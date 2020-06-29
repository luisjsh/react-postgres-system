const jwt = require('jsonwebtoken')
const config = require('../config')

const user = require('../models/usuario')

function tokenVerification (req, res, next){
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(200).json({
            status: 401,
            detail: 'token invalid'
        })
    }
    
    const decoded = jwt.verify(token, config.secret, (err, decoded)=>{
        if ( err ) {
            res.status(200).json({
                status: 401,
                detail: 'token expired'
            })
        } else if ( decoded ){
            return decoded
        }
        
    });
    req.userId = decoded.id;
    next()
}


async function adminVerification ( req, res, next ){
    req.user = await user.findOne({
        where: {id:req.userId}
    }).then( async response => {
        if ( response.admin === true ){
            next()
        } else {
             res.status(200).json({ status: 401, detail: 'not allowed'}) 
            }
    })
}

module.exports = {
    tokenVerification , adminVerification
};