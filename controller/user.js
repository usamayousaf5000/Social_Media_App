const User = require('../Model/UserSchema');
const UserPost = require('../Model/PostSchema');
const Post = require('../Model/PostSchema');
const jwt = require('jsonwebtoken');
const secretKey = 'abcdeghijk';
// Serve static files from 'uploads' directory


const isloggedin = (req, res) => {
  let user = req.user;
  return res.status(200).json({
    message: "Welcome",
    user
  })
};
// const createpost = async (req, res) => {
//   const { title, content } = req.body;
//   let email = req.user.email;
//   console.log(email)

//   // Log the incoming request body
//   console.log('Request Body:', req.body);

//   try {
//     const user = await User.findOne({ email });
//     console.log('User found:', user);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     // Create the post
//     let post = new UserPost({ email: user.email, title, content, userId: user._id });
//     console.log("Post to save:", post); // Log the post object

//     await post.save();
//     return res.status(200).json({
//       message: "Post created successfully"
//     });
//   } catch (err) {
//     console.error("Error saving post:", err); // Log the complete error object
//     return res.status(500).json({
//       message: "Server error",
//       error: err.message // Include error message for debugging
//     });
//   }
// };

const CreatePost = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token , secretKey);
    // console.log(token)
    const userId = decoded.id;
    console.log(userId);
  try {
    
    const { title, content } = req.body;
    console.log(req.body);
    const photo = req.file.path;
    
    const newPost = new Post({ title, content, photo,userId });
    await newPost.save();

    res.status(200).json({
      message: "Post created successfully",
      post: newPost,
    });
    console.log("Created post:", newPost);
  } catch (error) {
    console.error("Error creating post:", error); // Log detailed error
    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // Return error message for debugging
    });
  }
};

const timeline = async (req, res) => {
  let email = req.user.email;
  // console.log(email)
  const user = await User.findOne({ email })

  // console.log(user);
  try {
    const otherPosts = await UserPost.find({ userId: { $ne: user._id } }).populate('userId');
      console.log(otherPosts)
    if (otherPosts.length) {
      return res.status(200).json({
        otherPosts
      })
    } else {
      return res.status(404).json({
        message: "No Post Created Yet"
      });
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
const profile = async (req, res) => {
  let email = req.user.email
  console.log(email)
  const user = await User.findOne({ email })
  console.log(user);
  try {
    const activeUserPosts = await UserPost.find({ userId: user._id }).populate('userId');
    console.log(activeUserPosts)
    if (activeUserPosts.length) {
      return res.status(200).json({
        activeUserPosts
      })
    } else {
      return res.status(404).json({
        message: "No Post Created Yet"
      });
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
const likePost = (req, res) => {
  // console.log('here')
  const postId = req.params.id;

  let userData;
  users.forEach(user => {
    userData = user.posts.find(post => post.id == postId)
    let likedPost = user.posts.find(post => post.id == postId)
    console.log(likedPost)
    // console.log(userData,'user')
    if (userData) {
      if (user.id === req.userId) {
        return res.status(403).json({
          message: 'Cannot like your own post'
        });
      }
      if (user.id !== req.userId) {
        userData.likes.push({ userId: req.userId, like: 1 })
        return res.status(200).json({
          userData: userData,
        })
      } else {
        return res.status(400).json({
          message: "You Already Liked this post"
        })
      }
    }

  });
  return res.status(401).json('not found')
};
const commentPost = (req, res) => {
  const postId = req.params.id;
  const { comment } = req.body;
  console.log('Received postId:', postId);
  let userData;
  users.forEach(user => {
    if (user.posts.find(p => p.id == postId)) {
      userData = user.posts.find(p => p.id == postId);
      // console.log(userData, "yguu")
    }
    if (userData) {
      if (user.id === req.userId) {
        res.status(403).json({
          message: 'Cannot comment on your own post'
        })
      } else
        userData.comments.push({ userId: req.userId, comment });
      res.status(200).json({
        message: "comments added successfully"
      })
      {
        res.status(404).json({
          message: "Not Found"
        })
      }
    }

  })
};
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await UserPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).send('Post not found');
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await UserPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};



module.exports = { isloggedin, timeline, profile, likePost, commentPost, deletePost, updatePost, CreatePost };