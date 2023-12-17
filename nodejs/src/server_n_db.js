const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const util = require("util");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { csrfSync } = require('csrf-sync');
const { query, validationResult, matchedData , body} = require('express-validator');

const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();

const session = require("express-session");

// Configure session middleware
app.use(session({
  secret: "tqb7skSsJ8EeCGEw6sdafvQCsOUAs5dtYsS9T8pCKXvcpl71fZcO4JDZGEH",
  resave: false,
  saveUninitialized: true,
}));

// Configure CSRF protection
const {
  invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
  generateToken, // Use this in your routes to generate, store, and get a CSRF token.
  getTokenFromRequest, // use this to retrieve the token submitted by a user
  getTokenFromState, // The default method for retrieving a token from state.
  storeTokenInState, // The default method for storing a token in state.
  revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
  csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync();

// Attach CSRF protection middleware to all routes after session middleware
app.use(csrfSynchronisedProtection);

app.use(express.json());

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const access = fs.createWriteStream(path.join(__dirname, "./output.log"), {
  flags: "w",
});

console.log = function (d) {
  //
  access.write(util.format(d) + "\n");
};

const logFile = fs.createWriteStream(path.join(__dirname, "./access.log"), {
  flags: "a",
});
app.use(morgan({ stream: logFile }));

app.use(express.static(path.join(__dirname , '/public')));

/* Postgres DB Connection. Follow the documentation: https://node-postgres.com */
const { Client } = require("pg");

const DB_CONNECTION = {
  user: "discite-database",
  database: "discite-database",
  password: "discite-database",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
};

let client;
let sql_connect_tries = 0;
let server_stats = {active_users:0, all_users:0, all_time_spent_ms:0};

async function connectSql() {
  try {
    client = new Client(DB_CONNECTION);
    client.connect(error => {
      if (error) {
        if (sql_connect_tries > 3){
          console.error("Error connecting to the database (tries "+sql_connect_tries+") :", error);
        }else{
          console.log("Database not yet initialized (tries "+sql_connect_tries+")");
        }
        setTimeout(connectSql, sql_connect_tries * 200);
        sql_connect_tries++;
      }else{
        console.log("Connected to the database");
      }
    });
  } catch (error) {
    console.error("Error connecting to the database (tries "+sql_connect_tries+") :", error);
    setTimeout(connectSql, sql_connect_tries * 200);
    sql_connect_tries++;
  }
}


let render = function (req, res, name){
  req.token= generateToken(req)
  if (req.session?.user?.data != undefined) {
    res.render(name, {info: "info", server_stats, req, data: req.session.user.data});
  } else {
    res.render(name, {info: "info", server_stats, req});
  }
}

const login = async (req, res) => {
  try {
    // Validate user input
    await Promise.all([
      query('username').notEmpty().escape().trim().run(req),
      query('password').notEmpty().escape().trim().run(req),
    ]);
    const errors = validationResult(req);
    console.log(req.query)
    if (!errors.isEmpty()) {
      console.log(errors)
      req.errors = JSON.stringify(errors);
      return render(req, res, 'pages/index');
    }

    const password = req.query.password;
    const username = req.query.username;

    // Insert user data into the database
    const sql = `SELECT * FROM users WHERE username = '${username}';`;

    client.query(sql, (err, result) => {
      if (err) {
        console.log(err.stack);
        req.errors = JSON.stringify(err);
        return render(req, res, 'pages/index');
      } else {
        if (result.rows.length > 0) {
          console.log(result.rows[0])
          const hashedPassword = hashPassword(password, result.rows[0].salt);
          console.log(hashedPassword +" and "+  result.rows[0].password)
          if (hashedPassword != result.rows[0].password) {
            return res.redirect(`/index?wrong_password=1`);
          }
          json_data = result.rows[0].json_val;
          if (json_data == null || json_data == undefined || json_data == "null" || json_data == "undefined") {
            json_data = {name:username,email: result.rows[0].email,  max_score:0};
          }
          json_data['login_time'] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ' ');
          // Store user data in the session
          req.session.user = { username: username, data: json_data};
          server_stats.active_users++;
          server_stats.all_users++;
          return res.redirect(`/main?success=1`);
        } else {
          return res.redirect(`/index?wrong_password=1`);
        }
      }
    });

  } catch (error) {
    console.error(error);
    req.errors = JSON.stringify(error);
    render(req, res, 'pages/index');
  }
};

