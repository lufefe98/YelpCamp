// Express
// connection
const express = require('express');
const router = express.Router({mergeParams: true});

// middleware
const passport = require('passport');

//controllers
const users = require('../controllers/users');


// File Connections
// models


// utilities
const wrapAsync = require('../utilities/wrapAsync');




// Routes
router.route('/register')
    .get(users.renderRegister)
    .post(wrapAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout)


module.exports = router;