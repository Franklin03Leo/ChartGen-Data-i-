
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const { Charts } = require('./Config/Models');
mongoose.set('strictQuery', true);
const cors = require('cors');
app.use(cors());

const url = 'mongodb://localhost:27017/Data(i)'
var db = mongoose.connection;
async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            //useFindAndModify: false
        });
        //console.log('Connected Successfully, Happy coding!!!')
    }
    catch (error) {
        console.log('Try again', error)
    }
}
connect();


app.listen(8000, () => {
    // console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV}`)
    console.log(`Server started on PORT 8000`)
})

var dbcourse = [];



app.get("/GetTemplate/", (req, res) => {
    connect();
    // console.log('req', req.params)
    db
        .collection('charts')
        .find({}).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
                console.log('Fethced');
            };
        })
})

app.post('/InsertTemplate/:data', (req, res) => {
    let data = req.params.data
    connect();
    //console.log('insert', data);
    db
        .collection("charts").insertOne(JSON.parse(data)).then(function () {
            console.log("Data inserted")  // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });
})
app.post('/UpdateTemplate/:TempName-:data', (req, res) => {
    let data = JSON.parse(req.params.data)
    connect();
    //console.log('Update', data);
    db
        .collection("charts").updateOne({ 'TempName': req.params.TempName }, { $set: { data } }).then(function () {
            console.log("Data Updated")  // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });
})
app.delete("/DeleteTemplate/:TempName", (req, res) => {
    connect();
    // console.log('req', req.params)
    db
        .collection('charts')
        .deleteOne({ 'TempName': req.params.TempName }).then(function () {
            console.log("Data Deleted")  // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });
})

// Feedback section

// Finding courses of category Database
app.get("/GetFeedback/", (req, res) => {
    connect();
    // console.log('req', req.params)
    db
        .collection('Feedback')
        .find({}).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
                console.log('Feedback fetched');
            };
        })
})
app.post('/InsertFeedback/:data', (req, res) => {
    let data = req.params.data
    connect();
    //console.log('insert', data);
    db
        .collection("Feedback").insertOne(JSON.parse(data)).then(function () {
            console.log("Feedback inserted")  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log(error) 
            res.send('Error')    // Failure
        });
})