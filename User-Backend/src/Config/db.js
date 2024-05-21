const mongoose = require('mongoose');
const connectDb = async ()=>{
    try{
       const connect = await mongoose.connect(process.env.CONNECTION_STRING,{useNewUrlParser: true,useUnifiedTopology: true});
       console.log('DB connected successfully', connect.connection.host, connect.connection.name)
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDb;