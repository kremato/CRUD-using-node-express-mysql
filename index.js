const path = require("path");
const express = require("express");
const app = express();
const mysql = require("mysql2");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fileupload = require('express-fileupload');
const { uploadImage, deleteImage } = require('./azure.js')

require('dotenv').config();

const APP_SERVER_PORT = process.env.port || 3000;
const DATABASE_HOST = process.env.database_host
const DATABASE_USER = process.env.database_user
const DATABASE_PASSWORD = process.env.database_password
const DATABASE = process.env.database
const DATABASE_PORT = process.env.database_port || 3306

const connection = mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE,
    port: DATABASE_PORT,
    ssl: { rejectUnauthorized: true }
});

connection.connect((error)=>{
    if(error) {
        console.log("There is some problem to connect DB: ", error);
    } else {
        console.log("Connected to DB");
    }
});

app.use('/uploadimg', express.static('./public/file_upload'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(fileupload());


app.get('/',(req,res)=>{
    let sql = "select * from admins";
    connection.query(sql,(err,data)=>{
        if(err) {
            console.log(err);
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

app.post('/save', async (req,res)=>{
    let image_url = '';
    if(req.files !== undefined && Object.keys(req.files).length > 0) {
        image_url = await uploadImage(req.files.sampleFile) 
    }
    let data = {name:req.body.name,email:req.body.email,mobile:req.body.mobile,image:image_url};
    let sql = "INSERT into admins SET ?";
    connection.query(sql,data,(err,result)=>{
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

const getAdminById = async (id) => {
    const sql = `SELECT * FROM admins WHERE id=${id}`;
    const data = await new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return data[0];
};


app.get('/edit/:userid',async (req,res)=>{
    let id = req.params.userid;
    user_data = await getAdminById(id)
    res.render('user_edit',{
                 'title':'Edit user',
                 user:user_data
             });
});

app.post('/update',async (req,res)=>{
    let image_url = '';
    if(req.files !== undefined && Object.keys(req.files).length > 0) {
        image_url = await uploadImage(req.files.sampleFile) 
    }
    let id = req.body.id;
    let sql = "UPDATE admins SET name='"+req.body.name+"',email='"+req.body.email+"',mobile='"+req.body.mobile+"',image='"+image_url+"' where id="+id;
    connection.query(sql,(err,_)=>{
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

app.get('/delete/:id',async (req,res)=>{
    let id = req.params.id;
    if(id>0 && id != '') {
        let imageUrl = (await getAdminById(id)).image
        let sql = "DELETE from admins where id="+id;
        connection.query(sql,(err,data)=>{
            if(err){
                console.log(err);
            } else {
                deleteImage(imageUrl.split('/').pop())
                res.redirect("/");
            }
        })
    }
})

app.listen(APP_SERVER_PORT,()=>console.log(`Server is listing to port ${APP_SERVER_PORT}`));