
import Nav from './Nav'; // Assume you have a Nav component

import axios from "axios"

import React, { useEffect, useState } from 'react';
import Pieces from './Pieces';

const localHost = "http://localhost:5000/"

const AboutPage = () => {

    const [creators, setCreators] = useState([])
    const [pieces, setPieces] = useState([])

    const fetchData = async () => {
        try {
          const creatorResp = await axios.get(localHost + `api/creators/allCreators/`)
          const piecesResp = await axios.get(localHost + "api/pieces/allPieces/") 
        setCreators(creatorResp.data.creators)
        setPieces(piecesResp.data.pieces)
    } 
          catch(err){
            console.log(err)
          }
        }

    useEffect(() => {

        fetchData();
      }, []);


  return (
    <div className='w-full h-auto flex flex-col items-start bg-mainBackground justify-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
      <Nav />

      <div name="Main Page Div" className='p-4'>
        {/* Header Section */}
        <div name="Header" className='flex flex-col items-start mb-8'>
          <h1 className="text-6xl font-extrabold mb-4 text-gray-800">Our Mission</h1>
          <p className="text-2xl text-gray-700">
            Art knows no limits. Within the Art-Sharing website, users can discover a plethora of art-pieces, ranging from visual and audio types, all the way to text-based types. User can interract and support creators, via Liking, Subscribing and adding Comments to their favorite pieces.
          </p>
        </div>


        {/* Contact Section */}
        <div name="Contact" className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white font-bold mb-2 mt-2 p-4 rounded-lg w-52">
            {"Number of creators: " + creators.length}
            </div>

            <div name="Contact" className=" bg-gradient-to-r from-yellow-600 via-orange-400 to-yellow-400 mb-2 mt-2  text-white font-bold p-4 rounded-lg w-52">
            {"Number of Pieces: " + pieces.length}
            </div>

            <div className=''>
                <Pieces home={true}/>
            </div>

        {/* Footer Section */}
        <div name="Footer" className='border-t border-gray-300 mt-8 pt-4'>
          <p className="text-xl text-white">
          &copy; {new Date().getFullYear()} Bilici Mihai Razvan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
