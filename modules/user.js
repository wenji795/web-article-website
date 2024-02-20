const db = require('./dbConfig'); // 确保这里正确引入了您的数据库配置文件
const bcrypt = require('bcrypt');

/**
 * 创建新用户并插入到数据库中
 * @param {Object} userData 用户数据对象
 * @returns {Object} 插入的用户数据
 */
exports.createUser = async (userData) => {
    const { username, password, realName, birthDate, description, avatar } = userData;
    if (!username || !password || !realName || !birthDate || !description || !avatar) {
        throw new Error('Missing required fields');
    }

    try {
        // 注意 SQL 语句中列名与您的数据库定义一致，这里使用 user_name 而不是 username
        const result = await db.query(
            'INSERT INTO web_user (user_name, password, real_name, brith_day, description, avatar, create_date, update_date) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [username, password, realName, birthDate, description, avatar]
        );
        return result[0]; // 根据您使用的 SQL 客户端库，这里可能需要调整
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

/**
 * 根据用户名查找用户
 * @param {string} username 用户名
 * @returns {Object|null} 查找到的用户数据或null
 */
exports.findUserByUsername = async (username) => {
    try {
        // 使用正确的列名 user_name
        const result = await db.query(
            'SELECT * FROM web_user WHERE user_name = ?',
            [username]
        );
        return result[0] || null; // 根据您使用的 SQL 客户端库，这里可能需要调整
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

exports.loginUser = async (username, password) => {
    try {
        console.log(`Attempting to login user: ${username}`); // 打印尝试登录的用户名

        // 从数据库查询用户信息
        const userResult = await db.query(
            'SELECT * FROM web_user WHERE user_name = ?',
            [username]
        );

        const user = userResult[0]; // 根据您使用的 SQL 客户端库调整
        console.log('User found from DB:', user); // 打印数据库查询到的用户信息

        if (!user) {
            console.log('No user found with the username:', username); // 如果未找到用户，打印日志
            return { success: false, message: 'Login failed: Incorrect username or password.' };
        }

        // 比较密码
        const match = await bcrypt.compare(password, user.password);
        console.log('Password match result:', match); // 打印密码比较结果

        if (match) {
            // 登录成功逻辑，例如设置 session 或 token
            console.log('Login successful for user:', username); // 登录成功，打印日志
            return { success: true, message: 'Login successful', user: user};
        } else {
            console.log('Password does not match for user:', username); // 密码不匹配，打印日志
            return { success: false, message: 'Login failed: Incorrect username or password.' };
        }
    } catch (error) {
        console.error('Login error:', error); // 打印遇到的错误
        return { success: false, message: 'Server error during login.' };
    }
};