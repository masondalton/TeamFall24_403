const express = require("express");
const app = express();
const path = require("path");
const port = 4000;

app.set("view engine", "ejs"); // Set EJS as the template engine

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

// Connection to the PostgreSQL database using Knex.js
const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "1313",
        database: "project3",
        port: 5432
    }
});

// Route for the root URL
app.get("/", (req, res) => {
    res.render("index");
});

// Login page
app.get("/login", (req, res) => {
    res.render("login");
});

// Validate admin login credentials
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    knex("Admin_credentials")
        .where({ username: username, password: password })
        .then(admin => {
            if (admin.length) {
                res.redirect("/openClientList");
            } else {
                res.status(401).send("Invalid credentials");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error validating login credentials.");
        });
});

// About and Contact pages
app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

// Display client list
app.get("/openClientList", (req, res) => {
    knex.select().from("Client")
        .then(clients => {
            res.render("clients", { clients: clients });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching client data.");
        });
});

// Edit client information
app.get("/editClient/:id", (req, res) => {
    knex("Client")
        .where("client_id", req.params.id)
        .then(client => {
            res.render("editClient", { clients: client });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching client data.");
        });
});

// Search for a client
app.get("/searchClient", (req, res) => {
    const query = req.query.query; // Extract the search query from the URL

    knex("Client")
        .whereILike("first_name", `%${query}%`) // Case-insensitive search on first_name
        .orWhereILike("last_name", `%${query}%`) // Case-insensitive search on last_name
        .orWhere("phone_number", "like", `%${query}%`) // Partial match on phone_number
        .then(results => {
            res.render("clients", { clients: results }); // Render the same 'clients' page with filtered results
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error searching client data.");
        });
});


// Update client information
app.post("/changeClientInfo", (req, res) => {
    knex("Client")
        .where("client_id", parseInt(req.body.client_id))
        .update({
            first_name: req.body.first_name.toUpperCase(),
            last_name: req.body.last_name.toUpperCase(),
            phone_number: req.body.phone_number
        })
        .then(() => {
            res.redirect("/openClientList");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error updating client data.");
        });
});

// Delete client information
app.post("/deleteClient/:id", (req, res) => {
    knex("Client")
        .where("client_id", req.params.id)
        .del()
        .then(() => {
            res.redirect("/openClientList");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error deleting client data.");
        });
});

// Open the add client page
app.get("/addClient", (req, res) => {
    res.render("addClient");
});

// Add new client
app.post("/makeClient", (req, res) => {
    knex("Client")
        .insert({
            first_name: req.body.first_name.toUpperCase(),
            last_name: req.body.last_name.toUpperCase(),
            phone_number: req.body.phone_number
        })
        .then(() => {
            res.redirect("/openClientList");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error adding client data.");
        });
});

// Cancel and return to client list
app.get("/cancel", (req, res) => {
    knex.select().from("Client")
        .then(clients => {
            res.render("clients", { clients: clients });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching client data.");
        });
});

// Start the server
app.listen(port, () => console.log("Listening on port " + port));
