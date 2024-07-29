import React from 'react'
import {Routes,Route} from 'react-router-dom' ; 
import Home from '../Pages/Home';
import SolvePage from '../Pages/SolvePage';
function AllRoutes() {
  return (
   <>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/Solvecube' element={<SolvePage/>}/>


   </Routes>
   
   
   </>
  )
}

export default AllRoutes