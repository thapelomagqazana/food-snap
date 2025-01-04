# CaloriSee API Service

## Overview
CaloriSee is a RESTful API service designed to help users manage their daily food intake by logging meals, retrieving nutritional information, and recognizing food items from images using AI.

## Features
- User authentication (register, login, profile management)
- Meal logging and retrieval
- Nutritional information display
- Food recognition from uploaded images (**Planned Feature**)

## Endpoints

### **Auth Endpoints**
#### `POST /api/v2/auth/register`
Register a new user.

#### `POST /api/v2/auth/login`
Authenticate an existing user and return a JWT.

#### `GET /api/v2/auth/profile`
Retrieve the authenticated user's profile.

#### `PUT /api/v2/auth/profile`
Edit the authenticated user's profile.

### **Meal Log Endpoints**
#### `POST /api/v2/logs`
Create a new meal log.

#### `GET /api/v2/logs/daily`
Retrieve meal logs for the current day.

#### `GET /api/v2/logs`
Retrieve meal logs by a specific date.

#### `DELETE /api/v2/logs/:logId`
Delete a specific meal log.

### **Food Recognition Endpoint (Planned Feature)**
#### `POST /api/v2/food/recognize`
**Description:** Recognize food items from uploaded images using AI models.

**Request:**
- `multipart/form-data`
  - `image`: The uploaded image file.

**Response:**
- `200 OK`: Returns the recognized food items and their nutritional information.
- `400 Bad Request`: If the image is not provided or invalid.

**Example Response:**
```json
{
  "message": "Food recognized successfully",
  "data": [
    {
      "item": "Apple",
      "calories": 95,
      "protein": 0.5,
      "carbs": 25,
      "fat": 0.3
    },
    {
      "item": "Spaghetti",
      "calories": 220,
      "protein": 8,
      "carbs": 43,
      "fat": 1.3
    }
  ]
}
```

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:thapelomagqazana/food-snap.git
   cd food-snap/backend/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/foodsnap
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Usage

- Use a tool like Postman to test the API endpoints.
- Ensure MongoDB and Redis are running before starting the server.

<!-- ## Monitoring & Performance
- Integrated with **Prometheus** for metrics scraping.
- Use **Grafana** for real-time dashboard monitoring.
- Load testing with **k6**.
- Profiling with **Clinic.js**.
- Error tracking using **Sentry**. -->

## Contributing
Feel free to submit issues or create pull requests. Contributions are welcome!

## License
This project is licensed under the MIT License.

