#!/bin/bash

image="discite_db"
container="db"


echo "-- Running --"
docker run --name $container -p 5432:5432  $image 
