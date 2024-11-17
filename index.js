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
            res.render("clients", { clients: clients });
        })
        .catch(err => {
            console.error("Error fetching clients:", err.message);
            res.status(500).send("Error fetching client data.");
        });
});

// Routes for editing and deleting clients
app.get("/editClient/:id", (req, res) => {
    knex.select("client_id",
                "first_name",
                "last_name",
                "phone_number").from("client_info").where("client_id", req.params.id).then(client => {
        res.render("editClient", {clients: client}); 
    })
    .catch(err => {
        console.error(err);
        res.status(500).send("Error fetching client data.");
    });
});

app.post("/changeClientInfo", (req, res) => {
    console.log(req.body);
    knex("client_info").where("client_id", parseInt(req.body.client_id)).update({
        first_name: req.body.first_name.toUpperCase(),
        last_name: req.body.last_name.toUpperCase(),
        phone_number: req.body.phone_number.toUpperCase()
    }).then(toClients => {
        res.redirect("/openClientList");
    });
});

app.get("/delete/:id", (req, res) => {
    knex.select("client_id",
        "first_name",
        "last_name",
        "phone_number").from("client_info").where("client_id", req.params.id).then(client => {
res.render("editClient", {clients: client}); 
}).catch(err => {
console.error(err);
res.status(500).send("Error fetching client data.");
});
    res.render("clients"); // client list after removing info from database
});

// Opens up the add client page for owner to manually add. Complete as is
app.get("/addClient", (req, res) => {
    res.render("addClient");
});

// Routes from addClient
    // Redirects to client page
app.get("/cancel", (req, res) => {
    knex.select().from("client_info")
    .then(clients => {
        res.render("clients", { clients: clients });
    })
    .catch(err => {
        console.error("Error fetching clients:", err.message);
        res.status(500).send("Error fetching client data.");
    });
});

    // Adds client information entered in form to database
app.post("makeClient", (req, res) => {
    knex.select().from("client_info")
    .then(clients => {
        res.render("clients", { clients: clients });
    })
    .catch(err => {
        console.error("Error fetching clients:", err.message);
        res.status(500).send("Error fetching client data.");
    });
})


// Start the server
app.listen(port, () => console.log('Listening!'));
