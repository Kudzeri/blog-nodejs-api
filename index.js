import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { userRoutes, postRoutes } from "./routes/index.js";
import { makeFilename, checkAuth } from "./utils/index.js";

// DB
mongoose
  .connect("mongodb://localhost:27017/blog")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Storage
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, makeFilename(file));
  },
});
const upload = multer({ storage });

// App
const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.use(userRoutes);
app.use(postRoutes);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({ url: "/uploads/" + req.file.filename });
});

// Port and Start server
const PORT = 4444;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Handle server errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please use a different port.`
    );
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
