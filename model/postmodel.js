const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "userName必填"],
        },
        userContent: {
            type: String,
            required: [true, "userContent必填"],
        },
        userPhoto: String,
        imgUrl: String,       
    },
    { 
        versionKey:false,
        timestamps:true
    }
)

const Post=mongoose.model('Post',PostSchema);

module.exports=Post;