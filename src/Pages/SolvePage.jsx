import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import WebcamCapture from "../Components/WebcamCapture";

function SolvePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const files = e.target.files[0];

    if (files) {
      setSelectedImage(files);
    }

    const readFile = new FileReader();
    readFile.onloadend = () => {
      setPreviewImage(readFile.result);
    };
    readFile.readAsDataURL(files);
  };

  const handleSubmitImage=()=>{
    if(!selectedImage){
    alert("Please Enter an Image !") ; 
    return;
    }
    console.log("The Image has been uplaoded",selectedImage) ; 
    
  }

  return (
    <>
      <div className="  w-screen h-screen">
        <Navbar />

        <div className=" w-screen h-auto flex items-center justify-center p-2 ">
          <div className=" m-2 w-1/2 border h-[80vh] mt-12 bg-yellow-400 flex flex-col items-center justify-center">
            <p className="text-4xl my-5 text-black font-bold">
              Upload a picture with your Web-Cam
            </p>
            <WebcamCapture />
            
          </div>
          <div className="w-1/2 border m-2 h-[80vh] p-2 flex items-center justify-center mt-12 bg-red-500">
            <div className="flex flex-col items-center justify-around">
              <p className="text-4xl text-white font-bold">
                Upload Picture from your Device
              </p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="my-5 text-white font-bold" />
              {previewImage && <img src={previewImage} alt="ImagePreview" style={{ width: '200px', height: '200px' }} />}
              <button
                className="my-12  text-black bg-white p-2 font-semibold shadow-xl rounded-xl text-sm hover:text-white hover:bg-black"
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
