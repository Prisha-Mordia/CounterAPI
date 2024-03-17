const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    key : {
        type : String,
        required : true,
        unqiue : true
    },
    value : {
        type : Number,
        required : true,
        default : 1
    }
})

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;