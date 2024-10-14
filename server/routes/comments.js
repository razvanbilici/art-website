const router = require("express").Router()
const comment = require("../models/comment")
const piece = require("../models/piece")
const user = require("../models/user")

router.post("/newComment", async (request, response) => {

    const newComment = comment({
      content: request.body.content,
      userID: request.body.userID,
      pieceID: request.body.pieceID

    })

    const userData = await user.findOne({"userID" : newComment.userID})
    const pieceData = await piece.findOne({"_id" : newComment.pieceID})


    if(!userData){
        return response.status(400).json({"message" : "User not found", "data": userData[0] })
    }

    if(!pieceData){
        return response.status(400).json({"message" : "Piece not found", "id": newComment.pieceID})
    }

    try {
      const savedComment = await newComment.save();
      response.status(200).send({ comment: savedComment, user: userData, piece: pieceData })
    } catch (error) {
      response.status(400).send({ success: false, messsage: error })
    }
  })

router.delete("/delete/:commentID", async (request, response) => {
    try {
        const commentData = await comment.findByIdAndDelete(request.params.commentID);
        response.status(200).send({ success: true, message: "Comment deleted" })
        } catch (error) {
            response.status(400).send({ success: false, message: error });
            }


  })


router.get("/:pieceID", async (request, response) => {

    const query = { pieceID: request.params.pieceID }
    const comments = await comment.find(query);

    let commentsData = []

    for (let comment of comments){
        const userData = await user.findOne({"userID" : comment.userID})
        const pieceData = await piece.findOne({"_id" : comment.pieceID})
        commentsData.push({comment: comment, user: userData, piece: pieceData})
    }

    return response.status(201).send({comments: commentsData})
})

module.exports = router