const {
  host,
  user,
  password,
  database
}	            = require("../config.json").mysql;
const mysql 	= require('mysql2');

const pool = mysql.createPool({
  host     : host ? host : null,
  user     : user ? user : null,
  password : password ? password : null,
  database : database ? database : null
});

exports.pool = pool;
