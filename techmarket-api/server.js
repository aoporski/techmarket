require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const productRoutes = require("./routes/productRoutes");
const { pool } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API for TechMarket");
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("server is running"));
