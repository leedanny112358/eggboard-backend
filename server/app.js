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

  // Optionally log the request options so you can analyze it later.
});

const db = mysql.createPool({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b7b9992404b96d",
  password: "0178d97f",
  database: "heroku_620aa052fdc6f48",
});

db.getConnection((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

//CREATE
/* app.get("/throw", function (req, res) {
  throw new Error("BROKEN"); // Express will catch this on its own.
}); */

// new post
app.post("/newpost", (req, res) => {
  let post = req.body;
  let sql = "INSERT INTO posts SET ?";
  db.query(sql, post, (err, result) => {
    if (err) {
      res.status("400").send(err.sqlMessage);
    } else {
      console.log(result);
      res.send("success in adding post");
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

// delete post 
app.get('/deletepost/:id', (req,res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, post, (err, result) => {
      if (err) throw err;
      res.send('Post deleted');
  });
});

app.listen(process.env.PORT || "5000", () => {
  console.log(`listening on port:  ${process.env.PORT || "5000"}`);
});
