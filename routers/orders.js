const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();
const mongoose = require('mongoose');
const { Product } = require('../models/product');

router.get(`/`, async (req,res)=>{
    /* .sort('dateOrdered'); to sort default asc
     * to mention sort order we pass object in sort and value of order like
     * .sort({'dateOrdered':-1}) -1= latest first , 1= olderst first
    */ 
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1});
    if(!orderList){
        res.status(500).json({status:false,'message':'No order found'})
    }
    res.send(orderList)
});

router.get(`/:id`, async (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    const orderList = await Order.findById(req.params.id)
    .populate('user','name') // one level
    /* if we want to get product detail from orderItems based on id then */
    .populate({ 
        path: 'orderItems', populate: { 
            path: 'product',populate: 'category' 
        }
    }); 
    if(!orderList){
        res.status(500).json({status:false,'message':'No order found'})
    }
    res.send(orderList)
});

router.post(`/create`,async (req,res)=>{
    /*
     * creating order we have to first create order-item
     * and fetch order-item ids and save in order collection
     * We will loop through orderItems and create orderitem
     * Here we will use Promise.all() to return single promise 
     * and await will make it make to get all ids
    */ 

    let totalPrice = 0;
    let orderItemIds = await Promise.all(req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });
        newOrderItem = await newOrderItem.save();
        let product = await Product.findById(orderItem.product).select('price');
        totalPrice = totalPrice + (product.price * orderItem.quantity);
        return newOrderItem._id;
    }));

    /* To verify the total price sent from front-end 
     * will comapre prise with database price.
    */

    if(totalPrice < 0){
        res.status(500).send('Price is adding to 0, verify the payload');
    }
  
    let order = new Order({
        orderItems: orderItemIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        totalPrice: totalPrice,
        user: req.body.user,
    });

    order = await order.save()
    
    if(order){
        res.status(200).json(order)
    } else{
        res.status(500).json({
            error: 'Error in order creation',
            success: false
        });
    }
});

/* Update order status */
router.put(`/update/status/:id`,async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    const order = await Order.findByIdAndUpdate(req.params.id,{
        status: req.body.status,
    },{
        new: true
    });
    if(order){
        res.send(order);
    } else {
        res.status(404).send('Order status cannot be updated!');
    }
});

/* delete product */
router.delete('/delete/:id', (req,res) =>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    
    Order.findByIdAndRemove(req.params.id)
    .then( async order =>{
        if(order){
            /*
             * Here we have to delete orderItems associated with an order
            */ 
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success:true,'message':'Order deleted'});
        } else {
            return res.status(404).json({success:false,'message':'Order not found'});
        }
    })
    .catch(err => {
        return res.status(400).json({success:false,'message':err});
    });
});

/* return total sales of orders */
router.get(`/get/totalSales`, async (req,res) => {
    /*
     * Here we use aggregate function to return totalPrice
     * $group is like join of relation db and $sum is mongoose method 
     * which returns sum of particular field e.g $totalPrice
    */ 
    let order = await Order.aggregate([
        { $group : {_id:null, totalSales:{$sum: '$totalPrice'}}}
    ])
    if(!order){
        return res.status(400).send('Sales cannot be generated');
    }
    res.status(200).send({totalSales: order.pop().totalSales});
});
/* order of particular user */
router.get(`/get/userOrders/:user_id`, async (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.user_id)){
        res.status(400).send('Invalid id provided');
    }
    const userOrders = await Order.find({ user:req.params.user_id })
    .populate({ 
        path: 'orderItems', populate: { 
            path: 'product',populate: 'category' 
        }
    });
    if(!userOrders){
        res.status(500).json({status:false,'message':'No order found'})
    }
    res.send(userOrders)
});


module.exports = router; 