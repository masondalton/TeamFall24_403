const express = require("express");
const app = express();
const path = require("path");
const port = 2024;

app.set("view engine", "ejs"); // Set EJS as the template engine
app.set("views", path.join(__dirname, "views")); // Set the views folder path

app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public')); // Ensure public files are accessible

// Route for the root URL
app.get("/", (req, res) => {
    res.render("index"); // Render the 'index.ejs' file
});

// Start the server
app.listen(port, () => console.log('Listening!'));
