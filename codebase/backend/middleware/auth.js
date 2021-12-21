const jwt = require("jsonwebtoken");

const jwtSecret = require("../jwtConfig").secret;

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ status: "Unauthorized" });
    } else {
      res.locals.authData = decoded;
      next();
    }
  });
};

const verifyUserWithoutResponse = async (token) => {
  const result = jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  return result;
};

/**
 * Signs JWT and returns it
 *
 * @param UserSchema user
 * @returns JWT String
 */
const signJwt = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user._id,
      metadata: user.metadata,
    },
    jwtSecret,
    {
      expiresIn: "3h",
    }
  );
  return token;
};

module.exports = { verifyUser, signJwt, verifyUserWithoutResponse };
