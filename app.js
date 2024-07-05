require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cors = require("cors");
const passport = require("./passportGoogleOAuth");

const DB_URL = process.env.DB_URI;
const PORT = 3000;

const taskRoute = require("./routes/task");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/not-found");
const { authMiddleware } = require("./middleware/authMiddleware");

app.use(express.json());
app.use(passport.initialize());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.json("Test");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/data",
    failureRedirect: "/login",
  })
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/data", isLoggedIn, (req, res) => {
  const userEmail = req.user.emails[0].value;

  res.send("Data sent successfully!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", authMiddleware, userRoute);
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
