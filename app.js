require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cors = require("cors");

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
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

app.post("/verifyIdToken", async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID, // Specify your Google Client ID
    });

    const payload = ticket.getPayload();

    res.json(payload);
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    res.status(401).json({ error: "Invalid token", msg: error.message });
  }
});

app.get("/test", (req, res) => {
  res.json("Test");
});

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
