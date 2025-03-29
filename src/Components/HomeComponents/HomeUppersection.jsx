import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { NavLink } from 'react-router';

const HomeUppersection = () => {


  return (
    <div className="w-full h-screen bg-black flex justify-center items-center font-[Manrope] pt-[70px] md:pt-0 ">
      <div className="w-[90%] flex justify-center items-start">

        {/* Home Movie Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-gray-500 h-[450px] md:h-[400px] flex flex-col items-start gap-3 p-5 rounded-4xl"
        >
          <motion.p
            whileHover={{ scale: 1.03, color: "#e5e7eb" }} // Faster scale & color shift
            transition={{ duration: 0.15 }}
            className="text-2xl md:text-3xl font-extrabold text-white transition-all cursor-pointer"
          >
            Find the Perfect Movie for Your Mood!
          </motion.p>

          <motion.p
            whileHover={{ scale: 1.03, color: "#e5e7eb" }}
            transition={{ duration: 0.15 }}
            className="text-xl md:text-2xl font-bold text-white transition-all cursor-pointer"
          >
            Not sure what to watch? Let us help!
          </motion.p>

          <motion.p
            className="text-[18px] md:text-xl text-white w-full md:w-[80%] opacity-70"
          >
            Not sure what to watch? Let your mood decide! Whether you're craving thrilling action, heartfelt romance, hilarious comedy, or spine-chilling horror, we've got the perfect movie for you. Just answer a few quick questions and discover your ideal watch! 🎬✨
          </motion.p>
          <NavLink to="/mymovie">
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#e5e7eb", color: "#000" }} // Instant color change
              whileTap={{ scale: 0.95 }} // Quick bounce effect
              transition={{ duration: 0.15 }}
              className="w-[150px] h-[60px] bg-white rounded-4xl text-black font-bold mt-22 md:mt-5 transition-all"
              onClick={
                () => {
                  localStorage.removeItem("movies")
                }
              }
            >
              Find My Movie
            </motion.button>
          </NavLink>
        </motion.div>
      </div>
    </div>
  )
}

export default HomeUppersection