require("dotenv").config();
const app = require("./src/app");
const dbConnection = require("./src/config/db");

dbConnection();

app.listen(3000, () => {
  console.log(`app is running on the http://localhost:3000/`);
});
