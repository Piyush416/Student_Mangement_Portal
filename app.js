const { log } = require("console")
const express = require("express")
const path = require("path")


const PORT = 3003
const app = express()


//relative path
const homePage = path.join(__dirname, "./public/html/home.html")
const contactPage = path.join(__dirname, "./public/html/contact.html")
const style = path.join(__dirname, "./public/style")
const script = path.join(__dirname, "./public/script")


//MIDDLEWAR
app.use(express.static(style))
app.use(express.static(script))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




//DATABASE
const mongoose = require("mongoose");
const { MongoAPIError, MongoOIDCError } = require("mongodb")

// connection with server
const MONGO_URL = "mongodb://127.0.0.1:27017/uni";
mongoose.connect(MONGO_URL).then(() => {

    console.log("MongoDb connection Est. ");

}).catch((err) => {

    console.log("failed to Connect :", err);

})
const connection = mongoose.connection;


// create a schema for database 
const studentSchema = new mongoose.Schema({
    enrol: Number,
    fname: String,
    lname: String,
    course: String
})


// create mode
const stdModel = mongoose.model("std", studentSchema);



app.get("/", (req, res) => {
    res.sendFile(homePage);
})



app.get("/api/student/:enrol", async (req, res) => {
    const userEnrol = Number(req.params.enrol);
    let data = await stdModel.find({enrol: userEnrol});
    res.json(data);
})

app.get("/api/students/", async (req, res) => {
    const data = await stdModel.find();
    res.json(data);
})


app.get("/form", (req, res) => {
    res.sendFile(contactPage);
})


app.post("/submit_form", async (req, res) => {
    let dataObj = req.body;
    let newUser = await new stdModel(dataObj)
    newUser.save();
    res.send("Data Save SuccessFully")
})


// delete route
app.delete("/delete/:enrol", async (req, res) => {
    try 
    {
        const userEnrol = Number(req.params.enrol);
        const delData = await stdModel.findOneAndDelete({ enrol: userEnrol });
        if (delData) {
            res.status(200).send({ message: "User deleted successfully", data: delData });
        } 
        else
        {
            res.status(404).send({ message: "User not found" });
        }
    } 
    catch (error) 
    {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: "Internal server error" });
    }
})



//edit route
app.patch("/update/:enrol",async (req,res)=>
{
    const updateData = req.body;
    const userEnrol = Number(req.params.enrol);
    const updata = await stdModel.findOneAndUpdate({enrol : userEnrol}, {$set : updateData},{new: true,runValidators: true});
    if (updata) {
        res.status(200).send();
    } 
    else
    {
        res.status(404).send();
    }
})


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})