const register = async (req, res) => {
  try {
    // Validate user input
    await Promise.all([
      query('username')
        .notEmpty()
        .escape()
        .trim()
        .isLength({ min: 1, max: 32 }) // Enforce the max length of 32 characters
        .custom(value => !/\s/.test(value)) // Check for spaces
        .run(req),
      query('password')
        .notEmpty()
        .escape()
        .trim()
        .isLength({ min: 1, max: 512 }) // Enforce the max length of 512 characters
        .custom(value => !/\s/.test(value)) // Check for spaces
        .run(req),
      query('email')
        .notEmpty()
        .escape()
        .trim()
        .isEmail()
        .isLength({ min: 1, max: 256 }) // Enforce the max length of 512 characters
        .custom(value => !/\s/.test(value)) // Check for spaces
        .run(req),
    ]);
    const errors = validationResult(req);
    console.log(req.query)
    if (!errors.isEmpty()) {
      console.log(errors)
      req.errors = JSON.stringify(errors);
      return render(req, res, 'pages/index');
    }

    const password = req.query.password;
    const username = req.query.username;
    const email = req.query.email;
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash the password (you should use a secure password hashing library)
    const hashedPassword = hashPassword(password, salt);

    // Insert user data into the database
    const sql = `insert into users (username, password, salt, email) values ('${username}',  '${hashedPassword}', '${salt}', '${email}');`;
    console.log(sql)
    client.query(sql, (err, result) => {
      if (err) {
        console.log(err.stack);
        req.errors = JSON.stringify(err);
        return render(req, res, 'pages/index');
      } else {
        res.redirect(`/index?reg_success=1`);
      }
    });

  } catch (error) {
    console.error(error);
    req.errors = JSON.stringify(error);
    render(req, res, 'pages/index');
  }
};


// Function to hash a password with a salt using bcrypt
function hashPassword(password, salt) {
  console.log("salt= " + salt+ " and password= " + password);
  if (salt == "" || salt == undefined || salt == null || salt == "null") {
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    salt = bcrypt.genSaltSync(saltRounds);
    console.log("redo: salt= " + salt+ " and password= " + password);
  }
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function logout(req, res) { 
  var data = req.session.user.data;
  var old_date = new Date(data['login_time']);
  var current_date = new Date();
  var time_diff_ms = current_date - old_date;
  server_stats.active_users--;
  server_stats.all_time_spent_ms += time_diff_ms;

  req.session.destroy(function(err){  
    if(err){  
        console.log(err);  
        res.redirect('/index'); 
    }  
    else  
    {  
        res.redirect('/index');  
    }  
  });
}

function upload_json(req, jsonData) {
  return new Promise((resolve, reject) => {
    try {
      const username = req.session.user.username;
      
      // Use a parameterized query for safe database interactions
      const sql = `UPDATE users SET json_val = $1 WHERE username = $2`;

      client.query(sql, [jsonData, username], (err, result) => {
        if (err) {
          console.log(err.stack);
          req.errors = JSON.stringify(err);
          reject(err); // Reject the promise on error
        } else {
          resolve(true); // Resolve the promise on success
        }
      });

    } catch (error) {
      console.error(error);
      req.errors = JSON.stringify(error);
      reject(error); // Reject the promise on error
    }
  });
}

let is_authenticated = function(req, res, should_redirect = false){
  if (req.session.user) {
    const username = req.session.user.username;
    return true;
  } else {
    if (should_redirect) res.redirect("/index?&not_authenticated=1");
    return false;
  }
}


let csrf_valid = function(req, res, should_redirect = false){
  if (req.query.CSRFToken == undefined || req.query.CSRFToken == null || req.query.CSRFToken == "" || req.query.CSRFToken !== req.session.csrfToken) {
    console.log("Wrong CSRF token= " + req.query['CSRFToken']+ " and session= " + req.session.csrfToken)
    if (should_redirect) res.redirect("/index?&wrong_csrf=1");
    return false
  }else{
    console.log("good token")
    return true
  }
}

let start_server = function(){
  connectSql();
  app.listen(port, () => console.log(`Discite app listening on port ${port}!`));
}  

module.exports ={
  app, start_server, csrf_valid, render, login, register, is_authenticated, logout, upload_json
}