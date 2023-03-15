class ExpressError extends Error {
  constructor(message, statusCode, navbar = "none") {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.navbar = navbar;
    console.log("ExpressError navbar: ", navbar);
  }
}

module.exports = ExpressError;
