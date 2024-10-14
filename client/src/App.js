import React, { useEffect, useState } from 'react'
import {Routes, Route, useNavigate} from "react-router-dom"
import { AccountPanel, CreatorAccountInfo, Home, Login, Pieces, PiecePage, CreatorPage, About, AddPiece, Creators} from './components'
import {getAuth} from "firebase/auth"
import {app} from "./configs/firebase_config"
import { userInfoValidation } from './api'


import { useStateCustom } from './context/userStateProvider'
import { methods } from './context/userReducer'




const App = () => {

  const firebaseAuth = getAuth(app)
  const navigate = useNavigate()

  const [{user}, action] = useStateCustom()
 

  const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")
  const [authState, setauthState] = useState(false)

  // Check if the user is logged in only when the page mounts, not on every re-render
  useEffect(() => {

    firebaseAuth.onAuthStateChanged((userInfo) => {
      // console.log("User state changed: " + userInfo)
      if (userInfo) {

        // console.log(userInfo.email)

          userInfo.getIdToken().then((userToken) => {
          // console.log("User token: " + userToken)

          userInfoValidation(userToken).then((userData) => {

            // action({
            //   type: methods.setUser,
            //   user: userData
            // })
          })
 
      })
    }
      else{

        setauthState(false)
        window.localStorage.setItem("auth", "false")
        

        action({
          type: methods.setUser,
          user: null
        })

        navigate("/login")
      }
      })

  }, [])

  return (
    <div className="h-auto min-w-[680px] bg-background flex justify-center items-center">
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth}/>}/>
        <Route path="/*" element={<Home/>}/>
        <Route path="/my-pieces" element={<Pieces myPieces={true}/>}/>
        <Route path="/liked-pieces" element={<Pieces likedPieces={true}/>}/>
        <Route path="/pieces" element={<Pieces piecesPage={true}/>}/>
        <Route path="/account-panel" element={<AccountPanel/>}/>
        <Route path="/creator-account-info" element={<CreatorAccountInfo/>}/>
        <Route path="/add-piece" element={<AddPiece/>}></Route>
        <Route path={"/piece/:pieceID"} element={<PiecePage/>} clas></Route>
        <Route path={"/creator/:creatorID"} element={<CreatorPage/>}></Route>
        <Route path={"/about"} element={<About/>}></Route>
        <Route path={"/creators"} element={<Creators subscribed={false} creatorsPage={true}/>}></Route>
        <Route path={"/subscribed"} element={<Creators subscribed={true}/>}></Route>
      </Routes>
    </div>
  )
}

export default App
