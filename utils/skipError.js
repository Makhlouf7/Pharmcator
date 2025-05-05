const skipError = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => console.log("Skipped Error 💥💥"));
};

module.exports = skipError;
