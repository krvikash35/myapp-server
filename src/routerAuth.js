const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const db = require("./db.js");
const handlerNotFound = require("./handlerNotFound");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.getUserByUsername(username);
  if (!user) {
    return res.status(400).json({ message: "wrong username" });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: "wrong password" });
  }
  const token = jwt.sign(
    {
      userid: user._id,
      fullname: user.fullname
    },
    "server-secret"
  );
  return res.status(200).json({
    token: token,
    message: "Login successfull"
  });
});

router.post("/register", async (req, res) => {
  const { username, password, fullname } = req.body;

  if (!username || !password || !fullname) {
    return res
      .status(400)
      .json({ message: "please provide username, password and name" });
  }

  const isUsernameAvailable = await db.isUsernameAvailable(username);
  if (!isUsernameAvailable) {
    return res.status(400).json({ message: "Username already registered" });
  }

  const _id = await db.getNextValueForUserid();
  const createdAt = new Date();
  const user = { _id, fullname, username, password, createdAt };
  const isOk = await db.addUser(user);
  if (isOk) {
    return res.status(201).json({ message: "Successfully Registered" });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong on server side" });
});

router.get("/checkUsernameAvailability", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res
      .status(400)
      .json({ message: "please provide username in search query" });
  }
  const isAvailable = await db.isUsernameAvailable(username);
  return res.status(200).json({
    isAvailable
  });
});
router.use(handlerNotFound);

module.exports = router;
