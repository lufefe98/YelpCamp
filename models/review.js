// Mongoose connection|
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})




// A one-to-many relationship between the (1) campground and the reviews

module.exports = mongoose.model('Review', reviewSchema)