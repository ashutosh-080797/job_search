#!/bin/bash

# Kill old processes
pkill -f uvicorn || true
pkill -f serve || true

# Start backend (Python)
cd /home/ec2-user/jobify/backend
pip install -r requirements.txt
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start frontend (React)
cd /home/ec2-user/jobify/frontend-app
npx serve -s build -l 3000 &
