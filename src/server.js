const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectID;
var mailService = require('./Mail.js');
const saltRounds = 10; // Number of salt rounds
// const { Charts } = require('./Config/Models');
mongoose.set("strictQuery", true);
const cors = require("cors");
require('dotenv').config({path: "./.env"})

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
const url = "mongodb://localhost:27017/Data(i)";
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

app.post("/GetSingleTemplate", (req, res) => {
  let data = req.body;
  console.log("result   ====> ", data);
  connect();
  db.collection("charts")
    .findOne({ _id: ObjectId(data.id) })
    .then((result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        console.log("Template not found");
        res.status(404).send("Not Found");
      }
    })
    .catch((error) => {
      console.error("Error while querying MongoDB:", error);
      res.status(500).send("Internal Server Error");
    });
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

app.post("/GetDict/", (req, res) => {
  connect();
  console.log('connected')
  db.collection("charts")
  .find({SrcName: req.body.SrcName, userID: req.body.userID })
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
        console.log("Dictionary Data Fetched");
      }
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

// update the assigned user details
app.post("/InsertDataDict/", (req, res) => {
  let data = req.body;
  connect();
  db.collection("charts")
    .updateOne(
      { SrcName: data[0].SrcName, userID: data[0].userID },
      {
        $set: {
          DictionaryDataSet: data[1]
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
  bcrypt.hash(data["password"], saltRounds, function (err, hash) {
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
  const storedHash = "hashed_password_from_database"; // Retrieve from your database

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
        if (result == null) { res.send("User Not Found");}       
        else if (result != null) {
          bcrypt.compare(
            data.password,
            result.password,
            function (err, Authresult) {
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
                res.send("IncorrectPassword");
                console.log(
                  `${err} ===> Error while signin on ` +
                    new Date().toLocaleString()
                );
              }
            }
          );
        } else {
          res.status(422).send("UserDetails not found");
          console.log("Sign in attempt on " + new Date().toLocaleString());
        }
      }
    }
  );
});
app.post("/ForgotUser/", (req, res) => {
  let data = req.body;
  bcrypt.hash(data["password"], saltRounds, function (err, hash) { 
    if (err) {
      console.log(
        `${error} ===> Error while User Details insertion on ` +
        new Date().toLocaleString()
      );
      res.send("Error"); // Failure
    } else {
      connect();
    db.collection("UserDetails")
    .updateOne({ userID: data.FuserID }, { $set: { password: hash } })
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
     }
  })
  
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
          // Users: data.Users,
          // Groups: data.Groups,
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
//======================CAPITALIZE======================
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}
//======================RANDOMSTRING GENERATE======================
function generateRandomKey() {
  // Generate a random key (you can use a more secure method)
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
function encrypt(text, key) {
  // Perform encryption logic (replace with your encryption algorithm)
  // For simplicity, we'll use a basic XOR operation here
  let encryptedText = '';
  for (let i = 0; i < text.length; i++) {
    encryptedText += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return encryptedText;
}
function encryptEmail(email) {
  let encryptedEmail = '';
  for (let i = 0; i < email.length; i++) {
    let charCode = email.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      encryptedEmail += String.fromCharCode(((charCode - 65 + 13) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      encryptedEmail += String.fromCharCode(((charCode - 97 + 13) % 26) + 97);
    } else {
      encryptedEmail += email[i];
    }
  }
  return encryptedEmail;
}
//======================MAIL======================

app.post("/sendMail", (req, res, next) => {
  const email = req.body.RuserID;
  db.collection("UserDetails").findOne(
    { userID: email },
    function (err, result) {
     if (err) {
      res.status(400).send("Error fetching listings!");
        console.log(
          `${err} ===> Error while signin on ` + new Date().toLocaleString()
      );
      } else {
        if (result) {
          if(result.Status == "Inactive") {
            res.send("InActive");
            return;
          }
          else if(result.Status == 'Registered') {
            res.send("Registered");
            return;
          }
          else if(result.Status == 'Rejected') {
            res.send("Rejected");
            return;
          }
          else if (result.Status == "Active") {
            // Generate a random encryption key
            const key = generateRandomKey();
            // Encrypt the email address
            const encryptedEmail = encryptEmail(email);
            const url = process.env.FORGOT_EMAIL_URL + '=' + encryptedEmail
            content = 'Dear ' + capitalizeWords(result.Name) + ',<br/><br/> Kindly <a href="' + url + '">Click here</a> to set a new password.<br/><br/>Please feel free to reach our Admin, in case of any issues. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***'
            //Sending mail
            try {
              mailService(email,'Password Reset Request',content,'');
              res.status(200).send("Success");
              console.log("Reset Request"); // Success
              return;
            } catch (error) {
              res.send(error);
            }
          }
          else { res.send("This is not a valid User ID"); return; }
        }
        else if (result == null) {
          res.send("Not Found");
         console.log("User details Not Found");
         return;
        }
      }
    })
});
//======================USER DETAILS MAIL======================

app.post("/userDetailsEmail", (req, res, next) => {
  const useremail = req.body.useremail;  
  let content = '';
  if (req.body.userstatus == 'Active') {
    const url = process.env.LOGIN_URL
    content = 'Dear ' + capitalizeWords(req.body.username) + ',<br/><br/> We are delighted to inform you that your registration has been successfully <b>Approved!</b> You are now ready to access our system and enjoy its benefits.<br/><br/><b> Login Page:</b><a href="' + url + '">Click here</a><br/><br/>Please feel free to reach our Admin, in case of any issues. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***'
   }
  else if (req.body.userstatus == 'Inactive') { 
    content = 'Dear ' + capitalizeWords(req.body.username) + ',<br/><br/> Your user account has been changed to <b>Inactive</b>. Please contact admin for further details. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***'
  }
  else if (req.body.userstatus == 'Rejected') { 
    content = 'Dear ' + capitalizeWords(req.body.username) + ',<br/><br/> We are sorry to inform you that your user account is <b>Rejected</b>. Please contact admin for further details. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***'
  }
  else if (req.body.userstatus == 'Suspended') { 
    content = 'Dear ' + capitalizeWords(req.body.username) + ',<br/><br/> We are sorry to inform you that your user account is <b>Suspended</b>. Please contact admin for further details. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***'
  }
  try {
    mailService(useremail,'User Registration Status',content,'');
    res.status(200).send("Success");
    console.log("Reset Request"); // Success
    return;
  } catch (error) {
    res.send(error);
  }
  return;
})
