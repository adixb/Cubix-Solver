import React, { useState } from 'react';
import Webcam from 'react-webcam';

function WebcamCapture() {
  const videoConstraints = {
    width: 1000,
    height: 500,
    facingMode: "user",
  };

  const [imageWebCam, setImageWebCam] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const handleCapture = () => {
    setShowImage(true);
    setTimeout(() => {
      setShowImage(false);
      setImageWebCam(null);
    },10000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {showImage && imageWebCam && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img src={imageWebCam} alt="Captured" className="rounded-xl" />
          </div>
          <button
                className="my-12  text-black bg-white p-2 font-semibold shadow-xl rounded-xl text-sm hover:text-white hover:bg-black"
                
              >
                UPLOAD
              </button>
        </div>
      )}
      <Webcam
        audio={false}
        height={500}
        screenshotFormat='image/jpeg'
        width={1000}
        videoConstraints={videoConstraints}
        className='p-2 rounded-xl'
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              setImageWebCam(imageSrc);
              handleCapture();
            }}
            className='my-12 text-black bg-white p-2 font-semibold shadow-xl rounded-xl text-sm hover:text-white hover:bg-black'
          >
            Capture Photo
          </button>
        )}
      </Webcam>
    </div>
  );
}

export default WebcamCapture;
