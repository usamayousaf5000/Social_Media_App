const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  email:{
    type: String,
    requiredc: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  photo : {
    type : String,
    required : true
  },
  likes: {
    type : Number,
    default : 0
  },
  likedby: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  comments : {
    type : String,
    default : 0
  },
  commentedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});


postSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
