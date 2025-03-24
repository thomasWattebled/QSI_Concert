import amqp from 'amqplib';
import { eq } from 'drizzle-orm';
import { concertTable } from '../db/schema';
import { db } from '../app';

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'concert_details';

export async function startConcertRPC() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('✅ Connexion à RabbitMQ réussie');

    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });


    channel.consume(QUEUE_NAME, async (message) => {
      if (message) {
        const concertId = message.content.toString();
        console.log(`🎯 Requête reçue pour le concert ID : ${concertId}`);

        try {
          const concert = await db.select().from(concertTable).where(eq(concertTable.id, concertId));
          if (concert.length > 0) {
            console.log(message.properties.correlationId)
            console.log(` ✅ Concert trouvé : ${concertId}`);
            channel.sendToQueue(
              message.properties.replyTo,
              Buffer.from(JSON.stringify(concert[0])),
              {
                correlationId: message.properties.correlationId,
              }
            );
          } else {
            console.log(`❌ Concert non trouvé : ${concertId}`);
            channel.sendToQueue(
              message.properties.replyTo,
              Buffer.from(JSON.stringify({ error: 'Concert not found' })),
              {
                correlationId: message.properties.correlationId,
              }
            );
          }
          channel.ack(message);
        } catch (error: any) {
          console.error(`❌ Erreur lors de la récupération du concert : ${error.message}`);
          channel.sendToQueue(
            message.properties.replyTo,
            Buffer.from(JSON.stringify({ error: 'Internal Server Error' })),
            {
              correlationId: message.properties.correlationId,
            }
          );
          channel.ack(message);
        }
      }
    });

    console.log(`En attente de requêtes...`);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de RabbitMQ :', error);
  }
}

startConcertRPC();
