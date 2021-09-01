const express = require('express')
const categoryModel = require('../models/category.model')
const productModel = require('../models/product.model')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const data = []
        const category = await categoryModel.find({ name: req.body.query.toLowerCase() })
        const products = await productModel.find()
        for (let i = 0; i < products.length; i++) {
            if (category.length == 0) {
                if (req.body.query.toString() == products[i].price.toString()) {
                    data.push(products[i])
                }
            }
            else if (category.length >= 1) {
                if (category[0]._id.toString() == products[i].category.toString()) {
                    data.push(products[i])
                }
            }
        }
        if(data.length==0){
            req.flash("error", "No matched result")
        }
        res.render('search', { products: data, query: req.body.query })
    } catch (e) {
        console.log(e.message)
    }
})

module.exports = router