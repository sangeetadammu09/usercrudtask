const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const fileUpload = require('../Utils/fileUpload');

router.post('/create-user', fileUpload("./Storage/images"), userController.createUser);
router.get('/single-user/:id',userController.singleUser);
router.put('/update-user/:id', fileUpload("./Storage/images"), userController.updateUser);
router.delete('/delete-user/:id',userController.deleteUser);
router.get('/allusers', userController.allUsers);
router.post('/checkemailexists',userController.checkEmailExists);



module.exports = router;