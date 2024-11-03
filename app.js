const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const middleware = require('./middleware/authenticate');
const cors = require('cors');
const auth = require('./controller/auth');
const user = require('./controller/user');
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;
app.use(bodyParser.json());

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));


const uploadsDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

app.post('/signup',auth.signup)
app.post('/login',auth.login)
// app.post('/createpost',middleware,user.createpost);
app.get('/timeline',middleware,user.timeline);
app.get('/profile',middleware,user.profile);
app.post('/timeline/likePost',middleware,user.likePost);
app.post('/timeline/commentPost',middleware,user.commentPost);
app.delete('/timeline/:id',middleware,user.deletePost);
app.post('/send-otp',auth.sendOtp);
app.post('/verify-otp',auth.verfyOtp);
// app.put('/updateUser', auth.updateUser);
app.delete('/deleteUser/:id', auth.deleteUser);
app.get('/getupdateUser/:id',auth.getupdateUser);
app.use('/uploads', express.static('/public/uploads'));
app.put('/updateUser/:id', auth.updateUser);
app.post('/createPosts',middleware, upload.single('photo'),user.CreatePost);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose.connect("mongodb://localhost:27017/social_app")
  .then(() => {
    console.log("MongoDb connected")
  })
  .catch((err) => {
    console.log(err, "Error In MongoDb")
  });