import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import WebcamCapture from '../Components/WebcamCapture';
import RubiksCubeSolver from 'rubiks-cube-solver'; // Ensure this import is correct

function SolvePage() {
  const [selectedImages, setSelectedImages] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
    top: null,
    bottom: null,
  });

  const [detectedColors, setDetectedColors] = useState({
    front: [],
    back: [],
    left: [],
    right: [],
    top: [],
    bottom: [],
  });

  const [solution, setSolution] = useState(null);
  const [opencvReady, setOpenCvReady] = useState(false);
  
  const sides = ['front', 'back', 'left', 'right', 'top', 'bottom'];

  const handleImageChange = (side, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImages((prevState) => ({
        ...prevState,
        [side]: URL.createObjectURL(file),
      }));
    }
  };

  const handleWebcamCapture = (side, imageSrc) => {
    setSelectedImages((prevState) => ({
      ...prevState,
      [side]: imageSrc,
    }));
  };

  useEffect(() => {
    const loadOpenCv = () => {
      if (window.cv) {
        window.cv['onRuntimeInitialized'] = () => {
          setOpenCvReady(true);
        };
      }
    };

    if (window.cv) {
      loadOpenCv();
    } else {
      const checkCV = setInterval(() => {
        if (window.cv) {
          loadOpenCv();
          clearInterval(checkCV);
        }
      }, 100);

      return () => clearInterval(checkCV);
    }
  }, []);

  const handleSubmitImages = () => {
    if (!opencvReady) {
      alert('OpenCV is not ready!');
      return;
    }

    let allColorsDetected = true;
    sides.forEach((side) => {
      if (selectedImages[side]) {
        processImage(selectedImages[side], side);
      } else {
        alert(`Please upload or capture the ${side} side!`);
        allColorsDetected = false;
      }
    });

    if (allColorsDetected) {
      solveCube();
    }
  };

  const processImage = (imgFile, side) => {
    const img = new Image();
    img.src = imgFile;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const src = window.cv.imread(canvas);
      const dst = new window.cv.Mat();
      window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2RGB, 0);

      const colors = [];
      const squareSize = 50;
      const offsetX = canvas.width / 4;
      const offsetY = canvas.height / 4;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const x = offsetX + col * squareSize;
          const y = offsetY + row * squareSize;
          const color = detectColorAtPosition(dst, x, y);
          colors.push(color);
        }
      }

      src.delete();
      dst.delete();

      setDetectedColors((prevState) => ({
        ...prevState,
        [side]: colors,
      }));
    };

    img.onerror = (err) => {
      console.error('Failed to load image:', err);
    };
  };

  const detectColorAtPosition = (mat, x, y) => {
    const rect = new window.cv.Rect(x, y, 1, 1);
    const roi = mat.roi(rect);
    const mean = window.cv.mean(roi);
    roi.delete();

    const rgb = { r: mean[0], g: mean[1], b: mean[2] };
    const hsv = rgb2hsv(rgb.r, rgb.g, rgb.b);
    const hue = hsv.h;
    const saturation = hsv.s;
    const value = hsv.v;

    let colorName = 'Unknown';

    if (saturation < 0.2 && value > 0.8) {
      colorName = 'White';
    } else if (hue >= 0 && hue < 15) {
      colorName = 'Red';
    } else if (hue >= 15 && hue < 45) {
      colorName = 'Orange';
    } else if (hue >= 45 && hue < 75) {
      colorName = 'Yellow';
    } else if (hue >= 75 && hue < 150) {
      colorName = 'Green';
    } else if (hue >= 150 && hue < 255) {
      colorName = 'Blue';
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
      h = 0;
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
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s, v: v };
  };

  const solveCube = () => {
    // Check if all sides are processed
    const allSidesProcessed = sides.every((side) => detectedColors[side].length === 9);
  
    if (!allSidesProcessed) {
      alert('All six sides must have exactly 9 colors each. Please check the images and try again.');
      return;
    }
  
    // Flatten the detected colors into a single array
    const allColors = Object.values(detectedColors).flat();
  
    // Validate the total number of colors
    if (allColors.length !== 54) {
      alert(`Wrong number of colors provided. Expected 54, but got ${allColors.length}. Please try again.`);
      return;
    }
  
    // Convert detected colors to the solver notation
    const notation = convertColorsToNotation(detectedColors);
    
    try {
      const solution = RubiksCubeSolver(notation); // Ensure the solver function is correct
      setSolution(solution);
    } catch (error) {
      console.error("Error solving the cube:", error);
      alert("An error occurred while solving the cube. Please try again.");
    }
  };
  
  const convertColorsToNotation = (colors) => {
    const colorMap = {
      'White': 'U',
      'Red': 'F',
      'Blue': 'R',
      'Green': 'L',
      'Orange': 'B',
      'Yellow': 'D',
    };

    const notation = [
      ...colors.top.map(color => colorMap[color]),
      ...colors.front.map(color => colorMap[color]),
      ...colors.right.map(color => colorMap[color]),
      ...colors.back.map(color => colorMap[color]),
      ...colors.left.map(color => colorMap[color]),
      ...colors.bottom.map(color => colorMap[color]),
    ];

    return notation.join('');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5">
        {sides.map((side) => (
          <div key={side} className="mb-4">
            <p className="text-lg font-bold">{side.toUpperCase()} Side:</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(side, e)}
            />
            <WebcamCapture
              handleWebcamCapture={(imageSrc) => handleWebcamCapture(side, imageSrc)}
            />
            {selectedImages[side] && (
              <img
                src={selectedImages[side]}
                alt={`${side} Preview`}
                style={{ width: '200px', height: '200px' }}
              />
            )}
          </div>
        ))}
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleSubmitImages}
        >
          Submit Images
        </button>
        {solution && (
          <div className="mt-5">
            <h2 className="text-xl font-bold">Solution:</h2>
            <p>{solution.join(' ')}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default SolvePage;
