const {Product} = require('../models/product');
const {Category} = require('../models/category');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* all products */
router.get(`/`, async (req,res)=>{
     /* filterging */
     let filter = {};
     if(req.query.category){
         filter = {category:req.query.category.split(',')};
     }
    const productList = await Product.find(filter).populate('category');
    res.send(productList)
});

/* all products with selected colunms */
router.get(`/columns`, async (req,res)=>{
    /* filterging */
   const productList = await Product.find().select('name brand price').populate('category');
   res.send(productList)
});

/* create products */
router.post(`/create`, async (req,res)=>{
    const category = await Category.findById(req.body.category)
    .catch(err => {
        return res.status(400).json({success:false,'message':"Category is invalid!"});
    });
    
    if(!category){
        res.status(404).send({success:false,'message':'Category is invalid!'});
    } 

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    
    product = await product.save()
    if(product){
        res.status(200).json({success:true,'message':'Product created'});
    } else {
        res.status(404).json({success:false,'message':'Product cannot be created!'});
    }
    
});

/* Single product */
router.get('/:id', async (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    const product = await Product.findById(req.params.id);
    if(product){
        res.status(200).send(product);
    } else {
        return res.status(404).json({success:false,'message':'Product not found!'});
    }
});

/* update product */
router.put('/update/:id', async (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    const category = await Category.findById(req.body.category)
    .catch(err => {
        return res.status(400).json({success:false,'message':"Category is invalid!"});
    });
    
    if(!category){
        return res.status(404).send({success:false,'message':'Category is invalid!'});
    } 

    const product = await Category.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    },{
        new: true,
       // useFindAndModify: false
    })
    .catch(err => {
        return res.status(500).json({success:false,'message':err});
    });
    if(product){
        return res.send(product);
    } else {
        return res.status(404).send('product cannot be updated!');
    }
});

/* delete product */
router.delete('/delete/:id', (req,res) =>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    Product.findByIdAndRemove(req.params.id)
    .then(category =>{
        if(category){
            return res.status(200).json({success:true,'message':'Product deleted'});
        } else {
            return res.status(404).json({success:false,'message':'Product not found'});
        }
    })
    .catch(err => {
        return res.status(400).json({success:false,'message':err});
    });
})

/* count of products */
router.get('/get/count',async (req,res) => {
    const productCount = await Product.countDocuments((count) => count)
    .catch(err => {
        console.log(err)
        return res.status(400).json({success:false,'message':err});
    });
    if(productCount){
        return res.status(200).json({success:true,'count':productCount});
    } else {
        return res.status(500).json({success:false,'message':'Product not found'});
    }
});

/* get featured products */
router.get(`/get/featured/:count`,async (req,res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({
        isFeatured: true
    }).limit(+count); // prepending + to count makes it string to number type
    
    if(products){
        return res.status(200).json({success:true,'products':products});
    } else {
        return res.status(500).json({success:false,'message':'Product not found'});
    }
});

module.exports = router; 