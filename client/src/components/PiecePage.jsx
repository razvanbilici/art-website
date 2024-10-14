import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import axios from "axios"
import Nav from './Nav';
import { FaEdit as Edit, FaTrash as Delete} from "react-icons/fa";
import { AiOutlineLike as Unliked, AiFillLike as Liked } from "react-icons/ai";
import { IoCheckmarkCircleOutline as Subscribe, IoCheckmarkCircleSharp as Unsubscribe} from "react-icons/io5";
import ReactAudioPlayer from 'react-audio-player';

const localHost = "http://localhost:5000/"

const PiecePage = () => {

  const navigate = useNavigate()

  const { pieceID } = useParams(); // Get the piece_id from the route parameter
  const [piece, setPiece] = useState(null); // State to hold the piece data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [user, setUser] = useState(null)

  const [isNameEditing, setIsNameEditing] = useState(false)
  const [isDescEditing, setIsDescEditing] = useState(false)
  const [pieceComments, setPieceComments] = useState([])


  const [comment, setComment] = useState("")

  const addComment = async () => {
    try{
    await axios.post(localHost + "api/comments/newComment", {content: comment, 
                                                              userID: user.userID,
                                                            pieceID: pieceID})
  setComment("")
  fetchPiece() 
}
  catch(error){
    console.log(error)
    setComment("")
  }

  }


  const fetchPiece = async () => {
    try {
      const response = await axios.get(localHost + `api/pieces/piece/${pieceID}`)
      const userResp = await axios.get(localHost + "api/users/user/" + localStorage.getItem("loggedUserID"))
      const commentsResp = await axios.get(localHost + "api/comments/" + pieceID)
      console.log(response)
      setPiece(response.data)

      setUser(userResp.data.user)
      setName(response.data.piece.name)
      setDescription(response.data.piece.description)
      setPieceComments(commentsResp.data.comments)
      console.log("comms")
      console.log(commentsResp.data.comments)
      // console.log(piece.piece.creatorID)
      // console.log(localStorage.getItem("loggedUserID"))
      

      setLoading(false);
    } catch (err) {
      console.error('Error fetching piece data:', err);
      setError('Failed to load piece data')
      navigate("/home")
      setLoading(false);
    }
  }
  

  const handleSave = async () => {
    setLoading(true)

    // Optionally, send the updated name to the backend via axios
    await axios.put(localHost + 'api/pieces/update/' + pieceID, {name: name, description: description})

    // Update the user state with the new name
    setPiece({ ...piece, piece })
    setIsNameEditing(false)
    setIsDescEditing(false)
    // window.location.reload()
    fetchPiece()
};

  useEffect(() => {

    fetchPiece();
  }, [pieceID]);

  // Render loading state
  if (loading){ 
    return (<div className='w-full h-auto flex flex-col items-center bg-mainBackround'>
    <Nav />
    <div className="flex items-center justify-center min-h-screen">
  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div></div>)
}

  // Render error state
  if (error) return <div>{error}</div>;

  // --------------------------------------------------

  
  return (
    <div className='w-full h-auto flex flex-col items-start bg-gradient-to-b from-white to-blue-300 via-white'>
        <Nav />

        <div name="Main Page Div" className='p-4'>
            
          <div name="Logo-Name-By" className='flex flex-row'>

          <div name="Logo" className="w-40 h-40">
            <img
              src={piece.piece.iconURL}
              alt={"Piece Icon"}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div name="Name - By" className="ml-8 flex flex-col justify-center">

          {isNameEditing ? (
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                ) :
            <div className="flex items-center">
            <h2 className="text-6xl font-extrabold mb-4 text-gray-800">
              {piece.piece.name}
            </h2>
            {piece.piece.creatorID === localStorage.getItem("loggedUserID") && 
            <Edit className="text-2xl ml-4 cursor-pointer" onClick={() => {setIsNameEditing(true)}}/> } 
        </div>}

        <div className="flex justify-end p-1">
                {isNameEditing && (
                    <>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
                            onClick={() => setIsNameEditing(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </>
                )}
            </div>

            <p className="text-3xl text-gray-600 truncate flex items-center">
            By
            <NavLink
              className="text-gray-900 font-semibold flex items-center ml-2"
              to={`/creator/${piece.creator.userID}`}
            >
              {piece.creator.name}
              <div className='pt-1'>
              <img
                src={piece.creator.iconURL}
                alt={piece.creator.name}
                className="h-10 w-10 rounded-full ml-2 border-2 border-gray-500"
                />
              </div>
            </NavLink>
          </p>
          </div>

          </div>

          <div name="Media - Description" className='flex flex-row pt-5'>

          {piece.piece.pieceType === "Text" &&
            <div name="Text Media" className='overflow-y-auto border border-slate-950 w-96 h-96 rounded-lg shadow-xl'>
               <div>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{piece.piece.text}</p>
                    </div>
            </div>
          }

            {piece.piece.pieceType === "Visual" &&
            <div name="Visual Media" className='border border-slate-950 w-96 h-96 rounded-lg shadow-xl'>
              <img
              src={piece.piece.fileURL}
              alt={piece.piece.name}
              className="w-96 h-96 rounded-lg shadow-xl"
            />
            </div>
          }

          {piece.piece.pieceType === "Audio" && 
          
          <div name="Media" className='border flex items-center justify-center border-slate-950 w-96 h-96 rounded-lg shadow-xl'>

                <ReactAudioPlayer
                  src={piece.piece.fileURL}
                  controls
                />
            </div>
          }


            <div name="Description">
              <div className="ml-8 flex flex-col justify-center">

                  <div className="flex items-center">
                    <h2 className="text-6xl font-extrabold mb-4 text-gray-800">
                      Description
                    </h2>
                    {(piece.piece.creatorID === localStorage.getItem("loggedUserID") && !isDescEditing) && 
                    <Edit className="text-2xl ml-4 cursor-pointer" onClick={() => {setIsDescEditing(true)}}/> } 
                  </div>
                    

                  {isDescEditing ? (
                        <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        
                        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                        rows="5"
                      />
                    ) : 
                    
                    <div>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{piece.piece.description}</p>
                    </div>}

                  <div className="flex justify-end p-1">
                        {isDescEditing && (
                            <>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
                                    onClick={() => setIsDescEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </>
                        )}
                    </div>
              </div>
            </div>
          </div>

        <div name="Likes - Other Info" className='flex flex-row pt-5'>

          <div name="Likes" className="bg-yellow-500 text-white w-34 h-16 text-xl font-bold py-4 px-8 rounded-full shadow-lg">
              Likes: {piece.piece.likes}
          </div>

          {piece.piece.creatorID === localStorage.getItem("loggedUserID") &&
            <div name="Delete" className="ml-6 bg-red-500 text-white w-50 h-16 text-xl font-bold py-4 px-8 rounded-full shadow-lg flex flex-row cursor-pointer" onClick={
              async () => {
                  try {
                      const userConfirmed = window.confirm('Are you sure you want to delete piece?')
                      if (!userConfirmed){
                          return
                      }
                      const response = await axios.delete(localHost + 
                          `api/pieces/delete/${piece.piece._id}`)
                          navigate("/home")
                  
              }
              catch (error) {
                  console.error(error);
                  }
              }
              
              
          }>  Delete
              <Delete className='p-0 mt-1.5 ml-1 text-xl'/>
              </div>
          }


          {piece.piece.creatorID !== localStorage.getItem("loggedUserID") &&
          
          <div name="Other Info - Like / Sub Button" className='flex flex-row'>

            <div name="Like Button" className='pt-3 ml-2'>
            {piece.piece._id in user.likedPieces ? 
            
              <Liked className='text-4xl cursor-pointer' onClick={
                          async () => {
                              try {
                                  const response = await axios.put(localHost + 
                                      `api/pieces/unlike/${user.userID}/${piece.piece._id}`)
                                  fetchPiece()
                                  // window.location.reload()
                              
                          }
                          catch (error) {
                              console.error(error);
                              }
                          }
                      }/>
               : 
              <Unliked className='text-4xl cursor-pointer' onClick={
                          async () => {
                              try {
                                  const response = await axios.put(localHost + 
                                      `api/pieces/like/${user.userID}/${piece.piece._id}`)
                                      fetchPiece()
  
                              
                          }
                          catch (error) {
                              console.error(error);
                              }
                          }
                      }/>
              }
            </div>

            <div name="Subscribe Button" className=''>

            {piece.piece.creatorID in user.subscribedCreators ? 
            
            <div name="Unsubscribe" className="ml-6 bg-red-500 text-white w-50 h-16 text-xl font-bold py-4 px-8 rounded-full shadow-lg flex flex-row cursor-pointer" onClick={
              async () => {
                  try {
                      const userConfirmed = window.confirm('Are you sure you want to unsubscribe from this user?')
                      if (!userConfirmed){
                          return
                      }
                      const response = await axios.put(localHost + 
                          `api/users/unsubscribe/${user.userID}/${piece.piece.creatorID}`)
                          fetchPiece()
  
                  
              }
              catch (error) {
                  console.error(error);
                  }
              }
              
              
          }>  Unsubscribe
              <Unsubscribe className='p-0 mt-1 ml-1 text-2xl'/>
              </div> : 
            
            
            <div name="Subscribe" className="ml-6 bg-blue-500 text-white w-50 h-16 text-xl font-bold py-4 px-8 rounded-full shadow-lg flex flex-row cursor-pointer" onClick={
              async () => {
                  try {
                      const response = await axios.put(localHost + 
                          `api/users/subscribe/${user.userID}/${piece.piece.creatorID}`)
                          fetchPiece()
              }
              catch (error) {
                  console.error(error);
                  }
              }
              
              
          }>  Subscribe
              <Subscribe className='p-0 mt-1 ml-1 text-2xl'/>
              </div>
            }

            </div>
          </div> 
          }            


        </div>
        <div name="Comment Section" className='p-4 flex flex-col '>

          <textarea 
          className="h-52 w-96 bg-card backdrop-blur-md rounded-md border-2 border-dotted border-white" 
          onChange={(e) => setComment(e.target.value)} value={comment}
          placeholder='Leave a comment'
          />
          <button name="Add Comment" className="bg-green-500 text-white w-48 h-10 text-lg font-bold py-4 px-8 rounded-full shadow-lg truncate flex items-center mt-1" onClick={addComment}>
              Add Comment
          </button>
          <div name="Section" className='mt-3 pb-4 pt-4 border border-white rounded-lg'> 
            
            <div className='p-3'>
            <div className='font-bold'>Comments</div>

            {pieceComments.length == 0 ? <div>No comments yet</div> : 
            pieceComments.map((data, index) => (

               <div className="relative rounded-xl border p-4 bg-white shadow-xl mt-2">
               <div className="flex items-center mb-2">
                 <img
                   src={data.user.iconURL}
                   alt={data.user.name}
                   className="h-7 w-7 rounded-full mr-3"
                 />
                 <div className="font-semibold text-lg">{data.user.name}</div>
               </div>
               <div className="text-gray-700">{data.comment.content}</div>
                {data.user.userID === localStorage.getItem("loggedUserID") &&
                
                <div
        className="absolute bottom-4 right-4 bg-red-500 text-white w-16 h-10 text-xl font-bold py-2 px-4 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        onClick={async () => {
          try {
            const response = await axios.delete(
              `${localHost}api/comments/delete/${data.comment._id}`
            );
            fetchPiece();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <Delete className="w-5 h-5 text-white" />
      </div>
                
                }
                
              </div>
            ))}
            </div>
          
                
          </div>
        </div>

        </div>
      
    </div>
  )
}

export default PiecePage
