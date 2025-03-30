import React, { useContext, useEffect, useState } from 'react'
import { deleteData, fetchData } from '../../Components/Admin/api';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "framer-motion";
import Mycontext from '../../Pages/Mycontext/MyContext.js';



const WishListPage = () => {
    let { id } = useParams();
    const [wishlistData, setwishlistData] = useState([]);
    const [isloading, setisloading] = useState(false);
    const history = useNavigate();
    const context = useContext(Mycontext);

   

    useEffect(() => {
        fetchData(`/api/Wishlist/?userid=${id}`)
            .then(res => {
                setwishlistData(res.WishList)
            }).catch((err) => {
                console.error('Failed to delete item:', err.message);
            });
    }, [])

    const handleremovefromwihsList = (productID) => {
        setisloading(true);
        console.log(productID)
        deleteData(`/api/Wishlist/product/${productID}`)
            .then((res) => {
                // "WishList Product Remove successfully."
                setTimeout(() => {
                    setisloading(false);
                    window.location.reload();
                }, 500);

            })
            .catch((err) => {
                console.error('Failed to delete item:', err.message);
            });
    }

    const handleshowNow = () => {
        history('/');
    }
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    };
    return (
        <div className='w-full bg-black flex justify-center items-center font-[Manrope] pb-[100px] pt-[150px]'>
            <div className='w-[98%] md:w-[80%] flex flex-col items-center md:items-start md:p-0 p-4'>
                <p className='text-2xl font-extrabold text-white'>Your Watch Later Movies/Web series</p>
                {/* Main Box & data show in grid */}
                {wishlistData.length > 0 ? (
                    <>
                        <div className='w-full relative mt-5 md:p-2 grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {wishlistData.map((item, index) => (
                                <NavLink to={`/By/${item?.type}/${item?.productId}`} key={index}>
                                    <motion.div
                                        className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 relative overflow-hidden cursor-pointer"
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.3 }}
                                        whileHover={{
                                            scale: 0.8,
                                            borderColor: "white",
                                            boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.5)"
                                        }}
                                    >
                                        <img className="w-full h-full rounded-3xl object-cover" src={`https://image.tmdb.org/t/p/w500${item?.image}`} alt="Movie Poster" />

                                        {/* Rating */}
                                        <motion.p
                                            className="text-xl absolute bottom-1 right-2 text-amber-400"
                                            whileHover={{ scale: 1.2, rotate: -5 }}
                                        >
                                            ⭐{item?.rating}
                                        </motion.p>

                                        {/* Index Number */}
                                        <motion.p
                                            className="text-7xl absolute bottom-0 font-bold left-0 text-white"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, delay: 0.3 } }}
                                        >
                                            {index + 1}
                                        </motion.p>
                                        <RxCross1 onClick={(e) => { 
                                            e.preventDefault();
                                            handleremovefromwihsList(item?.productId) }} className='text-2xl absolute font-extrabold top-3 right-3 text-white cursor-pointer z-[103]' />
                                    </motion.div>

                                </NavLink>
                            ))}
                        </div>
                    </>) :
                    (
                        <div className='w-full flex justify-center items-center'>
                            <div className='w-[80%] flex flex-col items-center p-2 gap-4 mt-20'>
                                <img className='w-[200px] h-[220px] ml-10' src='https://cdn-icons-png.flaticon.com/128/17500/17500758.png' />
                                <p className='text-xl font-bold '>Your Watch Later is empty!</p>
                                <p className='text-[18px] font-semibold text-white'>"You haven't added any movies to watch later.</p>
                                <p className='text-[18px] font-semibold text-white'> Start exploring and save your favorites for later!".</p>
                                <button onClick={handleshowNow} className='w-[100px] h-[50px] bg-gray-500 text-white hover:bg-white hover:text-black font-bold rounded-lg'>Explore Now</button>
                            </div>
                        </div>)}

            </div>
            {isloading && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] bg-white/50">
                    <CircularProgress className="text-black" color="inherit" />
                </div>
            )}

        </div>
    )
}

export default WishListPage