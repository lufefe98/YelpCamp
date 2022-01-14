// File Connections
// models
const Review = require('../models/review')
const Campground = require('../models/campground')

// Functions
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You have deleted a review')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.createReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    // the .body below here is because of how the name of the form is structured - see the show page form for reviews
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${campground._id}`)
}