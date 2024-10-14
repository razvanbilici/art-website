const router = require("express").Router()

const piece = require("../models/piece")
const user = require("../models/user")

router.get("/allPieces", async (request, response) => {

    const piecesData = await piece.find().sort({ createdAt: 1 })

    let piecesAndCreators = []

    for (let piece of piecesData){
      let creator = await user.findOne({"userID" : piece.creatorID})
      piecesAndCreators.push({piece, creator})
    }

    return response.status(201).send({dataFound: true, pieces: piecesAndCreators})
})


router.get("/piece/:pieceID", async (request, response) => {

  try{
    const piece_id = request.params.pieceID
    const pieceData = await piece.findOne({"_id" : piece_id})
    
    if (pieceData){
        const creatorData = await user.find({"userID" : pieceData.creatorID})
        return response.status(201).send({dataFound: true, piece: pieceData, creator: creatorData[0]})
    }
  }
  catch(error){
    return response.status(404).send({dataFound: false, error: error})
  }
    return response.status(404).send("Piece not found")    
})


router.get("/creator/:creatorID", async (request, response) => {

  const creatorID = request.params.creatorID
  const piecesData = await piece.find({"creatorID" : creatorID})
  let pieces = []

  let piecesAndCreators = []

    for (let piece of piecesData){
      let creator = await user.findOne({"userID" : piece.creatorID})
      piecesAndCreators.push({piece, creator})
    }

  const creatorData = await user.find({"userID" : creatorID})

  if (piecesData){

      return response.status(201).send({dataFound: true, pieces: piecesAndCreators, creator: creatorData[0]})

  }
  else{
      return response.status(404).send("Pieces not found")
  }
})



router.post("/newPiece", async (request, response) => {

    const newPiece = piece({
      name: request.body.name,
      creatorID: request.body.creatorID,
      pieceType: request.body.pieceType,
      fileURL: request.body.fileURL,
      iconURL: request.body.iconURL,
      description: request.body.description,
      text: request.body.text,
      likes: 0,
      uploadTime: Date.now()

    })


    const creatorData = await user.findOne({"userID" : newPiece.creatorID, "role" : "Creator"})

    if(!creatorData){
        return response.status(400).json({"message" : "Creator not found", "data": creatorData[0] })
    }

    try {
      const savedPiece = await newPiece.save();
      response.status(200).send({ piece: savedPiece });
    } catch (error) {
      response.status(400).send({ success: false, messsage: error });
    }
  });

router.put("/update/:pieceID", async (request, response) => {

    // Can only update the name and imageURL 
    const piece_id = request.params.pieceID

    const updatedPiece = await piece.findOne({"_id" : piece_id})

    if(!updatedPiece){
        return response.status(404).json({message: "Piece not found"})}

    

    try {
      const updatedPiece = await piece.findOneAndUpdate({"_id" : piece_id},
        
        {
            name : request.body.name,
            iconURL : request.body.iconURL,
            description: request.body.description

        }
      )
      response.status(200).send({ piece: updatedPiece });
    } catch (err) {
      response.status(400).send({ success: false, messsage: err.message });
    }
  })

  router.put("/like/:userID/:pieceID", async (request, response) => {

    // Can only update the name and imageURL 
    const piece_id = request.params.pieceID
    const user_id = request.params.userID

    const updatedPiece = await piece.findOne({"_id" : piece_id})

    if(!updatedPiece){
      return response.status(404).json({message: "Piece not found"})
    }

    // Check if the user has liked the piece first
    const _user = await user.findOne({
      userID: user_id})

    if(_user.likedPieces.has(piece_id)){
      return response.status(400).json({message: "You have already liked this piece"})}
    

    if (updatedPiece.creatorID == user_id){
      return response.status(400).json({message: "You cannot like your own piece"})
    }

    if(!updatedPiece){
        return response.status(404).json({message: "Piece not found"})}

    try {
      const addLikeToPiece = await piece.findOneAndUpdate({"_id" : piece_id},
        
        {
          likes: updatedPiece.likes + 1

        }
      )

      const addToUserLikes = await user.findOneAndUpdate(
        {userID: user_id},
        { $set: { [`likedPieces.${piece_id}`]: true } }
      )



      response.status(200).send({user: addToUserLikes})
    } catch (err) {
      response.status(400).send({ success: false, messsage: err.message });
    }
  })

  router.put("/unlike/:userID/:pieceID", async (request, response) => {

    // Can only update the name and imageURL 
    const piece_id = request.params.pieceID
    const user_id = request.params.userID

    const updatedPiece = await piece.findOne({"_id" : piece_id})

    // Check if the user has liked the piece first
    const _user = await user.findOne({
      userID: user_id})

    if(!_user.likedPieces.has(piece_id)){
      return response.status(404).json({message: "User has not liked the piece"})}

    if(!updatedPiece){
        return response.status(404).json({message: "Piece not found"})}

    if(!_user){
      return response.status(404).json({message: "User not found"})}
 

    try {
      const removeLikeToPiece = await piece.findOneAndUpdate({"_id" : piece_id},
        
        {
            likes: updatedPiece.likes - 1

        }
      )

      const addToUserLikes = await user.findOneAndUpdate(
        {userID: user_id},
        { $unset: { [`likedPieces.${piece_id}`]: "" } }, // Remove the key from the Map
        { new: true }
      );



      response.status(200).send({user: addToUserLikes})
    } catch (err) {
      response.status(400).send({ success: false, messsage: err.message });
    }
  })



  router.put("/hasLiked/:userID/:pieceID", async (request, response) => {

    const piece_id = request.params.pieceID

    const _user = await user.findOne({
      userID: request.params.userID})

    if (!_user){
      return response.status(404).json({ message: "User not found" });
    }

    response.status(400).send({hasLiked: _user.likedPieces.has(piece_id)})

  })


router.delete("/delete/:pieceID", async (request, response) => {

    const piece_id = request.params.pieceID
    const pieceData = await piece.findOne({"_id" : piece_id})

    if(!pieceData){
        return response.status(404).json({message: "Piece not found",})
    }

    const deletedPieceData = await piece.deleteOne({"_id" : piece_id})

        if(!deletedPieceData){
            return response.status(404).json({message: "Piece couldn't be deleted"})}
            else{
              const updatedUsers = await user.updateMany(
                { [`likedPieces.${piece_id}`]: { $exists: true } }, // Check if the pieceID exists in likedPieces
                { $unset: { [`likedPieces.${piece_id}`]: "" } } // Remove the pieceID from likedPieces
              );
                return response.status(200).json({message: "Piece deleted", deletedPiece: deletedPieceData})
            }

})


module.exports = router