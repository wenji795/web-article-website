// const express = require('express');
// const router = express.Router();
//
// // 登录页面路由
// router.get('/login', (req, res) => {
//     // 渲染登录页面视图
//     res.render('login');
// });
//
// // 注册页面路由
//
//
// router.get('/register', (req, res) => {
//     const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png'];
//     console.log(avatars); // 在调用res.render之前
//     res.render('register', { avatars }); // 向模板传递头像信息
// });
//
//
// router.get('/check-username', async (req, res) => {
//     // const username = req.query.username;
//     // // 这里添加检查用户名是否存在的逻辑
//     // // 假设使用伪代码表示
//     // const usernameExists = await checkUsernameExists(username); // 实现这个函数
//     // if (usernameExists) {
//     //     res.json({ isTaken: true });
//     // } else {
//     //     res.json({ isTaken: false });
//     // }
// });
//
// module.exports = router;


const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/dbConfig');

const { createUser, findUserByUsername, loginUser } = require('../modules/user');


router.get('/register', (req, res) => {
    const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png'];
    res.render('register', { avatars });
});

router.post('/register', async (req, res) => {
    console.log(req.body); // 打印请求主体，查看发送的数据

    try {
        const { username, password, realName, birthDate, description, avatar } = req.body; // 正确提取 password 及其他字段

        // 检查用户名是否已存在
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 检查 password 是否存在
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // 对密码进行散列
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        await createUser({
            username: username,
            password: hashedPassword,
            realName: realName,
            birthDate: birthDate,
            description: description,
            avatar: avatar
        });

        // 返回成功响应
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering new user' });
    }

});

// 登录页面路由
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await loginUser(username, password);

        if (result.success) {
            // 登录成功的处理，例如重定向到另一个页面
// 如果登录成功，不要立即重定向，而是返回一个JSON对象指示成功
            req.session.user = result.user;
            res.json({ success: true, redirectUrl: '/home' });


        } else {
            // 登录失败的处理，例如发送错误信息
            res.status(401).json({ message: 'Login failed' });
        }
    } catch (error) {
        // 捕获并处理在登录过程中可能发生的任何异常
        console.error('Login error:', error);
        if (!res.headersSent) { // 检查响应头是否已发送
            res.status(500).send('服务器错误');
        }
    }
});

// 登出操作
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Server error');
            } else {
                // 重定向到文章列表页面
                res.redirect('/articles');
            }
        });
    } else {
        // 如果会话不存在，直接重定向
        res.redirect('/articles');
    }
});

// 检查用户名是否存在路由
router.get('/check-username', async (req, res) => {
    try {
        const username = req.query.username;
        const user = await findUserByUsername(username);
        if (user) {
            res.json({ isTaken: true });
        } else {
            res.json({ isTaken: false });
        }
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ message: 'Error checking username' });
    }
})

router.post('/update', async (req, res) => {
    const userId = req.session.user.user_id; // 假设用户ID存储在会话中
    const { realName, birthDate, description, avatar } = req.body;

    try {
        const updateQuery = `
            UPDATE web_user
            SET real_name = ?, brith_day = ?, description = ?, avatar = ?
            WHERE user_id = ?`;
        await db.query(updateQuery, [realName, birthDate, description, avatar, userId]);

        // 更新会话中的用户信息
        req.session.user = { ...req.session.user, realName, birthDate, description, avatar };

        res.redirect('/user/profile'); // 或者重定向到其他确认页面
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error during account update.');
    }
});

router.get('/edit', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login'); // 用户未登录时重定向到登录页面
    }
    const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png']; // 假设头像列表
    res.render('editAccount', { user: req.session.user, avatars });
});

module.exports = router;
