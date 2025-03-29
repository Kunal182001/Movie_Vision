import React, { useEffect, useState } from "react"
import './App.css'
import Navbar from "./Components/Navbar/Navbar"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Components/Home/Home";
import Moivefind from "./Pages/MoivebyAI/Moivefind";
import Movie from "./Pages/MovieShowpage/Movie";
import FooterSection from "./Components/HomeComponents/FooterSection";
import Mycontext from "./Pages/Mycontext/MyContext";
import Signin from "./Pages/SignIn/Signin";
import Signup from "./Pages/SignUp/Signup";
import VerifyotpPage from "./Pages/VerifyOtp/VerifyotpPage";
import Cursor from "./Components/Cursorpointer/Cursor";
import Profile from "./Pages/Profile/Profile";
import MovieCat from "./Pages/MovieCategory/MovieCat";
import Moviesearch from "./Pages/MovieSeacrh/Moviesearch";
import WishListPage from "./Pages/WishList/WishListPage";


function App() {

  const [isheader, setisheader] = useState(true);
  const [isfooter, setisfooter] = useState(true);
  const [isLogin, setisLogin] = useState(false);
  const [userData, setuserData] = useState([]);
  const [issearchActive,setissearchActive]=useState(false);
  const [searchfilterData, setsearchfilterData] = useState([]);
  const [searchtext,setsearchtext]=useState('');
  const [searchplaceholder,setsearchplaceholder]=useState('Search for products..');
  const [filterText,setfilterText]=useState('');
  const [searchdata,setsearchdata]=useState([]);

  const values={
    isheader,
    isfooter,
    isLogin,
    userData,
    issearchActive,
    searchfilterData,
    searchtext,
    searchplaceholder,
    filterText,
    searchdata,
    setisfooter,
    setisheader,
    setisLogin,
    setuserData,
    setissearchActive,
    setsearchfilterData,
    setsearchtext,
    setsearchplaceholder,
    setfilterText,
    setsearchdata
  }
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      setuserData(user);
      if (token != null && token != "") {
        setisLogin(true);
      }
    }
  }, [isLogin])


 
  return (
    <>
      <BrowserRouter>
      <Mycontext.Provider value={values}>
      {isheader && <Navbar/>}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/mymovie" element={<Moivefind/>}/>
          <Route path="/By/:type/:id" element={<Movie/>}/>
          <Route path="/signin"  element={<Signin/>}/>
          <Route path="/signup"  element={<Signup/>}/>
          <Route path="/verifyOTP"  element={<VerifyotpPage/>}/>
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/category/:type/" element={<MovieCat/>}/>
          <Route path="/search/:type/" element={<Moviesearch/>}/>
          <Route path="/wishlist/:id/" element={<WishListPage/>}/>
        </Routes>
      {isfooter && <FooterSection/>}
      <Cursor/>
      </Mycontext.Provider>
      
      </BrowserRouter>
    </>
  )
}

export default App
