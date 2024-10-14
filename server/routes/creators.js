const router = require("express").Router()
const user = require("../models/user")


router.get("/creator/:creatorID", async (request, response) => {

    const creator_id = request.params.creatorID
    const creatorData = await user.findOne({"userID" : creator_id, "role" : "Creator"})

    if (creatorData){

        return response.status(201).send({dataFound: true, creator: creatorData})

    }
    else{
        return response.status(404).send("Creator not found")
    }
}) 

router.get("/allCreators", async (request, response) => {
    // return response.json("Getting all creators")

    const query = { role: "Creator" };
    const creators = await user.find(query);
    return response.json({creators: creators})
})

module.exports = router

