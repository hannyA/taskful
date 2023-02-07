module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, err).catch(next);
  };
};
