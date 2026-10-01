import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import rankRouter from "./routes/rank.route.js";
import analysisRouter from "./routes/analysis.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRouter)
app.use("/api/v1/rank", rankRouter)
app.use("/api/v1/analysis", analysisRouter);


app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode !== 401) {
    console.log(err);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export { app };