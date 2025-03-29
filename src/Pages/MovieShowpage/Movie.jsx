import React, { useContext, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import CircularProgress from '@mui/material/CircularProgress';
import Mycontext from "../Mycontext/Mycontext";
import { CartData, deleteData, fetchData } from "../../Components/Admin/api";


const Movie = () => {
    const { type, id } = useParams();
    const [Moviedata, setMoviedata] = useState({});
    const [error, seterror] = useState(false);
    const [errorcontent, seterrorcontent] = useState("");
    const [trailerKey, setTrailerKey] = useState(null);
    const [platformdata, setplatformdata] = useState([]);
    const [isplatform, setisplatform] = useState(false);
    const server_api = import.meta.env.VITE_SERVER_API;
    const [wishlistData, setwishlistData] = useState({
        productTitle: "",
        image: "",
        type: "",
        rating: 0,
        productId: "",
        userID: "",
    })
    const [anscal,setanscal]=useState(false);
    const [addtowishlist, setaddtowishlist] = useState(false);
    const [removetowishlist, setremovetowishlist] = useState(false);
    const [productinwishList, setproductinwishList] = useState(false);
    const [Aidata, setAidata] = useState({
        name: "",
        language: ""
    })
    const [isloading, setisloading] = useState(false);
    const context = useContext(Mycontext);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setsearchfilterData([]);
        context.setsearchtext('');
        context.setissearchActive(false);
        context.setsearchplaceholder('Search for products..');
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            fetchData(`/api/Wishlist/?userID=${user.userID}`).then(res => {
                if (res && res.WishList) {
                    const isProductInWishlist = res.WishList.some(item => item.productId === id);
                    setproductinwishList(isProductInWishlist);
                } else {
                    setproductinwishList(false);
                }
            }).catch(err => {
                console.error("Error fetching wishlist:", err);
                setproductinwishList(false); // Ensure false on error
            });
        }
    }, []);

    useEffect(() => {
        const movieData = async () => {
            const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`;
            const urlTv = `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;
            const response = await fetch(url);
            if (type === "movie") {
                const data = await response.json();
                setMoviedata(data);
                return;
            }
            const Tvresponse = await fetch(urlTv);
            const data = await Tvresponse.json();
            setMoviedata(data);

        }

        movieData();
    }, [])

    const handletrailer = async (name) => {
        const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

        // Step 1: Get Movie ID
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            seterrorcontent("Sorry no Trailer Available for this Movie");
            seterror(true);
            setTimeout(() => {
                seterror(false);
            }, 2000)
            return;
        }

        const movieId = searchData.results[0].id;

        // Step 2: Get Trailer
        const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
        const trailerResponse = await fetch(trailerUrl);
        const trailerData = await trailerResponse.json();

        if (!trailerData.results || trailerData.results.length === 0) {
            seterrorcontent("Sorry no Trailer Available for this Movie");
            seterror(true);
            setTimeout(() => {
                seterror(false);
            }, 2000)
            return;
        }

        const trailer = trailerData.results.find(video => video.type === "Trailer" && video.site === "YouTube");

        if (!trailer) {
            seterrorcontent("Sorry no Trailer Available for this Movie");
            seterror(true);
            setTimeout(() => {
                seterror(false);
            }, 2000)
            return;
        }

        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        console.log("Using URL:", youtubeUrl);
        if (trailer.key) {
            setTrailerKey(trailer.key); // Store the video ID
        } else {
            seterrorcontent("Sorry no Trailer Available for this Movie");
            seterror(true);
            setTimeout(() => {
                seterror(false);
            }, 2000)
            return;
        }

    }

    const inputhandler = (e) => {
        setAidata((prev) => ({
            ...prev,
            language: e.target.value,
        }));
        setAidata(prevState => ({
            ...prevState, // Keep existing state
            name: Moviedata?.title || Moviedata?.name, // Update only 'name'
        }));
    }

    const languagefinder = async () => {
        setisloading(true);
        
        const openAIResponse = await fetch(server_api+"/api/AI/language", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Aidata }),
        });
        const { query } = await openAIResponse.json();
        const [availability, platforms] = query.split(" - ");

        const isAvailable = availability.toLowerCase() === "yes";
        const platformList = platforms ? platforms.split(",") : [];

        setisplatform(isAvailable);
        setplatformdata(platformList);
        setisloading(false);
        setanscal(true);

    }

    //Add to WishList
    const addtoWishlist = async () => {
        setisloading(true);
        wishlistData.productTitle = Moviedata?.title || Moviedata?.name;
        wishlistData.image = Moviedata?.poster_path
        wishlistData.type=type;
        wishlistData.rating = Moviedata?.vote_average?.toFixed(1)
        wishlistData.productId = Moviedata?.id
        wishlistData.userID = context.userData.userID
        await CartData("/api/Wishlist/add", wishlistData)
            .then(res => {
                if (res.status === 200) {
                    // Product successfully added
                    setTimeout(() => {
                        setisloading(false);
                        setaddtowishlist(true);
                        setproductinwishList(true);
                        setTimeout(() => {
                            setaddtowishlist(false);
                        }, 1000)
                    }, 500);
                }
                else if (res.status === 201) {
                    // Product already added to WishList
                    setTimeout(() => {
                        setisloading(false);
                    }, 1500);
                } else {
                    // Handle other response statuses (not 200 or 409)
                    setisloading(false);
                }
            })
            .catch(err => {
                if (err.response) {
                    console.error('Error during CartData request:', err.response);
                } else {
                    console.error('Network error or unknown error:', err);
                }
                setisloading(false)
            });
    }
    //Remove the product From WishList
    const removefromWishList = async () => {
        setisloading(true);
        deleteData(`/api/Wishlist/product/${id}`)
            .then((res) => {
                // "WishList Product Remove successfully."
                setTimeout(() => {
                    setisloading(false);
                    setremovetowishlist(true);
                    setproductinwishList(false);
                    setTimeout(() => {
                        setremovetowishlist(false);
                    }, 1000)
                }, 500);
            })
            .catch((err) => {
                console.error('Failed to delete item:', err.message);
            });
    }
    const checkforlogin = () => {
        history('/signin')
      }
    return (
        <div className="w-full  bg-black flex justify-center items-center font-[Manrope] pt-[100px] pb-[150px] overflow-hidden">
            <div className="w-full h-full flex flex-col items-center">
                {/* Upper part */}
                <div className="w-[90%] h-full flex md:flex-row flex-col justify-center items-center relative gap-10">

                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url("https://image.tmdb.org/t/p/w500${Moviedata?.backdrop_path}")` }}
                    ></div>
                    {/* Image section */}
                    <img className="w-[250px] h-[350px] md:w-[350px] md:h-[450px] rounded-2xl relative z-10 md:mt-0 mt-12" src={`https://image.tmdb.org/t/p/w500${Moviedata?.poster_path}`} />
                    {/* Movie Information Section */}
                    <div className="w-[90%] md:w-[60%] flex flex-col items-start gap-4 relative z-10 text-white ">
                        <p className="text-5xl font-extrabold">{Moviedata?.title || Moviedata?.name}  </p>
                        <p className="text-xl font-medium">{Moviedata?.tagline}</p>
                        <p className="text-[16px] md:text-xl font-bold flex items-center gap-3">
                            {Moviedata?.genres?.length > 0 &&
                                Moviedata?.genres?.map((g, i) => (
                                    <span key={i}>{g.name}</span> // Use <span> instead of <div>
                                ))
                            }
                        </p>

                        <div className="flex justify-start items-center gap-4">
                            <p className="text-[18px] text-amber-500 font-semibold">⭐{Moviedata?.vote_average?.toFixed(1)}</p>
                            <p className="text-[18px] font-semibold">Released: {Moviedata?.release_date || Moviedata?.first_air_date}</p>
                        </div>
                        <div className="flex justify-start items-center gap-3  md:gap-4">
                            <p className="text-[16px] md:text-[18px] font-semibold">Language: {Moviedata?.original_language === "en" ? "English" : Moviedata?.original_language === "hi" ? "Hindi" : Moviedata?.original_language}</p>
                            <p className="text-[16px] md:text-[18px] font-semibold">Run Time: {Moviedata?.runtime || "NA"} min</p>
                        </div>
                        <div className="flex justify-start items-center gap-4">
                           
                            {productinwishList ? (<button onClick={removefromWishList}
                                className='w-[35px] h-[35px] border-[2px] border-gray-200 bg-gray-500 p-2 flex justify-center items-center rounded-full' >
                                <FaHeart className='text-xl font-bold text-black ' />
                            </button>) :
                                (<button onClick={context.isLogin ? addtoWishlist : checkforlogin}
                                    className='w-[35px] h-[35px] border-[2px] border-white bg-gray-500  p-2 flex justify-center items-center rounded-xl'>
                                    <FaHeart className='text-xl font-bold text-white hover:text-gray-800 ' />
                                </button>)}
                            <button className="w-[80px] h-[30px] bg-red-700 text-white rounded-2xl font-bold cursor-pointer" onClick={() => {
                                handletrailer(Moviedata?.title || Moviedata?.name)
                            }} >Trailer</button>
                        </div>

                        <p className="text-xl font-bold">OverView</p>
                        <p className="text-[16px]  w-[90%] ">{Moviedata?.overview}</p>
                    </div>

                </div>
                {/* Lower Part */}
                <motion.div
                    className="w-[90%] flex flex-col items-start gap-5 mt-10 relative bg-gray-800 p-6 rounded-2xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Title */}
                    <motion.p
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Check if this is available in the preferred language
                    </motion.p>

                    {/* Input Field */}
                    <motion.input
                        className="text-xl border-2 border-gray-500 text-white rounded-2xl p-3 bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                        placeholder="Enter the language"
                        onChange={inputhandler}
                        whileFocus={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                languagefinder();
                            }
                        }}
                    />

                    {/* Check Button */}
                    <motion.button
                        onClick={languagefinder}
                        className="w-[100px] h-[50px] bg-gray-600 text-white rounded-xl font-bold cursor-pointer transition-all"
                        whileHover={{ scale: 1.1, backgroundColor: "#4B5563" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Check
                    </motion.button>

                    {/* Result Section */}
                    {isplatform ? (
                        <motion.div
                            className="flex flex-wrap items-center gap-3 text-2xl text-green-500 font-extrabold"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            ✅ YES! Available on:
                            {platformdata.map((p, i) => (
                                <motion.p
                                    key={i}
                                    className="text-xl font-bold text-white bg-gray-700 px-4 py-2 rounded-xl"
                                    whileHover={{ scale: 1.1, backgroundColor: "#374151" }}
                                >
                                    {p}
                                </motion.p>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.p
                            className="text-red-500 font-extrabold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {anscal&&<span>❌ Sorry, it's not available in {Aidata.language}.</span>}
                            
                        </motion.p>
                    )}
                </motion.div>

            </div>
            {error && (
                <>
                    <style>{`body { overflow: hidden; }`}</style>

                    <div className="fixed inset-0 bg-gray-500/70 flex justify-center items-center z-[50]">
                        <p className="w-fit h-[60px] rounded-2xl bg-red-900 text-white font-bold flex justify-center items-center p-4 shadow-lg">
                            {errorcontent}
                        </p>
                    </div>
                </>
            )}
            {trailerKey && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[50]">
                    <div className="w-[90%] max-w-3xl bg-white rounded-lg p-4 relative">
                        <button
                            onClick={() => setTrailerKey(null)}
                            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full"
                        >
                            ✖
                        </button>

                        <iframe
                            width="100%"
                            height="500"
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title="Movie Trailer"
                            allowFullScreen
                            className="rounded-lg"
                        ></iframe>
                    </div>
                </div>
            )}
            {isloading && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] bg-white/50">
                    <CircularProgress className="text-black" color="inherit" />
                </div>
            )}
            {addtowishlist && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] ">
                    <div className='w-[50%] md:w-[20%] h-[50px] absolute bottom-2 left-2 bg-gray-600 text-white font-bold text-sm md:text-xl flex justify-center items-center rounded-lg '>
                        <p>Product added in the WishList</p>
                    </div>
                </div>
            )}
            {removetowishlist && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] ">
                    <div className='w-[50%] md:w-[20%] h-[50px] absolute bottom-2 left-2 bg-black text-white font-bold text-sm md:text-xl flex justify-center items-center rounded-lg '>
                        <p>Product remove in the WishList</p>
                    </div>
                </div>
            )}
        </div>

    )
}

export default Movie
