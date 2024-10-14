import React from 'react'
import Nav from './Nav'
import Pieces from './Pieces'
import Creators from './Creators'
import { LoginBg } from '../assets'

const Home = () => {
  return (
    <div className='relative w-full h-auto flex flex-col items-center justify-center bg-gradient-to-t from-violet-500 via-red-400 to-blue-100'>
      <Nav/>
      <h1 className='bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-4 rounded-lg mb-2 mt-2 font-caveat text-2xl'>Latest Pieces</h1>
      <Pieces home={true}/>
      <hr className="border-black border-t-2" />
      <h1 className='bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-4 rounded-lg mb-2 mt-2 font-caveat text-2xl'>Creators</h1>
      <div><Creators home={true}/></div>
    </div>
  )
}


export default Home
