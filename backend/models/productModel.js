const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Please Enter product description"]
    },

    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price can't exceed 8 characters"]
    },

    ratings: {
        type: Number,
        default: 0
    },

    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],

    category: {
        type: String,
        required: [true, "Please Enter product Category"]
    },

    Stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxlength: [4, "Stock can't exceed 4 characters"],
        default: 1
    },

    numOfReviews: {
        type: Number,
        default: 0
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true,

            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,

    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema)