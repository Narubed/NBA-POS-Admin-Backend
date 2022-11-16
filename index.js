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
// app.use("/uploads", express.static("src"));

// const corsOptions = {
//     origin: "*",
//     credentials: true, //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
//   };

//   app.use(cors(corsOptions));

// LOGIN
app.use("/api/admin/nba-pos/signin", require("./routes/signin"));
// routes
app.use("/api/admin/nba-pos/owners", checkToken, require("./routes/owner"));
app.use("/api/admin/nba-pos/admins", checkToken, require("./routes/admin"));
app.use("/api/admin/nba-pos/branch", checkToken, require("./routes/branch"));

const port = process.env.PORT || 9012;
// const server = app.listen(port, console.log(`Listening on port ${port}...`));
app.listen(port, console.log(`Listening on port ${port}...`));
