require("dotenv").config();
const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

const Pool = require("pg").Pool;

const { Client } = require("pg");
const client = new Client({
  user: process.env.USER,
  host: "localhost",
  database: process.env.DB,
  password: process.env.PASSWORD,
  dialect: "postgres",
  port: 9090,
});

const pool = new Pool({
  user: process.env.USER,
  host: "localhost",
  database: process.env.DB,
  password: process.env.PASSWORD,
  dialect: "postgres",
  port: 9090,
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected to client");
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});

app.get("/getusers", (req, res, next) => {
  pool.query("Select * from users").then((users) => {
    res.send(users.rows);
  });
});

app.post("/saveuser", (req, res) => {
  const { name, sobrenome, cpf, age, adress_id } = req.body;

  text =
    "INSERT INTO users (name, sobrenome, cpf, age, adress_id) VALUES($1, $2, $3, $4, $5) RETURNING *";

  values = [name, sobrenome, cpf, age, adress_id];

  client
    .query(text, values)
    .then((resp) => {
      res.json(resp.rows[0]);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.post("/saveadress", (req, res) => {
  const { bairro, numero, complemento, cidade } = req.body;

  text =
    "INSERT INTO adress (bairro, numero, complemento, cidade) VALUES($1, $2, $3, $4) RETURNING *";

  values = [bairro, numero, complemento, cidade];

  client
    .query(text, values)
    .then((resp) => {
      res.json(resp.rows[0]);
    })
    .catch((e) => {
      console.log(e);
    });
});

const server = app.listen(5000, function () {
  let host = server.address().address;
  let port = server.address().port;
});
