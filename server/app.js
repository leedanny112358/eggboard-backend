const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());
app.use(function (error, request, response, next) {
  console.log("Error handler: ", error);
  // Send an error message to the user.
  response.status(500).json({ error: error.message });
});

// create connection to ClearDB database 
const db = mysql.createPool({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b7b9992404b96d",
  password: "0178d97f",
  database: "heroku_620aa052fdc6f48",
});

// confirm connection with MySQL
db.getConnection((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

// new post
app.post("/newpost", (req, res) => {
  let post = req.body;
  let sql = "INSERT INTO posts SET ?";
  db.query(sql, post, (err, result) => {
    if (err) {
      res.status("400").send(err.sqlMessage);
      console.log(err.sqlMessage);
    } else {
      res.send("New post created");
    }
  });
});

// get all posts
app.get("/posts", (req, res) => {
  let sql = "SELECT * FROM posts";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// filter posts 
// if GET to /filter?tag1=Java&tag2=Frontend&tag3=Open%20source
// then req.query = {tag1: "Java", tag2: "Frontend", tag3: "Open source"}
app.get("/filter", (req,res) => {
  let tag1 = req.query.tag1;
  let tag2 = req.query.tag2.replace(/%20/g, ' ');
  let tag3 = req.query.tag3.replace(/%20/g, ' ');
  let sql = `SELECT * FROM posts WHERE tag1 = ${tag1} OR tag2 = ${tag2} OR tag3 = ${tag3}`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// delete post
app.get("/deletepost/:id/:passcode", (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id} AND passcode = ${req.params.passcode}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      res.status("400").send(err.sqlMessage);
    } else if (result.affectedRows > 0) {
      res.status("200").send("Post deleted");
    } else {
      res.status("400").send("You have the wrong passcode");
    }
  });
});

// send listening message
app.listen(process.env.PORT || "5000", () => {
  console.log(`listening on port:  ${process.env.PORT || "5000"}`);
});
