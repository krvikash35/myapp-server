const MongoClient = require("mongodb").MongoClient;
const constants = require("./constants");

let db;

module.exports = {
  getDB,
  getNextValueForUserid,
  getNextValueForPollid,
  getNextValueForPostid,
  getNextValueForTodoid,
  isUsernameAvailable,
  addUser,
  getUserByID,
  getUserByUsername,
  getPostsByPageAndSize,
  createPost,
  likePost,
  unlikePost
};

async function likePost(postid, likedBy) {
  const db = await getDB();
  const collection = db.collection(constants.COLL_POSTS_NAME);
  const response = await collection.updateOne(
    { _id: postid },
    { $push: { likedBy } }
  );
  return response.result.ok === 1;
}

async function unlikePost(postid, likedBy) {
  const db = await getDB();
  const collection = db.collection(constants.COLL_POSTS_NAME);
  const response = await collection.updateOne(
    { _id: postid },
    { $pull: { likedBy } }
  );
  return response.result.ok === 1;
}

async function getPostsByPageAndSize(page, size) {
  const skip = size * (page - 1);
  const db = await getDB();
  const collection = db.collection(constants.COLL_POSTS_NAME);
  const posts = collection
    .find()
    .sort({ $natural: -1 })
    .skip(skip)
    .limit(size)
    .toArray();
  return posts;
}

async function createPost(post) {
  const db = await getDB();
  const collection = db.collection(constants.COLL_POSTS_NAME);
  const response = await collection.insertOne(post);
  return response.result.ok === 1;
}

async function getDB() {
  // if (db) return db;
  const client = await MongoClient.connect(
    constants.MONGO_DB_URL,
    { useNewUrlParser: true }
  );
  db = client.db(constants.MONGO_DB_NAME);
  return db;
}

async function getNextSequenceValue(sequenceName) {
  const db = await getDB();
  const result = await db
    .collection(constants.COLL_COUNTERS_NAME)
    .findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { value: 1 } },
      { returnOriginal: false }
    );
  return result.value.value;
}

function getNextValueForUserid() {
  return getNextSequenceValue("userid");
}

function getNextValueForPollid() {
  return getNextSequenceValue("pollid");
}

function getNextValueForPostid() {
  return getNextSequenceValue("postid");
}

function getNextValueForTodoid() {
  return getNextSequenceValue("todoid");
}

async function isUsernameAvailable(username) {
  const db = await getDB();
  const docs = db.collection("users").find({ username }, { limit: 1 });
  const isUserExist = await docs.hasNext();
  return !isUserExist;
}

async function addUser(user) {
  const db = await getDB();
  const collection = db.collection(constants.COLL_USERS_NAME);
  const response = await collection.insertOne(user);
  return response.result.ok === 1;
}

async function getUserByParam(paramName, paramValue) {
  const db = await getDB();
  const collection = db.collection(constants.COLL_USERS_NAME);
  const user = await collection.findOne({ [paramName]: paramValue });
  return user;
}

function getUserByID(_id) {
  return getUserByParam("_id", _id);
}

function getUserByUsername(username) {
  return getUserByParam("username", username);
}
