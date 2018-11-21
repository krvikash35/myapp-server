const express = require("express");
const router = express.Router();
const db = require("./db");
const handlerPrivateRoute = require("./handlerPrivateRoute");
// const util = require("./util");
const TITLE_MAX_LENGTH = 50;
const TITLE_MIN_LENGTH = 5;
const CONTENT_MIN_LENGTH = 10;
const CONTENT_MAX_LENGTH = 150;

function validatePost(title, content) {
  if (
    !title ||
    (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH)
  ) {
    return `title length must be min ${TITLE_MIN_LENGTH} & max ${TITLE_MAX_LENGTH} chars`;
  }
  if (
    !content ||
    (content.length < CONTENT_MIN_LENGTH || content.length > CONTENT_MAX_LENGTH)
  ) {
    return `content length must be min ${CONTENT_MIN_LENGTH} & max ${CONTENT_MAX_LENGTH} chars`;
  }
}

router.get("/", async (req, res) => {
  let { page = 1, size = 2, postid } = req.query;
  if (isNaN(page) || isNaN(size)) {
    return res
      .status(400)
      .json({ message: "Please send page and size as valid number in query" });
  }
  if (typeof page !== "number") {
    page = parseInt(page);
    size = parseInt(size);
  }
  let posts;
  if (postid) {
    if (isNaN(postid))
      return res
        .status(400)
        .json({ message: "Please send postid as valid number in query" });
    postid = parseInt(postid);
    posts = await db.getPostsByPageAndSizeAndPostID(page, size, postid);
  } else {
    posts = await db.getPostsByPageAndSize(page, size);
  }
  // await util.wait(1);
  return res.status(200).json(posts);
});

router.post("/", handlerPrivateRoute, async (req, res) => {
  const { title, content } = req.body;
  const errMsg = validatePost(title, content);
  if (errMsg) {
    res.status(400).json({ message: errMsg });
  }
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
  const { ok, data } = await db.createPost(post);
  if (!ok)
    return res
      .status(500)
      .json({ message: "Could not create post due to unexpected error" });
  return res.status(201).json({ message: "successfylly created", data });
});

router.put("/", handlerPrivateRoute, async (req, res) => {
  const optype = req.body.optype;
  const userid = req.userid;
  if (optype === "likePost") {
    const postid = req.body.postid;
    if (!postid) return res.status(400).json({ message: "Invalid postid" });
    const { n, nModified, ok } = await db.likePost(postid, userid);
    if (!ok) return res.status(500).json({ message: "server error" });
    if (n === 0) return res.status(400).json({ message: "Invalid postid" });
    if (nModified === 0)
      return res.status(409).json({ message: "Post already liked" });
    return res.status(200).send({ message: "updated successfully" });
  } else if (optype === "unlikePost") {
    const postid = req.body.postid;
    if (!postid) return res.status(400).json({ message: "Invalid postid" });
    const { n, nModified, ok } = await db.unlikePost(postid, userid);
    if (!ok) return res.status(500).json({ message: "server error" });
    if (n === 0) return res.status(400).json({ message: "Invalid postid" });
    if (nModified === 0)
      return res.status(409).json({ message: "Post already unliked" });
    return res.status(200).send({ message: "updated successfully" });
  } else {
    return res.status(400).json({ message: "Invalid operation" });
  }
});

module.exports = router;
