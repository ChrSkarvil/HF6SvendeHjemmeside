import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadAndDetect = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [watchDetected, setWatchDetected] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64data = reader.result.split(',')[1]; // Extract base64 string

      try {
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/watch-detection-pcn5i/1",
          params: {
            api_key: "VRERCE01WIVmSiPNKe5t"
          },
          data: base64data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

        const predictions = response.data?.predictions || [];
        const filteredPredictions = predictions.filter(prediction => prediction.confidence > 0.5);

        setResult(filteredPredictions);

        const isWatchDetected = filteredPredictions.length > 0;
        setWatchDetected(isWatchDetected);
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    };
  };

  return (
    <div>
      <h1>Test for watch</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Check image</button>
      {result && (
        <div>
          <h2>Detection Result:</h2>
          {watchDetected ? (
            <p>A watch has been detected!</p>
          ) : (
            <p>No watch detected with high confidence.</p>
          )}
          <div>
            {result.length > 0 && (
              <div>
                <p>First Prediction Confidence: {(result[0].confidence * 100).toFixed(2)}%</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadAndDetect;
