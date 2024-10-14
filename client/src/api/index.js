// Accessing remote data via axios

import axios from "axios"

const localHost = "http://localhost:5000/"


// Send token along with the request via the header
export const userInfoValidation = async(userToken) => {

    try {

        const response = await axios.get(localHost + "api/users/login", 
            {
                headers: { 
                    Authorization: `Bearer ${userToken}`
                }
            }
        )
        return response.data
    } 
    catch(err){
        console.log(err)
    }

}

export const allCreators = async() => {

    try {

        const response = await axios.get(localHost + "api/creators/allCreators")
        return response.creators
    } 
    catch(err){
        console.log(err)
    }

}