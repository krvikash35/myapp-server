exports.DB_URL = process.env.MYAPP_DB_URL || "mongodb://localhost:27017/test";
exports.DB_NAME = "myapp";
exports.COLL_USERS_NAME = "users";
exports.COLL_POLLS_NAME = "polls";
exports.COLL_TODOS_NAME = "todos";
exports.COLL_POSTS_NAME = "posts";
exports.COLL_COUNTERS_NAME = "counters";
exports.POSTS_PAGE_SIZE = 2;

// const sample = {
//   uidPointer: 1001,
//   users: [
//     {
//       userid: 1001,
//       fullname: "vikash kumar",
//       username: "krvikash35",
//       password: "12345"
//     }
//   ],
//   posts: [],
//   todos: [
//     {
//       text: "Pay credit card bills"
//     }
//   ],
//   polls: []
// };

// const user = {
//   userid: "",
//   username: "",
//   email: "",
//   mobile: "",
//   password: "",
//   createdAt: "",
//   followers: ["uid1", "uid2", "uid3"],
//   followings: ["uid1", "uid2", "uid3"]
// };
// const post = {
//   id: "",
//   title: "",
//   content: "",
//   createdAt: "",
//   createdBy: "uid1",
//   likedBy: ["uid1", "uid2", "uid3"]
// };
// const todo = {
//   id: "",
//   text: "",
//   isCompleted: "",
//   createdAt: "",
//   createdBy: "uid1"
// };
// const poll = {
//   id: "",
//   desc: "",
//   createdAt: "",
//   createdBy: "uid1",
//   options: ["opt1", "opt2"],
//   votedBy: ["uid1", "uid2"]
// };
