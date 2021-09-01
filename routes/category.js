const express=require('express')
const categoryModel=require('../models/category.model')
const router=express.Router()
router.get('/',async(req,res)=>{
    try{
        const categories=await categoryModel.find()
        res.render('categories/list',{categories:categories})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add',(req,res)=>{
    const category=new categoryModel()
    res.render('categories/add',{category:category})
})
router.get('/edit/:id',async(req,res)=>{
    try{
        const category=await categoryModel.findById(req.params.id)
        res.render('categories/edit',{category:category})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})
router.put('/edit/:id', async (req, res) => { //edit = phuong thuc put
    try {
        const category = await categoryModel.findById(req.params.id)
        category.name = req.body.name
        await category.save()
        res.redirect('/category')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})
router.post('/',async(req,res)=>{
    try{
        const categoryNew=new categoryModel({
            name:req.body.name
        })
        await categoryNew.save()
        res.redirect('/category')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


router.delete('/:id', async (req, res) => {
    try {
        // console.log("xoa cate")
        const categoryDelete = await categoryModel.findById(req.params.id)
        await categoryDelete.remove()
        res.redirect('/category')
    } catch (e) {
        // console.log("ko xoa cate")
        console.log(e.message)
        res.redirect('/')
    }
})
module.exports=router