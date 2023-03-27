const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // @TODO: Need to add decode as well
  // console.log("Verifying");
  const authHeader = req.headers["authorization"];
  // console.log("token", authHeader, process.env.JWT_SECRET);
  if (!authHeader) {
    return res.status(401).json({ message: "401 Unauthorized, Auth missing." });
  }

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "401 Unauthorized, Token missing." });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    (err, data) => {

      if (err) {
        console.log(err)
        return res
          .status(403)
          .json({ message: "403 Forbidden, Token missing." });
      }
      req.tokenData = data;
      next();
    }
  );

};

module.exports = { verifyToken };
