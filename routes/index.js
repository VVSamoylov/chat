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
  
  let login = req.body['login'];
  let password = req.body['password'];
  let sql = `select id as countuser from chatusers where login = '${login}' and password  = '${password}'`;
  console.log("login = " + login);
  console.log("password = " + password);
  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
   
    if(result.rows[0]== undefined){
      res.render('index', { title: 'Наш чат' });
      
    }
    console.log(result.rows[0].countuser); //id пользователя
  res.render('chat', { iduser: result.rows[0].countuser });
})


});


router.post('/addmessage', function(req, res, next) {

  let message = req.body['message'];
  let userid = req.body['id'];

  console.log(message + "  " + userid)

  res.render('chat', { iduser: userid });


});


/*
insert into message  ("time", message, "user") values(localtimestamp, 'aaaaaa', 1);

select "time" , message, c.login  from message m join chatusers c on m."user" = c.id  order by time asc;
*/
module.exports = router;
