# Backend Setup

This is a Flask-based backend for the Outfevibe MVP.

## Prerequisites

- Python 3.8+
- pip

## Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

1. Start the Flask server:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`.

## API Endpoints

- `GET /api/health`: Check if the server is running.
- `GET /api/outfits`: Get a list of outfits.
