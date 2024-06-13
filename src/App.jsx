/* eslint-disable no-unused-vars */
import LoginPage from "./LoginPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Routes} from 'react-router-dom'
import Home from "./Home";
import About from "./About";
import ErrorPage from "./ErrorPage";
import Home2 from "./Home2";
function App() {
  const token = sessionStorage.getItem('accessToken')
  return (
  <>
    <Routes>
      <Route  path="/" element={<LoginPage/>}/>
     {/*  <Route path="/home" element={<Home/>}/> */}
      <Route path="/about" element={<About/>}/>
      <Route path="*" element={<ErrorPage/>}/>
      <Route path="/home" element={<Home2/>}/>
    </Routes>
    <ToastContainer/>
  </>
  )
}

export default App
