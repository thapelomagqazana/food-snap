import torch
import json
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

# Initialize FastAPI app
app = FastAPI()

# Load model architecture and weights
model = models.efficientnet_b0(pretrained=False)  # Load EfficientNet-B0 architecture
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 101)  # Update classifier for 101 classes
model.load_state_dict(torch.load("best_model.pth", map_location=torch.device('cpu')))  
model.eval()  # Set the model to evaluation mode

# Define the preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load class labels
with open("class_labels.json", "r") as f:
    class_labels = json.load(f)

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    try:
        # Read and preprocess the image
        image = Image.open(file.file).convert("RGB")
        input_tensor = preprocess(image).unsqueeze(0)  # Add batch dimension

        # Perform inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)

        # Get the top 5 predictions
        top_probs, top_indices = torch.topk(probabilities, k=5)
        predictions = []
        for prob, idx in zip(top_probs, top_indices):
            predicted_label = class_labels[str(idx.item())]
            predictions.append({
                "label": predicted_label,
                "confidence": f"{prob.item() * 100:.2f}%"
            })

        return JSONResponse(content={
            "message": "Image classified successfully.",
            "predictions": predictions
        })

    except Exception as e:
        return JSONResponse(content={
            "message": "Failed to classify image.",
            "error": str(e)
        }, status_code=500)
