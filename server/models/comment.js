
const mongoose = require("mongoose")

const comment = mongoose.Schema(
    {   
        content: {
            type: String,
            required: true
        },

        userID: {
            type: String,
            required: true
        },


        pieceID: {
            type: String,
            required: true
        }
    },

    { timestamps: true }
)

module.exports = mongoose.model("comment", comment)