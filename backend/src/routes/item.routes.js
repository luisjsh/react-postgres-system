const express = require('express')
const router  = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op

const toros = require('../models/toros.model')
const torosImage = require('../models/torosimagenes.model')
const logrosModel = require('../models/usefull-model/logros.model')
const pelajeModel = require('../models/usefull-model/pelaje.model')

const {tokenVerification, adminVerification} = require('../functions/verification-functions')

router.post('/add', tokenVerification, adminVerification , async (req, res)=>{
    let { nombre , hierro , hierrocodigo, pelaje, sexo ,fechaNac , logros, notas , madreId , padreId } = req.body;
    
    let ChoosedPelaje = await pelajeModel.findOne({
        where: {
            nombre: pelaje
        }
    })

    await toros.create({
        nombre , hierro, hierrocodigo, pelaje: ChoosedPelaje.id, sexo, fechanac: fechaNac, logros, notas, madreid: madreId, padreid: padreId
    
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
    try{
    await toros.findAll({
        include: [{model: torosImage}]
    }).then( response => res.status(200).json({status: 200, response}))
    } catch(e){
        res.status(200).json({message: 'problem db'})
    }
})


router.get('/search/profile/:id', async (req, res)=>{
    let { id } = req.params;
    await toros.findOne({
        where: {
            id 
        },
        include: [{model: torosImage} , {model: logrosModel}, {model: pelajeModel, as: 'pelajes'}]
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

    let { id , nombre, pelaje, fechanac, logro, notas} = req.body


    let ChoosedPelaje = await pelajeModel.findOne({
        where: {
            nombre: pelaje
        }
    })

    await toros.findOne({ 
        where: { id }
    }).then( async response => {
        response.nombre = nombre;
        response.pelajes = ChoosedPelaje.id;
        response.fechaNac = fechanac;
        response.logros = parseInt(logro);
        response.notas = notas;
        response.save();
    })

            
    await toros.findOne({
        where: {id},
        include: [{model: logrosModel}, {model: pelajeModel, as: 'pelajes'}]
    }).then( response =>{
        res.status(200).json({status: 200, detail:'updated' , data: response})
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
    
    let oldImages = await torosImage.findAll({
        where: {
            torosid: id
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
        await torosImage.create({
            path: '/img/uploads/' + item.filename , torosid: id 
        },{
            fields: ['path', 'torosid']
        })
    })

    res.status(200).json({status: 'done'})
    
})

module.exports = router;