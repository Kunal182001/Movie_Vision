import React, { useContext, useEffect, useState } from 'react';
import Mycontext from '../Mycontext/Mycontext'
import logoimg from '../../assets/logo.webp'
import TextField from '@mui/material/TextField';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { getUser, postData, userData } from '../../Components/Admin/api';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Firebaseapp } from '../../Firebase'

const provider = new GoogleAuthProvider();
const auth = getAuth(Firebaseapp);


const Signin = () => {

    const context = useContext(Mycontext);
    const [formfeilds, setformfeilds] = useState({
        email: "",
        password: "",
    })
    const [checkforemail, setcheckforemail] = useState(false);
    const [eyeforpass, seteyeforpass] = useState(false);
    const [error, setError] = useState(null);
    const [dum, setdum] = useState([]);
    const history = useNavigate();
    const [isloading, setisloading] = useState(false);


    useEffect(() => {
        if (context.setisheader) {
            context.setisheader(false); // Adjusted function name for readability
        }
        if (context.setisfooter) {
            context.setisfooter(false); // Adjusted function name for readability
        }
        return () => {
            if (context.setisheader) {
                context.setisheader(true); // Reset header on unmount
            }
            if (context.setisfooter) {
                context.setisfooter(true); // Adjusted function name for readability
            }
        };
    }, []);

    const onChangeInput = (e) => {
        setformfeilds(() => ({
            ...formfeilds,
            [e.target.name]: e.target.value
        }))
    }


    const handleyepass = () => {
        if (eyeforpass) {
            seteyeforpass(false);
        }
        else {
            seteyeforpass(true);
        }
    }
    const vaildemail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }


    const handleSignin = async (e) => {
        e.preventDefault();
        let isValidEmail = vaildemail(formfeilds.email);

        setcheckforemail(!isValidEmail);

        if (!isValidEmail) {
            return;
        }

        await userData("/api/User/signin", formfeilds).then(response => {
            try {
                setisloading(true);
                localStorage.setItem("token", response.token);
                localStorage.setItem("Address", "");
                const user = {
                    name: response?.result?.name,
                    emal: response?.result?.email,
                    userPhone:response?.result?.phoneNum,
                    userID: response?.result?._id
                }
                localStorage.setItem("user", JSON.stringify(user));

                setTimeout(() => {
                    history('/')
                    setisloading(false);
                    window.location.reload();
                }, 2000);


            }
            catch (err) {
                if (err.response && err.response.data) {
                    setError(err.response.data.message);
                 


                } else {
                    setError("An unknown error occurred. Please try again.");
                    console.log(err)
                }
            }


        })


    }

    //Sign in with Google
    const handleSigninWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;

                const field = {
                    name: user.providerData[0].displayName,
                    phoneNum: user.providerData[0].phoneNumber,
                    email:  user.providerData[0].email,
                    password:null,
                    isVerified:true,
                }

                userData("/api/User/auth", field).then(response => {
                    try {
                        setisloading(true);
                        localStorage.setItem("token", response.token);
                        localStorage.setItem("Address", "");
                        const user = {
                            name: response?.result?.name,
                            emal: response?.result?.email,
                            userPhone:response?.result?.phoneNum,
                            userID: response?.result?._id
                        }
                        localStorage.setItem("user", JSON.stringify(user));
        
                        setTimeout(() => {
                            history('/')
                            setisloading(false);
                            window.location.reload();
                        }, 2000);
        
        
                    }
                    catch (err) {
                        if (err.response && err.response.data) {
                            setError(err.response.data.message);
        
                        } else {
                            setError("An unknown error occurred. Please try again.");
                            console.log(err)
                        }
                    }
        
        
                })
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
           

    }
    return (
        <div className=" w-full h-screen flex justify-center items-center bg-black">
            <div className=' w-[90%] md:w-[25%] h-[95%] md:h-[90%] bg-white rounded-xl flex flex-col items-center p-4 gap-8 '>
                <img src={logoimg} className='w-[90px] h-[60px] rounded-3xl' />
                <form onSubmit={handleSignin} className='w-full flex flex-col items-start font-robotoCondensed p-5 gap-4'>
                    {error && <div className="w-full text-red-500">{error}</div>}
                    <p className='text-xl text-black font-semibold'>Sign In</p>
                    <TextField error={!!checkforemail}
                        helperText={`${checkforemail ? "Incorrect Email Address" : ""}`}
                        className='w-[90%]' type='text' label="Email" name='email'
                        onChange={onChangeInput} required variant="standard" />
                    <div className='w-full relative'>
                        <TextField className='w-[90%]' type={`${eyeforpass ? "text" : "password"}`} label="Password"
                            name='password' onChange={onChangeInput} required variant="standard" />
                        <button
                            type="button"
                            onClick={handleyepass}
                            className="absolute right-3 top-5 text-lg"
                        >
                            {eyeforpass ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="w-[45%] h-[50px] flex flex-col items-start mt-1 group">
                        <p className="w-full font-medium text-gray-500 group-hover:text-black transition-all duration-300 ease-in-out">
                            Forgot Password?
                        </p>
                        <div className="w-0 h-[1px] bg-black transition-all duration-300 ease-in-out group-hover:w-[85%]"></div>
                    </div>
                    <div className='w-full h-[50px] flex justify-between items-center cursor-pointer'>
                        <button className='w-[47%] h-full text-[18px] bg-gray-500 font-semibold rounded-2xl text-white flex justify-center items-center hover:bg-gray-900'>
                            Sign In
                        </button>
                        <NavLink to='/' className='w-[47%] h-full'>
                            <div className='w-full h-full text-[18px] bg-white border-[1px] font-semibold rounded-2xl border-gray-500 text-gray-500 flex justify-center items-center'>
                                Cancel
                            </div>
                        </NavLink>
                    </div>
                    <div className='w-full flex justify-start items-center gap-1'>
                        <p className='text-[16px] font-medium text-black'>Not Registered?</p>
                        <div className="flex flex-col items-start mt-1 group">
                            <NavLink to='/signup' className='w-full' >
                                <p className="w-full font-medium text-gray-500 group-hover:text-black transition-all duration-300 ease-in-out">
                                    Sign Up
                                </p>
                            </NavLink>
                            <div className="w-0 h-[1px] bg-black transition-all duration-300 ease-in-out group-hover:w-[75%]"></div>
                        </div>
                    </div>
                    <p className='w-full text-xl font-medium flex justify-center items-center mt-2'>Or continue with social account</p>
                    <div onClick={handleSigninWithGoogle} className='w-full h-[50px] border-[1px] border-gray-500 rounded-xl flex justify-center gap-2 items-center cursor-pointer'>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png' className='w-[30px] h-[30px]' />
                        <p className='text-[18px] font-medium'>Sign In With Google</p>
                    </div>
                </form>
            </div>
            {isloading && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] bg-white/50">
                    <CircularProgress className="text-black" color="inherit" />
                </div>
            )}
        </div>
    )
}

export default Signin