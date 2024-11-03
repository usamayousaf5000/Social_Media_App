const User = require('../Model/UserSchema');
const jwt = require('jsonwebtoken');
const secretKey = 'abcdeghijk';
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "osamayousaf29@gmail.com",
      pass: "rahz tvwu vgvg dijw",
    },
  });
 const signup= async (req, res) => {
    const { name, email, password } = req.body;
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      // const otp = crypto.randomInt(100000, 999999).toString();
      // await transporter.sendMail({
      //   from: '"Usama Yousaf OTP" <osamayousaf29@gmail.com>', 
      //   to: "usama.48aug24webgpt@gmail.com", 
      //   subject: "Your OTP Code", 
      //   text: `Your OTP is ${otp}`, 
      //   html: `<b>Your OTP is ${otp}</b>`, 
      // });
  
      existingUser = new User({ name, email, password });
      await existingUser.save();
  
      res.status(201).json({
        // message: 'User registered successfully. An OTP has been sent to your email.',
        message: 'User registered successfully.',
      });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
      if (user.email == req.body.email && user.password == req.body.password) {
        const token = jwt.sign({ email: user.email, id : user.id }, secretKey);
        console.log(token);
        return res.status(200).json({
          message: "Login Succesfull",
          token
        });
      } else {
        return res.status(404).json({
          message: "Invalid email and password"
        })
      }
    }
    catch (error) {
      res.status(500).json({
        message: "Internal Server Error"
      })
    }
  };
  const sendOtp =  async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      const otp = crypto.randomInt(100000, 999999).toString();
      await transporter.sendMail({
        from: '"Usama Yousaf OTP" <osamayousaf29@gmail.com>',
        to: user.email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
        html: `<b>Your OTP is ${otp}</b>`,
      });
  
      user.otp = otp; // Store the OTP in the user's record
      await user.save();
  
      res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const verfyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
  
      user.otp = null;
      await user.save();
  
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const deleteUser = async (req, res) => {
    const {id} = req.params.id
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, secretKey);
        const user = await User.findOneAndDelete({ userId: id });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getupdateUser = async (req,res)=>{
  try{
    const {id} = req.params;
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    if(user){
      res.status(200).json({
        user,
        message : "user found"
      });
    }else{
      res.status(400).json({
        message : "user not found"
      });
    }
  }
  catch(error){
    res.status(500).json({
      message : "Internal server error"
    });
  }
}
const updateUser = async (req, res) => {
  try {
      const { id } = req.params; 
      const { name, email, password } = req.body;
      console.log(id);
      console.log(name,email,password);

      const user = await User.findByIdAndUpdate(
          id,
          { name, email, password },
          { new: true }
      );

      if (user) {
          res.status(200).json({
              user,
              message: "User updated successfully"
          });
      } else {
          res.status(404).json({
              message: "User not found"
          });
      }
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
          message: "Internal server error"
      });
  }
};


  module.exports = {signup,login,sendOtp,verfyOtp,deleteUser,getupdateUser,updateUser};