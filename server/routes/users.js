
const router = require("express").Router()

// Import Firebase admin privileges   
const admin = require("../configs/firebase_config")

const user = require("../models/user")
const piece = require("../models/piece")


// Login request, user token validation via auth token in the header 
router.get("/login", async (request, response) => {
    // return response.json("Login Request")
    
    if (!request.headers.authorization){
        return response.status(401).json({message: "User token was not provided."})
    }

    // Prefixing with Postman's Bearer Token for testing purposes, 
    // the user token itself comes second
    const userToken = request.headers.authorization.split(" ")[1]

    // Decode token using Firebase admin privileges
    try {
        const decodedInfo = await admin.auth().verifyIdToken(userToken)

        // Invalid user credentials
        if (!decodedInfo){
        return response.status(401).json(
            {
                message: "Invalid user credentials / Unauthorized access / Expired ID Token"})
            }
            else{
                // Create new user if its id is not already in the DB, update auth time otherwise 
                const userAlreadyInDb = await user.findOne({"userID" : decodedInfo.user_id})

                if(!userAlreadyInDb){
                    insertNewUser(decodedInfo, response)
                    return
                }

                try {
                    const authTimeUpdate = await user.findOneAndUpdate(
                      { userID: decodedInfo.user_id },          
                      { $set: { authTime: decodedInfo.auth_time } },  
                      { new: true }            
                    );

                
                    return response.status(200).json(
                        {
                        message: "User already exists / Auth Time Updated", 
                        user: authTimeUpdate            
                    }
                )
                  } catch (error) {
                    response.status(201).json('Error updating user:', error.message);
                  }
                  
        }
    } catch(error){
        return response.status(401).json(
            {
            message: "Couldn't send request", 
            error: error.message            
        }
    )
    }

})


router.get("/user/:userID", async (request, response) => {

    const user_id = request.params.userID
    const userData = await user.findOne({"userID" : user_id})
  
    if (userData){

        return response.status(201).send({dataFound: true, user: userData})

    }
    else{
        return response.status(404).send("User not found")
    }
}) 


router.put("/update/:userID", async (request, response) => {

    const user_id = request.params.userID
    
    const mongoOptions = {
      upsert: true,
      new: true,
    }

    const updatedUser = await user.findOne({"userID" : user_id})

    if(!updatedUser){
        return response.status(404).json({message: "User not found"})}

    
    // Not sending all the fields is OK

    // Cannot change role, only the DB admin can provide the user with an Creator role after 
    // the user submits a Creator role request 
    try {
      const updatedUser = await user.findOneAndUpdate({"userID" : user_id},
        
        {
            name : request.body.name,
            email : request.body.email,
            iconURL : request.body.iconURL,
            subscribedCreators: request.body.subscribedCreators,
            creatorRequest: request.body.creatorRequest,
            likedPieces: request.body.likedPieces,
            subscribers: request.body.subscribers
        },
        mongoOptions
      );
      response.status(200).send({ user: updatedUser });
    } catch (err) {
      response.status(400).send({ success: false, messsage: err.message });
    }
  })


  router.put("/subscribe/:userID/:creatorID", async (request, response) => {

    const creator_id = request.params.creatorID
    const user_id = request.params.userID

    if (creator_id == user_id){
        return response.status(400).json({message: "You cannot subscribe to yourself"})
    }

    const updatedCreator = await user.findOne({"userID" : creator_id})

    // Check if the user has subscribed to the creator first
    const _user = await user.findOne({userID: user_id})

    if(_user.subscribedCreators.has(creator_id)){
      return response.status(400).json({message: "You have already subscribed to this creator"})}

    if(!updatedCreator){
        return response.status(404).json({message: "Creator not found"})}

    try {

      const addToUserSubs = await user.findOneAndUpdate(
        {userID: user_id},
        { $set: { [`subscribedCreators.${creator_id}`]: true } }
      )

      const addToCreatorSubs = await user.findOneAndUpdate(
        {userID: creator_id},
        { $set: { [`subscribers.${user_id}`]: true } }
      )

      response.status(200).send({user: addToUserSubs})
    } catch (err) {
      response.status(400).send({ success: false, messsage: err.message });
    }
  })


  router.put("/unsubscribe/:userID/:creatorID", async (request, response) => {
    
    const creator_id = request.params.creatorID
    const user_id = request.params.userID
    
    const updatedCreator = await user.findOne({"userID" : creator_id})

    // Check if the user is not subscribed to the creator
    const _user = await user.findOne({userID: user_id})

    if(!_user.subscribedCreators.has(creator_id)){
        return response.status(400).json({message: "You are not subscribed to this creator"})}
  
      if(!updatedCreator){
          return response.status(404).json({message: "Creator not found"})}

    if(!_user){
      return response.status(404).json({message: "User not found"})}
 

    try {

      const removeSubFromUser = await user.findOneAndUpdate(
        {userID: user_id},
        { $unset: { [`subscribedCreators.${creator_id}`]: "" } }, 
        { new: true }
      )

      const removeSubFromCreator = await user.findOneAndUpdate(
        {userID: creator_id},
        { $unset: { [`subscribers.${user_id}`]: "" } }, 
        { new: true }
      )

      response.status(200).send({user: removeSubFromUser, creator: removeSubFromCreator})
    } catch (err) {
      response.status(400).send({ success: false, messsage: err.message });
    }
  })


// TODO If user === "Creator", delete all pieces as well, all subscribers, etc.
router.delete("/delete/:userID", async (request, response) => {

    const user_id = request.params.userID

    const userExists = await user.findOne({"userID" : user_id})

    if(!userExists){
        return response.status(404).json({"message": "User not found"})
    }

    const deletedUserData = await user.deleteOne({"userID" : user_id})

        if(!deletedUserData){
            return response.status(404).json({"message": "User couldn't be deleted"})
        }
     
            if (deletedUserData.role === "Casual"){
                
                return response.status(200).json({"message": "User deleted", 
                    "userData": userExists})
               
            }


            const deletedPieces = await piece.deleteMany({"creatorID" : user_id})

            return response.status(200).json({message: "User deleted", 
                
                deletedPieces: deletedPieces})
           
            
            
    })

const insertNewUser = async (decodedInfo, response) => {

    const _user = new user({
        name : decodedInfo.name,
        email : decodedInfo.email,
        iconURL : decodedInfo.picture,
        userID : decodedInfo.user_id,
        verified : decodedInfo.email_verified,
        role : "Casual",
        authTime: decodedInfo.auth_time,
        subscribedCreators: {},
        likedPieces: {},
        subscribers: {},
        creatorRequest: false
    })

    try {
        const saved = await _user.save()
        
        return response.status(200).json({user: saved})
        
    } catch(error){

        return response.status(401).json(
            {
            message: "Couldn't create user", 
            error: error.message,   
            user_info: _user         
        }
     )
    }   
}



// Export module
module.exports = router