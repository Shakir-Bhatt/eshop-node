/* mongoose for model schema */
const mongoose = require('mongoose');

/* Model schema */
const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});
/*  To get id in response data without underscore */
orderItemSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

/* When we pass data to api we pass virtuals as well */
orderItemSchema.set('toJSON',{
    virtuals: true
});

/* Model object and export in other files */

exports.OrderItem = mongoose.model('OrderItem',orderItemSchema);

 