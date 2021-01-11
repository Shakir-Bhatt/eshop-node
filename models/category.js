/* mongoose for model schema */
const mongoose = require('mongoose');

/* Model schema */
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    icon: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    }
})

/* Model object and export in other files */

exports.Category = mongoose.model('Category',categorySchema);

 