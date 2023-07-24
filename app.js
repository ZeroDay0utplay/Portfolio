require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);


mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PWD + "@cluster0.emfgcff.mongodb.net/?retryWrites=true&w=majority");

const schemas = require("./exports/Schemas.js");

const Form = mongoose.model("Form", schemas.formSchema);
const Skills = mongoose.model("Skills", schemas.skills);
const VolunWork = mongoose.model("VolunWork", schemas.volunWork);
const Certs = mongoose.model("Certs", schemas.certs);
const Work = mongoose.model("Work", schemas.work);
const Services = mongoose.model("Services", schemas.services);
const Books = mongoose.model("Books", schemas.books);
const WhoAmI = mongoose.model("WhoAmI", schemas.whoami);
const Contact = mongoose.model("Contact", schemas.contact);


function zdo(books, text){
    let book = [];
    for (let i=0; i<books.length; i++){
        if (books[i].type == text) book.push(books[i]);
    }
    return book;
}


const app = express();
const port = 3000 || process.env.PORT
app.use(express.static(__dirname));
app.set("view engine", "ejs");

app.use(express.json());



app.get("/", async (req, res)=>{
    const skills = await Skills.find({});
    const whoami = await WhoAmI.find({});
    const volunWork = await VolunWork.find({});
    let certs = await Certs.find({});
    certs.sort((cert1, cert2) => cert1.rank - cert2.rank); // sorting is used to organize the order of the certs's view
    const work = await Work.find({})  ;
    const services = await Services.find({});
    const contact = await Contact.find({});
    const books = await Books.find({});
    let tkbooks = zdo(books, "tech");
    let ntkbooks = zdo(books, "non_tech");
    const response = {
        contact: contact[0],
        whoami: whoami,
        skills: skills,
        volunWork: volunWork,
        certs: certs,
        work: work,
        services: services,
        tkbooks: tkbooks,
        ntkbooks: ntkbooks
    }
    res.render("index", response);
})


app.post("/contact", (req, res)=>{
    const name = req.body.Name;
    const email = req.body.Email;
    const message = req.body.Message;
    const form = new Form({"Name": name, "Email": email, "Message": message});
    form.save();
    res.render("index");
})


app.listen(port, ()=>{
    console.log("[+] Server running on port " + port);
})
