require('dotenv').config();
const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:process.env.DB_PD,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
});

module.exports = mysqlPool;