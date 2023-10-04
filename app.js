const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();
let items = ["Buy Food", "Cook Food"];

let workItem = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    let Day = date();
    res.render('index', { listTitle: Day, newListItems: items });
});

app.post("/", function (req, res) {

    let item = req.body.newItem;
    
if(req.body.list === "Working List") {
    workItem.push(item);
    res.redirect('/work');
} else {

    items.push(item);
    res.redirect('/');
}
});


app.get("/work", function (req, res) {
    
    res.render('index', { listTitle: "Working List", newListItems: workItem});
});

app.get("/about",(req,res)=>{
    res.render('about' );
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
