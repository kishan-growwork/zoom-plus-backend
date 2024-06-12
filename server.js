require("dotenv").config();
const app = require("./app");
const port = 7000;

app.listen(port, () => {
  console.log("Listening on server: " + process.env.NODE_ENV);
  console.log("Listening on port: " + port);
});
