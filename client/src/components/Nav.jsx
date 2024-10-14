import React, {useState, useEffect} from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { SiMusicbrainz as Logo} from "react-icons/si";
import { CiMusicNote1 as Creator} from "react-icons/ci";
import { BsPersonFill as Casual} from "react-icons/bs";
import { AiFillLike as Liked} from "react-icons/ai";
import { FaCheck as Subscribed} from "react-icons/fa";
import { IoIosAddCircle as Add} from "react-icons/io";
import { FaPaintbrush as Pieces} from "react-icons/fa6";
import { RiShutDownLine as Logout } from "react-icons/ri";
import { RiAccountCircleFill as Account} from "react-icons/ri";

import { getAuth } from 'firebase/auth';
import { app } from '../configs/firebase_config';

import axios from "axios"

const localHost = "http://localhost:5000/"



const Nav = ({onSave}) => {
    
  const [user, setUser] = useState({})
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [hoverPanel, setHoverPanel] = useState(false)

  const toggleOverviewState = () => {
    setHoverPanel(!hoverPanel)
  }

  const userLogOut = () => {


    const firebaseSession = getAuth(app)

    firebaseSession.signOut().then(() => {
        window.localStorage.setItem("auth", "false")
        window.localStorage.setItem("loggedUserID", "none")

    }).catch((error) => console.log(error))

    navigate("/login", {replace: true})
  }


  useEffect(() => {

      fetchUser();
  }, [onSave]) 

  const fetchUser = async () => {
    setLoading(true)
    try {

        const response = await axios.get(localHost + 'api/users/user/' + localStorage.getItem("loggedUserID"));
          
        setUser(response.data.user)
        setLoading(false)
    } catch (error) {
        console.log(error)
        userLogOut()
    } 
}

  return (
    
    <head className="flex items-center w-full p-4 md:py-2 md:px-6 bg-gradient-to-r from-blue-500 to-white rounded-b-2xl">
        
        <NavLink to={"/"}>
            <Logo className='text-5xl'/> 
        </NavLink>

        <ul className='flex items-center justify-center ml-7'>
            
            {/* isActive property provided via react-router-dom */}
            <li>
                <NavLink to={"/home"} className={({isActive}) => isActive ? "text-4xl font-caveat mx-6 hover:text-navHoverColor font-bold transition-all ease-in-out" : "duration-300 hover:text-4xl text-3xl font-caveat mx-6 hover:text-navHoverColor transition-all ease-in-out"}>Home</NavLink>
            </li>

            <li className='mx-6'>
                <NavLink to={"/pieces"} className={({isActive}) => isActive ? "text-4xl font-caveat mx-6 hover:text-navHoverColor font-bold transition-all ease-in-out" : "duration-300 hover:text-4xl text-3xl font-caveat mx-6 hover:text-navHoverColor transition-all ease-in-out"}>Pieces</NavLink>
            </li>

            <li className='mx-6'>
                <NavLink to={"/creators"} className={({isActive}) => isActive ? "text-4xl font-caveat mx-6 hover:text-navHoverColor font-bold transition-all ease-in-out" : "duration-300 hover:text-4xl text-3xl font-caveat mx-6 hover:text-navHoverColor transition-all ease-in-out"}>Creators</NavLink>
            </li>

            <li className='mx-6'>
                <NavLink to={"/about"} className={({isActive}) => isActive ? "text-4xl font-caveat mx-6 hover:text-navHoverColor font-bold transition-all ease-in-out" : "duration-300 hover:text-4xl text-3xl font-caveat mx-6 hover:text-navHoverColor transition-all ease-in-out"}>About</NavLink>
            </li>


            {/* TODO Request creator account option */}
            <li className='mx-6 text-sm'>
                <NavLink to={"/creator-account-info"} className={({isActive}) => isActive ? "text-4xl font-caveat mx-6 hover:text-navHoverColor font-bold transition-all ease-in-out" : "duration-300 hover:text-4xl text-3xl font-caveat mx-6 hover:text-navHoverColor transition-all ease-in-out"}>
                    Creator Account 
                </NavLink>
            </li>

        </ul>


        {loading ? <div className='flex items-center ml-auto cursor-pointer gap-2 relative hover:text-navHoverColor'>Loading user..</div> :
        <div name="User Info" className='flex items-center ml-auto cursor-pointer gap-2 relative hover:text-navHoverColor' 
        onMouseEnter={() => setHoverPanel(!hoverPanel)} onMouseLeave={() => setHoverPanel(!hoverPanel)}>
            
            <img src={user.iconURL} className='text-lg h-14 rounded-full shadow-lg'/>
            <div className='flex flex-col font-caveat'>
                <p className='text-2xl font-bold'>{user.name}</p>
                <p className='text-lg flex items-center gap-2 '>
                    {user.role + " Account"} {user.role === "Creator" ? <Creator/> : <Casual/>}</p>

            </div> 
            

            {hoverPanel &&

            <div className='absolute z-10 flex flex-col top-12 cursor-auto right-0 gap-4 p-4 rounded-lg w-275 bg-card shadow-xl backdrop-blur-sm '>

                    <NavLink to={"/account-panel"} className="flex flex-row font-caveat text-2xl hover:text-3xl hover:font-bold duration-100 transition-all ease-in-out">
                        <p>
                            My Account
                        </p>
                        <Account className='mx-5 mt-2 text-xl'/>

                    </NavLink>

                    {user.role === "Creator" && 

                    <>
                    <NavLink className="flex flex-row  font-caveat text-2xl hover:text-3xl hover:font-bold duration-100 transition-all text-textColor ease-in-out" to={"/my-pieces"}>
                        <p>
                        My Pieces 
                        </p>
                        <Pieces className='mx-5 mt-1.5 text-xl'/>
                    </NavLink>

                    <NavLink className="flex flex-row font-caveat text-2xl hover:text-3xl hover:font-bold duration-100 transition-all text-textColor ease-in-out" to={"/add-piece"}>
                        <p>
                        Add Piece
                        </p>
                        <Add className='mx-5 mt-1.5 text-xl'/>
                    </NavLink>

                       </> 
                    }

                    <NavLink className="flex flex-row  font-caveat text-2xl hover:text-3xl hover:font-bold duration-100 transition-all text-textColor ease-in-out" to={"/liked-pieces"}>
                    <p>
                            Liked Pieces
                    </p>
                    <Liked className='mx-5 mt-1.5 text-xl'/>
                    </NavLink>

                    <NavLink className="flex flex-row  font-caveat text-2xl hover:text-3xl hover:font-bold duration-100 transition-all text-textColor ease-in-out" to={"/subscribed"}>

                    <p>
                        Subscribed
                    </p>
                    <Subscribed className='mx-5 mt-1.5 text-xl'/>
                    </NavLink>

                    <hr/>

                    <div className="flex flex-row font-caveat hover:cursor-pointer text-2xl hover:text-3xl hover:font-bold duration-100 transition-all ease-in-out text-logOutColor">
                    <p onClick={userLogOut}>
                        Log Out
                    </p>
                    <Logout className='mx-5 mt-2 text-xl'/>
                    </div>

            </div> }
        </div> }

    </head>
  )
}

export default Nav
