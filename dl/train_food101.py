import torch
import json
from torchvision import models, transforms
from PIL import Image

# Load the model architecture
model = models.efficientnet_b0(pretrained=False)  # Load EfficientNet-B0 architecture
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 101)  # Update classifier for 101 classes

# Load the saved weights and map them to the CPU
model.load_state_dict(torch.load("best_model.pth", map_location=torch.device('cpu')))  
model.eval()  # Set the model to evaluation mode

# Define the preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load and preprocess the image
image_path = "pexels-brunoscramgnon-575610.jpg"
image = Image.open(image_path).convert("RGB")
input_tensor = preprocess(image).unsqueeze(0)  # Add batch dimension

# Perform inference
with torch.no_grad():
    outputs = model(input_tensor)
    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)

# Load class labels
with open("class_labels.json", "r") as f:  # You need the class label mapping
    class_labels = json.load(f)

# Get the top prediction
top_prob, top_idx = torch.max(probabilities, dim=0)
predicted_label = class_labels[str(top_idx.item())]

print(f"Predicted food item: {predicted_label} ({top_prob.item() * 100:.2f}%)")
