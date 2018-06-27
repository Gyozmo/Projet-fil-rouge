const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
let app = express();
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index')
})

app.listen(3000, function () {
    console.log('listening on 3000');
})

///////PASSPORT//////////////

//new local strategie with username and password
passport.use('local', new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) { // callback with username and password from our form
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        con.query("select * from client where login = '" + username + "'", function (err, rows) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong

            /*if (!(rows[0].password == password))*/
            console.log(rows[0].password)
            console.log("RESULT: ",bcrypt.compareSync(password, rows[0].password))
            if ((!bcrypt.compareSync(password, rows[0].password, function (err, res) {
                    console.log("res: ", res)
                })))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);
        })
    }))



// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.idclient);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    con.query("select * from client where idclient = " + id, function (err, rows) {
        done(err, rows[0]);
    });
});

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/login', function (req, res) {
    console.log("login page loaded")
    res.render('login')
});

app.get('/signin', function (req, res) {
    console.log("login page loaded")
    res.render('signin')
});

app.post('/signin', function (req, res) {
    //console.log(req.body.username,req.body.usermail,req.body.userpassword)
    let user = req.body.username;
    let password = req.body.password;
    console.log(user, password)
    //let hash = bcrypt.hashSync(password, 10);
    bcrypt.hash(password, 10, function (err, hash) {
        // Store hash in your password DB.
        con.connect(function (err) {
            if (err) throw err;
            //console.log('connected');
            var sql = "INSERT INTO client(login, password) VALUES (" + '"' + user + '","' + hash + '")';
            console.log(sql)
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log('client ajouter')
            })
        })
    });

    res.redirect('/');
});


/////////////PASSPORT END////////////////////



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
