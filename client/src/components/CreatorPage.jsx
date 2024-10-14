import React, { useEffect, useState } from 'react';

import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Pieces from './Pieces'
import axios from "axios"
import Nav from './Nav';

const localHost = "http://localhost:5000/"


const CreatorPage = () => {
  const { creatorID } = useParams()
  const navigate = useNavigate()
  const [creator, setCreator] = useState(null)
  const [pieces, setPieces] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  const onEvent = () => {
    fetchData()
  }

  const fetchData = async () => {

    try {

    const response = await axios.get(localHost + 'api/pieces/creator/' + creatorID)
    const _user = await axios.get(localHost + 'api/users/user/' + localStorage.getItem("loggedUserID"))
          setUser(_user.data.user)
          setPieces(response.data.pieces)
          setCreator(response.data.creator)
          console.log(creator) 
          try {
            const id = response.data.creator.userID
            console.log("id is " + id)
          }
          catch {
            navigate("/home")
          }
    
        } catch (err) {
            // Handle errors if any
            setError(err);
            navigate("/home")
            return
        } finally {
            setLoading(false)
        }
    }
  useEffect(() => {
      fetchData()
  }, [])

  if (loading) {
    return (<div className='w-full h-auto flex flex-col items-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
      <Nav />
 </div>)
    }

    if (error) {
        navigate("/home")
        return
    }


  return (
    <div className='w-full min-h-screen flex flex-col bg-gradient-to-t from-violet-600 via-red-400 to-blue-100 '>


    <Pieces creatorID={creatorID} externalEvent={onEvent} />
        
        <div className='flex flex-col justify-center items-center'>
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-200 p-2 rounded-md mt-4 mb-4 font-bold text-gray-500 ">
              {Object.keys(creator.subscribers).length} Subscribers
            </div>

  <div class="bg-gradient-to-r from-blue-500 to-blue-300 p-4 mb-4 rounded-lg text-gray-500 font-bold">
    {pieces.length} Pieces
  </div>
  
</div>

    </div>
  )
}

export default CreatorPage
