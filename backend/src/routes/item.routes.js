const express = require('express')
const router  = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op

const toros = require('../models/toros.model')
const torosImage = require('../models/torosimagenes.model')
const logrosModel = require('../models/usefull-model/logros.model')
const {tokenVerification, adminVerification} = require('../functions/verification-functions')

router.post('/add', tokenVerification, adminVerification , async (req, res)=>{
    let { nombre , hierro , hierrocodigo, pelaje, sexo ,fechaNac , logros, notas , madreId , padreId } = req.body;

    await toros.create({
        nombre , hierro, hierrocodigo, pelaje, sexo, fechanac: fechaNac, logros, notas, madreid: madreId, padreid: padreId
    
    },{
     
        fields: ['nombre','hierro','hierrocodigo', 'pelaje', 'sexo' ,'fechanac', 'logros', 'notas', 'madreid', 'padreid']
    
    }).then( async response =>{
        
        let i = 0;
        for ( i=0 ; i<req.files.length; i++){
            await torosImage.create({ 
                path: '/img/uploads/' + req.files[i].filename, torosid: response.id
            },{
                fields: [ 'path' , 'torosid']
            })
        }
        
        res.status(200).json({status: 200});    
    }) 
});


router.get('/', async (req, res)=>{
    await toros.findAll({
        include: [{model: torosImage}]
    }).then( response => res.status(200).json({status: 200, response}))
})


router.get('/search/profile/:id', async (req, res)=>{
    let { id } = req.params;
    await toros.findOne({
        where: {
            id 
        },
        include: [{model: torosImage} , {model: logrosModel}]
    }).then( response => res.status(200).json({status: 200, response}))
})


router.post('/searchforParent', tokenVerification, adminVerification , async (req, res)=>{
    let { sex , name } = req.body
    await toros.findAndCountAll({
        where: {
            sexo: sex ,
            nombre: {
                [Op.like]: '%'+ name +'%'
            }
        },
        limit: 15,
        include: [{
            model: torosImage
        }] 
    }).then( response => res.status(200).json({ status: 200, parentsArray: response.rows }))
})



router.get('/search/family/parents/:id', async (req, res)=>{
   let { id } = req.params
    
    await toros.findOne({
        where: { id }
    }).then( async response => {

        let {madreid , padreid} = response;

        if ( madreid > 0 || padreid > 0){
            await toros.findAll({
                where: {
                        [Op.or]: [ {id: parseInt(padreid)},{ id: parseInt(madreid)} ]
                },
                include:
                [{ model: torosImage}]
            }).then( response => {
                
                res.status(200).json({status: 200, detail: 'no-grandpa', response})
            })
        } else {
            res.status(200).json({status: 200, detail: 'no-parents' , response})
        }
    })
})


router.get('/search/family/child/:id', async (req, res)=>{
    let { id } = req.params 

    await toros.findAll({
        where: {
            [Op.or] : [{padreid: parseInt(id) }, { madreid: parseInt(id) }]
        } , 
        include: [{
            model: torosImage
        }]

    }).then( async answer => {
        answer.length > 0 ?
            res.status(200).json({ status: 200, detail: 'has childs', responseArray: answer})
        :
            res.status(200).json({status: 200, detail:'nochilds'})
        
    })
})

//------------------------------ UPDATE ----------------------------------------------------

router.post('/update', tokenVerification, adminVerification , async (req, res)=>{

    let { id , nombre, pelaje, fechanac } = req.body
    console.log(id)
    await toros.findOne({ 
        where: { id }
    }).then( async response => {
        response.nombre = nombre;
        response.pelaje = pelaje;
        response.fechaNac = fechanac;
        response.save();
        console.log(response)
        res.status(200).json({status: 200, detail:'updated' , data: response})
    })

})

module.exports = router;