# Use the official PostgreSQL image as a base
FROM postgres:latest

# Set environment variables for the database
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin
ENV POSTGRES_DB concertDB

# Optional: Copy initialization scripts if you need to create tables, insert data, etc.
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# The official PostgreSQL image automatically handles initialization and startup.
# No need to specify a CMD here unless you need custom behavior.