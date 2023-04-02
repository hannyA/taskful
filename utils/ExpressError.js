class ExpressError extends Error {
  constructor(message, statusCode, navbar = "none", body) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.navbar = navbar;
    this.body = body;
    console.log("ExpressError navbar: ", navbar);
  }
}

module.exports = ExpressError;
