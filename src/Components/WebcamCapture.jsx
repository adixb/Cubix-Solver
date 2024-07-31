import React from 'react';
import Webcam from 'react-webcam';

function WebcamCapture() {
  const videoConstraints = {
    width: 1000,
    height: 500,
    facingMode: "user",
  };

  return (
    <>
      <Webcam
        audio={false}
        height={500}
        screenshotFormat='image/jpeg'
        width={1000}
        videoConstraints={videoConstraints}
        className='p-2 rounded-xl'
      >
        {({ getScreenshot }) => (
          <div>
            <button
              onClick={() => {
                const imageSrc = getScreenshot();
                console.log(imageSrc); // Do something with the captured image
              }}
              className='my-12  text-black bg-white p-2 font-semibold shadow-xl rounded-xl text-sm hover:text-white hover:bg-black'
            >
              Capture Photo
            </button>
          </div>
        )}
      </Webcam>
    </>
  );
}

export default WebcamCapture;
