const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/envConfig");
class Authorization {
  authorized(req, res, next) {
    const headerToken = req.headers.authorization;
    if (headerToken) {
      const token = headerToken.split("Bearer ")[1];

      const verified = jwt.verify(token, JWT_SECRET);

      if (verified) {
        next();
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: "Please add a valid token" }] });
      }
      // console.log(token);
    } else {
      return res
        .status(401)
        .json({ errors: [{ msg: "anauthorized access/token" }] });
    }
  }
}

module.exports = new Authorization();
