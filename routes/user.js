const express = require('express')
const router = express.Router()
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const passport = require('passport')
router.get('/', async (req, res) => {
    try {
        console.log("vo index")
        const users = await userModel.find()
        res.render('users/index', { users: users })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})
router.get('/register/', (req, res) => {
    try {
        res.render('users/register')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        })
        await user.save()
        req.flash("success", "Insert successfully")
        res.redirect('/user')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.get('/login/', (req, res) => {
    try {
        res.render('users/login')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.delete('/:id', async (req, res) => {
    try {
        console.log(" user delete")
        const userDelete = await userModel.findById(req.params.id)
        await userDelete.remove()
        req.flash("success", "Delete successfully")
        res.redirect('/user')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add', async (req, res) => {
    const user = new userModel()
    res.render('users/add', { user: user })
})

function check(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/user/login')
}

router.get('/profile', check, (req, res) => {
    if (req.user) {
        console.log(req.user.username)
        value = "Name: " + req.user.username
    }
    else {
        value = "No Name"
    }
    res.render('users/profile', { value: value })
})

router.get('/logout', (req, res) => {
    res.logout()
    res.redirect('login')
})

router.get('/github', passport.authenticate('github'))
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))
module.exports = router