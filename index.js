import express from "express";
import path from "path";
import session from "cookie-session";
import crypto from "crypto";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
const port = 8008;
const publicPath = path.resolve("static-path");

app.use(express.static(publicPath));
app.set("view engine", "ejs");

import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));

import mysql from "mysql";
// MySQL Connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "aplikasi_online_voting",
});

const dbConnect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

const conn = await dbConnect();

app.listen(port, () => {
  console.log("App started");
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/", async (req, res) => {
  res.render("dashboard");
});

app.get("/requested", async (req, res) => {
  res.render("requested");
});
app.get("/result", async (req, res) => {
  res.render("result");
});

const getElections = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT electionID, title, description FROM election";
    pool.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// app.get('/dashboard', async (req, res) => {
//     try {
//         // Get the list of elections
//         const elections = await getElections();

//         // Pass the election data to the view
//         res.render('dashboard', { elections });
//     } catch (error) {
//         console.error('Error fetching data from the database:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});
