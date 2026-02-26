from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running!"})

@app.route('/api/outfits', methods=['GET'])
def get_outfits():
    # Mock data for now, similar to outfits.json
    outfits = [
        {
            "id": 1,
            "name": "Casual Summer",
            "items": ["White T-shirt", "Denim Shorts", "Sneakers"],
            "style": "Casual"
        },
        {
            "id": 2,
            "name": "Formal Business",
            "items": ["Navy Suit", "White Shirt", "Leather Shoes"],
            "style": "Formal"
        }
    ]
    return jsonify(outfits)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
