import React, { useContext, useEffect, useState } from 'react';
import Mycontext from '../Mycontext/Mycontext'
import logoimg from '../../assets/logo.webp'
import TextField from '@mui/material/TextField';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { postData,userData } from '../../Components/Admin/api';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Firebaseapp } from '../../Firebase.js'

const provider = new GoogleAuthProvider();
const auth = getAuth(Firebaseapp);

const Signup = () => {

  const context = useContext(Mycontext);
    const [formfeilds, setformfeilds] = useState({
        name: "",
        phoneNum: "",
        email: "",
        password: "",
        confirmpassword: "",
    })
    const [checkforemail, setcheckforemail] = useState(false);
    const [checkforNumber, setcheckforNumber] = useState(false);
    const [checkforpass, setcheckforpass] = useState(false);
    const [strongpass, setstrongpass] = useState(false);
    const [eyeforpass, seteyeforpass] = useState(false);
    const [eyeforconfirmpass, seteyeforconfirmpass] = useState(false);
    const [error, setError] = useState(null);
    const [passerror,setpasserror]=useState([]);
    const [isloading, setisloading] = useState(false);
    const history = useNavigate();
    
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
    }, [context]);

    const onChangeInput = (e) => {
        setformfeilds(() => ({
            ...formfeilds,
            [e.target.name]: e.target.value
        }))
    }

    const handleyconfirmepass = () => {
        if (eyeforconfirmpass) {
            seteyeforconfirmpass(false);
        }
        else {
            seteyeforconfirmpass(true);
        }
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

    const vaildnum = (num) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(num);
    }
    const vaildpass = (pass) => {
        if (pass.password === pass.confirmpassword) {
            return true;
        }
        return false;
    }
    const isstrongpass = (pass) => {

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        const errors = [];
        if (pass.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }

        if (!/[A-Z]/.test(pass)) {
            errors.push("Password must contain at least one uppercase letter.");
        }

        if (!/[a-z]/.test(pass)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/\d/.test(pass)) {
            errors.push("Password must contain at least one number.");
        }
        const specialCharCount = (pass.match(/[@$!%*?&#]/g) || []).length;
        if (specialCharCount === 0) {
            errors.push("Password must contain at least one special character (@$!%*?&).");
        }
        setpasserror(errors);
        return regex.test(pass);

    }
    const handleSignUp = async (e) => {
        e.preventDefault();
        let isValidEmail = vaildemail(formfeilds.email);
        let isValidNumber = vaildnum(formfeilds.phoneNum);
        let isStrong = isstrongpass(formfeilds.password);
        let isValidpass = vaildpass(formfeilds);


        setcheckforemail(!isValidEmail);
        setcheckforNumber(!isValidNumber);
        setcheckforpass(!isValidpass);
        setstrongpass(!isStrong);
        if (!isValidEmail) {
            return;
        }
        if (!isStrong) {
            return;
        }
        if (!isValidNumber) {
            return;
        }
        if (!isValidpass) {
            return;
        }
        try {
            const response = await postData('/api/User/signup', formfeilds);
            localStorage.setItem('userEmail',formfeilds.email);
            setisloading(true);
            setTimeout(() => {
                history('/verifyOTP')
                setisloading(false);
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);

            } else {
                setError("An unknown error occurred. Please try again.");
            }
        }

    }

     //Sign Up with Google
     const handleSignUpWithGoogle = () => {
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
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
           

    }
  return (
    <div className=" w-full  relative flex justify-center items-center bg-black overflow-hidden ">
            <div className='w-[90%] md:w-[37%]  relative  bg-white rounded-xl flex flex-col items-center p-4 '>

                <img src={logoimg} className='w-[90px] h-[60px] rounded-3xl' />
                <form onSubmit={handleSignUp} className='w-full relative flex flex-col items-start font-robotoCondensed p-5 gap-4'>

                    <p className='text-xl text-black font-semibold'>Sign Up</p>
                    {error && <div className="w-full text-red-500">{error}</div>}
                    <div className='w-full flex justify-between items-center'>
                        <TextField className='w-[47%]' type='text' label="Name" name='name' onChange={onChangeInput} required variant="standard" />
                        <TextField error={!!checkforNumber}
                            helperText={`${checkforNumber ? "Incorrect Phone Number" : ""}`}
                            className='w-[47%] no-spinner ' type='number' label="Phone No." name='phoneNum'
                            onChange={onChangeInput} required variant="standard" />
                    </div>
                    <TextField error={!!checkforemail}
                        helperText={`${checkforemail ? "Incorrect Email Address" : ""}`}
                        className='w-[90%]' type='text' label="Email" name='email'
                        onChange={onChangeInput} required variant="standard" />
                    <div className='w-full relative'>
                        <TextField error={!!strongpass}
                            helperText={`${strongpass ? "Not a Strong Password" : ""}`}
                            className='w-[90%]' type={`${eyeforpass ? "text" : "password"}`} label="Password"
                            name='password' onChange={onChangeInput} required variant="standard" />
                        <button
                            type="button"
                            onClick={handleyepass}
                            className="absolute right-3 top-5 text-lg"
                        >
                            {eyeforpass ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    {passerror?.length>0 && passerror.map((er,index)=>(
                        <p key={index} className='text-red-500 text-xs'>{er}</p>
                    ))}
                    <div className='w-full relative'>
                        <TextField error={!!checkforpass}
                            helperText={`${checkforpass ? "Confirm Password not match" : ""}`}
                            className='w-[90%]' type={`${eyeforconfirmpass ? "text" : "password"}`} label="Confirm Password"
                            name='confirmpassword' onChange={onChangeInput} required variant="standard" />
                        <button
                            type="button"
                            onClick={handleyconfirmepass}
                            className="absolute right-3 top-5 text-lg"
                        >
                            {eyeforconfirmpass ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="w-[40%] h-[50px] flex flex-col items-start mt-1 group">
                        <p className="w-full font-medium text-gray-500 group-hover:text-black transition-all duration-300 ease-in-out">
                            Forgot Password?
                        </p>
                        <div className="w-0 h-[1px] bg-black transition-all duration-300 ease-in-out group-hover:w-[85%]"></div>
                    </div>
                    <div className='w-full h-[50px] flex justify-between items-center cursor-pointer'>
                        <button type='submit' className='w-[47%] h-full text-[18px] bg-gray-500 font-semibold rounded-2xl text-white flex justify-center items-center hover:bg-gray-900'>
                            Sign Up
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
                            <NavLink to='/signin' className='w-full'>
                                <p className="w-full font-medium text-gray-800 group-hover:text-black transition-all duration-300 ease-in-out">
                                    Sign in
                                </p>
                            </NavLink>
                            <div className="w-0 h-[1px] bg-black transition-all duration-300 ease-in-out group-hover:w-[80%]"></div>
                        </div>
                    </div>
                    <p className='w-full text-xl font-medium flex justify-center items-center mt-2'>Or continue with social account</p>
                    <div onClick={handleSignUpWithGoogle} className='w-full h-[50px] border-[1px] border-gray-500 rounded-xl flex justify-center gap-2 items-center cursor-pointer'>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png' className='w-[30px] h-[30px]' />
                        <p className='text-[18px] font-medium'>Sign Up With Google</p>
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

export default Signup
