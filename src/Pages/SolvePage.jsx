import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import WebcamCapture from '../Components/WebcamCapture';



function SolvePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [opencvReady, setOpenCvReady] = useState(false);
  const [detectedColor,setDetectedColor] = useState([])

  // Show image on webpage
  const handleImageChange = (e) => {
    const files = e.target.files[0];

    if (files) {
      setSelectedImage(URL.createObjectURL(files)); // Use createObjectURL for better image handling
    }

    const readFile = new FileReader();
    readFile.onloadend = () => {
      setPreviewImage(readFile.result);
    };
    readFile.readAsDataURL(files);
  };

  // Handle image from webcam capture
  const handleWebcamCapture = (imageSrc) => {
    setSelectedImage(imageSrc);
   
  };

  // Wait for OpenCV to load
  useEffect(() => {
    let checkCV; // Define checkCV here

    const loadOpenCv = () => {
      if (window.cv) {
        window.cv['onRuntimeInitialized'] = () => {
          setOpenCvReady(true);
        };
      }
    };

    // Check if OpenCV has already loaded
    if (window.cv) {
      loadOpenCv();
    } else {
      checkCV = setInterval(() => {
        if (window.cv) {
          loadOpenCv();
          clearInterval(checkCV);
        }
      }, 100);
    }

    return () => {
      if (checkCV) clearInterval(checkCV); // Clear the interval if defined
    };
  }, []);

  // Log when OpenCV is ready
  useEffect(() => {
    if (opencvReady) {
      console.log("OpenCV.js is ready!");
    }
  }, [opencvReady]);

  // Submit image for image processing
  const handleSubmitImage = () => {
    if (!selectedImage) {
      alert("Please Enter an Image!");
      return;
    }
    if (!opencvReady) {
      alert('OpenCV is not ready!');
      return;
    }
    console.log("The Image has been uploaded", selectedImage);
    processImage(selectedImage); // Call your image processing function
  };


//IMAGE PROCESSING 
const processImage = (imgFile) => {
  const img = new Image();
  img.src = imgFile; // Use the data URL directly

  img.onload = () => {
    // Creating a canvas to draw the image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Conversion of Image to OpenCV Matrix
    const src = window.cv.imread(canvas);
    const dst = new window.cv.Mat();
    window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2RGB, 0);

    // Detect colors at predefined positions
    const colors = [];
    const squareSize = 50;
    const offsetX = canvas.width / 4;
    const offsetY = canvas.height / 4;

    // 3x3 cube
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = offsetX + col * squareSize / 2;
        const y = offsetY + row * squareSize + squareSize / 2;
        const color = detectColorAtPosition(dst, x, y);
        colors.push(color);
      }
    }

    // Clean up
    src.delete();
    dst.delete();

    setDetectedColor(colors);
    console.log("Detected Colors:", colors);
  };

  img.onerror = (err) => {
    console.error("Failed to load image:", err);
  };
};

const detectColorAtPosition = (mat, x, y) => {
  const rect = new window.cv.Rect(x, y, 1, 1);
  const roi = mat.roi(rect);
  const mean = window.cv.mean(roi);
  roi.delete();

  // Convert RGB to HSV: hue, saturation, value
  const rgb = {
    r: mean[0],
    g: mean[1],
    b: mean[2],
  };

  const hsv = rgb2hsv(rgb.r, rgb.g, rgb.b);
  const hue = hsv.h;
  const saturation = hsv.s;
  const value = hsv.v;

  let colorName = "Unknown";

  // Detection of colors
  if (saturation < 0.2 && value > 0.8) {
    colorName = "White";
  } else if (hue >= 0 && hue < 15) {
    colorName = "Red";
  } else if (hue >= 15 && hue < 45) {
    colorName = "Orange";
  } else if (hue >= 45 && hue < 75) {
    colorName = "Yellow";
  } else if (hue >= 75 && hue < 150) {
    colorName = "Green";
  } else if (hue >= 150 && hue < 255) {
    colorName = "Blue";
  }

  return colorName;
};

const rgb2hsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // Achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s, v: v };
};




  return (
    <>
      <div className="w-screen h-screen">
        <Navbar />

        <div className="w-screen h-auto flex items-center justify-center p-2">
          <div className="m-2 w-1/2 border h-[80vh] mt-12 bg-yellow-400 flex flex-col items-center justify-center">
            <p className="text-4xl my-5 text-black font-bold">
              Upload a picture with your Web-Cam
            </p>
            <WebcamCapture handleWebcamCapture={handleWebcamCapture} />
          </div>
          <div className="w-1/2 border m-2 h-[80vh] p-2 flex items-center justify-center mt-12 bg-red-500">
            <div className="flex flex-col items-center justify-around">
              <p className="text-4xl text-white font-bold">
                Upload Picture from your Device
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="my-5 text-white font-bold cursor-pointer"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="ImagePreview"
                  style={{ width: "200px", height: "200px" }}
                />
              )}
              <button
                className="my-12 text-black bg-white p-2 font-semibold shadow-xl rounded-xl text-sm hover:text-white hover:bg-black"
                onClick={handleSubmitImage}
              >
                UPLOAD
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SolvePage;
