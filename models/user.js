/* mongoose for model schema */
const mongoose = require('mongoose');

/* Model schema */
const userSchema = mongoose.Schema({
    name: String,
    image: String,
    stock: {
        type: Number,
        required: true
    }
})

/* Model object and export in other files */

exports.User = mongoose.model('User',userSchema);

 