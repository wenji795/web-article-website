require('dotenv').config();

const express = require('express');
const router = express.Router();

// 引入各个功能区域的路由模块
const userRoutes = require('./users');
const articleRoutes = require('./articles');

// 使用中间件将路由模块挂载到应用的路由中
// 例如，所有用户相关的路由都会以 '/users' 为前缀
router.use('/users', userRoutes);

// 所有文章相关的路由都会以 '/articles' 为前缀
router.use('/articles', articleRoutes);

// 可以在这里继续添加更多的路由模块挂载
// router.use('/anotherModule', anotherModuleRoutes);

//对根路径的访问，可以定义一个简单的欢迎信息或者重定向到一个主页路由
// router.get('/', (req, res) => {
//     res.send('欢迎来到我们的网站！');
// });

// 对根路径的访问重定向到 /articles
router.get('/', (req, res) => {
    res.redirect('/articles');
});

// 导出router使其可以在app.js中被引用
module.exports = router;
