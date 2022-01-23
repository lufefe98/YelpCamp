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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// const dbUrl = process.env.DB_URL
const MongoStore = require('connect-mongo').default;

const dbUrl = 'mongodb://localhost:27017/yelpcamp' || process.env.DB_URL;

app.listen(3000, () => {
    console.log('App listening on port 3k')
})




// Mongoose connection
const mongoose = require('mongoose');
async function main() {
    await mongoose.connect(dbUrl, {
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
    
    app.use(session({
     name: 'session',    
     secret: 'thisshouldbeabettersecret',
     resave:false,
     store: MongoStore.create({ 
     mongoUrl: dbUrl
    }),
    saveUninitialized:false,
    cookie:{
     httpOnly: true,
     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
     maxAge: 1000 * 60 * 60 * 24 * 7
     }
    }));

    store.on('error', function(e){
        console.log('Store session error', e)
    })


    app.use(flash())
    app.use(passport.session())
    app.use(passport.initialize())
    app.use(mongoSanitize({
        replaceWith: '_',
    }));

    // the line below tells passport to use the local strategy and locate the strategy on the user model
    passport.use(new LocalStrategy(User.authenticate()))

    // the 2 lines below gets the user in and out of their session
    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())

    app.use((req, res, next) => {
        console.log(req.query)
      res.locals.success = req.flash('success')
      res.locals.currentUser = req.user;
      res.locals.error = req.flash('error')
      next();
    })



// routes
    app.use('/', userRoutes)
    app.use('/campgrounds', campgroundRoutes)
    app.use('/campgrounds/:id/reviews', reviewRoutes)




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

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dv5vm4sqh/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/lstew9821/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dv5vm4sqh/" ],
            childSrc   : [ "blob:" ]
        }
    })
);


