#!/bin/bash

screen -dmS frontend-dev bash -c "cd frontend && npm start"
screen -dmS postprocessing-dev bash -c "cd backend/postprocessing && python3.8 processor.py"
screen -dmS backend-dev bash -c "cd backend && npm start"
