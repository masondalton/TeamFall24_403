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
    knex.select().from("client_info")
        .then(clients => {
            res.render("clients", { clients: clients }); // Use 'clients' instead of 'allClients'
        })
        .catch(err => {
            console.error("Error fetching clients:", err.message);
            res.status(500).send("Error fetching client data.");
        });
});

// Routes for editing and deleting clients
app.get("/editClient/:id", (req, res) => {
    // Need to edit this still. Only take ID from db to send to editClient
    knex.select().from("client_info").then(clients => {
        res.render("editClient", { clients: clients }); 
    })
    .catch(err => {
        console.error("Error fetching client", err.message);
        res.status(500).send("Error fetching client data.");
    });
});

app.get("/delete/:id", (req, res) => {
    res.render("clients"); // client list after removing info from database
});

app.get("/addClient", (req, res) => {
    res.render("addClient");
});


// Start the server
app.listen(port, () => console.log('Listening!'));
