
export default function keyMiddlewareFactory() {
  return function keyMiddleware(req, res, next) {
    if (!req.query.key) {
      return next();
    }

    let tokens;
    req.hull = req.hull || {};
    try {
      tokens = JSON.parse(Buffer.from(req.query.key, "base64").toString());
      req.hull.token = tokens.hull;
      req.query.emailToken = tokens.email;
      return next();
    } catch (e) {
      return res.end("Key not provided or wrong.");
    }
  };
}
