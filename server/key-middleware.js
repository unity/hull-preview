import { decrypt } from "./email-token";


export default function keyMiddlewareFactory(hostSecret) {
  return function keyMiddleware(req, res, next) {
    if (!req.query.emailToken) {
      return next();
    }

    let tokens;
    req.hull = req.hull || {};
    try {

      return decrypt(hostSecret, req.query.emailToken)
        .then(tokens => {
          req.hull.token = tokens.hullToken;
          req.query.email = tokens.email;
          console.log(tokens);
          next();
        })
        .catch(err => res.end(err));
    } catch (e) {
      console.error(e.stack || e);
      return res.end("Key not provided or wrong.");
    }
  };
}
