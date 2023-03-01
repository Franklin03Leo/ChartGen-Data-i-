
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
                console.log(`${err} ===> Error while Predefined Template Fetching on ` + new Date().toLocaleString());
            } else {
                res.json(result);
                console.log('Predefined Template Fetched');
            };
        })
})
// ==================== TEMPLATE =======================
app.post("/GetTemplate/", (req, res) => {
    const data = req.body
    connect();
    if (data.Flag.action === 'All') {
        db
            .collection('charts')
            .find({ 'userID': data.userID }).sort({ '_id': 1 }).toArray(function (err, result) {
                if (err) {
                    res.status(400).send("Error fetching listings!");
                    console.log(`${err} ===> Error while Template Fetching on ` + new Date().toLocaleString());
                } else {
                    res.json(result);
                    console.log('All Template Fetched');
                };
            })
    }
    else {
        db
            .collection('charts')
            .find({ 'userID': data.userID, 'TempName': { $in: data.Flag.charts } }).toArray(function (err, result) {
                if (err) {
                    res.status(400).send("Error fetching listings!");
                    console.log(`${err} ===> Error while Specific Template Fetching on ` + new Date().toLocaleString());
                } else {
                    res.json(result);
                    console.log('Specific Template Fetched');
                };
            })
    }
})
app.post('/InsertTemplate', (req, res) => {
    let data = [];
    data.push(req.body)
    connect();
    db
        .collection("charts").insertMany(data).then(function () {
            res.status(200).send('Success')
            console.log("Template inserted") // Success
        }).catch(function (error) {
            console.log(`${error} ===> Error while Template inserting on ` + new Date().toLocaleString())      // Failure
        });
})
app.post("/DeleteTemplate", (req, res) => {
    connect();
    db
        .collection('charts')
        .deleteOne({ 'TempName': req.body.TempName, 'userID': req.body.userID }).then(function () {
            res.status(200).send('Success')
            console.log("Template Deleted")  // Success
        }).catch(function (error) {
            console.log(`${error} ===> Error while Template Deleting on ` + new Date().toLocaleString())      // Failure
        });
})
// =================== FEEDBACK =======================
app.get("/GetFeedback/", (req, res) => {
    connect();
    db
        .collection('Feedback')
        .find({}).toArray(function (err, result) {
            if (err) {
                res.status(400).send(`${err} ===> Error fetching feedback! on ` + new Date().toLocaleString());
            } else {
                res.json(result);
                console.log('Feedback fetched');
            };
        })
})
app.post('/InsertFeedback/', (req, res) => {
    let data = req.body
    data['Date/Time'] = new Date()
    connect();
    db
        .collection("Feedback").insertOne(data).then(function () {
            console.log("Feedback inserted")  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log((`${error} ===> Error while Feedback insertion on ` + new Date().toLocaleString()))
            res.send('Error')    // Failure
        });
})
// ============== SIGNUP/SIGNIN/FORGOT PASSWORD ========
app.post('/SignupUser/', (req, res) => {
    let data = req.body
    connect();
    db
        .collection("UserDetails").insertOne(data).then(function () {
            console.log("User Details inserted")  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log(`${error} ===> Error while User Details insertion on ` + new Date().toLocaleString())
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
                    console.log(`${err} ===> Error while signin on ` + new Date().toLocaleString())
                } else {
                    if (result) {
                        res.status(200).send(result);
                        console.log(`${result.Name} Signed in on ` + new Date().toLocaleString())
                    }
                    else {
                        res.status(404).send('User not found');
                        console.log("Sign in attempt on " + new Date().toLocaleString());
                    }
                };

            });
})
app.post('/ForgotUser/', (req, res) => {
    let data = req.body
    connect();
    db
        .collection("UserDetails").updateOne({ 'userID': data.FuserID }, { $set: { password: data.password } }).then(function () {
            console.log("User Details updated")  // Success
            res.send('Success')
        }).catch(function (error) {
            console.log(error)
            res.send(`${error} ===> Error while User Details updation on ` + new Date().toLocaleString())    // Failure
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
                    console.log(`${err} ===> Error while checking on ` + new Date().toLocaleString())
                } else {
                    if (result) {
                        res.status(200).json(result);
                        console.log("Checking user")
                    }
                    else {
                        res.status(404).send('User not found');
                        console.log("Checking user attempt on " + new Date().toLocaleString());
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
            console.log(`${error} ===> Error while inserting dashboard on ` + new Date().toLocaleString())      // Failure
        });
})
app.post("/GetDashboard/", (req, res) => {
    connect();
    db
        .collection('Dashboards')
        .find({ 'userID': req.body.userID }).toArray(function (err, result) {
            if (err) {
                res.status(400).send(`${err} ===> Error fethcing projects on ` + new Date().toLocaleString());
            } else {
                res.json(result);
                console.log('Project Fetched');
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
                console.log("Dashboard Updated")  // Success
            }).catch(function (error) {
                console.log(`${error} ===> Error while Dashboard Updation on ` + new Date().toLocaleString())      // Failure
            });
})
app.post("/DeleteDashboard", (req, res) => {
    connect();
    db
        .collection('Dashboards')
        .deleteOne({ 'DashboardName': req.body.DashboardName, 'userID': req.body.userID }).then(function () {
            res.status(200).send('Success')
            console.log("Project Deleted")  // Success
        }).catch(function (error) {
            console.log(`${error} ===> Error while Project Deleting on ` + new Date().toLocaleString())      // Failure
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
            console.log(`${error} ===> Error while dataset insertion on ` + new Date().toLocaleString())      // Failure
        });
})
app.post("/GetDataset/", (req, res) => {
    connect();
    db
        .collection('Dataset')
        .find({ 'userID': req.body.userID }).toArray(function (err, result) {
            if (err) {
                res.status(400).send(`${err} ===> Error fethcing dataset on ` + new Date().toLocaleString());
            } else {
                res.json(result);
                console.log('Dataset Fetched');
            };
        })
})
app.post("/DeleteDataset", (req, res) => {
    connect();
    db
        .collection('Dataset')
        .deleteOne({ 'filename': req.body.id, 'userID': req.body.userID }).then(function () {
            res.status(200).send('Success')
            console.log("Dataset Deleted")  // Success
        }).catch(function (error) {
            console.log(`${error} ===> Error while Dataset Deleting on ` + new Date().toLocaleString())      // Failure
        });
})