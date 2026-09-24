const dotenv = require("dotenv");
dotenv.config();
const { app } = require("./app");
const { connectDatabase } = require("./db");

async function start() {
  await connectDatabase();
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started at port: ${process.env.PORT}`);
  });
}
start().catch((error) => {
  console.error(error);
  process.exit(1);
});
