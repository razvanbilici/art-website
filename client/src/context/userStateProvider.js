
import React, {createContext, useContext, useReducer} from "react"

export const UserContext = createContext()

export const UserStateProvider = ({userReducer, initState, children}) => (

    <UserContext.Provider value={useReducer(userReducer, initState)}>
        {children}
    </UserContext.Provider>
)

export const useStateCustom = () => useContext(UserContext)