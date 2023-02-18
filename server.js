import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";

const PORT = process.env.PORT || 8000;

//middlewares
app.use(cors());
app.use(express.json());

// db connect
import { connectDb } from "./src/config/dbConfig.js";
connectDb();

//routers
import adminRouter from "./src/routers/adminRouter.js";

app.use("/api/v1/admin", adminRouter);

app.use("/", (req, res) => {
  res.json({
    message: "You do not have access here",
  });
});

//global error handler
app.use((error, req, res, next) => {
  console.log(error.message, "=============>");
  const errorCode = error.errorCode || 404;

  res.status(errorCode).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server runing at http://localhost:${PORT}`);
});
