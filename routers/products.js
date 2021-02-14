const {Product} = require('../models/product');
const {Category} = require('../models/category');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

/* 
 * Allowed MIMIE types
*/
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
};

/* 
 * Here we update the file name send by font-end applicaiton
*/
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null;
        }
        cb(uploadError,'public/uploads') // This is where file will upload
    },
    filename: function(req,file,cb){
        const fileName = file.originalname.replace(' ','-'); // reomve space from filename
        cb(null,Date.now()+ '-' +fileName) // unique filename
    }
}); 
const uploadOptions = multer({storage:storage})

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
router.post(`/create`,uploadOptions.single('image'), async (req,res)=>{
    const category = await Category.findById(req.body.category)
    .catch(err => {
        return res.status(400).json({success:false,'message':"Category is invalid!"});
    });

    
    if(!category){
        res.status(404).send({success:false,'message':'Category is invalid!'});
    } 

    // Validate if req has image
    const file = req.file;
    if(!file){
        res.status(400).send('No image in request');
    }

    const singleFileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${singleFileName}`,
        // images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    
    //product = await product.save()
    if(product){
        res.status(200).json(product);
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

    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        // images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    },{
        new: true,
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

/* upload product gallery */
router.put('/product-gallery/:id',uploadOptions.array('images',4), async (req,res) => {
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const files = req.files;
    const imagePaths = [];
    if(files){
        files.map(file =>{
            imagePaths.push(`${basePath}${file.filename}`);
        })
    }
    console.log()
    const product = await Product.findByIdAndUpdate(req.params.id,{
        images: imagePaths,
    },{
        new: true,
    });
    if(!product){
        return res.status(404).send('product cannot be updated!');
    } 
    res.send(product);
});

module.exports = router; 