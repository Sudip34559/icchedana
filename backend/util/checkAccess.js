module.exports = () => {
  return (req, res, next) => {
    console.log(req.headers, req.body, req.query);
    const token = req.headers.key || req.body.key || req.query.key;
    console.log("wsde w", token);
    if (token) {
      if (token == process?.env?.secretKey) {
        next();
      } else {
        return res
          .status(401)
          .json({ status: false, error: "Unauthorized Access!" });
      }
    } else {
      return res
        .status(401)
        .json({ status: false, error: "Unauthorized Access!" });
    }
  };
};
