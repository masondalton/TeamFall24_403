const express = require("express");
const app = express();
const path = require("path");
const port = 4000;

//app.set("views", path.join(__dirname, "views")); // Set the views folder path
app.set("view engine", "ejs"); // Set EJS as the template engine

app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Need to change this conneciton to each of our own localhosts
// Connection to server
const knex = require("knex") ({
    client : "pg",
    connection : {
        host : "localhost",
        user : "postgres",
        password : "I am a Child of God",
        database : "assignment3",
        port : 5432
    }
})

// Route for the root URL
app.get("/", (req, res) => {
    res.render("index"); // Render the 'index.ejs' file
});

app.get("/login", (req, res) => {
    res.render("login"); // Render the 'index.ejs' file
});

// Routes for editing and deleting clients
app.get("/editClient/:id", (req, res) => {
    // Send the client name to page to display
    res.render("clientEdit"); // client edit page opened with current data taken from db
});

app.get("/delete/:id", (req, res) => {
    res.render("clients"); // client list after removing info from database
});


// Start the server
app.listen(port, () => console.log('Listening!'));
