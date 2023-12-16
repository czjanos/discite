const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const util = require("util");
const path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();

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

const logFile = fs.createWriteStream(path.join(__dirname, "./acces.log"), {
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

const client = new Client(DB_CONNECTION);
client.connect();

const printQueryResultsWithTitle = (title) => (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log(title);
    console.log(res.rows);
  }
};

client.query(
  "SELECT * from messages",
  printQueryResultsWithTitle("\n\n == Messages Contents == \n")
);
client.query(
  "SELECT * from books",
  printQueryResultsWithTitle("\n\n == Books Contents == \n")
);

/* Web server configurations to receive requests */
app.get("/", async (req, res) => {
  res.render("pages/index");
});

let tries = 0;

app.get("/flag-quiz", async (req, res) => {
  tries++;
  res.render("pages/flag-quiz", {tries});
});

app.get("/flag-memory", async (req, res) => {
  tries++;
  res.render("pages/flag-memory", {tries});
});

app.get("/games", async (req, res) => {
  res.render("pages/game-selector");
});

app.get("/register", async (req, res) => {
  res.render("pages/register");
  // res.send(`
  //   <form action="/register" method="post">
  //     <label for="name">Name:</label>
  //     <input type="text" id="name" name="name" required>
  //     <button type="submit">Submit</button>
  //   </form>
  // `)
});

// app.post('/register', (req, res) => {
//   const name = req.body.name || 'World';
//   res.render("pages/register");
// })
/*
app.get("/part1_vulnerable", (req, res) => {
  res.render("pages/part1_vulnerable_results", { ...req.query });
});*/


app.listen(port, () => console.log(`Discite app listening on port ${port}!`));
