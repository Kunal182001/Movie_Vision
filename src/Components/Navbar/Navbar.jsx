import React, { useContext, useEffect, useState } from 'react'
import logo from "../../assets/logo.webp"
import { NavLink, useNavigate } from 'react-router';
import Mycontext from '../../Pages/Mycontext/MyContext.js';
import { IoMdHome } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { debounce } from 'lodash';
import { motion, useScroll, useTransform } from "framer-motion";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import { GiHamburgerMenu } from "react-icons/gi";
import sidelogo from "../../assets/siide.png";
import { GrContact } from "react-icons/gr";

const Navbar = () => {
  const [accounthover, setaccounthover] = useState(false);
  const context = useContext(Mycontext);
  const [age, setAge] = useState('');
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 200], ["0px", "10px"]);
  const bgOpacity = useTransform(scrollY, [0, 200], ["rgba(55, 65, 81, 1)", "rgba(20, 28, 39, 0.9)"]);
  const History = useNavigate();
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const [openlogout, setopenlogout] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [mobview, setmobview] = useState(false);
  const [opencontact, setopencontact] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleLogout = () => {
    setisloading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setopenlogout(false);
    setTimeout(() => {
      context.setisLogin(false);
      setisloading(false);
      History("/");
      window.location.reload();
    }, 2000);
  }

  const handlecategory = (genre) => {
    History(`/category/${genre}`);
    window.location.reload();
  }



  //For Search Box

  const onChangeserachValue = debounce(async (e) => {
    context.setissearchActive(true);
    const query = e.target.value;
    context.setfilterText(query);
    if (query === "") {
      context.setsearchfilterData([]);
      context.setsearchtext('');
      context.setissearchActive(false);
      context.setsearchplaceholder('Search for products..');
      context.setsearchdata([]);
      return;
    }// Replace with your TMDB API key
    const BASE_URL = "https://api.themoviedb.org/3/search/movie";
    const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        context.setsearchtext('No Movie Found');
        context.setsearchfilterData([]);
        context.setsearchdata([]);
      }

      const data = await response.json();
      context.setsearchfilterData(data.results);
      context.setsearchdata(data.results);
      context.setsearchtext('');

    } catch (error) {
      console.error('Error fetching search results:', err);
      setsearchtext('Error fetching results');
      setsearchfilterData([]);
    }
  }, 300)

  const handleSearch = () => {
    context.setissearchActive(false);
    context.setsearchfilterData([]);
    context.setsearchtext('');
    context.setsearchplaceholder('Search for products..');
    History(`/search/${context.filterText}`);
  };
  const handlesearchMovie = (id) => {
    context.setissearchActive(false);
    context.setsearchfilterData([]);
    context.setsearchtext('');
    context.setsearchplaceholder('Search for products..');
    history(`/By/movie/${id}`);
    // window.location.reload();
  }



  return (
    <>

      <motion.div
        id="navbar"
        className="w-full h-[80px] hidden fixed top-0 md:flex justify-center items-center font-[Manrope] z-[100]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {context.issearchActive && <div onClick={() => {
          context.setissearchActive(false)
          context.setsearchfilterData([]);
          context.setsearchtext('');
          context.setsearchplaceholder('Search for products..');
        }} className='fixed inset-0 bg-black opacity-40 z-[101] overflow-hidden mt-[80px]'></div>}
        <motion.div
          className="w-[90%] h-full flex justify-center items-center gap-10 bg-gray-700 p-2 rounded-b-2xl shadow-lg"
          initial={{ opacity: 0.5, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: bgOpacity,
            backdropFilter: `blur(${blur})`,
            WebkitBackdropFilter: `blur(${blur})`
          }}
        >
          {/* Logo & Home Link */}
          <NavLink to="/" className="flex items-center gap-3">
            <motion.img
              src={logo}
              className="w-[80px] h-[60px] rounded-full"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            <p className="text-white font-bold text-xl">Movie Vision</p>
          </NavLink>

          {/* Genre Selection */}
          <Select
            value={age}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              width: "120px",
              height: "40px",
              borderRadius: "16px",
              backgroundColor: "#6b7280",
              color: "white",
              textAlign: "center",
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "War"].map((genre) => (
              <MenuItem
                onClick={() => {
                  handlecategory(genre);
                }}
                key={genre} value={genre}>{genre}</MenuItem>
            ))}
          </Select>

          {/* Search Bar */}
          <div className="w-[55%] h-[40px] relative">
            <FiSearch className="w-[25px] h-[25px] text-white absolute top-2 right-5 cursor-pointer"
              onClick={context.searchfilterData.length > 0 ? handleSearch : undefined} />
            <input
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  context.searchfilterData.length > 0 ? handleSearch() : undefined
                }
              }}
              onChange={onChangeserachValue}
              onClick={() => { context.setissearchActive(true) }}
              className="w-full h-full rounded-2xl bg-gray-600 text-white p-4 font-medium outline-none focus:ring-2 focus:ring-white transition-all"
              placeholder="Search for a Movie"
            />
            {context.searchfilterData?.length > 0 ? (
              <ul className='w-full  z-[102] h-[500px] border absolute top-[45px] flex flex-col items-start gap-2 p-2 rounded-lg cursor-pointer bg-white
                                         overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent '>
                {context.searchfilterData?.map((item, index) => (
                  <NavLink className='w-full'
                    to={`/By/movie/${item?.id}`}
                    onClick={() => {
                      handlesearchMovie(item?.id);
                    }}>
                    <li className='w-full flex justify-start items-center gap-4 z-[100] bg-white border-[2px] border-gray-200 rounded-md p-2' key={index}>
                      <img className='w-[50px] h-[50px] rounded-lg ' src={`https://image.tmdb.org/t/p/w500${item?.poster_path}`} />
                      <p className='text-[18px] font-semibold'>
                        {item?.title || item?.name}
                      </p>
                    </li>
                  </NavLink>
                ))}
              </ul>
            ) : (
              <>
                {context.searchtext.length > 0 &&
                  <div className='w-[75%] md:w-full border absolute top-0 flex justify-center items-center p-2 rounded-lg cursor-pointer bg-white  '>
                    <p className='text-xl font-semibold'>{context.searchtext}</p>
                  </div>}
              </>)}
          </div>

          {/* Account/Profile Section */}
          {context.isLogin ? (
            <motion.div
              onMouseEnter={() => setaccounthover(true)}
              onMouseLeave={() => setaccounthover(false)}

              id="account"
              className="relative w-[8%] h-[40px] rounded-2xl bg-gray-500 text-white flex justify-center items-center font-bold text-lg cursor-pointer transition-all hover:bg-gray-900"
            >
              {context?.userData?.name.split(" ")[0]}

              {/* Dropdown Menu */}
              {accounthover && (
                <motion.div
                  className="absolute top-12 left-0 w-[160px] h-[190px] text-[18px] flex flex-col items-start bg-white text-gray-500 rounded-2xl shadow-xl p-3 gap-2 cursor-pointer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <NavLink to={"/"} className="flex items-center gap-2 hover:text-gray-900 transition-all">
                    <IoMdHome />
                    <p>Home</p>
                  </NavLink>
                  <NavLink to={`/profile/${context.userData.userID}`} className="flex items-center gap-2 hover:text-gray-900 transition-all">
                    <IoPerson />
                    <p>Profile</p>
                  </NavLink>
                  <NavLink to={`/wishlist/${context.userData.userID}`} className="flex items-center gap-2 hover:text-gray-900 transition-all">
                    <MdFavorite />
                    <p>Favorites</p>
                  </NavLink>
                  <div className="flex items-center gap-2 hover:text-gray-900 transition-all">
                    <GrContact className='font-bold' />
                    <p className='font-bold' onClick={() => { setopencontact(true) }}>Contact Us</p>
                  </div>
                  <div
                    onClick={() => { setopenlogout(true) }}
                    className="flex items-center gap-2  hover:text-gray-900 transition-all"
                  >
                    <FiLogOut />
                    <p>Log out</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <NavLink to="/signin" className="w-[8%] h-[40px] rounded-2xl bg-gray-500 text-white flex justify-center items-center font-bold transition-all hover:bg-gray-900">
              Sign in
            </NavLink>
          )}
        </motion.div>
      </motion.div>

      {/* Moble View */}
      <motion.div
        initial={{ opacity: 0.5, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: bgOpacity,
          backdropFilter: `blur(${blur})`,
          WebkitBackdropFilter: `blur(${blur})`
        }}
        className='w-full fixed top-0 z-[81] md:hidden flex flex-col items-center gap-1 bg-gray-700 p-1 rounded-b-2xl'>
        {/* Side Menu */}
        <div className='w-full  md:hidden flex justify-between items-center p-3'>
          <div className='flex justify-start items-center gap-3'>
            <GiHamburgerMenu className='w-[30px] h-[30px] cursor-pointer text-white transition-all duration-300 ease-in-out'
              onClick={() => { setmobview(true) }} />
            {/* Genre Selection */}
            <Select
              value={age}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                width: "80px",
                height: "35px",
                borderRadius: "16px",
                backgroundColor: "#6b7280",
                color: "white",
                textAlign: "center",
                "& .MuiSelect-icon": { color: "white" },
              }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "War"].map((genre) => (
                <MenuItem
                  onClick={() => {
                    handlecategory(genre);
                  }}
                  key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </Select>
          </div>

          <NavLink to="/">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              src={logo} className="w-[50px] sm:w-[50px] cursor-pointer rounded-3xl" />
          </NavLink>
        </div>
        {/* Search Bar */}
        <div className="w-full h-[50px] relative pb-2">
          <FiSearch className="w-[25px] h-[25px] text-white absolute top-2 right-5 cursor-pointer"
            onClick={context.searchfilterData.length > 0 ? handleSearch : undefined} />
          <input
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                context.searchfilterData.length > 0 ? handleSearch() : undefined
              }
            }}
            onChange={onChangeserachValue}
            onClick={() => { context.setissearchActive(true) }}
            className="w-full h-full rounded-2xl bg-gray-600 text-white p-4 font-medium outline-none focus:ring-2 focus:ring-white transition-all"
            placeholder="Search for a Movie"
          />
          {context.searchfilterData?.length > 0 ? (
            <ul className='w-full  z-[102] h-[500px] border absolute top-[45px] flex flex-col items-start gap-2 p-2 rounded-lg cursor-pointer bg-white
                                         overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent '>
              {context.searchfilterData?.map((item, index) => (
                <NavLink className='w-full'
                  to={`/By/movie/${item?.id}`}
                  onClick={() => {
                    handlesearchMovie(item?.id);
                  }}>
                  <li className='w-full flex justify-start items-center gap-4 z-[100] bg-white border-[2px] border-gray-200 rounded-md p-2' key={index}>
                    <img className='w-[50px] h-[50px] rounded-lg ' src={`https://image.tmdb.org/t/p/w500${item?.poster_path}`} />
                    <p className='text-[18px] font-semibold'>
                      {item?.title || item?.name}
                    </p>
                  </li>
                </NavLink>
              ))}
            </ul>
          ) : (
            <>
              {context.searchtext.length > 0 &&
                <div className='w-[75%] md:w-full border absolute top-0 flex justify-center items-center p-2 rounded-lg cursor-pointer bg-white  '>
                  <p className='text-xl font-semibold'>{context.searchtext}</p>
                </div>}
            </>)}
        </div>
        {mobview &&
          <div onClick={() => { setmobview(false) }} className='w-full h-screen  left-0 z-[101] absolute inset-0 bg-[rgba(0,0,0,0.5)] overflow-hidden'>
            <div className='w-[70%] flex flex-col h-screen items-start bg-gray-700 text-white z-[102] transition-transform duration-300 ease-in-out transform translate-x-0'>
              <img className='w-full h-[200px]'
                src={sidelogo} />
              <div className='w-full flex flex-col items-start p-5 gap-4 '>
                <NavLink to='/' className=' relative'>
                  <div className="w-full flex items-center justify-start gap-4 rounded-lg text-2xl">
                    <IoMdHome className='font-bold' />
                    <p className='font-bold'>Home</p>
                  </div>
                </NavLink>

                <NavLink to={context.isLogin ? `/profile/${context.userData.userID}` : "/signin"} className=' relative'>
                  <div className="w-full flex items-center justify-start gap-4 rounded-lg text-2xl">
                    <IoPerson className='font-bold ' />
                    <p className='font-bold '>Profile</p>
                  </div>
                </NavLink>
                <NavLink to={context.isLogin ? `/wishlist/${context.userData.userID}` : "/signin"} className=' relative'>
                  <div className="w-full flex items-center justify-start gap-4 rounded-lg text-2xl">
                    <MdFavorite className='font-bold' />
                    <p className='font-bold'>Favorites</p>
                  </div>
                </NavLink>
                <div className="w-full flex items-center justify-start gap-4 rounded-lg text-2xl">
                  <GrContact className='font-bold' />
                  <p className='font-bold' onClick={() => { setopencontact(true) }}>Contact Us</p>
                </div>

                {context.isLogin ?

                  <div onClick={() => { setopenlogout(true) }} className="w-[150px] h-[50px] absolute bottom-16 flec justify-center items-center bg-gray-500 text-white left-12 flex  gap-4 text-3xl rounded-lg">
                    <p className='font-bold'>Logout</p>
                  </div>
                  :
                  <NavLink to='/signin' >
                    <div onClick={() => { setopenlogout(true) }} className="w-[150px] h-[50px] absolute bottom-16 flec justify-center items-center bg-gray-500 text-white left-12 flex  gap-4 text-3xl rounded-lg">
                      <p className='font-bold'>SignIn</p>
                    </div>
                  </NavLink>
                }

              </div>
            </div>
          </div>}
      </motion.div>


      {/* Logout PopUp */}
      <Dialog
        PaperProps={{
          className: 'w-full md:w-[25%] z-[103]'
        }}
        onClose={() => { setopenlogout(false) }} open={openlogout} className='w-full font-robotoCondensed '>
        <div className='w-full h-[170px] flex justify-center items-center relative p-5'>
          <div className='w-[90%] h-full  flex flex-col items-start '>
            <p className='text-xl font-bold'>Are your sure you want to Logout?</p>
            <div className='w-[90%] flex justify-between items-center  mt-8'>
              <button onClick={handleLogout} className='w-[40%] h-[40px] text-white bg-gray-500 rounded-xl hover:bg-gray-900'>Logout</button>
              <button onClick={() => { setopenlogout(false) }} className='w-[40%] h-[40px] text-gray-500 border-[2px] rounded-xl border-gray-500'>Cancel</button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* Contact us PopUp */}
      <Dialog
        PaperProps={{
          className: 'w-full md:w-[40%] h-[250px] z-[103]'
        }}
        onClose={() => { setopencontact(false) }} open={opencontact} className='w-full font-robotoCondensed '>
        <div className='w-full h-[170px] flex justify-center items-center relative p-5'>
          <div className='w-[90%] h-full  flex flex-col items-start '>
            <p className='text-xl font-bold'>Mail on : <span className='text-[18px] font-semibold'>kunalmaurya732@gmail.com</span></p>
            <p className='text-xl font-bold'>Helpline Number : <span className='text-[18px] font-semibold'>7678531570</span></p>
            <div className='w-[90%] flex justify-center items-center  mt-8'>
              <button onClick={() => { setopencontact(false) }} className='w-[50%] h-[50px] text-[12px] md:text-xl text-white bg-gray-500 rounded-xl hover:bg-gray-900 font-bold' >Back to watching</button>
            </div>
          </div>
        </div>
      </Dialog>
      {isloading && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-white/50">
          <CircularProgress className="text-gray-800" color="inherit" />
        </div>
      )}
    </>
  )
}

export default Navbar