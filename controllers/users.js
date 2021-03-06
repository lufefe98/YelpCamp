// File Connections
// models
const User = require('../models/user')
const Campground = require('../models/campground')

// Functions
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try{
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password);
    // the if(err) is just in case there is any error while logging in, even though it is highly unlikely
    req.login(registeredUser, err => {
        if(err) return next();
        req.flash('success', 'Welcome to Yelp Camp')
        res.redirect('/campgrounds')
    })
} catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye, see you soon');
    res.redirect('/campgrounds');
}