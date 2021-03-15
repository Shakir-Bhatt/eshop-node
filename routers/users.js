const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken'); 


router.get(`/`, async (req,res)=>{
    const userList = await User.find().select('-passwordHash');
    res.send(userList)
});

/* Single user */
router.get('/:id', async (req,res)=>{
    /* validate id */
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id provided');
    }
    /*
        in select function if we pass fields with minus(-) sign like
        -passwordHash -apartment , there fields will be ignored in result set
        and if we want to select on few fields like
        name email then pass like select('name phone email')

        id will be there as we have generated virtual id for each models
    */
    // const user = await User.findById(req.params.id).select('-passwordHash -apartment');
    const user = await User.findById(req.params.id).select('name email phone');

    if(user){
        return res.status(200).send(user);
    }
    return res.status(500).json({success:false});
});

router.post(`/create`,(req,res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    
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

router.post('/login',async (req,res) => {
    const user = await User.findOne({ email: req.body.email});
    if(!user){
        return res.status(400).send('User not found');
    }
    if(user && bcrypt.compareSync(req.body.password ,user.passwordHash)){

        const token = jwt.sign(
                        {  
                            userId: user.id,
                            isAdmin : user.isAdmin 
                        },
                        process.env.SESSION_SECRET,
                        { 
                            expiresIn: '1d'
                        }
                    );
        return res.status(200).send({user:user.email,token:token});
    } else {
        return res.status(400).send("Password invalid");
    }
})

module.exports = router; 