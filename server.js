const express = require('express');

let app = express()



app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.render('index')
})

app.listen(3000, function(){
  console.log('listening on 3000');
})
