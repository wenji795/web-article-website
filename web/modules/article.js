//modules/article.js
const db = require('./dbConfig'); // 假设您已经设置好了数据库配置
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// 设置图片保存目录
const upload = multer({dest: 'public/images/'});


// 获取所有文章
exports.getArticles = async () => {
    try {
        const result = await db.query('SELECT * FROM web_article ORDER BY create_date DESC');
        return result; // 直接返回查询结果
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error; // 抛出错误，由调用者处理
    }
};

exports.listAllArticlesHome = async () => {
    try {
        const result = await db.query('SELECT * FROM web_article ORDER BY create_date DESC');
        return result; // 直接返回查询结果
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error; // 抛出错误，由调用者处理
    }
};

// 获取并排序文章
exports.getSortedArticles = async (sortField = 'create_date', sortOrder = 'ASC') => {
    try {
        const articles = await db.query(`SELECT * FROM web_article ORDER BY ${sortField} ${sortOrder}`);
        return articles; // 直接返回查询结果
    } catch (error) {
        console.error('Error fetching sorted articles:', error);
        throw error; // 抛出错误，由调用者处理
    }
};

// 创建文章
exports.createArticle = async (title, content, author) => {
    try {
        const result = await db.query('INSERT INTO web_article (title, content, author) VALUES (?, ?, ?)', [title, content, author]);
        return result; // 返回插入结果
    } catch (error) {
        console.error('Error creating article:', error);
        throw error; // 抛出错误，由调用者处理
    }
};
exports.likeArticle = async (req, res) => {
    let userId = req.session.user.user_id;
    let articleId = req.params.articleId;
    
    
    try {
        const alreadyLiked = await checkIfAlreadyLiked(userId, articleId);
        if (!alreadyLiked) {
            // 假定这里是插入点赞记录到数据库的逻辑
            await db.query('INSERT INTO web_like (user_id, article_id, create_date) VALUES (?, ?, NOW())', [userId, articleId]);
            // 更新文章的点赞计数
            await db.query('UPDATE web_article SET like_count = like_count + 1 WHERE article_id = ?', [articleId]);
            // 获取更新后的点赞计数
            const rows = await db.query('SELECT like_count FROM web_article WHERE article_id = ?', [articleId]);
            if (rows.length > 0) {
                const updatedLikeCount = rows[0].like_count;
                res.json({ success: true, likeCount: updatedLikeCount });
                
            } else {
                res.json({ success: false, message: 'Article not found.' });
            }
        } else {
            res.json({ success: false, message: 'Article already liked by this user.' });
        }
    } catch (error) {
        console.error('Error liking the article:', error);
        throw error; // 抛出错误，由调用者处理
    }
};

const checkIfAlreadyLiked = async (userId, articleId) => {
    const rows = await db.query('SELECT 1 FROM web_like WHERE user_id = ? AND article_id = ? LIMIT 1', [userId, articleId]);
    return rows.length > 0; // 如果找到记录，返回 true，否则返回 false
};

exports.checkIfAlreadyLiked = checkIfAlreadyLiked;

exports.saveArticle = async (req, res) => {
    const { articleId, title, content } = req.body;
    const image = req.file; // `multer`提供的上传文件信息

    try {
        let imagePath = '';
        if (image) {
            // 确保public/images目录存在
            const imagesDir = path.join(__dirname, '..', 'public', 'images');
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
            }
            const newImagePath = path.join(imagesDir, image.originalname);
            fs.renameSync(image.path, newImagePath);
            imagePath = '/images/' + image.originalname; // 保存用于访问的相对路径
        }

        // 这里假设db是您已经配置好的数据库连接实例
        if (articleId) {
            // 更新现有文章
            const updateQuery = `UPDATE web_article SET article_title = ?, article_content = ?, image_path = ? WHERE id = ?`;
            await db.query(updateQuery, [title, content, imagePath, articleId]);
        } else {
            // 创建新文章
            const insertQuery = `INSERT INTO web_article (article_title, article_content, image_path) VALUES (?, ?, ?)`;
            await db.query(insertQuery, [title, content, imagePath]);
        }

        res.redirect('/articles/list');
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).send('Error saving article');
    }
};