const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

router.get(`/`, async (req,res)=>{
    const userList = await User.find();
    res.send(userList)
});


router.post(`/create`,(req,res)=>{
    const user = new User({
        name: req.body.name,
        image: req.body.image,
        stock: req.body.stock
    })
    
    user.save()
    .then((createdUser => {
        res.status(201).json(createdUser); 
    }))
    .catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})


module.exports = router; 