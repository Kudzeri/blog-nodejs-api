import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { userRoutes, postRoutes } from "./routes/index.js";
import { makeFilename, checkAuth } from "./utils/index.js";

// DB
mongoose
  .connect(
    "mongodb+srv://festoplay:6b7WpyBXPZAR91yc@cluster0.g1qbl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
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

// Use PORT from environment or fallback to default
const PORT = process.env.PORT || 3000;

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
