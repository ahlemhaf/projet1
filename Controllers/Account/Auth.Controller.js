const User = require('../../Models/UserModel')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../../Models/token')
const randomString = require('randomstring')

/***** */

exports.register = async (req, res) => {
  try {
    const Found = await User.findOne({ email: req.body.email })
    if (Found !== null) {
      res.status(400).send({ message: 'email address was used!' });
    }
    else {
      const salt = bcrypt.genSaltSync(10);
      req.body.passwordHashed = bcrypt.hashSync(req.body.password, salt);
      let transporter = nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
        secure: false,
        auth: {
          user: process.env.email,
          pass: process.env.password,
        },
      });
      
      await User.create(req.body)
      res.send({ message: 'Your registration was completd successfully !' })
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }

}


exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (user != null && (await bcrypt.compare(req.body.password, user.passwordHashed))) {
        const data = {
          useremail: user.email,
          userId: user._id
        }
        var token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'connected successfully!', token: token })
      }
      else {
        res.status(400).send({ message: ' Please verify your email address and your password !' })
      }
    }
    catch (error) {
      res.status(500).send({ message: error.message || "An error occured" });
    }
  }

  exports.forgetpassword = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      console.log(user);
      if (user) {
        const resetToken = randomString.generate(20);
        const reset = {
          userId: user._id,
          token: resetToken
        }
        await Token.create(reset)
        const link = `${process.env.protocol}resetPassword/${resetToken}`
  
        let transporter = nodemailer.createTransport({
          host: process.env.host,
          port: process.env.port,
          secure: false,
          auth: {
            user: process.env.email,
            pass: process.env.password,
          },
        });
  
        await transporter.sendMail({
          from: `${process.env.email}`,
          to: `${req.body.email}`,
          subject: "Reset your password",
  
          html: `<h1>reset your password </h1> 
        <p> Hello Ahlem this's the link to reset your password! </p> <br>
         <a href="${link}">reset link</a>
        `
        })
        res.send({ message: 'link sent successfully' })
  
      } else {
        res.status(400).send({ message: `user not found!` })
      }
  
    } catch (error) {
      res.status(500).send({ message: error.message || "An error occured" });
    }
  }
  
  /**
   * 
   * 
   */
  exports.resetPassword = async (req, res) => {
    try {
      const token = await Token.findOne({ token: req.params.token })
      console.log(token.userId);
      if (token) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        await User.findByIdAndUpdate(token.userId, { password: req.body.password, passwordHashed: hash }, { new: true })
        res.send({ message: 'password updated' })
      } else {
        res.status(400).send({ message: 'token invalid' })
      }
    } catch (error) {
      res.status(500).send({ message: error.message || "An error occured" });
    }
  }
  
  
  