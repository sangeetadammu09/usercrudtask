const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {type:String, required:[true, 'First Name is required']},
    lastName:{type:String, required:[true, 'Last Name is required']},
    phoneNumber:{type:String, required:[true, 'Phone Number is required']},
    email: {type:String, required:[true, 'Email is required']},
    isActive: {type:Boolean, required:true,default:true},
    avatar:{type:String, required:false},
    imageUrl: {type:String, required:false}
},{timestamps:true, versionKey:false})


module.exports = mongoose.model('User', userSchema)