import React, { useEffect, useState } from 'react'
import MoiveCard from '../MoiveCard/MoiveCard'
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";


const HomemiddleSection = () => {

    const [popularMovie, setPopularMovie] = useState({});
    const [webSeries, setwebSeries] = useState({});
    const [BollywoodMovie, setBollywoodMovie] = useState({});
    const [Bollywoodseries, setBollywoodseries] = useState({});
    const [Animedata, setAnimedata] = useState({});


    useEffect(() => {
        const fetchMovies = async () => {
            const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            const today = new Date().toISOString().split("T")[0];
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&first_air_date.lte=${today}`;
            const Tvseries = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&first_air_date.lte=${today}`;
            const Bollywood = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&first_air_date.lte=${today}`;
            const BollywoodWeb = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&with_watch_providers=8|119|337&watch_region=IN&first_air_date.lte=${today}`;
            const Anime = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc&language=en-US&first_air_date.gte=2020-01-01&first_air_date.lte=${today}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                const response1 = await fetch(Tvseries);
                const data1 = await response1.json();
                const response2 = await fetch(Bollywood);
                const data2 = await response2.json();
                const response3 = await fetch(BollywoodWeb);
                const data3 = await response3.json();
                const response4 = await fetch(Anime);
                const data4 = await response4.json();
                setPopularMovie(data.results);
                setwebSeries(data1.results);
                setBollywoodMovie(data2.results);
                setBollywoodseries(data3.results);
                setAnimedata(data4.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="w-full bg-black flex justify-center items-center font-[Manrope] pb-[100px] -mt-1 pt-[50px] md:pt-0  overflow-hidden">
            <div className="w-[90%] flex flex-col items-start gap-10">
                {/* Popular Movie Section */}
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-bold text-white">Popular Movies</p>
                    <motion.div
                        className="w-full flex gap-6 md:gap-10 overflow-x-auto overflow-y-hidden p-2 whitespace-nowrap scroll-smooth no-scrollbar mt-4"
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {popularMovie.length > 0 ? (
                            <>
                                {popularMovie.map((movie, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-wrap items-center"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileInView="visible"
                                    >
                                        <NavLink to={`/By/movie/${movie.id}`}>
                                            <MoiveCard movie={movie} index={index} />
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <div className="w-screen grid grid-cols-2 md:grid-cols-4 ">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex flex-wrap items-center mt-10" >
                                        <div className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 relative overflow-hidden cursor-pointer animate-pulse">
                                            {/* Fake Image Skeleton */}
                                            <div className="w-full h-full rounded-3xl bg-gray-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Popular Web Series Section */}
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-extrabold text-white">Popular Web Series</p>
                    <div className="w-full grid grid-cols-2 md:grid-cols-4">
                        {webSeries.length > 0 ? (
                            <>
                                {webSeries.map((movie, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-wrap items-center mt-5 md:mt-10"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        whileInView="visible"
                                    >
                                        <NavLink to={`/By/Tv/${movie.id}`}>
                                            <MoiveCard movie={movie} index={index} />
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <div className="w-screen grid grid-cols-2 md:grid-cols-4 ">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <div key={index} className="flex flex-wrap items-center mt-10" >
                                        <div className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 relative overflow-hidden cursor-pointer animate-pulse">
                                            {/* Fake Image Skeleton */}
                                            <div className="w-full h-full rounded-3xl bg-gray-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Popular Bollywood Movies Section */}
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-bold text-white">Popular Bollywood Movies</p>
                    <motion.div
                        className="w-full flex gap-6 md:gap-10 overflow-x-auto overflow-y-hidden p-2 whitespace-nowrap scroll-smooth no-scrollbar mt-4"
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {BollywoodMovie.length > 0 ? (
                            <>
                                {BollywoodMovie.map((movie, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-wrap items-center"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileInView="visible"
                                    >
                                        <NavLink to={`/By/movie/${movie.id}`}>
                                            <MoiveCard movie={movie} index={index} />
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <div className="w-screen grid grid-cols-2 md:grid-cols-4 ">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex flex-wrap items-center mt-10" >
                                        <div className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 relative overflow-hidden cursor-pointer animate-pulse">
                                            {/* Fake Image Skeleton */}
                                            <div className="w-full h-full rounded-3xl bg-gray-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Popular Bollywood Web Series Section */}
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-bold text-white">Popular Bollywood Web Series</p>
                    <motion.div
                        className="w-full  grid grid-cols-2 md:grid-cols-4 "
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {Bollywoodseries.length > 0 ? (
                            <>
                                {Bollywoodseries.map((movie, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-wrap items-center mt-5 md:mt-10"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileInView="visible"
                                    >
                                        <NavLink to={`/By/Tv/${movie.id}`}>
                                            <MoiveCard movie={movie} index={index} />
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <div className="w-screen grid grid-cols-2 md:grid-cols-4 ">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <div key={index} className="flex flex-wrap items-center mt-10" >
                                        <div className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 relative overflow-hidden cursor-pointer animate-pulse">
                                            {/* Fake Image Skeleton */}
                                            <div className="w-full h-full rounded-3xl bg-gray-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
                {/* Popular Anime  Section */}
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-bold text-white">Popular Anime</p>
                    <motion.div
                        className="w-full flex gap-6 md:gap-10 overflow-x-auto overflow-y-hidden p-2 whitespace-nowrap scroll-smooth no-scrollbar mt-4"
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {Animedata.length > 0 ? (
                            <>
                                {Animedata.map((movie, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-wrap items-center"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileInView="visible"
                                    >
                                        <NavLink to={`/By/Tv/${movie.id}`}>
                                            <MoiveCard movie={movie} index={index} />
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <div className="w-screen grid grid-cols-4 ">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex flex-wrap items-center mt-10" >
                                        <div className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 relative overflow-hidden cursor-pointer animate-pulse">
                                            {/* Fake Image Skeleton */}
                                            <div className="w-full h-full rounded-3xl bg-gray-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default HomemiddleSection