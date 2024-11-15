const express = require("express");
const app = express();
const path = require("path");
const port = 4000;

//app.set("views", path.join(__dirname, "views")); // Set the views folder path
app.set("view engine", "ejs"); // Set EJS as the template engine

app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));



// Route for the root URL
app.get("/", (req, res) => {
    res.render("index"); // Render the 'index.ejs' file
});

app.get("/login", (req, res) => {
    res.render("login"); // Render the 'index.ejs' file
});

// Start the server
app.listen(port, () => console.log('Listening!'));
