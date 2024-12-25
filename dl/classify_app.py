import torch
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import JSONResponse
from PIL import Image
import io
import base64

# Initialize FastAPI app
app = FastAPI()

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)  # Use 'yolov5x' for highest accuracy

# Set confidence threshold
CONFIDENCE_THRESHOLD = 0.25  # Default value, can be modified

@app.post("/classify")
async def detect_objects(
    file: UploadFile = File(...),
    confidence_threshold: float = Query(default=CONFIDENCE_THRESHOLD, ge=0.0, le=1.0)
):
    """
    Endpoint to detect objects in a food image.
    
    Args:
    - file: Uploaded image file.
    - confidence_threshold: Minimum confidence level to filter predictions.
    """
    try:
        # Read the uploaded image
        image = Image.open(file.file).convert("RGB")
        
        # Perform inference
        results = model(image)

        # Extract detections
        detections = []
        for *box, confidence, cls in results.xyxy[0].tolist():
            if confidence < confidence_threshold:
                continue  # Skip predictions below the threshold

            label = model.names[int(cls)]
            x_min, y_min, x_max, y_max = map(int, box)

            # Crop region of interest
            cropped_img = image.crop((x_min, y_min, x_max, y_max))
            buffer = io.BytesIO()
            cropped_img.save(buffer, format="JPEG")
            cropped_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            # Append detection
            detections.append({
                "label": label,
                "confidence": f"{confidence * 100:.2f}%",
                "bbox": [x_min, y_min, x_max, y_max],
                "thumbnail": f"data:image/jpeg;base64,{cropped_base64}"
            })

        # Check if detections are empty
        if not detections:
            return JSONResponse(content={
                "message": "No objects detected above the confidence threshold."
            })

        return JSONResponse(content={
            "message": "Objects detected successfully.",
            "detections": detections,
        })
    except Exception as e:
        return JSONResponse(content={
            "message": "Failed to process image.",
            "error": str(e)
        }, status_code=500)