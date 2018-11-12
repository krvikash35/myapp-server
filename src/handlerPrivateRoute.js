const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const bearerAuth = req.get("Authorization");
  if (!bearerAuth) {
    return res.status(401).json({ message: "Authorization header not passed" });
  }
  const bearerAuthArr = bearerAuth.split(" ");
  if (bearerAuthArr.length !== 2) {
    return res
      .status(401)
      .json({ message: "Pass token in format: Bearer token_no" });
  }
  if (bearerAuthArr[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Pass token in format: Bearer token_no" });
  }
  const token = bearerAuthArr[1];
  try {
    const payload = jwt.verify(token, "server-secret");
    req.userid = payload.userid;
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
  next();
};
