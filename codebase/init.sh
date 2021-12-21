#!/bin/bash
ENV_FILE=".env"
if [ ! -z "$1" ]; then
    # Look for --prod flag
    if [ "$1" == "--prod" ]; then
        ENV_FILE=".env.prod"
    fi
fi
cp $ENV_FILE frontend/.env
cp $ENV_FILE backend/.env
cp $ENV_FILE backend/postprocessing/.env
if [ -f $ENV_FILE ]; then
    export $(echo $(cat $ENV_FILE | sed 's/#.*//g'| xargs) | envsubst)
fi
