import React, { useContext, useEffect } from 'react'
import Mycontext from '../Mycontext/Mycontext';
import { NavLink, useNavigate, useParams } from 'react-router';
import { motion} from "framer-motion";
import MoiveCard from '../../Components/MoiveCard/MoiveCard';

const Moviesearch = () => {
    const { type } = useParams();
    const context = useContext(Mycontext);
    const history = useNavigate();
    useEffect(()=>{
        if(context.searchdata.length === 0){
            setTimeout(()=>{
                history(`/`);
            },1000)
        }
    },[context.searchdata])
  return (
    <div className="w-full  bg-black flex justify-center items-center font-[Manrope] pt-[150px] pb-[100px] overflow-hidden">
            <div className="w-[90%] flex flex-col items-start gap-10">
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-extrabold text-white">{`Search for ${type}`}</p>
                    <div className="w-full grid grid-cols-2 md:grid-cols-4">
                        {context?.searchdata?.length > 0 ? (
                            <>
                                {context?.searchdata?.map((movie, index) => (
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

export default Moviesearch
