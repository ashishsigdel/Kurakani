import jwt from "jsonwebtoken";

export const generateToken = ({ payload, expiresIn }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn * 60, // convert minutes to seconds for expiresIn
    issuer: process.env.JWT_ISSUER, // issuer name for JWT
    algorithm: "HS512", // algorithm used to sign/verify JWT
  });

  return token;
};

export const verifyToken = ({ token, ignoreExpiration = false }) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    algorithms: ["HS512"],
    ignoreExpiration: ignoreExpiration,
  });
};

export const removeBearer = (token) => {
  if (token && token.startsWith("Bearer ")) {
    return token.slice(7, token.length);
  }

  return token;
};

export const getAuthToken = (req) => {
  if (
    req &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

export const getCookieToken = (req) => {
  if (req && req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken.split(" ")[1];
  }

  return null;
};

export const generateRefreshToken = ({ userId }) => {
  return generateToken({
    payload: {
      id: userId,
    },
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const generateAccessToken = ({ userId, refreshTokenId }) => {
  return generateToken({
    payload: {
      id: userId,
      rfId: refreshTokenId,
    },
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
