
const mongoose = require("mongoose")

const user = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        iconURL: {
            type: String,
            required: true
        },

        userID: {
            type: String,
            required: true
        },

        verified: {
            type: Boolean,
            required: true
        },

        // Creator, Casual
        role: {
            type: String,
            required: true
        },

        patreonURL: {
            type: String,
            required: false
        },

        authTime: {
            type: String,
            required: true
        },

        creatorRequest: {
            type: Boolean,
            required: true
        },
        
        subscribedCreators: {
            type: Map,
            of: Boolean, 
            default: {}},

          likedPieces: {
            type: Map,
            of: Boolean, 
            default: {}},


        subscribers: {
            type: Map,
            of: Boolean, 
            default: {}
        }

    },
// createdAt, updatedAt - MongoDB will automatically provide the timestamps
{timestamps: true}
)

module.exports = mongoose.model("user", user)