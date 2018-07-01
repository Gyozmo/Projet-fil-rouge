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
    //console.log(req.user.login)
    res.render('index', {
        user: req.user.login
    })
});

app.listen(3000, function () {
    //console.log('listening on 3000');
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
        con.query(`SELECT * FROM client WHERE login = '${username}'`, function (err, rows) {
            ////console.log("ROWS: ", rows)
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
                    //console.log("bad password")
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
    con.query(`SELECT * FROM client WHERE idclient = ${id}`, function (err, rows) {
        done(err, rows[0]);
    });
});

//////////GESTION LOGIN////////////
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.render('index', {
            user: req.user.login
        });

    });

app.get('/login', function (req, res) {
    //console.log("login page loaded")
    res.render('login', {
        errorMsg: ''
    })
    //}
});

///////////GESTION SIGNIN///////////
app.get('/signin', function (req, res) {
    //console.log("signin page loaded")
    let error = "";
    res.render('signin', {
        errorMsg: error
    });
});

app.post('/signin', function (req, res) {
    //console.log(req.body.username, req.body.password)
    //Now we check if username already exist, if true we send an error "login already exists"
    con.query(`SELECT * FROM client WHERE login = '${req.body.username}'`, function (err, rows) {
        if (err)
            //return done(err);
            console.log(err)
        if (rows.length) {
            let error = "Username déja utilisé";
            res.render('signin', {
                errorMsg: error
            })
        } else {
            //console.log("we can create user");
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                // Store hash in your password DB.
                var sql = `INSERT INTO client(login, password) VALUES ('${req.body.username}', '${hash}')`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    //console.log('user added successfully')
                });
            });
            res.redirect('/');
        }
    });
});

//Deconnecte l'utilisateur
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
/////////////PASSPORT END////////////////////



//////// GESTION DES COMPETENCES//////////////////////////
//page Modifiez vos Competences
app.get('/comp', function (req, res) {
    res.render('comp')
});

//Reception et traitement des competences
app.post('/comp', function (req, res) {
    let sqldelete = `DELETE FROM note WHERE client_idclientvoter = ${req.user.idclient} AND client_idclientvotant = ${req.user.idclient}`;
    con.query(sqldelete, function (err, result) {
        //console.log(result)
        if (err) throw err;
        //console.log('ancienne notes votée supprimmées');
        //Insere les competences perso
        var sql = `INSERT INTO note (client_idclientvoter, client_idclientvotant, comp_idcomp, note) VALUES 
(${req.user.idclient}, ${req.user.idclient}, 1, ${req.body.comp1}),
(${req.user.idclient}, ${req.user.idclient}, 2, ${req.body.comp2}),
(${req.user.idclient}, ${req.user.idclient}, 3, ${req.body.comp3}),
(${req.user.idclient}, ${req.user.idclient}, 4, ${req.body.comp4}),
(${req.user.idclient}, ${req.user.idclient}, 5, ${req.body.comp5}),
(${req.user.idclient}, ${req.user.idclient}, 6, ${req.body.comp6}),
(${req.user.idclient}, ${req.user.idclient}, 7, ${req.body.comp7}),
(${req.user.idclient}, ${req.user.idclient}, 8, ${req.body.comp8}),
(${req.user.idclient}, ${req.user.idclient}, 9, ${req.body.comp9}),
(${req.user.idclient}, ${req.user.idclient}, 10, ${req.body.comp10})`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            //console.log('note ajoutée');
            res.redirect('/stat')
        });
    });
});

//Affiche la page des votes
app.get('/compVote', function (req, res) {
    var sql = `SELECT * FROM client WHERE login != '${req.user.login}'`;
    con.query(sql, function (err, userlist) {
        res.render('compVote', {
            users: userlist
        })
    });
});

//Recupere les votes et les insert dans la db
app.post('/compVote', function (req, res) {
    let sqldelete = `DELETE FROM note WHERE client_idclientvoter = ${req.body.idVoted} AND client_idclientvotant = ${req.user.idclient}`;
    con.query(sqldelete, function (err, result) {
        if (err) throw err;
        //console.log('ancienne notes votée supprimées');
        let sql = `INSERT INTO note (client_idclientvoter, client_idclientvotant, comp_idcomp, note) VALUES 
(${req.body.idVoted}, ${req.user.idclient}, 1, ${req.body.comp1}),
(${req.body.idVoted}, ${req.user.idclient}, 2, ${req.body.comp2}),
(${req.body.idVoted}, ${req.user.idclient}, 3, ${req.body.comp3}),
(${req.body.idVoted}, ${req.user.idclient}, 4, ${req.body.comp4}),
(${req.body.idVoted}, ${req.user.idclient}, 5, ${req.body.comp5}),
(${req.body.idVoted}, ${req.user.idclient}, 6, ${req.body.comp6}),
(${req.body.idVoted}, ${req.user.idclient}, 7, ${req.body.comp7}),
(${req.body.idVoted}, ${req.user.idclient}, 8, ${req.body.comp8}),
(${req.body.idVoted}, ${req.user.idclient}, 9, ${req.body.comp9}),
(${req.body.idVoted}, ${req.user.idclient}, 10, ${req.body.comp10})`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            //console.log('note votée ajoutée');
            res.redirect('/stat');
        });
    });
});

