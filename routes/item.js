const express = require('express')
const router = express.Router()
const itemSchema = require('../models/item');
const moment = require('moment');
const cors = require('cors')



//GET ALL ITEM
router.get('/', async (req,res) => {
        
    const itemshemas = await itemSchema.find()
    const todolist = itemshemas
    res.render('index', {
        title : 'mins todo list',
        todolist : todolist
    })
})


// craeting one
router.post('/api/v1/item', async (req,res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");   
    const itemschema = new itemSchema({
        content : req.body.content,
        checked : false
    })
    try {
        const newItem = await itemschema.save();
        res.status(200).json(newItem);
    } catch (error) {
        res.status(400).json({message : err.message})
    }
}) 


//UPDATE ITEM
router.patch('/api/v1/item', getItem, async (req,res)=>{
    res.item.checked === true ? res.item.checked = false : res.item.checked = true
    console.log(`updateded res.item : ${res.item}`)
    try {
        const updatedItem = await res.item.save()
        res.json(updatedItem)
    } catch (error) {
        res.status(400).json({message:err.message})
    }
})



//DELETE ITEM
router.delete('/api/v1/item/:id', deleteitem, async (req,res) => {
    // res.header("Access-Control-Allow-Origin", '/');
    // res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTION");
    // res.header("Access-Control-Allow-Headers", '*');
    try {
        await res.item.remove()
        res.json({message:"Deleted Subscriber"})        
    } catch (error) {
        res.status(400).json({message:err.message})
    }
})



async function deleteitem(req, res, next){
    console.log(req.params.id)
    let item
    try {
        item = await itemSchema.findById(req.params.id);
        if(item == null){
            return res.status(404).json({message: 'Cannot find item'})
        }
    } catch (error) {   
        return res.status(500).json({message: err.message})
    }
    res.item = item;
    console.log(`res.item : ${res.item}`)
    next()
}



async function getItem(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");   

    let item;
    console.log(`req.body.id : ${req.body.id}`)
    try{
        item = await itemSchema.findById(req.body.id)
        if(item == null){
            return res.status(404).json({message: 'Cannot find subscriber'})
        }
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.item = item;
    console.log(`res.item : ${res.item}`)
    next()
}



module.exports = router