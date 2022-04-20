const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "userName必填"],
        },
        userPhoto: String,
        postContent: {
            type: String,
            required: [true, "postContent必填"],
        },
        postImgUrl: String,  
    },
    { 
        versionKey:false,
        timestamps:true
    }
)

const Post=mongoose.model('Post',PostSchema);

module.exports=Post;