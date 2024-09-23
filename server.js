const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/short-url");
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost/urlShotner", {});
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/short-url", async function (req, res) {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async function (req, res) {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.send(404);

  shortUrl.clicks++; // increments the clicks counter
  shortUrl.save(); // saves the clicked count
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Server started");
});
