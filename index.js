let express = require("express");

let app = express();

let path = require("path");

const port = 2024;

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

app.listen(port, () => console.log('I am listening'));