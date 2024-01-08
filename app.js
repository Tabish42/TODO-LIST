const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);


const item1 = new Item({
    name: "Welcome to my todo List"
});

const item2 = new Item({
    name: "<---------Click This to delete this item"
});

const item3 = new Item({
    name: "Enjoy Saving Memories"
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
})

const List = mongoose.model("list", listSchema);


app.get("/", async (req, res) => {
    let Day = date();

    let foundItems = await Item.find({});

    if(foundItems.length === 0){

Item.insertMany(defaultItems);

    }
    res.render('index', { listTitle: Day, newListItems: foundItems });
});

app.post("/", async function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;


    const item = new Item({
        name: itemName
    });

    if(listName === date()){
    item.save();
    res.redirect('/');
    }else{
      let foundList = await List.findOne({name:listName})
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    }
});

app.post('/delete', async (req,res) => {
    const itemID = req.body.checkbox;
    const listName = req.body.listName;
    
    if(listName===date()){
        await Item.findOneAndDelete({_id: itemID});
        res.redirect('/');
    }else{
        let deletedItem = await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, {new: true})
        console.log(deletedItem);
        res.redirect('/'+listName);
        
    }

    });


app.get("/:customListName", async function (req, res) {

    const customListName = req.params.customListName;

    let foundList = await List.findOne({name: customListName })

    if(!foundList) {
        const list = new List({
            name: customListName,
            items: defaultItems
        });
    
        list.save();
        res.redirect('/'+customListName);
    } else{
        
        res.render('index', { listTitle: foundList.name, newListItems: foundList.items});
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
