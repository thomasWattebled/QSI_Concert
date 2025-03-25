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
          const concert = await db.select().from(concertTable).where(eq(concertTable.id,concertId));
          if (concert.length > 0) {
              const modifiedConcert = concert[0];
              console.log(`✅ Concert trouvé`);
              console.log(modifiedConcert.availableSeats)
              console.log(modifiedConcert.totalSeats)
              if (modifiedConcert.availableSeats > 0) {
                const resultConcert = await db.update(concertTable).set({availableSeats: (modifiedConcert.availableSeats - 1)}).where(eq(concertTable.id, concertId)).returning();
              channel.sendToQueue(
                    message.properties.replyTo,
                    Buffer.from(JSON.stringify(resultConcert)),
                    {
                      correlationId: message.properties.correlationId,
                    }
                  );  
                  console.log(`✅ Envoie du Concert`);
            
                } else {
                  channel.sendToQueue(
                    message.properties.replyTo,
                    Buffer.from(JSON.stringify({ error: 'BadRequest',
                      message: 'The concert is already empty.', })),
                    {
                      correlationId: message.properties.correlationId,
                    })
              }
          } else {
            channel.sendToQueue(
              message.properties.replyTo,
              Buffer.from(JSON.stringify({ error: 'NotFound',
                message: `Concert with ID '${concertId}' not found.`,})),
              {
                correlationId: message.properties.correlationId,
              })
          }
      } catch (error: any) {
          console.log(error);
          if (error.code === "22P02") {
            channel.sendToQueue(
              message.properties.replyTo,
              Buffer.from(JSON.stringify({ error: 'BadRequest',
                message: 'The type of the id isn\'t valid',})),
              {
                correlationId: message.properties.correlationId,
              })
          }
      }
        /*try {
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
        }*/
      }
    });

    console.log(`En attente de requêtes...`);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de RabbitMQ :', error);
  }
}

startConcertRPC();
