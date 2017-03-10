import Hull from "hull";
import express from "express";
import cors from "cors";
import _ from "lodash";
import jwt from "jwt-simple";
import { Cache } from "hull/lib/infra";

import emailAuthMiddleware from "./email-auth-middleware"
import keyMiddleware from "./key-middleware";

const cache = new Cache({ store: 'memory', max: 1, ttl: 1 });

const connector = new Hull.Connector({
  cache,
  port: process.env.PORT || 8082,
  hostSecret: process.env.SECRET || "1234"
});
const app = express();

app.use(keyMiddleware());
connector.setupApp(app);

app.get("/preview", cors(), emailAuthMiddleware(connector.hostSecret), (req, res, next) => {
  const { client } = req.hull;
  let ident;
  try {
    ident = JSON.parse(Buffer.from(req.query.ident, "base64").toString());
  } catch (e) {}

  if (!ident) {
    return res.render("error.html");
  }

  client.logger.info("loading user", ident);
  const scopedHull = client.as(ident, { create: false });
  return scopedHull.get("/me")
  .then(user => {
    return client.get(`/${user.id}/user_report`)
      .then(userData => {

        const grouped = client.utils.groupTraits(userData);
        const userForView = {
          properties: {}
        };
        _.map(grouped, (element, key) => {
          if (_.isObject(element) && !_.isArray(element)) {
            return userForView[key] = element;
          }
          return userForView.properties[key] = element;
        });
        return res.render("home.html", { user: userForView, _ });
      });
  })
  .catch(err => {
    console.error(err);
    return res.render("error.html");
  });
});

app.get("/admin", (req, res) => {
  const { hostname, token, ship } = req.hull;

  const authorizedEmails = ship.private_settings.authorized_emails.reduce((emails, email) => {
    const data = JSON.stringify({
      hull: req.hull.token,
      email: jwt.encode(email, connector.hostSecret)
    });
    emails[email] = new Buffer(data).toString('base64')
    return emails;
  }, {});

  return res.render("admin.html", { hostname, authorizedEmails, _ });
});

connector.startApp(app);
