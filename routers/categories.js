/* require('../models/category') returns object {Category} will hold all the values as object */
const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req,res)=>{
    const categoryList = await Product.find();
    res.send(categoryList)
});


router.post(`/create`,(req,res)=>{
    const category = new Category({
        name: req.body.name,
        image: req.body.image,
        stock: req.body.stock
    })
    
    category.save()
    .then((createdCategory => {
        res.status(201).json(createdCategory); 
    }))
    .catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})


module.exports = router; 