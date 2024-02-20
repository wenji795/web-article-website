const express = require('express');
const router = express.Router();

// 引入用于获取文章详情和评论的控制器函数
const { getArticleDetails, getArticleComments } = require('../modules/comment_dao');
const commentsController = require("../modules/comment_dao");

router.get('/article/:articleId/comments', async (req, res) => {
    console.log(req.params);
    const articleId = req.params.articleId;
    try {
        const articleDetails = await getArticleDetails(articleId);
        const comments = await getArticleComments(articleId);
        res.render('comments', {
            article: articleDetails,
            comments: comments,
            user: req.session.user, // 假设用户信息保存在会话中
        });
    } catch (error) {
        console.error('Error fetching article details or comments:', error);
        res.status(500).send('Server error');
    }
});

// 假设您使用Express
router.post('/comments/add', commentsController.addComment);

module.exports = router;
