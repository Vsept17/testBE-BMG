const mySQL = require("mysql");

const {HOST, DB_USER, DB_PASSWORD, DB} = process.env;

const db = mySQL.createConnection({
    host: HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB,
})

db.connect(err => {
    if (err) throw err;
    console.log("Database Connected");
})

module.exports = db;