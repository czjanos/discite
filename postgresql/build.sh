#!/bin/bash

image="discite_db"
container="db"



echo "-- Building --"
docker   build  -t  $image   .
