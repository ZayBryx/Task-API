require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const useragent = require("express-useragent");
const cors = require("cors");

const DB_URL = process.env.DB_URI;
const PORT = 3000;

const taskRoute = require("./routes/task");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/not-found");
const {
  authMiddleware,
  authorizePermissions,
} = require("./middleware/authMiddleware");

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(useragent.express());

app.get("/", (req, res) => {
  const agent = req.useragent;

  console.log(agent);
  res.send(agent);
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/task", authMiddleware, taskRoute);
app.use("/api/v1/admin", authMiddleware, adminRoute);
app.use(errorHandler);
app.use(notFound);

const start = async () => {
  await connectDB(DB_URL);
  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}/`);
  });
};

start();
