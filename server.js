const express = require('express')
const indexRouter = require('./routes/index')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const searchRouter = require('./routes/search')
const userRouter = require('./routes/user')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
require('./models/passport.model')(passport)
const app = express()
const session = require('express-session')
const flash = require('express-flash')
const methodOverride = require('method-override')
app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(flash())
app.use(methodOverride('_method')) //dung override
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 100 }
}))
app.use((req, res, next) => {
    res.locals.session = req.session
    next();
})
app.use(passport.initialize())
app.use(passport.session())
const connectFunction = async () => {
    try {
        await mongoose.connect('mongodb://localhost/bai2', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log("connected succesfully")
    } catch (e) {
        console.log(e)
        console.log("connection failed")
    }
}
connectFunction()
app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)
app.use('/search', searchRouter)
app.listen(3000)