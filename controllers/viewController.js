const redirectUser = (req, res, next) => {
  if (res.locals.user) res.render("index.ejs");
  next();
};

const getMain = (req, res, next) => {
  res.render("index");
};

const getSign = (req, res) => {
  res.render("sign");
};

const getRegister = (req, res) => {
  res.render("register");
};

const getForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

module.exports = {
  redirectUser,
  getMain,
  getSign,
  getRegister,
  getForgotPassword,
};
