require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const checkToken = require("./lib/checkToken");
const connection = require("./config/db");
const bodyParser = require("body-parser");
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("src"));
app.use("/api/admin/nba-pos/static", express.static("src"));

// LOGIN
app.use("/api/admin/nba-pos/signin", require("./routes/signin"));
// routes
app.use("/api/admin/nba-pos/owners", checkToken, require("./routes/owner"));
app.use("/api/admin/nba-pos/admins", checkToken, require("./routes/admin"));
app.use("/api/admin/nba-pos/branch", checkToken, require("./routes/branch"));

app.use("/api/admin/nba-pos/advert", require("./routes/advert"));
app.use(
  "/api/admin/nba-pos/images/advert",
  require("./routes/images.advert")
);

const port = process.env.PORT || 7010;
// const server = app.listen(port, console.log(`Listening on port ${port}...`));
app.listen(port, console.log(`Listening on port ${port}...`));
