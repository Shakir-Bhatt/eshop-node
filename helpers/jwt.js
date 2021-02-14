const expressJwt = require('express-jwt');

function authJwt(){
    const secret = process.env.SESSION_SECRET;
    const appUrl = process.env.API_URL;
    
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
            {url: /\/api\/v1\/products(.*)/,method: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/,method: ['GET','OPTIONS']},
            {url: /\/public\/uploads(.*)/,method: ['GET','OPTIONS']},

            `${appUrl}/users/login`,
            `${appUrl}/users/create`,
        ]
    });
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null,true);
    }
    done();
}

module.exports = authJwt;