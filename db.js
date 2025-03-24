import mysql from 'mysql2';

const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database:"mydb",
})

db.connect(err=>{
    if(err){
        return console.log("error connecting db", err);
    }
    console.log("db connected");
});

export default db;