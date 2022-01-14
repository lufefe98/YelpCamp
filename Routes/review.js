// Express connection
const express = require('express');
const router = express.Router({mergeParams: true});




// File Connections    
// models
// const Campground = require('../models/campground')
// const Review = require('../models/review')

// utilities
const wrapAsync = require('../utilities/wrapAsync');

//controllers
const reviews = require('../controllers/reviews');

// Middlewares
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')



// Review Routes
router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))


// The 'Id' in reviewId is to remove the refernce to the review in the campground and move it to the actual review and then remove the review
// Over here, you want to delete the id related to the review and not the actual campground. This is why you use $pull
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))





// Export

module.exports = router;