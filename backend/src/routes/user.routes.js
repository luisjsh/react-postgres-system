const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


const passwordFunctions = require('../functions/password-functions');
const { tokenVerification , adminVerification }= require('../functions/verification-functions');
const config = require('../config');


//models 
const user = require('../models/usuario')
const userimagens = require('../models/usuarioImagenes')

//--------------------------------------------

router.get('/profile/', tokenVerification, adminVerification , async (req,res)=>{
    let { userId } = req;
    let { status, message, userInformation } = '';
    await user.findOne({
        where: {id: userId},
        include: [{
            model: userimagens
        }]
    }).then( response => {
        status = 200;
        message = 'success';
        userInformation = response
    }).catch( e => {
        status = 401;
        message = 'The user isnt in the database'
    })

    res.json({ status , message , userInformation })
})


router.get('/admin/', tokenVerification, adminVerification, (req, res)=>{
    res.json({status: 200, message: 'admin granted'})
})



//-------------------  Adding ----------------------

router.post('/add', async (req, res)=>{
    let { correo, contrasena, nombre, admin, primerapregunta, primerapreguntarespuesta, segundapregunta, segundapreguntarespuesta } = req.body
    let status = 0;
    let token = null;
    let message = null;
    contrasena = await passwordFunctions.encrypt( contrasena );

    await user.create({
        email: correo , clave: contrasena, nombre: nombre, admin: true , primerapregunta, primerapreguntarespuesta, segundapregunta, segundapreguntarespuesta
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
        message= 'succedd'
        token = jwt.sign({id: response.id}, config.secret, { expiresIn: 60 * 60 * 24  }) //here we initialize the jwt token    
    })  
    .catch( e => {
        message = 'error db'
        status = 401;
    })    
    
    res.json({status , token, message})
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
        status = 'bad db'
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

    res.json({status: 200, message: 'updated'})
})


router.get('/delete/:id', tokenVerification, adminVerification , async (req,res)=>{
    let { id } = req.params
    
    await usuarioImagenes.findOne({
        where: { usuarioid: id }
    }).then( response =>{
        if( response.length > 0){
            
            response.forEach( async ( image ) => {
                await image.destroy({
                    where: { id: image.id}
                })
            })
        }    
    })

})

router.post('/updateimage', async (req, res)=>{
    let { tokeepimage , id } = req.body;
   
    if(typeof tokeepimage == 'string'){
        tokeepimage = [{id: 0 , path: tokeepimage}]
    } else if (typeof tokeepimage == 'object'){
        tokeepimage = tokeepimage.map( (item, id) =>{
            return {id , path: item}
        })
    }
    
    let oldImages = await userimagens.findAll({
        where: {
            usuarioid: id
        }
    })
     

    let ItemsToDelete = []
    
    if (tokeepimage == undefined){
        
        oldImages.map( oldItem =>{
            ItemsToDelete.push(oldItem)
        })
    
    } else if (oldImages.length != tokeepimage.length){
        oldImages.map( oldItem =>{
            tokeepimage.map( newItem  => {
                if (newItem.path != oldItem.path){
                    ItemsToDelete.push(oldItem)
                }
            })
        })
    }
    
    
    ItemsToDelete.map( async item =>{
        await item.destroy()
    })
    
    req.files.map( async item =>{
        await userimagens.create({
            path: '/img/uploads/' + item.filename , usuarioid: id
        },{
            fields: ['path', 'usuarioid']
        })
    })

    await user.findOne({
        where: {id},
        include: [{
            model: userimagens
        }]
    }).then( response =>{
        res.status(200).json({status: 'done', data: response})
    })
    
    
})

module.exports = router;