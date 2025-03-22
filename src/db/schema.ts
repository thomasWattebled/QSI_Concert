import { pgTable, uuid, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const concertTable = pgTable('concert', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  place: varchar('place', { length: 200 }).notNull(),
  image: varchar('image', { length: 300 }),
  concertDate: timestamp('concert_date').notNull(),
  totalSeats: integer('total_seats').notNull(),
  availableSeats: integer('available_seats').notNull(),
  canceled: boolean('canceled').default(false),
  canceledAt: timestamp('canceled_at'),
  createdAt: timestamp('created_at').default(sql`now()`),
});