const app = require("./app");
const db = require("./config/db");
const cron = require("node-cron");
const populateDatabase = require("./seeding/seed");

const startCronJobs = () => {
  cron.schedule("51 13 * * *", populateDatabase, {
    schedule: true,
    timezone: "UTC",
  });
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening to requests on port ${PORT}`);
  startCronJobs();
});
