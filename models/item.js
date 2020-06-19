const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    content : {
        type: String, 
        required:true
    },
    date : {
        type: Date,
        required: true,
        default: Date.now
    },
    checked : {
        type: Boolean,
    }
})

module.exports = mongoose.model('todoitem', itemSchema);

