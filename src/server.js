
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
// const { Charts } = require('./Config/Models');
mongoose.set('strictQuery', true);
const cors = require('cors');


app.use(cors({
    origin: `*`,
    credentials: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({ limit: `50mb` }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
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
//==================== PREDEFINED TEMPALTES============
app.post("/GetPreDefinedTemplate", (req, res) => {
    connect();
    db
        .collection('PredefinedTemplates')
        .find({}).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
                console.log('Error while Predefined Template Fetching on ' + new Date());
            } else {
                res.json(result);
                console.log('Predefined Template Fetched on ' + new Date());
            };
        })
})
// ==================== TEMPLATE =======================
app.post("/GetTemplate/", (req, res) => {
    connect();
    db
        .collection('charts')
        .find({ 'userID': req.body.userID }).sort({ '_id': 1 }).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
                console.log('Error while Template Fetching on ' + new Date());
            } else {
                res.json(result);
                console.log('Template Fetched on ' + new Date());
            };
        })
})
app.post('/InsertTemplate', (req, res) => {
    let data = [];
    data.push(req.body)
    connect();
    db
        .collection("charts").insertMany(data).then(function () {
            res.status(200).send('Success')
            console.log("Template inserted on " + new Date())  // Success
        }).catch(function (error) {
            console.log("Error while Template inserting on " + new Date())      // Failure
        });
})
app.post("/DeleteTemplate", (req, res) => {
    connect();
    db
        .collection('charts')
        .deleteOne({ 'TempName': req.body.TempName, 'userID': req.body.userID }).then(function () {
            res.status(200).send('Success')
            console.log("Template Deleted on " + new Date())  // Success
        }).catch(function (error) {
            console.log("Error while Template Deleting on " + new Date())      // Failure
        });
})
// =================== FEEDBACK =======================
app.get("/GetFeedback/", (req, res) => {
    connect();
    db
        .collection('Feedback')
        .find({}).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching feedback! on " + new Date());
            } else {
                res.json(result);
                console.log('Feedback fetched on' + new Date());
            };
        })
})
app.post('/InsertFeedback/', (req, res) => {
    let data = req.body
    data['Date/Time'] = new Date()
    connect();
    db
        .collection("Feedback").insertOne(data).then(function () {
            console.log("Feedback inserted on " + new Date())  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log(("Error while Feedback insertion on " + new Date()))
            res.send('Error')    // Failure
        });
})
// ============== SIGNUP/SIGNIN/FORGOT PASSWORD ========
app.post('/SignupUser/', (req, res) => {
    let data = req.body
    connect();
    db
        .collection("UserDetails").insertOne(data).then(function () {
            console.log("User Details inserted on " + new Date())  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log("Error while User Details insertion on " + new Date())
            res.send('Error')    // Failure
        });
})
app.post('/SigninUser/', (req, res) => {
    let data = req.body
    connect();
    db
        .collection("UserDetails").findOne({ userID: data.userID, password: data.password },
            function (err, result) {
                if (err) {
                    res.status(400).send("Error fetching listings!");
                    console.log("Error while signin on " + new Date())
                } else {
                    if (result) {
                        res.status(200).json(result);
                        console.log("Signed in on " + new Date())
                    }
                    else {
                        res.status(404).send('User not found');
                        console.log("Sign in attempt on " + new Date());
                    }
                };

            });
})
app.post('/ForgotUser/', (req, res) => {
    let data = req.body
    connect();
    db
        .collection("UserDetails").updateOne({ 'userID': data.FuserID }, { $set: { password: data.password } }).then(function () {
            console.log("User Details updated on " + new Date())  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log(error)
            res.send("Error while User Details updation on " + new Date())    // Failure
        });
})
app.post('/CheckSignupUser/', (req, res) => {
    let data = req.body
    connect();
    db
        .collection("UserDetails").findOne({ userID: data.userID },
            function (err, result) {
                if (err) {
                    res.status(400).send("Error fetching listings!");
                    console.log("Error while checking on " + new Date())
                } else {
                    if (result) {
                        res.status(200).json(result);
                        console.log("Checking user on " + new Date())
                    }
                    else {
                        res.status(404).send('User not found');
                        console.log("Checking user attempt on " + new Date());
                    }
                };

            });
})
// =================== DASHBOARD =======================
app.post('/InsertDashboard', (req, res) => {
    let data = [];
    data.push(req.body)
    connect();
    db
        .collection("Dashboards").insertMany(data).then(function () {
            res.status(200).send('Success')
            console.log("Dashboard inserted")  // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });
})
app.post("/GetDashboard/", (req, res) => {
    connect();
    db
        .collection('Dashboards')
        .find({ 'userID': req.body.userID }).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fethcing projects! on " + new Date());
            } else {
                res.json(result);
                console.log('Project Fetched on ' + new Date());
            };
        })
})
app.post('/UpdateDashboard', (req, res) => {
    let data = req.body
    connect();
    db
        .collection('Dashboards')
        .updateOne({ 'DashboardName': data.DashboardName, 'userID': data.userID },
            {
                $set: {
                    layouts: data.layouts,
                    layoutOption: data.layoutOption,
                    charts: data.charts,
                    DashboardDescription: data.DashboardDescription,
                    filterProps: data.FilterProps,
                    filter: data.Filter,
                    selectedFilterDimensions: data.selectedFilterDimensions
                }
            }).then(function () {
                //.deleteOne({ 'DashboardName': req.body.DashboardName, 'userID': req.body.userID }).then(function () {
                res.status(200).send('Success')
                console.log("Dashboard Updated on " + new Date())  // Success
            }).catch(function (error) {
                console.log("Error while Dashboard Updation on " + new Date())      // Failure
            });
})
app.post("/DeleteDashboard", (req, res) => {
    connect();
    db
        .collection('Dashboards')
        .deleteOne({ 'DashboardName': req.body.DashboardName, 'userID': req.body.userID }).then(function () {
            res.status(200).send('Success')
            console.log("Project Deleted on " + new Date())  // Success
        }).catch(function (error) {
            console.log("Error while Project Deleting on " + new Date())      // Failure
        });
})
// =================== DATASET =======================
app.post('/InsertDataSet', (req, res) => {
    let data = [];
    data.push(req.body)
    connect();
    db
        .collection("Dataset").insertMany(data).then(function () {
            res.status(200).send('Success')
            console.log("DataSet inserted")  // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });
})
app.post("/GetDataset/", (req, res) => {
    connect();
    db
        .collection('Dataset')
        .find({ 'userID': req.body.userID }).toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fethcing dataset! on " + new Date());
            } else {
                res.json(result);
                console.log('Dataset Fetched on ' + new Date());
            };
        })
})
app.post("/DeleteDataset", (req, res) => {
    connect();
    db
        .collection('Dataset')
        .deleteOne({ 'filename': req.body.id, 'userID': req.body.userID }).then(function () {
            res.status(200).send('Success')
            console.log("Dataset Deleted on " + new Date())  // Success
        }).catch(function (error) {
            console.log("Error while Dataset Deleting on " + new Date())      // Failure
        });
})