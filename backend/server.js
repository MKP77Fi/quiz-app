const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Reitit
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
