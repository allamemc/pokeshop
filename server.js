const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Set the public path

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
