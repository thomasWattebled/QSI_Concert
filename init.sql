CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE concert (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title varchar(200) NOT NULL,
    place varchar(200) NULL,
    concert_date timestamp NULL,
    total_seats integer,
    available_seats integer,
    canceled boolean DEFAULT FALSE,
    canceled_at timestamp,
    created_at timestamp DEFAULT NOW()
);