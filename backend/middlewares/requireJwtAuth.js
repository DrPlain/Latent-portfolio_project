const jwt = require("jsonwebtoken");
const SECRET_KEY = "hxjbh6fghbjhsyf8yihbhvUTFUHVUv";

function requireAuth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.user = decodedToken;
  });
  next();
}

module.exports = requireAuth;
