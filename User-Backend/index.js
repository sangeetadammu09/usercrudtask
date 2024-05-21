const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const connectDb = require('./src/Config/db')
const cors = require('cors');
const routes = require('./src/Routes/userRoute');
const multer = require('multer');

const port = process.env.PORT ||3000;

connectDb();

//As we have multipart data like data with image we need inbuilt middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({origin: '*'}));

//static image for user

app.use('/uploads', express.static('Storage/images'));

//base route
app.use('/api', routes);

//multer error handling
app.use((err,req,res,next) => {
  // multer errors
  if(err instanceof multer.MulterError){
    return res.status(418).json({err_code: err.code, err_message: err.message})
  }else{
    //other application errors
    return res.status(500).json({err_code: 409, err_message: "Something went wrong"})
  }
})

//undefined User Route
app.use('*',(req, res)=>{
  res.status(404).json({status:'failed', data : "Not found"})
})


app.listen(port,() => {
  console.log(`Server listening at port ${port}`);
})