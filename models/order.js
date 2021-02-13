/* mongoose for model schema */
const mongoose = require('mongoose');

/* Model schema */
const orderSchema = mongoose.Schema({
    
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now()
    }
})
/*  To get id in response data without underscore */
orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

/* When we pass data to api we pass virtuals as well */
orderSchema.set('toJSON',{
    virtuals: true
});


/* Model object and export in other files */

exports.Order = mongoose.model('Order',orderSchema);

 