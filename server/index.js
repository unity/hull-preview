import Hull from "hull";
import express from "express";
import cors from "cors";
import _ from "lodash";
import jwt from "jwt-simple";
import { Cache } from "hull/lib/infra";
import Promise from "bluebird";

import * as query from "./queries";
import emailAuthMiddleware from "./email-auth-middleware";
import keyMiddleware from "./key-middleware";

const cache = new Cache({ store: "memory", max: 1, ttl: 1 });

const connector = new Hull.Connector({
  cache,
  port: process.env.PORT || 8082,
  hostSecret: process.env.SECRET || "1234"
});
const app = express();

app.use(keyMiddleware());
connector.setupApp(app);

app.get("/preview", cors(), emailAuthMiddleware(connector.hostSecret), (req, res) => {
  const { client } = req.hull;
  let ident;
  try {
    ident = JSON.parse(Buffer.from(req.query.ident, "base64").toString());
  } catch (e) {} // eslint-disable-line no-empty

  if (!ident) {
    return res.render("error.html");
  }

  client.logger.info("loading user", ident);
  return client.post("/search/user_report", query.email(ident.email))
  .then((data) => {
    if (!data.data[0] || !data.data[0].id) {
      Promise.reject("user not found");
    }

    const user = data.data[0];
    return client.get(`/${user.id}/segments`)
      .then((segments) => {
        user.segments = segments;
        const grouped = client.utils.groupTraits(user);

        const userForView = _.reduce(grouped, (newUser, element, key) => {
          if (key[0] === "_") {
            return newUser;
          }
          if (_.isObject(element) && !_.isArray(element)) {
            newUser[key] = element;
            return newUser;
          }
          newUser.properties[key] = element;
          return newUser;
        }, {
          properties: {}
        });
        return res.render("home.html", { user: userForView, _ });
      });
  })
  .catch((err) => {
    console.error(err);
    return res.render("error.html");
  });
});

app.get("/admin", (req, res) => {
  const { hostname, ship } = req.hull;

  const authorizedEmails = ship.private_settings.authorized_emails.reduce((emails, email) => {
    const data = JSON.stringify({
      hull: req.hull.token,
      email: jwt.encode(email, connector.hostSecret)
    });
    emails[email] = new Buffer(data).toString("base64");
    return emails;
  }, {});

  return res.render("admin.html", { hostname, authorizedEmails, _ });
});

connector.startApp(app);
