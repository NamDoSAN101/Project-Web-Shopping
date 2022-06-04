const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    totalPrice: Number,
    totalQty: Number,
    payment: Number,
    paymentMethod: String,
    status: String,
    address: String,
    phone: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "User"
        },
        username: String
    },
    cart: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        },
        totalPrice : Number,
        totalQuantity :Number,
        payment : Number,       
    }] 
});

module.exports = mongoose.model('Order', orderSchema);