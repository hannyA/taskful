const wrapAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
};

// function wrapAsync(fn) {
//   return function (req, res, next) {
//     func(req, res, next).catch((e) => next(e));
//   };
// }

module.exports = wrapAsync;
