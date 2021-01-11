/* mongoose for model schema */
const mongoose = require('mongoose');

/* Model schema */
const orderSchema = mongoose.Schema({
    name: String,
    image: String,
    stock: {
        type: Number,
        required: true
    }
})

/* Model object and export in other files */

exports.Order = mongoose.model('Order',orderSchema);

 