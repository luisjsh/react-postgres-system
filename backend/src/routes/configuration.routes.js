const express = require('express')
const router  = express.Router()

const pelajes = require('../models/usefull-model/pelaje.model')
const hierros = require('../models/usefull-model/hierro.model')
const logros = require('../models/usefull-model/logros.model')
const {tokenVerification, adminVerification} = require('../functions/verification-functions')

router.get('/getpelaje',tokenVerification, adminVerification, async (req, res) => {
    await pelajes.findAll().then( response => res.status(200).json({response}) ).catch( e => res.status(400))
})

router.post('/pelajes', tokenVerification, adminVerification, async (req, res) => {
    let {pelaje} = req.body;
    await pelajes.create({
        nombre: pelaje
    },{
        fields: ['nombre']
    }).then( async response => {
        await pelajes.findAll().then(
             response => res.status(200).json({response})
            )
    }).catch(e => res.status(400))

})

router.get('/gethierro',  tokenVerification, adminVerification, async (req, res)=>{
    await hierros.findAll().then( response => res.status(200).json({response}) ).catch( e => res.status(400))
})

router.post('/hierros', tokenVerification, adminVerification, async (req, res)=>{
    
    let { hierroCode } = req.body;
    let { filename } = req.files[0];
    await hierros.create({
        codigo: hierroCode, path: '/img/uploads/' + filename
    },{
        fields: [ 'codigo' , 'path']
    }).then( response =>{
        res.status(200).json({status: 200})}) .catch( e => res.status(400))
    
        
})

router.get('/getparticularhierro/:id', async(req, res)=>{

    await hierros.findOne({
        where: {id: parseInt(req.params.id)}
    }).then( response => res.status(200).json({status: 200, response}))
})


router.get('/logros', tokenVerification, adminVerification, async (req, res)=>{
  
    await logros.findAll().then( response => {  
            res.status(200).json({status: 200, response})
        
        }).catch( e => res.status(400))

})

module.exports = router;