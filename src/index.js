/* eslint-disable no-console */

const express = require("express");
const app = express();
const path = require("path");

const connectDB = require("./db").getDB;
const apiRouter = require("./routerAPI");

const APP_PORT = process.env.PORT || 3000;
const APP_HOST = process.env.HOST || "0.0.0.0";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", apiRouter);

const publicDir = path.join(__dirname, "../../myapp-client/build/");
const publicIndexFile = path.join(publicDir, "index.html");
app.use(express.static(publicDir));
app.get("*", (req, res) => {
  // res.redirect("/"); //dont redirect to homepage, instead send the homepage
  res.sendFile(publicIndexFile);
});

(async () => {
  try {
    await connectDB();
    console.log("Database server connected!");
  } catch (error) {
    return console.log("could not connect to database:", error.message);
  }
  const server = app.listen(APP_PORT, APP_HOST, () => {
    console.log("HTTPserver listening on: " + APP_HOST + ":" + APP_PORT);
  });
  server.on("error", err => {
    console.log(
      "HTTPServer Failed to bind on ",
      APP_HOST + ":" + APP_PORT,
      "\nReason: " + err.message
    );
    process.exit();
  });
})();
