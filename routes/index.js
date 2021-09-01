const express = require('express')
const productModel=require('../models/product.model')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const products = await productModel.find()
        res.render('index', { products: products })
    } catch (e) {
        console.log(e.message)
    }
})
module.exports = router