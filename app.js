
const express = require('express');
const app = express();
const path = require('path');
// require('dotenv').config();
const { engine } = require('express-handlebars');

// 配置中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// 配置Handlebars视图引擎
app.engine('handlebars', engine({
    defaultLayout: 'main', // 设置默认布局为main.handlebars
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views'); // 设置视图文件的目录

// 使用路由
const indexRouter = require('./routers/index');
const articleRoutes = require('./routers/articles');
const userRoutes = require('./routers/users');
const homeRouters = require('./routers/home')
const commentsRouters = require('./routers/comments')
const session = require('express-session'); // 假设使用session管理登录状态
app.use(session({
    secret: 'your_secret_key', // 更换为您自己的密钥
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 }, // 配置cookie
}));
app.use('/', indexRouter);
app.use('/articles', articleRoutes);
app.use('/users', userRoutes);
app.use('/home', homeRouters);
app.use('/', commentsRouters);
// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Web final project listening on http://localhost:${port}`);
});
