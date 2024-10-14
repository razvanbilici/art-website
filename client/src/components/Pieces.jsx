import React, {useState, useEffect} from 'react'
import PieceCard from './PieceCard'


import axios from "axios"
import Nav from './Nav';
import { IoMdArrowDropdown as Dropdown} from "react-icons/io";

const localHost = "http://localhost:5000/"


const Pieces = ({home, myPieces, likedPieces, creatorID, externalEvent, piecesPage}) => {

  // State to hold the data fetched from the database
  const [pieces, setPieces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState()
  const [creator, setCreator] = useState()
  const [pieceSearchBox, setPieceSearchBox] = useState("")

  const [typeFilter, setTypeFilter] = useState("")


  const filteredPieces = pieces.filter(piece =>
    piece.piece.name.toLowerCase().includes(pieceSearchBox.toLowerCase()) 
    && (piece.piece.pieceType.toLowerCase().includes(typeFilter.toLowerCase()))
    
  )


  const fetchData = async () => {
    try {
        let response = []
        const _user = await axios.get(localHost + 'api/users/user/' + localStorage.getItem("loggedUserID"))
        setUser(_user.data.user)

        if (myPieces){
          console.log("My Pieces case")
          response = await axios.get(localHost + 'api/pieces/creator/' + localStorage.getItem("loggedUserID"))
          setPieces(response.data.pieces)
          console.log(response.data)

        }
        else if (likedPieces){
          const _pieces = Object.keys(_user.data.user.likedPieces)
          console.log(_pieces)

        let pieceJSONs = []
        
        for (let piece of _pieces){
            const piecesResponse = await axios.get(localHost + "api/pieces/piece/" + piece)
            pieceJSONs.push(piecesResponse.data)

        }
        // console.log(pieceJSONs)
        setPieces(pieceJSONs)
        }

        else if (creatorID){
          response = await axios.get(localHost + 'api/pieces/creator/' + creatorID)
          setPieces(response.data.pieces)
          setCreator(response.data.creator)
          // console.log(creatorID)
        }


        // Collect all the pieces
        else {
             
        response = await axios.get(localHost + 'api/pieces/allPieces')
        console.log(response.data.pieces)
        setPieces(response.data.pieces)
      }

    } catch (err) {
        // Handle errors if any
        setError(err);
    } finally {
        setLoading(false)
    }
}


  useEffect(() => {
      fetchData()
  }, [myPieces, likedPieces, creatorID, externalEvent])


  const onEvent = () => {
    setLoading(true)
    fetchData();

  };

  if (loading){ 
    return <div className={(piecesPage  || likedPieces || myPieces)? 'w-full h-auto flex flex-col items-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'
    : "'w-full h-auto flex flex-col items-center"}>
    {(piecesPage || likedPieces || myPieces) && <Nav/>}
    <div className="flex items-center justify-center min-h-screen">
  <div className="w-16 h-16 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
</div></div>;
}

  if (error) {
      return <div>Error: {error.message}</div>;
  }

  if(home){

    return(
      <div className='items-center flex flex-col p-4'>

      {loading ? <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div> : 

      <div className="my-2 p-4  rounded flex items-start flex-col">
        <div className='w-400 flex gap-3 items-start'>
        {pieces.length >= 3 ? pieces.slice(-3).reverse().map((piece, index) => (
                  <PieceCard piece={piece.piece} creator={piece.creator} user={user} onEvent={onEvent} onExternal={externalEvent} className='mx-6' key={index} />
                  )) : pieces.reverse().map((piece, index) => (
                    <PieceCard piece={piece.piece} creator={piece.creator} user={user} onEvent={onEvent} onExternal={externalEvent} className='mx-6' key={index} />
                    ))}
      </div>
        
    </div>}
      </div>
    )
  }


  return (

    <div className={(home || creatorID)? 'w-full min-h-screen flex flex-col items-center' : "w-full min-h-screen flex flex-col items-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100"}>
          <Nav />
          <div className='flex-grow w-full flex flex-col items-center mt-2 p-4'>
        <div className='flex flex-row items-center justify-center content-center'>
        <div className='p-4 w-full flex justify-center items-center gap-20'>
          <input className="w-50 px-4 py-2 border-gray-700 shadow-xl rounded-md bg-white bg-opacity-50 duration-100 transition-all ease-in-out text-base outline-none text-gray-600 placeholder-gray-500" type="text" placeholder='Search for pieces' value={pieceSearchBox}
          onChange={(e) => setPieceSearchBox(e.target.value)} />
        </div>
        <select
        className="w-50 appearance-none bg-white border bg-opacity-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pl-3 pr-10 py-2.5 text-gray-900 sm:text-sm"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="" disabled className='text-gray-500 bg-opacity-50 bg-white'>Piece Type </option>
        <option value="audio" className='text-gray-600 bg-opacity-50 bg-white'>Audio</option>
        <option value="visual" className='text-gray-600 bg-opacity-50 bg-white'>Visual</option>
        <option value="text" className='text-gray-600 bg-opacity-50 bg-white'>Text</option>
      </select>
      </div>

      
      <div
        className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 mt-4  text-white w-40 h-10 text-xl font-bold py-2 px-4 rounded-full shadow-lg items-center justify-center flex cursor-pointer"
        onClick={() => {setTypeFilter(""); setPieceSearchBox("")}}
      >
        Reset Filters
      </div>
      </div>

          {myPieces && <h1 className="items-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400  p-4 rounded-lg mb-2 mt-2 font-caveat text-2xl text-center text-white font-bold">My Pieces</h1>}

          {likedPieces && <h1 className="items-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400  p-4 rounded-lg mb-2 mt-2 font-caveat text-2xl text-center text-white font-bold">Liked Pieces</h1>}

          {creatorID && <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-4 rounded-lg mb-2 mt-2 font-caveat text-2xl text-center font-bold">{creator.name}'s Pieces</h1>}
          

        <div className="relative w-[98%] my-2 p-4 rounded flex items-center justify-center flex-col">

          {(pieceSearchBox !== "" || typeFilter != "")? <div className='w-full flex flex-wrap gap-3 items-center justify-center'>
          {pieces.length > 0 ? filteredPieces.map((piece, index) => (
                    <PieceCard piece={piece.piece} creator={piece.creator} user={user} onEvent={onEvent} onExternal={externalEvent} className='mx-6' key={index} />
                    )) : <div>No Pieces Found</div>}
          </div>
          :

          <div className='w-full flex flex-wrap gap-3 items-center justify-center'>
          {pieces.length > 0 ? pieces.map((piece, index) => (
                    <PieceCard piece={piece.piece} creator={piece.creator} user={user} onEvent={onEvent} onExternal={externalEvent} className='mx-6' key={index} />
                    )) : <div>No Pieces found</div>}
          </div>
  }
    
            
        </div>
    </div>
  );

}

export default Pieces