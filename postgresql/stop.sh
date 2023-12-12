#!/bin/bash

image="discite_db"
container="db"



docker stop $container
docker rm $container