require("dotenv").config();
const app = require("./app");

app.listen(7000, () => {
  console.log("Listening on server: " + process.env.NODE_ENV);
  console.log("Listening on port: " + 7000);
});
