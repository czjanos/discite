# discite

## Overview of the Contents


- [**`PostgreSQL`**](postgresql) - Database ready to run in a docker container with or without the help of the docker-compose tool;
- [**`NodeJS`**](nodejs) - Source code of web application template in nodejs with Docker container configured. Ready to run in docker-compose with PostgreSQL
  - [`src/`](nodejs/src) folder is mounted for developing with container running
- [**`docker-compose`**](.) - Files that start the NodeJS application together with a PostgreSQL database;

## Requirements

To execute this project it is required to have installed:

- `docker`
- `docker-compose`

## Development

Run the script (e.g. [`./start.sh`](start.sh)) or (e.g. [`./start.bat`](start.bat)) to have both the server and the database running.

[`NodeJS`](nodejs) allows you to be developing while the containers are running, and the sources are continuously being integrated.

## Web browser access

After the required commands and having started the web application, they will available on your browser at:

- http://localhost:8080;

# Authors

- Discite team