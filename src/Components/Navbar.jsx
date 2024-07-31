import React, { useEffect, useState } from 'react';
import rubix from '../Media/rubix.png';
import { useNavigate } from 'react-router-dom';


function Navbar() {
  const [instructionsModal, setInstructionsModal] = useState(false);

  const handleInstructions = () => {
    setInstructionsModal(true);
  };

  const handleCloseModal = () => {
    setInstructionsModal(false);
  };

  const renderInstructionModal = () => {
    if (instructionsModal) {
      return (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center" onClick={handleCloseModal}>
          <div className="bg-white h-1/2 w-1/2  p-6 rounded-lg shadow-lg flex flex-col items-center">
            <span className='flex items-center justify-between'> <p className="text-black w-full text-4xl font-bold text-center">Welcome to CubixSolver !</p></span>
            <span className='text-2xl my-5 text-gray-500 font-semibold'>How to Use CubixSolver ?</span>
            <div className=' my-5 text-xl font-medium'>Upload a picture from your device <strong>OR</strong> Use the Web-Cam on the website to upload the picture of the  <strong>(3 X 3)</strong>  Rubik's Cube.
            <br />
            <br />
            
            Wait for few seconds for our algorithm to process the uploaded image and solve the Rubik's Cube .
            <br />
            <br />
            Steps to solve the rubiks cube will be shown on the screen . 
            <br />
            <br />
            <strong className='text-2xl'>Thank You !</strong>
            
            </div>
           
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  useEffect(()=>{
    const timer= setTimeout(() => {
      setInstructionsModal(true);
      
    }, 1000);
    return ()=>clearTimeout(timer)
     
  },[])
  
  useEffect(()=>{
    const timer= setTimeout(() => {
      setInstructionsModal(false);
      
    }, 8000);
    return ()=>clearTimeout(timer)
     
  },[])
  

  const navigate = useNavigate();

  return (
    <>
      <nav className='border mt-0 shadow-xl p-5 flex items-center justify-between'>
        <span
          onClick={() => navigate('/')}
          className='cursor-pointer flex items-center text-3xl text-black font-mono font-bold'
        >
          Cubix<img src={rubix} alt='logo' className='w-7 h-7 mx-2' /> Solver
        </span>
        <div className="text-gray-400 flex items-center gap-5 text-lg font-semibold">
          <p
            className='hover:text-black cursor-pointer'
            onClick={handleInstructions}
          >
            How to Use?
          </p>
          <a href='https://github.com/adixb' target='_blank' rel='noopener noreferrer'>
            <p className='hover:text-black cursor-pointer'>Developer GitHub</p>
          </a>
          <a href='https://app.eraser.io/workspace/40yG0lthVg2r06WCp312?origin=share' target='_blank' rel='noopener noreferrer'>
            <p className='hover:text-black cursor-pointer'>Project Documentation</p>
          </a>
        </div>
        {renderInstructionModal()}
      </nav>
    </>
  );
}

export default Navbar;
