const express = require('express')
const productModel = require('../models/product.model')
const cartModel = require('../models/cart.model')
const session = require('express-session')
const orderModel = require('../models/order.model')
const paypal = require('paypal-rest-sdk');
const router = express.Router()

function check(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/cart/checkout/')
}

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfuUfVHP9alwI_Ris6uMumOeWzpuoJo5dIRguc9HATqUlVr3uoRYwxMHxCrjoRq_86epVD5sSY9XZkAq',
    'client_secret': 'EKIZw0Pa_H5eRDgqDkpTd4YpFlwMrHC7HWkyR7xmIS6UYx8Y1IUfSgKK2etF43nNI6qd3fPrp5L91T2r'
});

router.get('/', async (req, res) => {
    try {
        console.log("vo '/cart'")
        let products = []
        let total = 0
        if (req.session.cart) {
            products = req.session.cart.items
            total = req.session.cart.priceTotal
        }
        res.render('carts/cart', { cart: products, total: total })
    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})
router.get('/add/:id', async (req, res) => {
    try {
        console.log("vo /add/:id")
        const product = await productModel.findById(req.params.id)
        const cart = new cartModel(req.session.cart ? req.session.cart : { items: [] })
        cart.add(product, req.params.id, product.imageSrc)
        req.session.cart = cart
        res.send("Add thành công!")
    } catch (e) {
        console.log(e.message)
        res.send("Add thất bại!")
    }
})
router.get('/delete/:id', (req, res) => {
    try {
        console.log("delete")
        const cart = new cartModel(req.session.cart)
        cart.delete(req.params.id)
        req.session.cart = cart
        res.send("Xoá thành công!")

    } catch (e) {
        console.log(e.message)
        res.send("Xoá thất bại!")
    }
})
router.delete('/:id', (req, res) => {
    try {
        console.log("delete")
        const cart = new cartModel(req.session.cart)
        cart.delete(req.params.id)
        req.session.cart = cart
        res.send("Xoá thành công!")

    } catch (e) {
        console.log("huhu")
        console.log(e.message)
        res.send("Xoá thất bại!")
    }
})
router.put('/reduce/:id', async (req, res) => {
    try {
        console.log("reduce")
        const product = await productModel.findById(req.params.id)
        let items_old = []
        if (req.session.cart) {
            items_old = req.session.cart.items
        }
        const cart = new cartModel(req.session.cart ? req.session.cart : { items: [] })
        cart.reduce(req.params.id)
        req.session.cart = cart
        res.send("Giảm thành công")
    } catch (e) {
        console.log(e.message)
        res.send("Giảm thất bại")
    }
})
router.get('/reduce/:id', async (req, res) => {
    try {
        console.log("reduce cart")
        const product = await productModel.findById(req.params.id)
        let items_old = []
        if (req.session.cart) {
            items_old = req.session.cart.items
        }
        const cart = new cartModel(req.session.cart ? req.session.cart : { items: [] })
        cart.reduce(req.params.id)
        req.session.cart = cart
        res.send("Giam thành công")
    } catch (e) {
        console.log(e.message)
        res.send("Giam thất bại")
    }
})
router.get('/increase/:id', async (req, res) => {
    try {
        console.log("increase cart")
        const product = await productModel.findById(req.params.id)
        let items_old = []
        if (req.session.cart) {
            items_old = req.session.cart.items
        }
        const cart = new cartModel(req.session.cart ? req.session.cart : { items: [] })
        cart.increase(req.params.id)
        req.session.cart = cart
        res.send("Tăng thành công")
    } catch (e) {
        console.log(e.message)
        res.send("Tăng thất bại")
    }
})

router.get('/checkout', (req, res) => {
    // console.log("checkout")
    // console.log(req.session.cart.items[0].qty)
    if (!req.session.cart) {
        res.redirect('/cart')
    }
    const cart = new cartModel(req.session.cart)
    const total = new Intl.NumberFormat().format(cart.priceTotal)
    res.render('carts/checkout', { products: cart.items, total: total })
})

router.post('/order', check, async (req, res) => {
    try {
        console.log("order")
        console.log(req.session.cart.priceTotal)
        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user: req.user,
            cart: cart,
            address: req.body.address
        })

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/cart/success",
                "cancel_url": "http://localhost:3000/cart/cancel"
            },
            "transactions": [{
                
                "amount": {
                    "currency": "USD",
                    "total": req.session.cart.priceTotal
                },
                
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
        await order.save()
    } catch (e) {
        console.log(e.message)
        res.redirect('/cart/checkout/')
    }
})

// router.post('/order', check, (req, res) => {
//     const cart = new cartModel(req.session.cart)
//     const create_payment_json = {
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "redirect_urls": {
//             "return_url": "http://localhost:3000/cart/success",
//             "cancel_url": "http://localhost:3000/cart/cancel"
//         },
//         "transactions": [{
//             // "item_list": cart.items,
//             "amount": {
//                 "currency": "USD",
//                 "total": cart.priceTotal
//             },

//         }]
//     };

//     paypal.payment.create(create_payment_json, function (error, payment) {
//         if (error) {
//             throw error;
//         } else {
//             for (let i = 0; i < payment.links.length; i++) {
//                 if (payment.links[i].rel === 'approval_url') {
//                     res.redirect(payment.links[i].href);
//                 }
//             }
//         }
//     });

// });

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    // Obtains the transaction details from paypal
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));

        }
    });

    res.redirect('http://localhost:3000/')
    req.flash("success", "Order successfully")
});
module.exports = router
