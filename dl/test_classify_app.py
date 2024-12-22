import pytest
from fastapi.testclient import TestClient
from classify_app import app

# Initialize the TestClient with the FastAPI app
client = TestClient(app)

@pytest.fixture
def sample_image_path():
    return "pexels-brunoscramgnon-575610.jpg"  # Path to a valid sample image

@pytest.fixture
def invalid_file_path():
    return "invalid-file.txt"  # Path to an invalid file for testing

def test_classify_image_success(sample_image_path):
    """Test successful image classification."""
    with open(sample_image_path, "rb") as image_file:
        response = client.post("/classify", files={"file": ("sample.jpg", image_file, "image/jpeg")})
    assert response.status_code == 200
    assert response.json()["message"] == "Image classified successfully."
    assert "predicted_label" in response.json()
    assert "confidence" in response.json()

def test_classify_image_invalid_file(invalid_file_path):
    """Test classification with an invalid file."""
    with open(invalid_file_path, "rb") as invalid_file:
        response = client.post("/classify", files={"file": ("invalid.txt", invalid_file, "text/plain")})
    assert response.status_code == 500
    assert response.json()["message"] == "Failed to classify image."
    assert "error" in response.json()

def test_classify_no_file_uploaded():
    """Test classification with no file uploaded."""
    response = client.post("/classify")
    assert response.status_code == 422  # FastAPI returns 422 for missing required fields
    assert response.json()["detail"][0]["msg"] == "field required"

def test_classify_internal_error(monkeypatch):
    """Test internal server error during classification."""
    def mock_open(*args, **kwargs):
        raise IOError("Mocked internal error")

    monkeypatch.setattr("PIL.Image.open", mock_open)

    with open("pexels-brunoscramgnon-575610.jpg", "rb") as image_file:
        response = client.post("/classify", files={"file": ("sample.jpg", image_file, "image/jpeg")})
    assert response.status_code == 500
    assert response.json()["message"] == "Failed to classify image."
    assert "error" in response.json()
