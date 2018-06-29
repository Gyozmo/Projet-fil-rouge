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


//CREATE TABLE
/* con.connect(function(err){
     if (err) throw err;
     console.log('connected to DB');
     var sql = "ALTER TABLE client MODIFY password VARCHAR(128) NOT NULL DEFAULT '{}'"
     con.query(sql, function(err, result){
         if(err) throw err;
         console.log('table created');

     })
 })*/


        //COMP ADD
 function insertComp() {

    con.connect(function (err) {
        if (err) throw err;
        console.log('connected');
        var sql = "INSERT INTO comp (compname) VALUES ('maquetter une application')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log('comp ajoutée')
        })
    })
}
 
//insertComp() //COMP CALL


        //NOTE ADD
function insertNote() {

    con.connect(function (err) {
        if (err) throw err;
        console.log('connected');
        var sql = "INSERT INTO note (client_idclientvoter, client_idclientvotant, comp_idcomp, note) VALUES ('1','1','1','20')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log('note ajoutée')
        })
    })
}

// insertNote();     //COMP CALL

//RECUPERER NOTES
function recupNote() {

    con.connect(function (err) {
        if (err) throw err;
        console.log('connected');
        var sql = "SELECT * FROM note WHERE login = '" + req.login.user + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result)
        })
    })
}


//Genere un log lors des erreurs sql
con.on('error', function (err) {
    console.log("[mysql error]", err);
});
