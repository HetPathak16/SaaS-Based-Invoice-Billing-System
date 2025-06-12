const mysql =require('mysql2');

const pool=mysql.createPool({
    host:"localhost",
    user:"root",
    password:'Het@2003',
    database:'SaaS-based Invoice & Billing System',
    connectionLimit:10
});

module.exports=pool;