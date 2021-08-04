const express=require('express')
const indexRouter=require('./routes/index')
const categoryRouter=require('./routes/category')
const productRouter=require('./routes/product')
const expressLayouts=require('express-ejs-layouts')
const mongoose  = require('mongoose')
const app=express()
app.use(express.urlencoded({extend:false}))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout','layouts/layout')
app.use(express.static('public'))

const connectFunction=async()=>{
    try{
        await mongoose.connect('mongodb://localhost/bai2',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log("connected succesfully")
    }catch(e){
        console.log(e)
        console.log("connection failed")
    }
}
connectFunction()

app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/product',productRouter)
app.listen(3000)