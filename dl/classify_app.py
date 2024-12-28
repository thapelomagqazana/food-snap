from ultralytics import YOLO
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import JSONResponse
from PIL import Image
import traceback
import io
import base64

# Initialize FastAPI app
app = FastAPI()

# Load YOLOv5 model
model = YOLO('yolov5su.pt')  # Use 'yolov5x.pt' for higher accuracy

# Set confidence threshold
CONFIDENCE_THRESHOLD = 0.25

# Define the food-related categories
FOOD_CATEGORIES = [
    "banana", "apple", "orange", "broccoli", "carrot",
    "hot dog", "pizza", "donut", "cake"
]

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
        results = model.predict(source=image, conf=confidence_threshold)

        # Extract detections
        detections = []
        seen_labels = set()  # Track unique labels to avoid duplication

        for result in results:
            for box in result.boxes:
                # Safely parse attributes
                try:
                    # Extract class, confidence, and bounding box
                    label_idx = int(box.cls)
                    confidence = float(box.conf)
                    x_min, y_min, x_max, y_max = map(int, box.xyxy[0])

                    # Convert label index to label name
                    label = model.names.get(label_idx, "unknown")

                    # Skip non-food categories or duplicate labels
                    if label not in FOOD_CATEGORIES or label in seen_labels:
                        continue
                    seen_labels.add(label)

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
                except Exception as box_error:
                    print(f"Error processing box: {box_error}")

        # Check if detections are empty
        if not detections:
            return JSONResponse(content={
                "message": "No objects detected above the confidence threshold.",
                "detections": detections,
            })

        return JSONResponse(content={
            "message": "Objects detected successfully.",
            "detections": detections,
        })

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return JSONResponse(content={
            "message": "Failed to process image.",
            "error": str(e),
            "details": error_details,
        }, status_code=500)
