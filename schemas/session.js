const mongoose=require('mongoose');

var sessionSchema=new mongoose.Schema({
    userId:{type:String},
    })

exports.Session=mongoose.model('session',sessionSchema);