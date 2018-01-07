const   config	= require("./config.json");
const 	mysql 	= require('mysql2');

const pool = mysql.createPool({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

exports.pool = pool;
