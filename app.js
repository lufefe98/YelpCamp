if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}



// Express connection and middleware
const express = require('express')
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

app.listen(3000, () => {
    console.log('App listening on port 3k')
})

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{ 
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
}





// File Connections    
// utilities
const ExpressError = require('./utilities/ExpressError')

// routes
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campground')

// models
const User = require('./models/user')





// Other (app.use)
// external code
    app.use(express.urlencoded({ extended: true }))
    app.use(methodOverride('_method'))
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(session(sessionConfig))
    app.use(flash())
    app.use(passport.session())
    app.use(passport.initialize())

    // the line below tells passport to use the local strategy and locate the strategy on the user model
    passport.use(new LocalStrategy(User.authenticate()))

    // the 2 lines below gets the user in and out of their session
    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())

    app.use((req, res, next) => {
        console.log(req.session)
      res.locals.success = req.flash('success')
      res.locals.currentUser = req.user;
      res.locals.error = req.flash('error')
      next();
    })




// routes
    app.use('/', userRoutes)
    app.use('/campgrounds', campgroundRoutes)
    app.use('/campgrounds/:id/reviews', reviewRoutes)





// Mongoose connection
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelpcamp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false ---> I might not need this because I don't get any deprecation warning
    })
    console.log('DATABASE CONNECTED')
        }
        
    main().catch(err => {
        console.log('ERROR, CONNECTION FAILED'),
        console.log(err)
    });





// Ejs Connections
    
    app.engine('ejs', ejsMate)
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'))





// Routes
app.get('/', (req, res) => {
    res.render('Home')
})





// Error Handlers
app.all('*', (req, res, next) => {
   next(new ExpressError('Page not found', 404))
})


// this code  handles all the errors we can't anticipate and the ones that we haven't thrown with our async error handler
app.use((err, req, res, next) => {
    // nb: the err.message = '', does not update the error object, hence we remove message and put in {err} in the .render below
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something has gone wrong'
    res.status(statusCode).render('error', { err });
    // console.log(err.name);
    // if (err.name === 'ValidationError') err = handleValidationErr(err)
    // next(err);
})