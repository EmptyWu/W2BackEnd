const http = require('http');
var url = require('url');
var util = require('util');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./model/postmodel');
const headers = require('./base');

dotenv.config({ path: './config.env' });

const DBConnect = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DBConnect)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((error) => {
    console.log('資料庫連線失敗');
  });

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
console.log(req.url);
  if (req.url === '/posts') {
    //多筆資料
    switch (req.method) {
      case 'GET':        
        const data = await Post.find();
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            result: true,
            data,
          }),
        );
        res.end();
        break;
    }
  } else if(req.url.startsWith('/posts')){
    switch (req.method) {
      case 'GET':
        const q=url.parse(req.url,true).query;
        const startrow=(q.page -1)*10; // 起
        const limit = 10;
        const number = await Post.find().count(); //計算總量
        const totalPages = Math.ceil(number / limit); // 總共幾頁
        const data = await Post.find().skip(startrow).limit(limit);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            result: true,
            data,
            pagination: {
              total_pages: totalPages,
              current_page: Number(q) ,
              has_pre: q > 1 ? true : false,
              has_next: q < totalPages ? true : false,
            },
            message: '成功取得當頁資料',
          }),
        );
        res.end();
        break;
    }
  } else if (req.url === '/post') {
    //新增資料
    switch (req.method) {
      case 'POST':
        req.on('end', async () => {
          try {
            const PostData = JSON.parse(body);
            const data = await Post.create(PostData);
            res.writeHead(200, headers);
            res.write(
              JSON.stringify({
                result: true,
                data,
              }),
            );
            res.end();
          } catch (err) {
            res.writeHead(400, headers);
            res.write(
              JSON.stringify({
                result: false,
                err,
              }),
            );
            res.end();
          }
        });
        break;
    }
  } else if (req.url.startsWith('/post/')) {
    //單筆資料
    const id = req.url.split('/').pop();
    switch (req.method) {
      case 'GET':
        const data = await Post.find({ _id: id });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            result: true,
            data,
          }),
        );
        res.end();
        break;
      case 'DELETE':
        try {
          await Post.deleteOne({ _id: id });
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              result: true,
            }),
          );
          res.end();
        } catch (err) {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              result: false,
              err,
            }),
          );
          res.end();
        }
        break;
    }
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
