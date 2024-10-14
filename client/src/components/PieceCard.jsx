import { NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import { IoIosPlayCircle as Play} from "react-icons/io";
import { MdOutlinePauseCircleFilled as Pause } from "react-icons/md";




import { FaEdit as Edit, FaTrash as Delete} from "react-icons/fa";
import { AiOutlineLike as Unliked, AiFillLike as Liked } from "react-icons/ai";

import { IoCheckmarkCircleOutline as Subscribe, IoCheckmarkCircleSharp as Unsubscribe} from "react-icons/io5";

import axios from "axios"
const localHost = "http://localhost:5000/"

function PieceCard({ piece, creator, user, onEvent, onExternal }) {

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (audio.paused) {
        audio.play();
        setIsPlaying(true);
        } else {
        audio.pause();
        setIsPlaying(false);
        }
    };

    return (
        <div className={piece.creatorID === user.userID ? 
            "relative w-56 h-510 px-4 py-6 bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-300 shadow-2xl rounded-2xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl mb-6 flex flex-col items-center justify-center"
            : 
            "relative w-56 h-510 px-4 py-6 bg-gradient-to-r from-blue-500 via-blue-400 to-white shadow-2xl rounded-2xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl mb-6 flex flex-col items-center justify-center"}>
            
            <div className='w-44 h-32 rounded-lg drop-shadow-md overflow-hidden hover:rotate-2 transition-transform duration-500 '>
    
            {piece.pieceType === "Audio" && 
                <div name="Media" className='flex justify-center items-center h-full'>
                    <audio ref={audioRef} src={piece.fileURL} />
                    <button className="text-8xl text-yellow-100 hover:text-yellow-300 transition-colors duration-300" onClick={handlePlayPause}>
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                </div>
            }
            {piece.pieceType === "Visual" && 
            <img 
                className="w-full h-full rounded-lg object-cover" 
                src={piece.fileURL || "https://i.ebayimg.com/images/g/k-4AAOSwBFpbnADm/s-l1600.jpg"} 
                alt={`${piece.title} cover`} 
            />
                }
            
            {piece.pieceType === "Text" && 
            <img 
                className="w-44 h-full rounded-lg object-cover" 
                src={piece.iconURL} 
                alt={`${piece.title} cover`} 
            />
                }
            </div>
            
            <div className="p-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-shadow-lg">{piece.name}</h3>
                <p className="text-gray-700 text-shadow-md">{"By " + creator.name}</p>
                <p className="text-sm font-bold text-gray-900 text-shadow-sm">{piece.pieceType}</p>
            </div>
    
            <div className="p-6">
                <p className="text-gray-700 text-shadow-md">{piece.likes} {piece.likes !== 1 ? "Likes" : "Like"}</p>
            </div>
    
            <div name="options" className='h-150'>
                <div>
                    {piece.creatorID !== user.userID &&
                    <>  
                        <div className="flex items-center space-x-2 px-4 py-2 mb-4 rounded-lg cursor-pointer hover:bg-yellow-200 transition-colors duration-300">
                            {piece._id in user.likedPieces ? 
                            
                                <div className="flex flex-row" onClick={
                                    async () => {
                                        try {
                                            const response = await axios.put(localHost + 
                                                `api/pieces/unlike/${user.userID}/${piece._id}`)
                                            onEvent()
                                            onExternal()
                                    }
                                    catch (error) {
                                        console.error(error);
                                        }
                                    }
                                }>
                                    Unlike <Liked className='text-md m-1'/>
                                </div> 
                                : 
                                <div className='flex flex-row'  onClick={
                                    async () => {
                                        try {
                                            const response = await axios.put(localHost + 
                                                `api/pieces/like/${user.userID}/${piece._id}`)
                                                onEvent()
                                            onExternal()
                    
                                    }
                                    catch (error) {
                                        console.error(error);
                                        }
                                    }
                                }>
                                    Like <Unliked className='text-md m-1'/>
                                </div>
                            }
                        </div>
    
                        {piece.creatorID in user.subscribedCreators ?
                            <div className="flex items-center space-x-2 px-4 py-2 mb-4 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors duration-300" onClick={
                                async () => {
                                    try {
                                        const userConfirmed = window.confirm('Are you sure you want to unsubscribe from this user?')
                                        if (!userConfirmed){
                                            return
                                        }
                                        const response = await axios.put(localHost + 
                                            `api/users/unsubscribe/${user.userID}/${piece.creatorID}`)
                                            onEvent()
                                        onExternal()
        
        
                                    
                                }
                                catch (error) {
                                    console.error(error);
                                    }
                                }
                            }>
                            Unsubscribe
                            <Unsubscribe className='text-md m-1'/>
                            </div> 
                            : 
                            <div className="flex items-center space-x-2 px-4 py-2 mb-4 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors duration-300" onClick={
                                async () => {
                                    try {
                                        const response = await axios.put(localHost + 
                                            `api/users/subscribe/${user.userID}/${piece.creatorID}`)
                                            onEvent()   
                                        onExternal()
        
                                }
                                catch (error) {
                                    console.error(error)
                                    }
                                }
                            }>
                            Subscribe
                            <Subscribe className='text-md m-1'/>
                            </div>
                        }
                    </>
                    }
                </div>
    
                {piece.creatorID === localStorage.getItem("loggedUserID") && 
                    <>
                        <div className="flex items-center space-x-2 px-4 py-2 mb-4 rounded-lg cursor-pointer hover:bg-red-200 transition-colors duration-300" onClick={
                    async () => {
                        try {
                            const userConfirmed = window.confirm('Are you sure you want to delete this piece?')
                            if (!userConfirmed){
                                return
                            }
                            const response = await axios.delete(localHost + `api/pieces/delete/${piece._id}`)
                            onEvent()
                            onExternal()
                        
                    }
                    catch (error) {
                        console.error(error);
                        }
                    }
                }>
                            Delete Piece <Delete className='text-md m-1'/>
                        </div>
    
                        <NavLink to={"/piece/" + piece._id} className="flex items-center space-x-2 px-4 py-2 mb-4 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors duration-300">
                            Edit Piece <Edit className='text-md m-2'/>
                        </NavLink>
                    </>
                }
            </div>
    
            <NavLink to={"/piece/" + piece._id}>
                <div className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 mt-6">
                    <div className="text-center text-white font-medium p-2 transition-transform hover:scale-105 duration-500">
                        Go To Piece
                    </div>
                </div>
            </NavLink>
        </div>
    );
    
    
}

export default PieceCard;
