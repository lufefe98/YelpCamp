const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // unique is not a validation, but it sets up an index, so it won't really work with a validation middleware
        unique: true
    }
})
//This will add on to the schema a field for: username, password, ensure username are unique, plus a few other methods

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)