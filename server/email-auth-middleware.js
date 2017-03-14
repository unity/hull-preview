import jwt from "jwt-simple";
import _ from "lodash";

export default function emailAuthFactory(hostSecret) {
  return function emailAuthMiddleware(req, res, next) {
    try {
      const { authorized_emails: authorizedEmails } = req.hull.ship.private_settings;
      if (!_.includes(authorizedEmails, req.query.email)) {
        throw new Error("Email not authorized");
      }
      return next();
    } catch (e) {
      return res.end("Token not provided or wrong.");
    }
  };
}
