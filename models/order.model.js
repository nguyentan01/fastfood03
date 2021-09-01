const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    cart: { type: Object, require: true },
    address: { type: String, require: true }
})
module.exports = mongoose.model('order', orderSchema)