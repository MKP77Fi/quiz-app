const express = require("express");
const app = express();
const PORT = 3000;

// Tämä on API-skeleton: palautetaan testidataa
app.get("/api/questions", (req, res) => {
  const testData = [
    {
      id: 1,
      text: "Mikä on 2 + 2?",
      options: ["3", "4", "5"],
      correct: "4"
    },
    {
      id: 2,
      text: "Mikä on Suomen pääkaupunki?",
      options: ["Helsinki", "Tampere", "Turku"],
      correct: "Helsinki"
    }
  ];
  res.json(testData);
});

// Käynnistetään serveri
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
