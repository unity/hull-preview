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
  const ident = JSON.parse(Buffer.from(req.query.ident, "base64").toString());
  req.hull.client.logger.info("loading user", ident);
  const scopedHull = req.hull.client.as(ident);

  return scopedHull.get("/me")
  .then(user => {
    return scopedHull.get(`/${user.id}/segments`)
      .then(segments => {
        return res.render("home.html", { user, segments });
      });
  })
  .catch(err => {
    console.error(err);
    res.end("err");
  });
});

app.get("/admin", (req, res) => {
  return res.render("admin.html", { ctx: req.hull });
});

connector.startApp(app);
