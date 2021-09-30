# CRUD-using-node-express-mysql
This repository contains code for CRUD using NodeJS ExpressJS MySQL database. Here we are going to use Express Framework and EJS as a template engine to build a CRUD operation. For CRUD operation we will use HTTP Methods to make our application. We will post and retrieving data using MySQL database.

Follow these steps to create same project for practise:<br/>
Step 1: Install nodeJs package and Init application<br/>
Step 2: Create an applicate folder and init the project using the following command. <b>npm init</b><br/>
Step 3: Install required packages using NPM like Express,body-parser,mysql,ejs<br/>
Step 4: Create index.js file<br/>
Step 5: Create a Database table and then create database Connection<br/>

Here we are using mysql database table admins. <br/>
You can create above table using below mysql Query:<br/>

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;


ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
  <br/><br/>
  After all set up, Run the project using Below command in terminal:
  <b>node index</b>
