/* require('../models/category') returns object {Category} will hold all the values as object */
const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* all categories */
router.get('/', async (req,res)=>{
    const categoryList = await Category.find();
    res.status(200).send(categoryList)
});

/* create category */
router.post('/create', async (req,res)=>{
    let category =  new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon
    })
    category = await category.save();
    if(category){
        res.send(category);
    } else {
        res.status(404).send('Category cannot be created!');
    }
});

/* Single category */
router.get('/:id', (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    Category.findById(req.params.id)
    .then(category =>{
        return res.send(category);
    })
    .catch(err => {
        return res.status(400).json({success:false,'message':err});
    });
});

/* update category */
router.put('/update/:id', async (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    const category = await Category.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    },{
        new: true
    });
    if(category){
        res.send(category);
    } else {
        res.status(404).send('Category cannot be updated!');
    }
});

/* delete category */
router.delete('/delete/:id', (req,res) =>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    Category.findByIdAndRemove(req.params.id)
    .then(category =>{
        if(category){
            return res.status(200).json({success:true,'message':'Category deleted'});
        } else {
            return res.status(404).json({success:false,'message':'Category not found'});
        }
    })
    .catch(err => {
        return res.status(400).json({success:false,'message':err});
    });
})

module.exports = router; 