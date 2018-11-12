module.exports = function notFoundHandler(req, res) {
  return res.status(404).send();
};
