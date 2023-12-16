

DROP TABLE IF EXISTS users;

CREATE USER asd WITH SUPERUSER PASSWORD 'asd';

CREATE TABLE users (
    username    VARCHAR( 32)    primary key,
    password    VARCHAR(512)    NOT NULL,
    salt        VARCHAR(512)    NOT NULL,
    json_val    JSON            
);


-- Default data for messages
insert into users (username, password, salt)
          values ('a', '$2b$10$KnkVFhSGKebr/g18U06XTeiKRLzD6LxoH8QZ.tcTOYgcWtV2Ej6LO', '$2b$10$KnkVFhSGKebr/g18U06XTe');
insert into users (username, password, salt)
          values ('try_account', '$2b$10$mWUY4maXykuPrda71gaAIupSk2H76POxHJ3u4f4dGbiSyci0QvNWa', '$2b$10$mWUY4maXykuPrda71gaAIu');