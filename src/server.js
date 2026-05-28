const app = require("./app");
require("./config/db");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening to requests on port ${PORT}`);
});
