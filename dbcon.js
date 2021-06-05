var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_peterja7',
  password        : '97701',
  database        : 'cs340_peterja7'
});
module.exports.pool = pool;
