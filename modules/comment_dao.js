const db = require('./dbConfig');

exports.getArticleDetails = async (articleId) => {
    try {
        const result = await db.query('SELECT * FROM web_article WHERE article_id = ?', [articleId]);
        console.log(result);

        if (result.length > 0) {
            return result; // 返回找到的第一篇文章
        } else {
            throw new Error('Article not found');
        }
    } catch (error) {
        console.error('Error fetching article details:', error);
        throw error; // 向上抛出错误，让调用者处理
    }
};

exports.getArticleComments = async (articleId) => {
    try {
        const result = await db.query('SELECT * FROM web_comment WHERE article_id = ? ORDER BY create_date DESC', [articleId]);
        return result; // 返回所有找到的评论
    } catch (error) {
        console.error('Error fetching article comments:', error);
        throw error;
    }
};

exports.addComment = async (req, res) => {
    const { articleId, commentContent, parentCommentId } = req.body;
    if (!articleId) { // 确保articleId存在
        return res.status(400).send('Article ID is required.');
    }
    try {
        await db.query('INSERT INTO web_comment (article_id, comment_content, parent_comment_id, user_id, create_date) VALUES (?, ?, ?, ?, NOW())', [parseInt(articleId), commentContent, parentCommentId || null, req.session.user.user_id]);
        res.redirect(`/article/${articleId}/comments`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Unable to add comment.');
    }
};


exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const deleteQuery = `DELETE FROM web_comment WHERE comment_id = ?`;
        await db.query(deleteQuery, [commentId]);
        res.send('Comment deleted successfully.');
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Server error');
    }
};
