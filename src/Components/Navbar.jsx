import React from 'react'
import rubix from '../Media/rubix.png'
import {useNavigate} from 'react-router-dom' ; 


function Navbar() {
    const navigate = useNavigate() ; 
  return (
    <>
    <nav className='border mt-0  shadow-xl p-5 flex items-center justify-between ' >
   
        <span onClick={()=>navigate('/')} className=' cursor-pointer  flex items-center text-3xl text-black font-mono font-bold '>Cubix<img src={rubix} alt='logo' className='w-7 h-7 mx-2'></img> Solver</span>
        <div className="text-gray-400 flex items-center gap-5 text-lg font-semibold">
            <p className='hover:text-black cursor-pointer'>How to Use ?</p>
           <a href='https://github.com/adixb' target='blank_'><p className='hover:text-black cursor-pointer'>Developer GitHub</p></a> 
           <a href='https://app.eraser.io/workspace/40yG0lthVg2r06WCp312?origin=share' target='blank_'><p className='hover:text-black cursor-pointer'>Project Documentation</p></a> 
        </div>
    </nav>
    
    
    </>
  )
}

export default Navbar