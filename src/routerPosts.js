const express = require("express");
const router = express.Router();
const db = require("./db");
const handlerPrivateRoute = require("./handlerPrivateRoute");
// const util = require("./util");

router.get("/", async (req, res) => {
  let { page = 1, size = 2 } = req.query;
  if (isNaN(page) || isNaN(size)) {
    return res
      .status(400)
      .json({ message: "Please send page and size as valid number in query" });
  }
  if (typeof page !== "number") {
    page = parseInt(page);
    size = parseInt(size);
  }
  const posts = await db.getPostsByPageAndSize(page, size);
  // await util.wait(1);
  return res.status(200).json(posts);
});

router.post("/", handlerPrivateRoute, async (req, res) => {
  const { title, content } = req.body;
  const userid = req.userid;
  const _id = await db.getNextValueForPostid();
  const createdAt = new Date();
  const post = {
    _id,
    title,
    content,
    createdAt,
    createdBy: userid,
    likedBy: []
  };
  const isOk = await db.createPost(post);
  if (isOk) return res.status(201).json({ message: "successfylly created" });
  return res.status(500).json({ message: "something went on server side" });
});

router.put("/", handlerPrivateRoute, async (req, res) => {
  const optype = req.body.optype;
  const userid = req.userid;
  if (optype === "likePost") {
    const postid = req.body.postid;
    if (!postid) return res.status(400).json({ message: "Invalid postid" });
    const isOk = await db.likePost(postid, userid);
    if (!isOk) return res.status(500).json({ message: "server error" });
    return res.status(200).send({ message: "updated successfully" });
  } else if (optype === "unlikePost") {
    const postid = req.body.postid;
    if (!postid) return res.status(400).json({ message: "Invalid postid" });
    const isOk = await db.unlikePost(postid, userid);
    if (!isOk) return res.status(500).json({ message: "server error" });
    return res.status(200).send({ message: "updated successfully" });
  } else {
    return res.status(400).json({ message: "Invalid operation" });
  }
});

module.exports = router;
