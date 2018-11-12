const express = require("express");
const router = express.Router();
const authRouter = require("./routerAuth");
const routerTodos = require("./routerTodos");
const routerPosts = require("./routerPosts");
const routerUsers = require("./routerUsers");
const routerPolls = require("./routerPolls");
const notFoundHandler = require("./handlerNotFound");
const handlerPrivateRoute = require("./handlerPrivateRoute");

router.use("/auth", authRouter);
// router.use(privateRouteHandler);
router.use("/polls", routerPolls); //not all path under this path is private, so use privateroute handler at sub-route level
router.use("/posts", routerPosts);
router.use("/todos", handlerPrivateRoute, routerTodos);
router.use("/users", handlerPrivateRoute, routerUsers);
router.use(notFoundHandler);

module.exports = router;
