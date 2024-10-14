import React, { useEffect } from 'react'
import {FcGoogle as GoogleIcon} from "react-icons/fc"
import {app} from "../configs/firebase_config"
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import {LoginBg} from "../assets"


const Login = ({setAuth}) => {

    const firebaseAuth = getAuth(app)
    const googleProvider = new GoogleAuthProvider()
    
    const navigate = useNavigate()

    const googleLogin = async () => {
        await signInWithPopup(firebaseAuth, googleProvider).then((userInfo) => {

            if (userInfo){

                setAuth(true)
                window.localStorage.setItem("auth", "true")

                window.localStorage.setItem("loggedUserID", userInfo.user.uid)

                firebaseAuth.onAuthStateChanged((userInfo) => {
                    if (userInfo){
                        userInfo.getIdToken().then(() => {
                          console.log("User is logged in")
                          
                          })
                        
                        navigate("/",{replace : true})
                    }
                    else{
                        setAuth(false)
                        navigate("/login")
                    }
                    })
            }
        })
        console.log("Google authentification working")

    }


    // Don't allow the user to visit the login page if they're already logged in
    useEffect(() => {

        if(window.localStorage.getItem("auth") === "true"){
            navigate("/", {replace : true})    
        }
    }, [])


  return (
    
    <div className='relative w-screen h-screen'>
      <video
        src={LoginBg}
        type="video/mp4"
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
      ></video>
      <div className='absolute inset-0 bg-darkOverlay flex items-center justify-center p-4'>
        <div className='w-full md:w-375 p-4 bg-lightOverlay shadow-2xl rounded-md backdrop-blur-md flex flex-col items-center justify-center' 
            onClick={googleLogin}>
            
            <div className='flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-cardOverlay cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all text-white hover:text-black 
            border border-gray-300 shadow-2xl'>
                
                <GoogleIcon className='text-xl'/> 
                
                Google Sign In
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login
