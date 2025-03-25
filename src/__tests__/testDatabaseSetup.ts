import { drizzle } from 'drizzle-orm/pglite';
import { sql } from 'drizzle-orm';

const testDb = drizzle();

async function createConcertTable() {
    await testDb.execute(sql`
      CREATE TABLE IF NOT EXISTS concert (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(200) NOT NULL,
        place VARCHAR(200) NOT NULL,
        image VARCHAR(300),
        concert_date TIMESTAMP WITH TIME ZONE NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        canceled BOOLEAN DEFAULT FALSE,
        canceled_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('PGLite "concert" table created.');
}

export { testDb, createConcertTable }