// routers/home.js
const express = require('express');
const router = express.Router();
const { listAllArticlesHome, likeArticle,  } = require('../modules/article');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 设置上传文件的目录

const isLoggedIn = (req) => req.session && req.session.user;



router.get('/', async (req, res) => {
    try {
        const articles = await listAllArticlesHome();
        // console.log(articles);
        res.render('home', {
            title: 'Home Page',
            loggedIn: isLoggedIn(req),
            articles: articles
        });
    } catch (error) {
        console.error('Error displaying home page:', error);
        res.status(500).send('Server error');
    }
});

// 点赞文章

router.post('/like/:articleId', likeArticle);





module.exports = router;
