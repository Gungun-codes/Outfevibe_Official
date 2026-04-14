from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
import uvicorn
from engine import FashionCVEngine

app = FastAPI()
# Initialize the engine once globally to save memory and startup time per request
engine = FashionCVEngine()

@app.post("/analyze")
async def analyze_fashion(file: UploadFile = File(...)):
    # Read the file from the request
    data = await file.read()
    
    # Convert image bytes to OpenCV format
    nparr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Process the image
    result = engine.analyze(img)
    
    # Pydantic's .dict() converts the result to a JSON-ready dictionary
    return result.dict()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)