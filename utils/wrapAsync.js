const wrapAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
};
module.exports = wrapAsync;
