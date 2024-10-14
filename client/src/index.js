import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { createRoot } from 'react-dom/client'

import "./index.css"

import App from "./App"

import { UserStateProvider } from "./context/userStateProvider"
import { init } from "./context/init"
import userReducer from "./context/userReducer"


const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <UserStateProvider initState={init} userReducer={userReducer}>
        <App />
      </UserStateProvider>
    </Router>
  </React.StrictMode>
)
