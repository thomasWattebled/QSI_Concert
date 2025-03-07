import { pgTable, uuid, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const concertTable = pgTable('concert', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  place: varchar('place', { length: 200 }),
  concertDate: timestamp('concert_date'),
  totalSeats: integer('total_seats'),
  availableSeats: integer('available_seats'),
  canceled: boolean('canceled').default(false),
  canceledAt: timestamp('canceled_at'),
  createdAt: timestamp('created_at').default(sql`now()`),
});