import React from 'react';
import HomePageImage from '../Media/HomePage/Homepage.jpg';
import {useNavigate} from 'react-router-dom' ; 
import rubix from '../Media/rubix.png'
function Home() {
  const navigate = useNavigate() ; 
  return (
    <>
      <div 
        className="relative z-40 w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col items-start justify-center" 
        style={{ backgroundImage: `url(${HomePageImage})` }}
      >
        <div className="absolute w-screen h-screen bg-black opacity-50"></div>
        <div className="mx-12 flex flex-col items-center z-50 ">
        <span className=' cursor-pointer  flex items-center text-8xl text-white font-mono font-bold '>Cubix<img src={rubix} alt='logo' className='w-16 h-16 mx-2'></img> Solver</span>
         <p className='text-2xl text-zinc-300 my-5'>Your Personalised Online Rubik's Cube Solver</p>
         <button onClick={()=>navigate('/Solvecube')} className="font-bold text-black py-3 px-6 rounded-lg shadow-lg transform hover:-translate-y-1 hover:shadow-2xl transition duration-300 ease-in-out bg-gradient-to-r from-blue-200 to-purple-300 hover:from-blue-600 hover:to-purple-700 hover:text-white">
  Solve Your Cube
</button>


        </div>
      </div>
    </>
  );
}

export default Home;
