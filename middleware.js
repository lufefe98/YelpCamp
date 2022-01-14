// File Connections
//models
const Campground = require('./models/campground')
const Review = require('./models/review')

// schema
const { campgroundSchema, reviewSchema } = require('./schemas.js')

// utilities
const ExpressError = require('./utilities/ExpressError')



// Middlewares
//campgrounds
module.exports.isLoggedIn = (req, res, next) => {
    console.log('req.user...', req.user)
if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error', 'you must be logged in');
    return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// reviews
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    // we add both id and reviewId in the destructured variable below because we need to access the campground by its own id and then reviewId is to access the review by its own id
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}