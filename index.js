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
        database : "jantzenphotos",
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

// Route to run after succesful login attempt
app.get("/openClientList", (req, res) => {
    knex.select().from("client_info").then(clients => {
        res.render("clients", {allClients: clients}); // client edit page opened with current data taken from db
    });
})

// Routes for editing and deleting clients
app.get("/editClient/:id", (req, res) => {
    // Send the client info to edit page to display
    knex.select().from("client_info").then(client => {
        res.render("editClient", {currClient: client}); // client edit page opened with current data taken from db
    });
});

app.get("/delete/:id", (req, res) => {
    res.render("clients"); // client list after removing info from database
});


// Start the server
app.listen(port, () => console.log('Listening!'));
