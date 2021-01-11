const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req,res)=>{
    const orderList = await Order.find();
    res.send(orderList)
});


router.post(`/create`,(req,res)=>{
    const order = new Order({
        name: req.body.name,
        image: req.body.image,
        stock: req.body.stock
    })
    
    order.save()
    .then((createdOrder => {
        res.status(201).json(createdOrder); 
    }))
    .catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})


module.exports = router; 