//公共函数库
var G_FUNC = require('cloud/libs/g_func.js');
// 在 Cloud code 里初始化 Express 框架
var express = require('express');
//引入 comments controller
var comments = require('cloud/controller/comments.js');
//https
var avosExpressHttpsRedirect = require('avos-express-https-redirect');
//express
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(avosExpressHttpsRedirect()); // 强制 https

//get comment list
app.get('/comments', comments.get_comments);
//get comment num
app.get('/comments_num', comments.get_comments_num);
//add comment
app.post('/comments', comments.add_comment);


// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();