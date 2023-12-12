
FROM postgres:latest


ENV POSTGRES_USER discite-database
ENV POSTGRES_PASSWORD discite-database
ENV POSTGRES_DB discite-database

COPY discite-db-schema-pg.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
