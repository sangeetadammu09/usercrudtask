const User = require('../Model/user');
const fs = require('fs');
const DIR = './';


const allUsers = async(req,res) => {
    try{
      const usersData = await User.find().sort({ _id: -1 });

      usersData.forEach(user => {
      console.log(user)
      if(user.avatar !== ''){
      var getImageName = user.avatar.match(/\/([^\/?#]+)[^\/]*$/);
      let imageUrl = `http://localhost:3000/uploads/${getImageName[1]}`;
      user.imageUrl = imageUrl;
      }
      })

     return res.status(200).json({status:200, message:"All Users information", data: usersData}) 

    }
    catch(err){
      return res.status(400).json({status:400, message:err.message, error:true}) 
    }
}

const createUser = async(req,res)=>{

    let payload = req.body;
    var phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
    //check if image included in payload
    var imageUrl = '';
    if(req.file)
    var imageUrl = `Storage/images/${req.file.filename}`;
    payload.avatar = imageUrl;

    //return console.log(payload);

    try{
        if(payload.phoneNumber.match(phonePattern)){
            const userCreate = await User(payload).save();
            return res.status(200).json({status:200, message:"user created successfully", data: userCreate})
        }else{
            return res.status(400).json({status:400, message:"Invalid phone number", error:true}) 
        }
        
    }catch(err){
        return res.status(400).json({status:400, message:err.message, error:true}) 
    }
}

const singleUser = async(req,res)=>{
  const id = req.params.id;
  try{
    const singleUserData = await User.findById(id);
    const {firstName, lastName, phoneNumber, email, isActive, avatar} = singleUserData;
    var getImageName = avatar.match(/\/([^\/?#]+)[^\/]*$/);

    const singleUserInfo = {
        firstName,
        lastName,
        phoneNumber,
        email,
        isActive,
        imageUrl : `http://localhost:3000/uploads/${getImageName[1]}`
    }

    return res.status(200).json({status:200, message:"User information", data: singleUserInfo}) 

  }catch(err){
    return res.status(400).json({status:400, message:err.message, error:true}) 
  }
}

const updateUser = async(req, res) => {
    const id = req.params.id;
    let payload = req.body;
    
     //check if image included in payload
     var storageUrl = '';
     if(req.file){
       var storageUrl = `Storage/images/${req.file.filename}`;
       payload.avatar = storageUrl;
     
        var getImageName = payload.avatar.match(/\/([^\/?#]+)[^\/]*$/);
        let imageUrl = `http://localhost:3000/uploads/${getImageName[1]}`;
        payload.imageUrl = imageUrl;
     
     }
     try{
       
         const userInfo = await User.findById(id);
         if(!userInfo){
                res.status(404);
                throw new Error('User not found')
         }
        
         const updateUserData = await User.findByIdAndUpdate( req.params.id,payload,{new:true})
         updateUserData.avatar = payload.avatar ?  payload.avatar : userInfo.avatar
         updateUserData.imageUrl = payload.imageUrl ?  payload.imageUrl : userInfo.imageUrl
     
         return res.status(200).json({status:200, message:"user updated successfully", data: updateUserData})
        }catch(err){
            return res.status(400).json({status:400, message:err.message, error:true}) 
        }
 


}

const deleteUser = async(req, res) => {
    const id = req.params.id;
     try{
         // check if user has image if yes then first delete file and then upload
         const userInfo = await User.findById(id);
         const userPhotoInfo = userInfo.avatar;
         if(userPhotoInfo){
            fs.unlinkSync(DIR + userPhotoInfo)
         }
         const deleteUserData = await User.deleteOne({_id:id})
         console.log(deleteUserData);
        return res.status(200).json({status:200, message:"user deleted successfully", data: deleteUserData})
    }catch(err){
        return res.status(400).json({status:400, message:err.message, error:true}) 
    }
 


}

const checkEmailExists = async(req, res) => {
    console.log(req.body.email)
  try{
    if(req.body.email !== undefined){
    const singleUserData = await User.findOne({ email: req.body.email });
    if(singleUserData !== null){
    return res.status(200).json({status:200, message:"Email already exists", data: singleUserData}) 
    }else{
        return res.status(201).json({status:201, message:"Email is not registered", data: singleUserData}) 
    }
    }else{
        return res.status(400).json({status:400, message:"Email is required", error:true}) 
    }
  }catch(err){
    return res.status(400).json({status:400, message:err.message, error:true}) 
  }
}



module.exports = {createUser, singleUser, updateUser, deleteUser, allUsers, checkEmailExists};