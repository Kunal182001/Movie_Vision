import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import { NavLink } from "react-router";
import CircularProgress from '@mui/material/CircularProgress';

const MovieFind = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [errorcontent, seterrorcontent] = useState("");
  const [trailerKey, setTrailerKey] = useState(null);



  const questions = [
    { key: "mood", text: "What’s your current mood?", options: ["Happy", "Sad", "Excited", "Relaxed", "Scared"] },
    { key: "genre", text: "Which genre do you prefer?", options: ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"] },
    { key: "pace", text: "Do you like fast-paced or slow-paced movies?", options: ["Fast", "Medium", "Slow"] },
    { key: "era", text: "Which era do you prefer?", options: ["New (2020+)", "Middle Years (2000-2019)", "Old (Before 2000)", "Doesn't Matter"] },
    { key: "ending", text: "Do you want a feel-good ending or something unpredictable?", options: ["Happy Ending", "Unpredictable"] },
    { key: "industry", text: "Which industry do you prefer?", options: ["Hollywood", "Bollywood", "Anime", "Doesn't Matter"] },
    { key: "rating", text: "What is the minimum rating you prefer?", options: ["5", "6", "7", "8", "9"] },
  ];


  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[step].key]: option });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      fetchMovieRecommendations();
    }
  };

  const fetchMovieRecommendations = async () => {
    setLoading(true);

    const openAIResponse = await fetch("http://localhost:5000/api/AI/generateQuery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    const { query } = await openAIResponse.json();
    console.log("Using TMDB Query:", query);

    const genreMap = {
      action: 28,
      adventure: 12,
      animation: 16,
      comedy: 35,
      crime: 80,
      documentary: 99,
      drama: 18,
      fantasy: 14,
      horror: 27,
      mystery: 9648,
      romance: 10749,
      "sci-fi": 878,
      thriller: 53,
      war: 10752,
      western: 37
    };

    const normalizedQuery = query.toLowerCase().replace(/\s+/g, " ").trim();
    const foundGenre = Object.keys(genreMap).find(
      genre => normalizedQuery.includes(genre) || normalizedQuery.includes(genre.replace("-", " "))
    );
    const genreId = foundGenre ? genreMap[foundGenre] : "";

    if (!genreId) {
      console.error("No valid genre found in query!");
      setLoading(false);
      return;
    }

    console.log("Mapped Genre:", foundGenre, "-> ID:", genreId);

    const industryKeywords = {
      hollywood: "en",
      bollywood: "hi",
      anime: "ja",
    };
    const foundIndustry = Object.keys(industryKeywords).find(ind => query.toLowerCase().includes(ind));
    const industryCode = foundIndustry ? industryKeywords[foundIndustry] : "";

    console.log("Industry:", foundIndustry, "-> Language Code:", industryCode);

    let releaseYearFilter = "";
    if (answers.era === "New (2020+)") {
      releaseYearFilter = "&primary_release_year=2020";
    } else if (answers.era === "Middle Years (2000-2019)") {
      releaseYearFilter = "&primary_release_date.gte=2000-01-01&primary_release_date.lte=2019-12-31";
    } else if (answers.era === "Old (Before 2000)") {
      releaseYearFilter = "&primary_release_date.lte=1999-12-31";
    }

    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const tmdbURL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}
    &sort_by=popularity.desc
    &with_genres=${genreId}
    ${industryCode ? `&with_original_language=${industryCode}` : ""}
    ${releaseYearFilter}`.replace(/\s+/g, "");

    console.log("Final TMDB API URL:", tmdbURL);

    const tmdbResponse = await fetch(tmdbURL);
    const { results } = await tmdbResponse.json();



    if (!results || results.length === 0) {
      seterrorcontent("Sorry no Moive Found");
      seterror(true);
      setTimeout(() => {
        seterror(false);
      }, 2000)
      setLoading(false);
      setStep(0);
      setAnswers({});
      setMovies([]);
      return;
    }

    setMovies(results.slice(0, 10));
    console.log("TMDB API Response:", results);
    setLoading(false);
  };

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

  useEffect(() => {
    const savedMovies = localStorage.getItem("movies");
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    }
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem("movies", JSON.stringify(movies));
    }
  }, [movies]);
 



  return (
    <div className="w-full  bg-black flex justify-center items-center font-[Manrope] text-white pt-[170px] md:pt-[100px] pb-[200px] ">
      <div className="w-[95%] md:w-[90%]  flex justify-center items-center">
        {movies.length === 0 ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[80%] md:w-[60%] bg-gray-500 p-6 rounded-2xl text-center"
          >
            <p className="text-2xl font-bold">{questions[step].text}</p>
            <div className="mt-4 flex flex-col gap-3">
              {questions[step].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb", color: "#000" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleAnswer(option)}
                  className="p-3 w-full bg-white text-black rounded-lg font-semibold transition-all"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[95%] md:w-[90%] bg-gray-500 p-6 rounded-2xl flex flex-col items-start gap-2 overflow-hidden"
          >
            <h2 className="text-xl md:text-3xl font-bold mb-4">🎬 Your {answers.type} Recommendations</h2>
            {movies.map((movie, index) => (
              <NavLink to={`/By/movie/${movie.id}`} >
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-[300px] md:h-[200px] relative flex  justify-between items-center p-2 bg-black gap-4 rounded-2xl "
                >
                  <img className="w-[100px] md:w-[200px] h-full rounded-2xl" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                  <div className="w-full flex flex-col items-start gap-2">
                    <h3 className="text-[16px] md:text-xl font-extrabold">{movie.title || movie.name}</h3>
                    <div className="text-[12px] md:text-[18px] w-full flex justify-start items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      <p className="text-gray-500">{parseInt(movie.vote_average)}</p>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center gap-1 md:gap-4">
                      <p className="text-[12px] md:text-[18px] text-gray-400">Language:{" "}{movie.original_language === "hi" ? "Hindi" : movie.original_language === "en" ? "English" : "Japanese"}</p>
                      <p className="text-[12px] md:text-[18px] text-gray-400">Release Date:{" "}{movie.release_date}</p>
                      <button className="w-[50px] h-[20px] md:w-[80px] md:h-[30px] text-[10px] md:text-[18px] bg-red-700 text-white rounded-2xl font-bold cursor-pointer z-[12]" 
                      onClick={(e) => {
                        e.preventDefault();
                        handletrailer(movie.title || movie.name)
                      }} >Trailer</button>
                    </div>
                    <p className="w-[80%] hidden md:flex text-gray-400">{movie.overview.slice(0, 300)}...</p>
                    <p className="w-[100%] text-[10px] md:text-[18px] md:hidden flex text-gray-400">{movie.overview.slice(0, 200)}...</p>
                  </div>
                </motion.div>
              </NavLink>
            ))}

            {/* Buttons: Try Again & Regenerate */}
            <div className="flex gap-4 mt-4">
              {/* Try Again Button */}
              <button
                onClick={() => {
                  localStorage.removeItem("movies");
                  setStep(0);
                  setAnswers({});
                  setMovies([]);
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                🔄 Try Again
              </button>
            </div>
          </motion.div>

        )}
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
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              allowFullScreen
              className="w-full h-[300px] md:h-[500px] rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-white/50">
          <CircularProgress className="text-black" color="inherit" />
        </div>
      )}

    </div>
  );

};

export default MovieFind;
