import Hull from "hull";
import express from "express";
import cors from "cors";

const connector = new Hull.Connector({
  port: process.env.PORT || 8082,
  hostSecret: process.env.SECRET || "1234"
});
const app = express();

connector.setupApp(app);

app.get("/preview", cors(), (req, res, next) => {
  // const ident = Buffer.from(req.query.ident, "base64").toString();
  const email = req.query.email;
  console.log("loading user", { email });
  return req.hull.client.as({ email }).get("/me")
  .then(user => {
    req.hull.client.as({ email }).get(`/${user.id}/segments`)
      .then(segments => {
        return res.render("home.html", { user, segments });
      });
  });
});

app.get("/admin", (req, res) => {
  return res.render("admin.html", { ctx: req.hull });
});

connector.startApp(app);
