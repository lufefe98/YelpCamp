// Express connection
const express = require('express');
const router = express.Router();





// File Connections
// models
// const Campground = require('../models/campground') --- is it really needed if Campground is not going to be read?

// utilities
const wrapAsync = require('../utilities/wrapAsync');

//controllers
const campgrounds = require('../controllers/campgrounds');





// Middleware
// validation
const { isAuthor, isLoggedIn, validateCampground } = require('../middleware')


// other
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })
// You don't have to add /index to refer to the index.js file because node automatically looks for that



// Campground Routes
router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground))


// NB!!! you have to make sure that '/campgrounds/new' comes before '/campgrounds/:id', because when you enter this into the browser, it will start looking for the id first and hence treats /new as if it had an id
router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
.get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))
    

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm))








// Export

module.exports = router;