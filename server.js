const express = require('express');
const passport =require('/passport')
let app = express()



app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.render('index')
})

app.listen(3000, function(){
  console.log('listening on 3000');
})



//SQL

/*  SERVER SQL
Server: sql7.freemysqlhosting.net
Name: sql7244511
Username: sql7244511
Password: wcUkbMcLNl
Port number: 3306
*/

//connection parameters
var con = mysql.createConnection({
  host: "sql7.freemysqlhosting.net",
  user: "sql7244511",
  password: "wcUkbMcLNl",
  database: "sql7244511"
});

//CREATE TABLE
// con.connect(function(err){
//     if (err) throw err;
//     console.log('connected to DB');
//     var sql = "CREATE TABLE customers (name VARCHAR(45))"
//     con.query(sql, function(err, result){
//         if(err) throw err;
//         console.log('table created');

//     })
// })

          //INSERT CLIENT INTO DB
function insertClient() {

  con.connect(function (err) {
      if (err) throw err;
      console.log('connected');
      var sql = "INSERT INTO client(login, password) VALUES ('Paul','paul')";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log('client ajouter')
      })
  })

}

          //STORAGE ADD
function insertStorage() {

  con.connect(function (err) {
      if (err) throw err;
      console.log('connected');
      var sql = "INSERT INTO storage (name, format, date, price, author) VALUES ('le seigneur des anneaux','DVD','2002-09-17','20','Peter Jackson')";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log('storage ajouter')
      })
  })
}

