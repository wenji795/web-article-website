//routers/articles.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 设置上传文件的目录
const articleController = require('../modules/article');
const {saveArticle,} = require("../modules/article");


// 显示文章列表
router.get('/', async (req, res) => {
    try {
        const articles = await articleController.getArticles();
        res.render('articlesList', { articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Server error');
    }
});



// 获取排序后的文章列表
router.get('/sorted', async (req, res) => {
    const sortField = req.query.field || 'create_date';
    const sortOrder = req.query.order || 'ASC';
    try {
        const articles = await articleController.getSortedArticles(sortField, sortOrder);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching sorted articles:', error);
        res.status(500).send('Server error');
    }
});

// 创建文章
router.post('/create', async (req, res) => {
    const { title, content, author } = req.body;
    try {
        await articleController.createArticle(title, content, author);
        res.status(201).send('Article created successfully');
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).send('Server error');
    }
});

// 获取当前用户点赞的文章列表
router.get('/liked', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const userId = req.session.user.user_id; // 确保这与你存储在 session 中的用户 ID 的字段匹配
    try {
        const articles = await articleController.getLikedArticlesByUser(userId);
        res.render('likedArticlesList', { articles, loggedIn: true });
    } catch (error) {
        console.error('Error fetching liked articles:', error);
        res.status(500).send('Server error');
    }
});

// 添加GET请求处理器
router.get('/new', (req, res) => {
    res.render('createOrEditArticle', {
        title: 'Create New Article', // 页面标题
        article: null, // 新建文章，所以传入null
        loggedIn: req.session ? req.session.user : false, // 假设您使用session来检查用户是否登录
    });
});

// 路由处理文章提交
router.post('/save', upload.single('image_path'), saveArticle);

//其他文章相关路由...

module.exports = router;
