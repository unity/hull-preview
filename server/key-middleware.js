import { decrypt } from "./email-token";


export default function keyMiddlewareFactory(hostSecret) {
  return function keyMiddleware(req, res, next) {
    if (!req.query.emailToken) {
      return next();
    }
    req.hull = req.hull || {};
    try {
      return decrypt(hostSecret, req.query.emailToken.trim())
        .then((tokens) => {
          req.hull.token = tokens.hullToken.trim();
          req.query.email = tokens.email.trim();
          next();
        })
        .catch(err => next(err));
    } catch (e) {
      console.error(e.stack || e);
      return next("Key not provided or wrong.");
    }
  };
}
