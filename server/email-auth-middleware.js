import _ from "lodash";

export default function emailAuthFactory() {
  return function emailAuthMiddleware(req, res, next) {
    try {
      const { authorized_emails: authorizedEmails } = req.hull.ship.private_settings;
      if (!_.includes(authorizedEmails, req.query.email)) {
        return next(new Error("Email not authorized"));
      }
      return next();
    } catch (e) {
      return next("Token not provided or wrong.");
    }
  };
}
