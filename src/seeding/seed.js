if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./src/config.env" });
}
const db = require("../config/db");
