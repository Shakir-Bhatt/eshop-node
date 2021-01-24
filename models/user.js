/* mongoose for model schema */
const mongoose = require('mongoose');

/* Model schema */
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }
});

/*  To get id in response data without underscore */
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

/* When we pass data to api we pass virtuals as well */
userSchema.set('toJSON',{
    virtuals: true
});


/* Model object and export in other files */

exports.User = mongoose.model('User',userSchema);
// exports.userSchema = userSchema;
 