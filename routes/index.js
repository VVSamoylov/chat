var express = require('express');
var router = express.Router();
const { Pool } = require("pg");
const pool = new Pool({
    user: "web",
    host: "localhost",
    database: "test",
    password: "web",
    port: 5432
  });
  console.log("подключися к базе данных");  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Наш чат' });
});

router.post('/login', function(req, res, next) {
  let userid;
  
  let login = req.body['login'];
  let password = req.body['password'];
  let sql = "select id as countuser from chatusers where login = $1 and password  = $2";
  console.log("login = " + login);
  console.log("password = " + password);
  try{
  pool.query(sql, [login, password], (err, result) => {
     if (err) {
      return console.error(err.message);
      }
      
      userid = result.rows[0].countuser;
      console.log(userid); //id пользователя
  
    });
  }catch(e){
    console.log("Авторизация не удалась");
  }

sql = 'select login, message, to_char(time, \'MM:DD:YYYY\') as time from message m join chatusers c on c.id = m."user" order by m."time" asc';

let arrMessage = [];
console.log(sql);
pool.query(sql, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
 console.log('query pool');
 console.log(result.rows)
  if(result.rows.length != 0){
    res.render('chat', { userid: userid, arrmes: result.rows });
    
  }

});

});


router.post('/addmessage', function(req, res, next) {

  let message = req.body['message'];
  let userid = req.body['id'];

  console.log(message + "  " + userid)
  let sql = 'insert into message  ("time", message, "user") values(localtimestamp, $1, $2)';
  
  console.log(sql);
  pool.query(sql, [message, userid], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
   
});

sql = 'select login, message, to_char(time, \'MM:DD:YYYY\') as time from message m join chatusers c on c.id = m."user" order by m."time" asc';

let arrMessage = [];
console.log(sql);
pool.query(sql, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
 
  if(result.rows.length != 0){
    res.render('chat', {userid: userid, arrmes: result.rows });
    
  }

});

});

/*
insert into message  ("time", message, "user") values(localtimestamp, 'aaaaaa', 1);

select "time" , message, c.login  from message m join chatusers c on m."user" = c.id  order by time asc;
*/
module.exports = router;
