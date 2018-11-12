/* eslint-disable no-console */

const express = require("express");
const app = express();
const path = require("path");

const connectDB = require("./db").getDB;
const apiRouter = require("./routerAPI");

const port = process.argv[2] || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../build")));
app.use("/api", apiRouter);
app.get("*", (req, res) => {
  // res.redirect("/"); //dont redirect to homepage, instead send the homepage
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

(async () => {
  try {
    await connectDB();
    console.log("Database server connected!");
  } catch (error) {
    return console.log("could not connect to database:", error.message);
  }
  const server = app.listen(port, () => {
    console.log("HTTP server listening on port", port);
  });
  server.on("error", err => {
    console.log("could not bind the server on port ", port, ":", err.message);
  });
})();
