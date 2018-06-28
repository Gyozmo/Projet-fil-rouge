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
});

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
            console.log("ROWS: ", rows)
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                //req.flash('success', 'Registration successfully');
                //res.locals.message = req.flash();
                //res.render('login');
            }
            // if the user is found but the password is wrong
            console.log("HASH RESULT LENGTH: ", rows[0].password.length)
            console.log("RESULT: ", bcrypt.compareSync(password, rows[0].password));


            bcrypt.compare(password, rows[0].password, function (err, res) {
                if (err)
                        return done(err);
                if (res == false) {
                        console.log("res: ", res)
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        // all is well, return successful user
                    } else {
                        return done(null, rows[0], req.flash('loginMessage', 'User authentifié.'));
                    }
            });


            /*if ((!bcrypt.compareSync(password, rows[0].password)), function (err, res) {
                    console.log("res: ", res)
                    if (err)
                        return done(err);


                    if (res == false) {
                        console.log("res: ", res)
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        // all is well, return successful user
                    }
                }*/


           // )
                //return done(null, rows[0]);



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

//////////GESTION LOGIN////////////
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    function (req, res) {
        console.log("ICI: ",req.session.flash.loginMessage)
        res.render('index',{
            errorMsg: req.session.flash.loginMessage[0].toString()
        });
        req.session.flash.loginMessage = [];
    });

app.get('/login', function (req, res) {
    //var test = req.session.flash
    if (req.session.flash) {
        //console.log(req.session.flash.loginMessage[0]);
        res.render('login', {
            errorMsg: req.session.flash.loginMessage[0].toString()
        })
        req.session.flash.loginMessage = [];
        console.log(req.session.flash.loginMessage)
    } else {

        console.log("login page loaded")
        res.render('login', {
            errorMsg: ""
        })
    }
});

///////////GESTION SIGNIN///////////
app.get('/signin', function (req, res) {
    console.log("signin page loaded")
    let error = "";
    res.render('signin', {
        errorMsg: error
    });
});

app.post('/signin', function (req, res) {
    let user = req.body.username;
    let password = req.body.password;
    console.log(user, password)
    //Now we check if username already exist, if true we send an error "login already exists"
    con.query("select * from client where login = '" + user + "'", function (err, rows) {
        console.log("ROWS: ", rows)
        if (err)
            //return done(err);
            console.log(err)
        if (rows.length) {
            console.log("user already exists")
            let error = "Username déja utilisé";
            res.render('signin', {
                errorMsg: error
            })
            /*});*/

            //return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        } else {
            console.log("we can create user");
            bcrypt.hash(password, 10, function (err, hash) {
                // Store hash in your password DB.
                console.log('connected');
                var sql = "INSERT INTO client(login, password) VALUES (" + '"' + user + '","' + hash + '")';
                console.log(sql)
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log('utilisateur ajouté')
                });
            });
            res.redirect('/');
        }
    });

    //VIEW ADDCOMP
    // app.get('/addcomp', function(req, res){
    //     console.log("test")
    //     res.render('addcomp')
    // });



    //let hash = bcrypt.hashSync(password, 10);
    /*bcrypt.hash(password, 10, function (err, hash) {
        // Store hash in your password DB.
        con.connect(function (err) {
            if (err) throw err;
            //console.log('connected');
            var sql = "INSERT INTO client(login, password) VALUES (" + '"' + user + '","' + hash + '")';
            console.log(sql)
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log('utilisateur ajouté')
            })
        })
    });*/

});
/////////////////////////////////

app.get('/comp', function(req,res){
    res.render('comp')
})

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


//Genere un log lors des erreurs sql
con.on('error', function (err) {
    console.log("[mysql error]", err);
});
