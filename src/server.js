if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./src/config.env" });
}

const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening to requests on port ${PORT}`);
});
