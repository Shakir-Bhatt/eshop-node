const expressJwt = require('express-jwt');

function authJwt(){
    const secret = process.env.SESSION_SECRET;
    const appUrl = process.env.API_URL;
    console.log(appUrl+/products(.*)/);
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path : [
            /*
                Here i used regx to mange urls but there is one issue that url after patter can also match.
                like /api/v1/product/edit or delete
                To handle this situation we use isRevoked option of expressJwt as above
                to validate if use is admin
            */ 

            {url: /\/api\/v1\/products(.*)/,methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/,methods: ['GET','OPTIONS']},
            {url: /\/public\/uploads(.*)/,methods: ['GET','OPTIONS']},

            `${appUrl}/users/login`,
            `${appUrl}/users/create`,
        ]
    });
}

async function isRevoked(req, payload, done){
    
    // Check if customer is using post for create
    let createOrder = req.originalUrl;
    if(!payload.isAdmin){

        const appUrl = process.env.API_URL;
        /*
            In case customer is not admin and passes valid token 
            then all below routes
        */ 

        if(createOrder == `${appUrl}/orders/create`){
            done();
        }
        done(null,true);
    }
    done();
}

module.exports = authJwt;