//Recupere les notes perso et les votes sur la db, et les affiche
app.get('/stat', function (req, res) {
    //console.log("page stat request");
    let idclient = req.user.idclient;
    //requete vers notes perso
    let sql = `SELECT * FROM note WHERE client_idclientvoter = ${idclient} AND client_idclientvotant = ${idclient}`;
    //requete vers notes votée
    let sqlVote = `
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 1)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 2)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 3)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 4)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 5)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 6)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 7)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 8)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 9)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 10)`;
    //Lancement des requetes
    let compArr;
    con.query(sql, function (err, result) {
        if (err) throw err;
        ////console.log(result)
        if (result[0]) {
            compArr = [Number(result[0].note),
                       Number(result[1].note),
                       Number(result[2].note),
                       Number(result[3].note),
                       Number(result[4].note),
                       Number(result[5].note),
                       Number(result[6].note),
                       Number(result[7].note),
                       Number(result[8].note),
                       Number(result[9].note)];
        }
        con.query(sqlVote, function (err, result2) {
            //if (err) res.redirect('/comp');//throw err;
            let voteArr = [Number(result2[0].avg),
                       Number(result2[1].avg),
                       Number(result2[2].avg),
                       Number(result2[3].avg),
                       Number(result2[4].avg),
                       Number(result2[5].avg),
                       Number(result2[6].avg),
                       Number(result2[7].avg),
                       Number(result2[8].avg),
                       Number(result2[9].avg)]
            ////console.log(result)
            if (result.length) {
                res.render('stat', {
                    title: "Statistiques",
                    user: req.user.login,
                    dataUser: compArr,
                    dataVote: voteArr
                });
            } else {
                res.redirect('/comp')
            }
        });
    });
});

//Afficher la page Comparatif
app.get('/comparatif', function (req, res) {
    console.log(req);
    let idclient = req.user.idclient;
    //let idclient = req.body.idVoted
    //requete vers notes perso
    let sql = `SELECT * FROM note WHERE client_idclientvoter = ${idclient} AND client_idclientvotant = ${idclient}`;
    //requete vers notes votée
    let sqlVote = `
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 1)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 2)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 3)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 4)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 5)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 6)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 7)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 8)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 9)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 10)`;
    //Lancement des requetes
    let compArr;
    con.query(sql, function (err, result) {
        if (err) throw err;
        ////console.log(result)
        if (result[0]) {
            compArr = [Number(result[0].note),
                       Number(result[1].note),
                       Number(result[2].note),
                       Number(result[3].note),
                       Number(result[4].note),
                       Number(result[5].note),
                       Number(result[6].note),
                       Number(result[7].note),
                       Number(result[8].note),
                       Number(result[9].note)];
        }
        con.query(sqlVote, function (err, result2) {
            //if (err) res.redirect('/comp');//throw err;
            let voteArr = [Number(result2[0].avg),
                       Number(result2[1].avg),
                       Number(result2[2].avg),
                       Number(result2[3].avg),
                       Number(result2[4].avg),
                       Number(result2[5].avg),
                       Number(result2[6].avg),
                       Number(result2[7].avg),
                       Number(result2[8].avg),
                       Number(result2[9].avg)]
            ////console.log(result)
            var sql = `SELECT * FROM client WHERE login != '${req.user.login}'`;
            con.query(sql, function (err, userlist) {
                console.log(userlist)
                /*res.render('compVote', {
                users: userlist
                });*/
            
                if (result.length) {
                    
                    res.render('comparatif', {
                        title: "Compara",
                        user: req.user.login,
                        dataUser: compArr,
                        dataVote: voteArr,
                        users: userlist
                    });
                } else {
                    res.redirect('/comp')
                }
            });
        });
    });
});

app.post('/voir',function (req, res) {
    console.log(req.body.idVoted)
    let idclient = req.body.idVoted;
    //let idclient = req.body.idVoted
    //requete vers notes perso
    let sql = `SELECT * FROM note WHERE client_idclientvoter = ${idclient} AND client_idclientvotant = ${idclient}`;
    //requete vers notes votée
    let sqlVote = `
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 1)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 2)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 3)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 4)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 5)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 6)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 7)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 8)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 9)
UNION ALL
SELECT AVG(note) AS avg FROM note WHERE ( client_idclientvoter = ${idclient} AND client_idclientvotant != ${idclient} AND comp_idcomp = 10)`;
    //Lancement des requetes
    let compArr;
    con.query(sql, function (err, result) {
        if (err) throw err;
        ////console.log(result)
        if (result[0]) {
            compArr = [Number(result[0].note),
                       Number(result[1].note),
                       Number(result[2].note),
                       Number(result[3].note),
                       Number(result[4].note),
                       Number(result[5].note),
                       Number(result[6].note),
                       Number(result[7].note),
                       Number(result[8].note),
                       Number(result[9].note)];
        }
        con.query(sqlVote, function (err, result2) {
            //if (err) res.redirect('/comp');//throw err;
            let voteArr = [Number(result2[0].avg),
                       Number(result2[1].avg),
                       Number(result2[2].avg),
                       Number(result2[3].avg),
                       Number(result2[4].avg),
                       Number(result2[5].avg),
                       Number(result2[6].avg),
                       Number(result2[7].avg),
                       Number(result2[8].avg),
                       Number(result2[9].avg)]
            ////console.log(result)
            var sql = `SELECT * FROM client WHERE login != '${req.user.login}'`;
            con.query(sql, function (err, userlist) {
                console.log(userlist)
                /*res.render('compVote', {
                users: userlist
                });*/
            
                if (result.length) {
                    
                    res.render('comparatif', {
                        title: "Compara",
                        user: req.user.login,
                        dataUser: compArr,
                        dataVote: voteArr,
                        users: userlist
                    });
                } else {
                    res.redirect('/compVote')
                }
            });
        });
    });
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
    //console.log("[mysql error]", err);
});

///////////// SQL END ////////////////////
