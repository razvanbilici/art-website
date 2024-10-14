import React, { useState, useEffect } from 'react'
import { IoCheckmarkCircleOutline as Subscribe, IoCheckmarkCircleSharp as Unsubscribe} from "react-icons/io5";

import axios from "axios"
import { NavLink } from 'react-router-dom';

const localHost = "http://localhost:5000/"

const CreatorCard = ({creator, user, onEvent}) => {


    const [pieces, setPieces] = useState([])
    const [error, setError] = useState()


    const fetchData = async () => {
        try {
          const piecesResp = await axios.get(localHost + "api/pieces/creator/" + creator.userID) 
        // setCreators(creatorResp.data.creators)
        setPieces(piecesResp.data.pieces)
    } 
          catch(err){
            console.log(err)
          }
        }

    useEffect(() => {

        fetchData();
      }, []);

    

    if(error){
        return <div>Error: {error.message}</div>
    }


    return (

        
        <div className="w-880 flex items-center bg-gradient-to-r from-yellow-500 via-yellow-300 to-white shadow-lg rounded-lg duration-600 overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out mb-4">
          <img
            className="h-10 w-10 rounded-full ml-2 border-2 border-gray-500 m-4"
            src={creator.iconURL}
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">{creator.name}</h2>
          </div>
          <div class=" ml-5 mr-5">
            {Object.keys(creator.subscribers).length} Subscribers
        </div>
        <div class=" ml-5 mr-5">
            {pieces.length} Pieces
        </div>
        {user.userID !== creator.userID ?
            <div>{creator.userID in user.subscribedCreators ? 
                    
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white ml-32 rounded-md hover:cursor-pointer flex-row" onClick={
                    async () => {
                        try {
                            const userConfirmed = window.confirm('Are you sure you want to unsubscribe from this user?')
                            if (!userConfirmed){
                                return
                            }
                            const response = await axios.put(localHost + 
                                `api/users/unsubscribe/${user.userID}/${creator.userID}`)
                                onEvent()

                        
                    }
                    catch (error) {
                        console.error(error);
                        }
                    }
                }>
                Unsubscribe
                <Unsubscribe className='text-sm mt-1.5 m-1'/>

                </div> : 

                 <div className="flex items-center bg-green-600 text-white ml-32 space-x-2 px-4 py-2 rounded-md hover:cursor-pointer flex-row" onClick={
                    async () => {
                        try {
                            const response = await axios.put(localHost + 
                                `api/users/subscribe/${user.userID}/${creator.userID}`)
                                
                                onEvent()
                                

                    }
                    catch (error) {
                        console.error(error)
                        }
                    }
                }>
                Subscribe 
                <Subscribe className='text-sm mt-1.5 m-1'/>

                </div>
                }
                
                </div>
                :
                <NavLink to={"/add-piece"}>
            
            <div className="flex items-center space-x-2 px-4 py-2 ml-32 bg-green-600 text-white rounded-md hover:cursor-pointer flex-row">
                
                    Add Piece
            </div>
            </NavLink>
                
        }
        <NavLink to={"/creator/" + creator.userID}>
            
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ml-4 rounded-md hover:cursor-pointer flex-row">
                
                    Go To Profile
            </div>
            </NavLink>
        </div>
      );
    };

export default CreatorCard
