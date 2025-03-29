import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router'
import { motion } from "framer-motion";
import MoiveCard from '../../Components/MoiveCard/MoiveCard';

const MovieCat = () => {
    const { type } = useParams();
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const [moviedata, setmoviedata] = useState({});

    const getGenreId = (genreName) => {
        const genres = {
            Action: 28,
            Adventure: 12,
            Animation: 16,
            Comedy: 35,
            Crime: 80,
            Documentary: 99,
            Drama: 18,
            Family: 10751,
            Fantasy: 14,
            History: 36,
            Horror: 27,
            Music: 10402,
            Mystery: 9648,
            Romance: 10749,
            "Science Fiction": 878,
            "TV Movie": 10770,
            Thriller: 53,
            War: 10752,
            Western: 37,
        };

        return genres[genreName] || null; // Return genre ID or null if not found
    };


    useEffect(() => {
        const fetchdata = async () => {

            let allMovies = [];
            let page = 1;
            let totalPages = 1; // Default value, will be updated after first request
            let genreID = getGenreId(type);

            while (page <= totalPages && page <= 5) {

                const api = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreID}&sort_by=popularity.desc&page=${page}`;
                const response = await fetch(api);
                const data = await response.json();

                allMovies = [...allMovies, ...data.results]; // Merge movies
                totalPages = data.total_pages; // Update total available pages
                page++;
            }
            setmoviedata(allMovies);
        }
        fetchdata();
    }, [])



    return (
        <div className="w-full  bg-black flex justify-center items-center font-[Manrope] pt-[150px] pb-[100px] ">
            <div className="w-[90%] flex flex-col items-start gap-10">
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-extrabold text-white">{`${type} Movie`}</p>
                    <div className="w-full grid grid-cols-2 md:grid-cols-4">
                        {moviedata.length > 0 ? (
                            <>
                                {moviedata.map((movie, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-wrap items-center mt-10"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
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
            </div>
        </div>
    )
}

export default MovieCat
