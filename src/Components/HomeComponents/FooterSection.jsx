import React from "react"
import { motion } from "framer-motion";


const FooterSection = () =>{
    return(
        <footer className="relative bg-gray-500 text-white flex justify-center items-center font-[Manrope] py-10 overflow-hidden">
        {/* Large Rolling Film Reel Animation */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-[200%] h-full bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat-x opacity-40"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          />
        </div>
  
        {/* Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-[90%] flex flex-col items-center text-center"
        >
          <motion.p
            className="text-xl font-semibold"
            whileHover={{
              scale: 1.1,
              textShadow: "0px 0px 15px rgba(255,255,255,1)",
            }}
          >
            All information is taken from the TMDB database.
          </motion.p>
          <motion.p
            className="text-lg font-bold text-gray-300 mt-2"
            whileHover={{
              scale: 1.1,
              textShadow: "0px 0px 15px rgba(255,255,255,1)",
            }}
          >
            © 2025 Kunal Maurya | All Rights Reserved
          </motion.p>
        </motion.div>
  
       
      </footer>
    )
}

export default FooterSection;