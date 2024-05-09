require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Db connection successfully");
  })
  .catch((err) => {
    console.info("-------------------------------");
    console.info("err => ", err);
    console.info("-------------------------------");
  });

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(fileUpload());

fs.readdirSync("./routes/user").map((file) => {
  app.use("/api/user", require("./routes/user/" + file));
});

fs.readdirSync("./routes/merchant").map((file) => {
  app.use("/api/merchant", require("./routes/merchant/" + file));
});

fs.readdirSync("./routes/admin").map((file) => {
  app.use("/api/admin", require("./routes/admin/" + file));
});

module.exports = app;
