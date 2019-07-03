var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({

    id           : String,
    name       : String,
    email        : String,
    role         : String, 

});

module.exports = mongoose.model('User', UserSchema);