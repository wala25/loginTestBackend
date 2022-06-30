const mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String, unique: true,required : true},
    password:{type:String}})

exports.User=mongoose.model('user',userSchema);