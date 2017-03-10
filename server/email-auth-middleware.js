import jwt from "jwt-simple";
import _ from "lodash";

export default function emailAuthFactory(hostSecret) {
  return function emailAuthMiddleware(req, res, next) {
    try {
      const decoded = jwt.decode(req.query.emailToken, hostSecret);
      const { authorized_emails: authorizedEmails } = req.hull.ship.private_settings;
      console.log(decoded, authorizedEmails);
      if (!_.includes(authorizedEmails, decoded)) {
        throw new Error("Email not authorized");
      }
      next();
    } catch (e) {
      return res.end("Token not provided or wrong.");
    }
  };
}
