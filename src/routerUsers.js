const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/me", async (req, res) => {
  const user = await db.getUserByID(req.userid);
  delete user.password;
  res.status(200).send(user);
});

module.exports = router;
