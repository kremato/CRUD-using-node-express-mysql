const path = require("path");
const express = require("express");
const app = express();
const mysql = require("mysql");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const PORT = process.env.port || 3000;

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database: 'test_db'
});

connection.connect((error)=>{
    if(error) {
        console.log("There is some problem to connect DB.");
    } else {
        console.log("Connected to DB");
    }
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    let sql = "select * from admins";
    let query = connection.query(sql,(err,data)=>{
        if(err) {
            throw err;
        } else {
            res.render('index',{
                title:'CRUD operation using Node.js / ExpressJs / Mysql',
                users:data
            });
        }
    });
});

app.get('/add',(req,res)=>{
    res.render('user_add',{
        title:'Add new User'
    });
})

app.post('/save',(req,res)=>{
    let data = {name:req.body.name,email:req.body.email,mobile:req.body.mobile};
    let sql = "INSERT into admins SET ?";
    let query = connection.query(sql,data,(err,result)=>{
        if(err) {
            throw err;
        } else {
            res.redirect('/');
        }
    })
});

app.get('/edit/:userid',(req,res)=>{
    let id = req.params.userid;
    let sql = `Select * from admins where id=${id}`;
    let query = connection.query(sql,(err,data)=>{
        if(err) {
            throw err;
        } else {
            res.render('user_edit',{
                'title':'Edit user',
                user:data[0]
            });
        }
    });
});

app.post('/update',(req,res)=>{
    let id = req.body.id;
    let sql = "UPDATE admins SET name='"+req.body.name+"',email='"+req.body.email+"',mobile='"+req.body.mobile+"' where id="+id;
    let query = connection.query(sql,(err,data)=>{
        if(err) {
            throw err;
        } else {
            res.redirect("/");
        }
    });
});

app.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    if(id>0 && id != '') {
        let sql = "DELETE from admins where id="+id;
        let query = connection.query(sql,(err,data)=>{
            if(err){
                throw err;
            } else {
                res.redirect("/");
            }
        })
    }
})

app.listen(PORT,()=>console.log(`Server is listing to port ${PORT}`));