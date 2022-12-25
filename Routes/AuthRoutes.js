const express=require('express')
const { register, login, forgetpassword, resetPassword } = require('../Controllers/Account/Auth.Controller')

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/forgetPassword',forgetpassword)
router.put('/resetPassword/:token',resetPassword)



module.exports=router