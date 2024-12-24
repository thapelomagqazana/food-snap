import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "react-bootstrap";
import "./CropTool.css";
import getCroppedImg from "../utils/cropImage";

interface CropToolProps {
  imageSrc: string; // Base64 or data URI image string
  onCrop: (croppedImage: string) => void; // Callback for cropped image
}

const CropTool: React.FC<CropToolProps> = ({ imageSrc, onCrop }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | any>(null);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCrop(croppedImage); // Send the cropped image back to the parent component
    }
  };

  return (
    <div className="crop-tool">
      <div className="crop-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3} // Aspect ratio for the crop area
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="controls mt-3">
        <Button
          variant="primary"
          onClick={handleApplyCrop}
          className="me-2 crop-button"
        >
          Apply Crop
        </Button>
      </div>
    </div>
  );
};

export default CropTool;
