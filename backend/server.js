const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");  // uusi

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); // sallii pyynnöt kaikista lähteistä

// Reitit
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

