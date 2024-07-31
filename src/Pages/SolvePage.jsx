import React from 'react'
import Navbar from '../Components/Navbar'
import WebcamCapture from '../Components/WebcamCapture'


function SolvePage() {
  return (
    <>

    <div className="  w-screen h-screen">
    <Navbar/>

    <div className=" w-screen h-auto flex items-center justify-center p-2 ">
      <div className=" m-2 w-1/2 border h-[80vh] mt-12 bg-yellow-400 flex flex-col items-center justify-center">
      <p className='text-4xl my-5 text-black font-bold'>Upload Picture with your Web-Cam</p>
        <WebcamCapture/>

      </div>
      <div className="w-1/2 border m-2 h-[80vh] p-2 flex items-center justify-center mt-12 bg-red-500">
        <div className="flex flex-col items-center justify-around">
          <p className='text-4xl text-white font-bold'>Upload Picture from your Device</p>
          <button className='my-12  text-black bg-white p-2 font-semibold shadow-xl rounded-xl text-sm hover:text-white hover:bg-black'>UPLOAD</button>
        </div>
      </div>
    </div>

    </div>
    </>
  )
}

export default SolvePage ;