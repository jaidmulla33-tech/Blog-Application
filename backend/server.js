const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());           // allows the frontend (Live Server) to call this API
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));

app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
