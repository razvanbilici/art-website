
const mongoose = require("mongoose")

const piece = mongoose.Schema(
    {   
        name: {
            type: String,
            required: true
        },

        creatorID: {
            type: String,
            required: true
        },

        // Audio / Visual / Text
        pieceType: {
            type: String,
            required: true
        },

        fileURL: {
            type: String,
            required: false
        },

        text: {
            type: String,
            required: false
        },

        iconURL: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: false
        },

        likes: {
            type: Number
        }

    },

    { timestamps: true }
)

module.exports = mongoose.model("piece", piece)