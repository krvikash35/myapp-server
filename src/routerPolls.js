const express = require("express");
const router = express.Router();
const handlerPrivateRoute = require("./handlerPrivateRoute");

router.get("/", (req, res) => {
  return res.status(200).send("success");
});

router.get("/private", handlerPrivateRoute, (req, res) => {
  return res.status("200").send("passed");
});

module.exports = router;
