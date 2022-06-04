const mongoose = require('mongoose');

const printSchema = new mongoose.Schema({
    name: String,
    Artist: String, /*ref*/
    price: Number,
    qty : Number,
    type : String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Print', printSchema);