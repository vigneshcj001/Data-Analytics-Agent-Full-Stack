#!/bin/bash
set -e

# Upgrade pip and packaging tools
pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port $PORT

python main.py
