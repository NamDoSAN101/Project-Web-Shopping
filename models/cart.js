const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    totalPrice : Number,
    totalQty :Number,
    payment : Number,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "User"
        },
        username: String,
        address : String,
        mobile   : String
    },
    product: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Print'
        },
        name : String,
        price :Number,
        image : String        
    }] 
});

module.exports = mongoose.model('Cart', cartSchema);