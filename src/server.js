const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds
// const { Charts } = require('./Config/Models');
mongoose.set("strictQuery", true);
const cors = require("cors");

app.use(
  cors({
    origin: `*`,
    credentials: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json({ limit: `50mb` }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const url = "mongodb://localhost:27017/Spectra";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "antoxavier44@gmail.com",
    pass: "vpgcmgpaikunfsqg",
  },
});
var db = mongoose.connection;
async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false
    });
    //console.log('Connected Successfully, Happy coding!!!')
  } catch (error) {
    console.log("Try again", error);
  }
}
connect();

app.listen(3012, () => {
  // console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV}`)
  console.log(`Server started on PORT 3012`);
});
//==================== PREDEFINED TEMPALTES============
app.post("/GetPreDefinedTemplate", (req, res) => {
  connect();
  db.collection("PredefinedTemplates")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
        console.log(
          `${err} ===> Error while Predefined Template Fetching on ` +
            new Date().toLocaleString()
        );
      } else {
        res.json(result);
        console.log("Predefined Template Fetched");
      }
    });
});
// ==================== TEMPLATE =======================
app.post("/GetTemplate/", (req, res) => {
  const data = req.body;
  connect();
  if (data.Flag.action === "All") {
    db.collection("charts")
      .find({ userID: data.userID })
      .sort({ _id: 1 })
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(
            `${err} ===> Error while Template Fetching on ` +
              new Date().toLocaleString()
          );
        } else {
          res.json(result);
          console.log("All Template Fetched");
        }
      });
  } else {
    db.collection("charts")
      //.find({ userID: data.userID, TempName: { $in: data.Flag.charts } })
      .find({ TempName: { $in: data.Flag.charts } })
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(
            `${err} ===> Error while Specific Template Fetching on ` +
              new Date().toLocaleString()
          );
        } else {
          res.json(result);
          console.log("Specific Template Fetched");
        }
      });
  }
});
app.post("/InsertTemplate", (req, res) => {
  let data = [];
  data.push(req.body);
  connect();
  db.collection("charts")
    .insertMany(data)
    .then(function () {
      res.status(200).send("Success");
      console.log("Template inserted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Template inserting on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
app.post("/DeleteTemplate", (req, res) => {
  connect();
  db.collection("charts")
    .deleteOne({ TempName: req.body.TempName, userID: req.body.userID })
    .then(function () {
      res.status(200).send("Success");
      console.log("Template Deleted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Template Deleting on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
// =================== FEEDBACK =======================
app.get("/GetFeedback/", (req, res) => {
  connect();
  db.collection("Feedback")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fetching feedback! on ` +
              new Date().toLocaleString()
          );
      } else {
        res.json(result);
        console.log("Feedback fetched");
      }
    });
});
app.post("/InsertFeedback/", (req, res) => {
  let data = req.body;
  data["Date/Time"] = new Date();
  connect();
  db.collection("Feedback")
    .insertOne(data)
    .then(function () {
      console.log("Feedback inserted"); // Success
      res.send("Success");
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Feedback insertion on ` +
          new Date().toLocaleString()
      );
      res.send("Error"); // Failure
    });
});
// ============== SIGNUP/SIGNIN/FORGOT PASSWORD  ========
// Function to get the next sequence value
function fnGetNextCount() {
  connect();
  const sequenceDocument = db.collection("UserDetails").count();
  return sequenceDocument;
}

app.post("/SignupUser/", (req, res) => {
  let data = req.body;
  delete data["Confirmpassword"];
  bcrypt.hash(data["password"], saltRounds, function(err, hash) {
  if (err) {
    console.log(
      `${error} ===> Error while User Details insertion on ` +
        new Date().toLocaleString()
    );
    res.send("Error"); // Failure
  } else {
    // Store 'hash' in your database along with other user data   
    const encrypted = hash;    
  connect();
  fnGetNextCount() // Assuming "userId" is the field you want to auto-increment
    .then((nextId) => {
      data._id = nextId + 1;
      data.createdDate = new Date();
      data.approvedBy = "";
      data.approvedDate = "";
      data.Status = "Registered";
      data.password = encrypted;     
      db.collection("UserDetails")
        .insertOne(data)
        .then(function () {
          console.log("User Details inserted"); // Success
          res.send("Success");
        })
        .catch(function (error) {
          console.log(
            `${error} ===> Error while User Details insertion on ` +
              new Date().toLocaleString()
          );
          res.send("Error"); // Failure
        });
    });
  }
  });
    
});
app.post("/SigninUser/", (req, res) => {
  let data = req.body;
  const storedHash = 'hashed_password_from_database'; // Retrieve from your database


  connect();
  db.collection("UserDetails").findOne(
    //{ userID: data.userID, password: data.password },
    { userID: data.userID },
    function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
        console.log(
          `${err} ===> Error while signin on ` + new Date().toLocaleString()
        );
      } else {
        if (result) {
          bcrypt.compare(data.password, result.password, function(err, Authresult) {
            if (err) {
              // Handle error
            } else if (Authresult === true) {
              // Authentication successful
          res.status(200).send(result);
          console.log(
            `${result.Name} Signed in on ` + new Date().toLocaleString()
          );
            } else {
              // Authentication failed
              res.status(400).send("Error fetching listings!");
        console.log(
          `${err} ===> Error while signin on ` + new Date().toLocaleString()
        );
            }
          });          
        } else {
          res.status(404).send("User not found");
          console.log("Sign in attempt on " + new Date().toLocaleString());
        }
      }
    }
  );
});
app.post("/ForgotUser/", (req, res) => {
  let data = req.body;
  connect();
  db.collection("UserDetails")
    .updateOne({ userID: data.FuserID }, { $set: { password: data.password } })
    .then(function () {
      console.log("User Details updated"); // Success
      res.send("Success");
    })
    .catch(function (error) {
      console.log(error);
      res.send(
        `${error} ===> Error while User Details updation on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
app.post("/CheckSignupUser/", (req, res) => {
  let data = req.body;
  connect();
  db.collection("UserDetails").findOne(
    { userID: data.userID },
    function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
        console.log(
          `${err} ===> Error while checking on ` + new Date().toLocaleString()
        );
      } else {
        if (result) {
          res.status(200).json(result);
          console.log("Checking user");
        } else {
          res.status(404).send("User not found");
          console.log(
            "Checking user attempt on " + new Date().toLocaleString()
          );
        }
      }
    }
  );
});
// =================== DASHBOARD =======================
app.post("/InsertDashboard", (req, res) => {
  let data = [];
  data.push(req.body);
  connect();
  db.collection("Dashboards")
    .insertMany(data)
    .then(function () {
      res.status(200).send("Success");
      console.log("Dashboard inserted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while inserting dashboard on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
//db.getCollection('Dashboards').find({ 'DashboardName': { $in: ["45", "All the charts"] } })
//db.getCollection('Dashboards').find({ 'Users': { $in: ["Naveen"] }})

app.post("/GetDashboard/", (req, res) => {
  let { userID, flag } = req.body;
  let obj = {};
  if (flag === 0) obj = { userID: userID };
  else obj = { Users: { $in: [userID] } };
  connect();
  db.collection("Dashboards")
    .find(obj)
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fethcing projects on ` +
              new Date().toLocaleString()
          );
      } else {
        res.json(result);
        console.log("Project Fetched");
      }
    });
});
app.post("/UpdateDashboard", (req, res) => {
  let data = req.body;
  connect();
  db.collection("Dashboards")
    .updateOne(
      { DashboardName: data.DashboardName, userID: data.userID },
      {
        $set: {
          layouts: data.layouts,
          layoutOption: data.layoutOption,
          charts: data.charts,
          DashboardDescription: data.DashboardDescription,
          filterProps: data.FilterProps,
          filter: data.Filter,
          selectedFilterDimensions: data.selectedFilterDimensions,
          Users: data.Users,
          Groups: data.Groups,
        },
      }
    )
    .then(function () {
      //.deleteOne({ 'DashboardName': req.body.DashboardName, 'userID': req.body.userID }).then(function () {
      res.status(200).send("Success");
      console.log("Dashboard Updated"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Dashboard Updation on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
app.post("/DeleteDashboard", (req, res) => {
  connect();
  db.collection("Dashboards")
    .deleteOne({
      DashboardName: req.body.DashboardName,
      userID: req.body.userID,
    })
    .then(function () {
      res.status(200).send("Success");
      console.log("Project Deleted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Project Deleting on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
// =================== DATASET =======================
app.post("/InsertDataSet", (req, res) => {
  let data = [];
  data.push(req.body);
  connect();
  db.collection("Dataset")
    .insertMany(data)
    .then(function () {
      res.status(200).send("Success");
      console.log("DataSet inserted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while dataset insertion on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});
app.post("/GetDataset/", (req, res) => {
  connect();
  db.collection("Dataset")
    .find({ userID: req.body.userID })
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fethcing dataset on ` +
              new Date().toLocaleString()
          );
      } else {
        res.json(result);
        console.log("Dataset Fetched");
      }
    });
});
app.post("/DeleteDataset", (req, res) => {
  connect();
  db.collection("Dataset")
    .deleteOne({ filename: req.body.id, userID: req.body.userID })
    .then(function () {
      res.status(200).send("Success");
      console.log("Dataset Deleted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Dataset Deleting on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});

//====================== ADMIN ===================
app.post("/GetUsers/", (req, res) => {
  connect();
  db.collection("UserDetails")
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fethcing projects on ` +
              new Date().toLocaleString()
          );
      } else {
        res.json(result);
        console.log("Users Fetched");
      }
    });
});

// get the Assigned User details for project assigned details
app.post("/GetAssignedUsers/", (req, res) => {
  let data = req.body;
  connect();
  db.collection("Dashboards")
    .aggregate([
      { $match: { DashboardName: data.DashboardName, userID: data.userID } },
      {
        $lookup: {
          from: "UserDetails",
          localField: "Users",
          foreignField: "userID",
          as: "UserDetails",
        },
      },
      {
        $project: {
          UserName: "$UserDetails.Name",
          UserGroup: "$UserDetails.Group",
          userID: "$UserDetails.userID",
          AssignedGroups: "$Groups",
          AssignedUsers: "$Users",
        },
      },
    ])
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fethcing projects on ` +
              new Date().toLocaleString()
          );
      } else {
        res.json(result);
      }
    });
});

// update the assigned user details
app.post("/AssignUsers/", (req, res) => {
  let data = req.body;
  connect();
  db.collection("Dashboards")
    .updateOne(
      { DashboardName: data.DashboardName, userID: data.userID },
      {
        $set: {
          Users: data.Users,
          Groups: data.Groups,
        },
      }
    )
    .then(function () {
      res.status(200).send("Success");
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Assigning User on ` +
          new Date().toLocaleString()
      );
    });
});

app.post("/SaveUsers/", (req, res) => {
  let data = req.body;
  console.log(data);
  connect();
  db.collection("UserDetails")
    .updateOne(
      { _id: data["_id"] },
      {
        $set: data,
      }
    )
    .then(function () {
      res.status(200).send("Success");
      console.log("User details Updated"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while User details Updation on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});

//======================MAIL======================

app.post("/sendMail", (req, res, next) => {
  const name = req.body.name;
  const message = req.body.messageHtml;
  var mail = {
    from: "naveenkumarm572@gmail.com",
    to: "antoxavier44@gmail.com",
    subject: "SpectraIQ",
    html: message,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: "fail",
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  });
});
