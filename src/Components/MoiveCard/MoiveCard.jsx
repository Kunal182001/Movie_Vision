import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";

const MoiveCard = ({ movie, index }) => {

  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };
  return (

    <motion.div
      className="w-[150px] h-[250px] md:w-[250px] md:h-[350px] rounded-3xl border-4 border-gray-500 hover:border-white relative overflow-hidden cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        scale: 0.8,
        boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.5)"
      }}
    >
      <img className="w-full h-full rounded-3xl object-cover" src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} alt="Movie Poster" />

      {/* Rating */}
      <motion.p
        className="text-xl absolute bottom-1 right-2 text-amber-400"
        whileHover={{ scale: 1.2, rotate: -5 }}
      >
        ⭐{movie?.vote_average.toFixed(1)}
      </motion.p>

      {/* Index Number */}
      <motion.p
        className="text-7xl absolute bottom-0 font-bold left-0 text-white"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, delay: 0.3 } }}
      >
        {index + 1}
      </motion.p>
      
    </motion.div>
  )
}

export default MoiveCard