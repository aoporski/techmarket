const app = require("./app");
const { pool } = require("./config/db");

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("server is running"));
