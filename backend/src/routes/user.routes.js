const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


const passwordFunctions = require('../functions/password-functions');
const { tokenVerification , adminVerification }= require('../functions/verification-functions');
const config = require('../config');


//models 
const user = require('../models/usuario')
const userimagens = require('../models/usuarioImagenes')
const toros = require('../models/toros.model')
const torosimagenes = require('../models/torosimagenes.model');
const usuarioImagenes = require('../models/usuarioImagenes');

//--------------------------------------------

router.get('/profile/', tokenVerification, adminVerification , async (req,res)=>{
    let { userId } = req;
    let { status, detail, userInformation } = '';
    await user.findAll({
        where: {id: userId},
        include: [{
            model: userimagens
        }]
    }).then( response => {
        status = 200;
        detail = 'success';
        userInformation = response
    }).catch( e => {
        status = 401;
        detail = 'The user isnt in the database'
    })

    res.json({ status , detail , userInformation })
})


router.get('/admin/', tokenVerification, adminVerification, (req, res)=>{
    res.json({status: 200, detail: 'admin granted'})
})



//-------------------  Adding ----------------------

router.post('/add', async (req, res)=>{
    let { correo, contrasena, nombre, admin, primerapregunta, primerapreguntarespuesta, segundapregunta, segundapreguntarespuesta } = req.body
    let status = 0;
    let token = null;
    contrasena = await passwordFunctions.encrypt( contrasena ); 
    let detail = null;
    await user.create({
        email: correo , clave: contrasena, nombre: nombre, admin , primerapregunta, primerapreguntarespuesta, segundapregunta, segundapreguntarespuesta
    },{
        fields: [ 'email', 'clave', 'nombre', 'admin' ,'primerapregunta', 'primerapreguntarespuesta', 'segundapregunta', 'segundapreguntarespuesta' ]
    }).then( async response => {
        let i = 0
        for (i= 0; i<req.files.length; i++){

            await userimagens.create({ 
                path: '/img/uploads/' + req.files[i].filename, usuarioid: response.id
            },{
                fields: [ 'path' , 'usuarioid']
            }).then( response => console.log('succeed'))

        }

        status= 200
        detail= 'agregado correctamente'
        token = jwt.sign({id: response.id}, config.secret, { expiresIn: 60 * 60 * 24  }) //here we initialize the jwt token    
    })  
    .catch( e => {
        detail= e.original.detail
        status = 401;
    })    
    
    res.json({status , token, detail})
})

//--------------------  Login  ----------------------
router.post('/login', async (req, res)=>{
    let { correo , clave } = req.body
    let { token , status, userInformation } = ''
    await user.findOne({
        where: {email: correo },
        include: [{
            model: userimagens
        }]
    }).then( async response => {
        
     if ( await passwordFunctions.compare(clave , response.clave) ){
        token = jwt.sign({id: response.id}, config.secret, { expiresIn: 60 * 60 * 48 })
        status = 'password approved'
        userInformation = response 
    } else {
        status = 'password wrong'
    }
            
    }).catch( e => {
        status = 'email'
    })

    res.json({ token , status, userInformation })
})



router.post('/changepassword',  async (req,res)=>{
    let { clave , id } = req.body
    
    clave = await passwordFunctions.encrypt( clave )
    
    let Item = await user.findOne({
        where: { id }
    })
    
    Item.clave = clave;
    Item.save()

    res.json({status: 200, detail: 'updated'})
})


router.get('/delete/:id', tokenVerification, adminVerification , async (req,res)=>{
    let { id } = req.params
    
    await usuarioImagenes.findOne({
        where: { usuarioid: id }
    }).then( response =>{
        console.log(response)
        if( response.length > 0){
            
            response.forEach( async ( image ) => {
                await image.destroy({
                    where: { id: image.id}
                })
            })
        }    
    })

})


module.exports = router;