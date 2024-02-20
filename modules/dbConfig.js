const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST, // 从.env文件读取数据库主机地址
    user: process.env.DB_USER, // 数据库用户名
    password: process.env.DB_PASSWORD, // 数据库密码
    database: process.env.DB_NAME, // 数据库名称
});

async function query(sql, values) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql, values);
        return res;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end(); // 释放连接
    }
}

module.exports = {
    query
};
