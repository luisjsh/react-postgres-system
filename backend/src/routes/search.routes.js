const express = require('express')
const router  = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op

const torosModel = require('../models/toros.model')
const torosImage = require('../models/torosimagenes.model') 


router.get('/:name', async (req, res)=>{
    let { name } = req.params
    
    let Item = await torosModel.findAll({
        where: {
            nombre:{ 
                [Op.like]: '%'+name+'%'
            }
        }
    })

    res.status(200).json({response: Item})
})

router.get('/page/:name', async (req, res)=>{
    let { name } = req.params
    
    let Item = await torosModel.findAll({
        where: {
            nombre:{ 
                [Op.like]: '%'+name+'%'
            }
        },
        include: [{model: torosImage}]
    })

    res.status(200).json({response: Item})
})

module.exports = router;