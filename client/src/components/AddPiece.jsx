import React, {useState} from 'react'

import Nav from './Nav'
import { GoUpload as Upload} from "react-icons/go";

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../configs/firebase_config'
import { FaEdit as Edit, FaTrash as Delete} from "react-icons/fa";


import axios from 'axios';


const localHost = "http://localhost:5000/"

const AddPiece = () => {

const [pieceName, setPieceName] = useState('')

// TEXT, AUDIO, VISUAL
const [pieceType, setPieceType] = useState("Text")
const [file, setFile] = useState()
const [fileError, setFileError] = useState('')
const [desc, setDesc] = useState("")
const [progress, setProgress] = useState(0)

const [textContent, setTextContent] = useState("")
const [loading, setLoading] = useState(false)

const handleTypeChange = (event) => {
    setPieceType(event.target.value)
    setFile(null)
    setFileError('')
    
    console.log(event.target.value)
  }

  const handleFileChange = (e) => {
    console.log(e.target.files[0])
    if (e.target.files[0].size > 10 * 1024 * 1024){
      alert('File size must be less than 10MB!')
      return
    }
    setFile(e.target.files[0])
  }

  const handleUpload = () => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No file provided!');
        return;
      }
  
      const storageRef = ref(storage, `${pieceType}/media` + 
        localStorage.getItem("loggedUserID") +
        Date.now() + 
        file.name);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          reject(error); // Reject the promise if there is an error during the upload
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL); // Resolve the promise with the download URL
          } catch (error) {
            reject(error); // Reject the promise if there is an error getting the download URL
          }
        }
      );
    });
  };


  const handleSave = async () => {

    if (!pieceName){
      alert("Please enter the piece's name!")
      return
    }

    if (pieceType === "Text"){
      try {
        if(!textContent){
          alert("Please enter the piece's text!")
          return
        }

        if(!desc) {
          alert("Please enter a description!")
          return
        }
        setLoading(true)

        await axios.post(localHost + 'api/pieces/newPiece', {
          name: pieceName,
          creatorID: localStorage.getItem("loggedUserID"),
          pieceType: pieceType,
          text: textContent,
          iconURL: "https://firebasestorage.googleapis.com/v0/b/art-website-d34be.appspot.com/o/PieceIcons%2F28cd1498911e84b2a590cbad6537129b.jpg?alt=media&token=63dfcffc-6761-42d5-aef5-a14abeaae5a3",
          description: desc  
        })
        
        setLoading(false)
        alert("Piece uploaded successfully")
        return
      } catch (error) {
        console.error('Error saving piece:', error);
        setLoading(false)
      }
    }

    try {
      
      if(!file){
        alert("Please select a file!")
        return
      }
      if(!desc) {
        alert("Please enter a description!")
        return
      }
      setLoading(true)
      const downloadURL = await handleUpload()
      await axios.post(localHost + 'api/pieces/newPiece', {
        name: pieceName,
        creatorID: localStorage.getItem("loggedUserID"),
        pieceType: pieceType,
        fileURL: downloadURL,
        iconURL: pieceType === "Visual" ? "https://firebasestorage.googleapis.com/v0/b/art-website-d34be.appspot.com/o/PieceIcons%2Fvisual1.jpg?alt=media&token=3b63e050-fdf5-4160-8d1c-3776909725f7" : "https://firebasestorage.googleapis.com/v0/b/art-website-d34be.appspot.com/o/PieceIcons%2Faudio1.jpg?alt=media&token=aebc1fcf-f7c0-416c-a5b9-929a2fd73629",
        description: desc  
      })

      
      setLoading(false)
      alert("Piece uploaded successfully")
      setFile(null)
      setDesc("")
      setPieceName("")
    } catch (error) {
      alert(error);
      setLoading(false)
    }
  }

  if (loading){ return <div className='w-full h-auto flex flex-col items-center bg-mainBackround'>
    <Nav />
    <div className="flex items-center justify-center min-h-screen">
  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div></div>;
}
  

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center bg-mainBackround'>
        <Nav/>
      <div className='m-4 flex flex-col items-center justify-center p-4 rounded-md'>
        <input type="text" placeholder='Piece name...' className="p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-lg bg-transparent w-52 h-18"
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
          />
      </div>


      <h3 className="text-2xl font-bold text-gray-700 mb-4">Select Piece Type:</h3>
      
      <div className="flex space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Text"
            checked={pieceType === 'Text'}
            onChange={handleTypeChange}
            className="form-radio text-blue-500 h-5 w-5"
            />
          <span className="text-lg font-medium text-gray-600">Text</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Visual"
            checked={pieceType === 'Visual'}
            onChange={handleTypeChange}
            className="form-radio text-blue-500 h-5 w-5"
            />
          <span className="text-lg font-medium text-gray-600">Visual</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Audio"
            checked={pieceType === 'Audio'}
            onChange={handleTypeChange}
            className="form-radio text-blue-500 h-5 w-5"
            />
          <span className="text-lg font-medium text-gray-600">Audio</span>
        </label>
      </div>

      <hr className='text-black'/>
      
      <div className='justify-center items-center'>

    {pieceType === "Audio" &&
    <div>
      <label>
      <div className='bg-card backdrop-blur-md w-880 h-300 rounded-md border-2 border-dotted border-gray-400 cursor-pointer p-4 flex justify-center items-center hover:text-lg'> 
        <Upload/>
        Upload Audio
        <input type="file" name="upload-file" onChange={handleFileChange} accept="audio/mp3, audio/wav" className='w-0 h-0'/>
      </div>
    </label>
    {file != null && 
      <div className='flex flex-row p-4'>File Uploaded: <span className='font-bold ml-2'>{file.name} </span>
      <Delete className='text-red-500 mt-1.5 ml-1 cursor-pointer' onClick={() => setFile(null)}/></div>
      
      } 
      </div>
}

    {pieceType === "Visual" &&
  <div>
    <label>
      <div className='bg-card backdrop-blur-md w-880 h-300 rounded-md border-2 border-dotted border-gray-400 cursor-pointer p-4 flex justify-center items-center hover:text-lg'> 
        <Upload/>
        Upload Image
        <input type="file" name="upload-file" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" className='w-0 h-0'/>
      </div>
    </label>
    {file != null && 
      <div className='flex flex-row p-4'>File Uploaded: <span className='font-bold ml-2'>{file.name} </span>
      <Delete className='text-red-500 mt-1.5 ml-1 cursor-pointer' onClick={() => setFile(null)}/></div>
      
      }
    </div>
    }

    {pieceType === "Text" &&
      <div className='bg-card backdrop-blur-md w-880 h-300 rounded-md border-2 border-dotted border-gray-400 cursor-pointer p-4'>
      <textarea 
        className="w-full h-full bg-transparent border-none resize-none outline-none" 
        defaultValue={textContent === "" ? "" : textContent}
        placeholder={textContent === "" ? "Enter your text piece here" : textContent}
        onChange={(e) => setTextContent(e.target.value)}
      />
    </div>
    }

<div className='bg-card backdrop-blur-md w-880 h-300 rounded-md mt-4 mb-4 border-2 border-dotted border-gray-400 cursor-pointer p-4'>
      <textarea 
        className="w-full h-full bg-transparent border-none resize-none outline-none" 
        defaultValue={desc === "" ? "" : desc}
        placeholder={desc === "" ? "Enter description here" : desc}
        onChange={(e) => setDesc(e.target.value)}
      />
    </div>

    </div>
    <button 
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
        onClick={handleSave}
      >
        {loading ? "Loading..." : "Save Piece"}
      </button>

    </div>
  )
}

export default AddPiece
