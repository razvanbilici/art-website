
const express = require("express")
const cors = require("cors")
const {default : mongoose} = require("mongoose")

require('dotenv').config()

const server = express()

// // Allow cross-origin interactions (for MongoDB and Firebase)
server.use(cors({origin : true}))

server.use(express.json())

const userAuthRoute = require("./routes/users")
server.use("/api/users/", userAuthRoute)

const creatorRoute = require("./routes/creators")
server.use("/api/creators/", creatorRoute)

const pieceRoute = require("./routes/pieces")
server.use("/api/pieces/", pieceRoute)

const commentRoute = require("./routes/comments")
server.use("/api/comments/", commentRoute)


server.get("/", (request, response) => {
    response.json("GET test")
})


// console.log(process.env.DB_STRING)

mongoose.connect(process.env.DB_CONNECTION_STRING)
mongoose.connection
    .once("open", () => console.log("Connected To Mongo Database"))
    .on("error", (error) => console.log(error))


server.listen(5000, () => console.log("Listening to port 5000"))

