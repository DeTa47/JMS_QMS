require('dotenv').config();
const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: process.env.CLOUD_HOST,
    user: process.env.CLOUD_DB_USER,
    password:process.env.CLOUD_DB_PWD,
    port:process.env.CLOUD_DB_PORT,
    database:process.env.CLOUD_DB
});

module.exports = mysqlPool;