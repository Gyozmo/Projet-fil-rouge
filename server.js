const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
let app = express();
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

app.get('/', loggedIn, function (req, res) {
    console.log(req.user.login)
    res.render('index', {
        user: req.user.login
    })
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
            //console.log("ROWS: ", rows)
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false);
            }
            // if the user is found but the password is wrong
            bcrypt.compare(password, rows[0].password, function (err, res) {
                if (err)
                    return done(err);
                if (res == false) {
                    console.log("bad password")
                    return done(null, false);
                } else {
                    // all is well, return successful user
                    return done(null, rows[0]);
                }
            });
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
        failureRedirect: '/login'
    }),
    function (req, res) {
        console.log(req.user)
        res.render('index', {
            user: req.user.login
        });

    });

app.get('/login', function (req, res) {
    console.log("login page loaded")
    res.render('login', {
        errorMsg: ''
    })
    //}
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
        //console.log("ROWS: ", rows)
        if (err)
            //return done(err);
            console.log(err)
        if (rows.length) {
            let error = "Username déja utilisé";
            res.render('signin', {
                errorMsg: error
            })
        } else {
            console.log("we can create user");
            bcrypt.hash(password, 10, function (err, hash) {
                // Store hash in your password DB.
                var sql = "INSERT INTO client(login, password) VALUES (" + '"' + user + '","' + hash + '")';
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log('added user successfully')
                });
            });
            res.redirect('/');
        }
    });
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
/////////////PASSPORT END////////////////////



//////// GESTION DES COMPETENCES//////////////////////////
////partie guillaume
app.get('/comp', function (req, res) {
    res.render('comp')
});

app.post('/comp', function (req, res) {
    //let compValue1 = req.body.comp1; //10 variables ? -_-
    //con.connect(function (err) {
        //if (err) throw err;
       // console.log('connected');
        var sql = 'INSERT INTO note (client_idclientvoter, client_idclientvotant, comp_idcomp, note) VALUES (' + req.user.idclient + ',' + req.user.idclient + ',' +
            1 + ',' + req.body.comp1 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            2 + ',' + req.body.comp2 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            3 + ',' + req.body.comp3 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            4 + ',' + req.body.comp4 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            5 + ',' + req.body.comp5 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            6 + ',' + req.body.comp6 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            7 + ',' + req.body.comp7 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            8 + ',' + req.body.comp8 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            9 + ',' + req.body.comp9 + '),(' + req.user.idclient + ',' + req.user.idclient + ',' +
            10 + ',' + req.body.comp10 + ')';


        console.log(sql)



        //var sql = "INSERT INTO note (client_idclientvoter, client_idclientvotant, comp_idcomp, note) VALUES ('1','1','1','20')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log('note ajoutée')
        });
    });

    /*con.query("SELECT * FROM `comp`", function () {
        //console.log(query)
    })


    console.log(compValue1)

    res.redirect('/comp')*/
//});

/////partie philippe
app.get('/compVote', function (req, res) {
    res.render('compVote')
});

app.get('/stat', function (req, res) {
    console.log("page stat request");
    let idclient = req.user.idclient;
    var sql = "SELECT * FROM note WHERE client_idclientvoter = " + idclient + " AND client_idclientvotant = " + idclient;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("RESULT NOTES", result[0].note)
        let compArr = [Number(result[0].note),
                       Number(result[1].note),
                       Number(result[2].note),
                       Number(result[3].note),
                       Number(result[4].note),
                       Number(result[5].note),
                       Number(result[6].note),
                       Number(result[7].note),
                       Number(result[8].note),
                       Number(result[9].note)];
        console.log(compArr)
        let voteArr = [50, 30, 45, 70, 20, 60, 50, 50, 50, 50];
        res.render('stat', {
        title: "Statistiques",
        user: req.user.login,
        dataUser: compArr,
        dataVote: voteArr
    });
    });
    
    
    //recupNote(req.user.idclient)
    //let compArr = [50, 30, 45, 70, 20, 60, 50, 50, 50, 50];
    //let voteArr = [50, 30, 45, 70, 20, 60, 50, 50, 50, 50];
    
});






/////////// FUNCTION //////////////
//check if user is logged in
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


//////////// SQL ///////////////////////
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

function recupNote(idclient) {

    //con.connect(function (err) {
    //if (err) throw err;
    //console.log('connected');
    var sql = "SELECT * FROM note WHERE client_idclientvoter = " + idclient + " AND client_idclientvotant = " + idclient;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("RESULT NOTES", result)
    })
    //})
}

///////////// SQL END ////////////////////
