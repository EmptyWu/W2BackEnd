# Node.js 直播班-2022春季 第八組小組任務 
# 第二週
---
## POST 後端API 設定

## heroku 網址
> https://infinite-wave-68225.herokuapp.com/ 

## GET 所有資料
> https://infinite-wave-68225.herokuapp.com/PostList

## POST 新增資料
> https://infinite-wave-68225.herokuapp.com/PostList

## Mongoose Schema
```javascript
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

```