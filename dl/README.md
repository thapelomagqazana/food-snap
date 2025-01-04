
# **CaloriSee AI Service**  
_Real-Time Food Detection and Nutritional Analysis Powered by YOLOv5_

The AI service for CaloriSee is a backend application designed to process meal images, detect food items using a YOLOv5 model, and return detailed nutritional information. This service enables users to effortlessly track their meals with instant AI-powered insights.

---

## **Features**  
- **YOLOv5-based Food Detection:** Uses a pre-trained YOLOv5 model to detect food items from uploaded images.  
- **Nutritional Analysis:** Retrieves nutritional data (calories, protein, carbs, fat) for each detected food item.  
- **Caching with Redis:** Speeds up responses by caching frequently requested nutritional data.  
- **RESTful API:** Exposes endpoints for image uploads, food detection, and logging.  

---

## **Tech Stack**  
- **Python** (v3.8+)  
- **FastAPI** for building the RESTful API  
- **YOLOv5** for object detection  
- **Redis** for caching  
- **MongoDB** for storing user meal logs  
- **Docker** for containerization  

---

## **Installation and Setup**  
### **Prerequisites**  
- Python 3.8+  
- Redis  
- MongoDB  
- Docker (optional for containerized deployment)  

### **Clone the Repository**  
```bash
git clone git@github.com:thapelomagqazana/food-snap.git
cd food-snap/dl/
```

### **Set Up Virtual Environment**  
```bash
python -m venv env
source env/bin/activate   # On Windows, use env\Scripts\activate
```

### **Install Dependencies**  
```bash
pip install -r requirements.txt
```

---

## **Environment Variables**  
Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/foodtrack

# Redis host and port
REDIS_HOST=localhost
REDIS_PORT=6379

# YOLOv5 model path
YOLO_MODEL_PATH=models/yolov5s.pt
```

---

## **Running the Service**  
### **Locally**  
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at [http://localhost:8000](http://localhost:8000).

### **Using Docker**  
Build and run the Docker container:

```bash
docker build -t foodtrack-ai-service .
docker run -p 8000:8000 --env-file .env foodtrack-ai-service
```

---

## **API Endpoints**  
### **1. POST /api/v2/food/recognize**  
Uploads an image and returns detected food items with labels and confidence scores.  

**Request:**  
- `file` (form-data): Image file to be processed.

**Response:**  
```json
{
  "message": "Objects detected successfully.",
  "detections": [
    {
      "label": "orange",
      "confidence": "86.28%",
      "thumbnail": "data:image/jpeg;base64,..."
    }
  ]
}
```

### **2. GET /api/v2/food/nutrition**  
Retrieves nutritional information for detected food items.

**Request:**  
- `foodItems` (query param): Comma-separated list of food items (e.g., `apple,orange`).

**Response:**  
```json
{
  "nutrition": [
    {
      "name": "apple",
      "calories": 95,
      "protein": 0.5,
      "carbs": 25,
      "fat": 0.3
    },
    {
      "name": "orange",
      "calories": 62,
      "protein": 1.2,
      "carbs": 15.4,
      "fat": 0.2
    }
  ]
}
```

### **3. POST /api/v2/logs**  
Logs the detected meal and nutritional data for the user.

**Request:**  
```json
{
  "mealTime": "Lunch",
  "items": [
    { "name": "apple", "calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3 },
    { "name": "orange", "calories": 62, "protein": 1.2, "carbs": 15.4, "fat": 0.2 }
  ]
}
```

**Response:**  
```json
{
  "message": "Meal logged successfully."
}
```

---

## **Folder Structure**  
```plaintext
dl/
├── app
│   ├── main.py               # Main entry point
│   ├── routes.py             # API route handlers
│   ├── models                # YOLOv5 model and utilities
│   ├── services              # Business logic for detection and nutrition
│   └── db                    # MongoDB and Redis connections
├── requirements.txt          # Python dependencies
├── Dockerfile                # Docker configuration
└── README.md                 # Project documentation
```

---

## **Deployment**  
1. Build the Docker container using the provided `Dockerfile`.  
2. Deploy the container to a cloud service like **AWS**, **Azure**, or **Railway**.  
3. Ensure MongoDB and Redis are properly configured and accessible.  

---

## **Acknowledgments**  
- [YOLOv5](https://github.com/ultralytics/yolov5) for real-time object detection.  
- [FastAPI](https://fastapi.tiangolo.com/) for building the backend service.  

---

## **License**  
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## **Contact**  
For any queries or collaborations, feel free to reach out:  
Follow me on [LinkedIn](www.linkedin.com/in/thapelo-magqazana-90632a174).

---

