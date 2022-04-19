const http = require('http');
const mongoose =require('mongoose');
const dotenv=require('dotenv');
const Post = require('./model/postmodel');
const headers=require('./base');


dotenv.config({path:'./config.env'});

const DBConnect=process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DBConnect)
.then(()=>{
    console.log('資料庫連線成功');
})
.catch((error)=>{
    console.log('資料庫連線失敗')
});

const requestListener=async(req,res)=>{
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });

    if ( req.url === '/PostList'){
        switch(req.method){
            case "GET":
                const data = await Post.find();
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    result: true,
                    data
                }));
                res.end();
                break;
            case"POST":
            req.on('end',async()=>{
                try{
                    const PostData = JSON.parse(body);
                    const data = await Post.create(PostData);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        result: true,
                        data
                    }));
                    res.end();
                }catch(err){
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({
                        result: false,
                        err
                    }));
                    res.end();
                }
            });
                break;
        }
    }
};


const server=http.createServer(requestListener);
server.listen(process.env.PORT);