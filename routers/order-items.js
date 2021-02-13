const {OrderItem} = require('../models/order-item');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req,res)=>{
    const orderList = await Order.find();
    res.send(orderList)
});

router.post(`/create`,(req,res)=>{
    const OrderItem = new Order({
        quantity: req.body.quantity,
        product: req.body.product,
    });
    
    OrderItem.save()
    .then((createdOrderItem => {
        res.status(201).json(createdOrderItem); 
    }))
    .catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})


module.exports = router; 