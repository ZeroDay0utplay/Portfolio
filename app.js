const express = require("express");
const bodyParser = require("body-parser");



const app = express();
const port = 3000 || process.env.PORT
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", (req, res)=>{
    res.render("index")
})


app.post("/api/contact", (req, res)=>{
    console.log(req.body);
    res.render("index");
})


app.listen(port, ()=>{
    console.log("[+] Server running on port " + port);
})
