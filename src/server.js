const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
const app = express();
const bcrypt = require("bcrypt");
// const ObjectId = require("mongodb").ObjectID;
var mailService = require("./Mail.js");
const zlib = require("zlib"); // used to compress and decompress data
const saltRounds = 10; // Number of salt rounds
mongoose.set("strictQuery", true);
const cors = require("cors");
require("dotenv").config({ path: ".env" });

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
app.use(bodyParser.json({ limit: `150mb` }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
const url = "mongodb://0.0.0.0:27017/Data(i)";

// const url ="mongodb://admin:password@192.168.1.147:27017/Spectra?authSource=admin";

var db = mongoose.connection;
async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Try again", error);
  }
}
connect();

app.listen(3012, () => {
  console.log(`Server started on PORT 3012`);
});
//==================== PREDEFINED TEMPALTES============
app.post("/GetPreDefinedTemplate", (req, res) => {
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

// =================== checkTemplate is exist ==========
app.post("/CheckTemplateExist/", (req, res) => {
  console.log("====== CheckTemplateExist =========> ", req.body);
  db.collection("charts")
    .find({ Uploaded_fileID: req.body.id, userID: req.body.userID })
    .toArray() // Convert the cursor to an array
    .then(function (result) {
      res.json(result);
      console.log("CheckTemplateExist");
    })
    .catch(function (err) {
      res.status(400).send("Error fetching listings!");
      console.log(
        `${err} ===> Error while Template Fetching on ` +
          new Date().toLocaleString()
      );
    });
});

// ==================== TEMPLATE =======================
app.post("/GetTemplate/", async (req, res) => {
  try {
    const data = req.body;
    if (data.Flag.action === "All") {
      const result = await db
        .collection("charts")
        .aggregate([
          { $match: { userID: data.userID } },
          {
            $lookup: {
              from: "Dataset",
              localField: "Uploaded_fileID",
              foreignField: "_id",
              as: "filedata",
            },
          },
          {
            $project: {
              Chart: "$Chart",
              TempName: "$TempName",
              TempDescription: "$TempDescription",
              userID: "$userID",
              charts: "$charts",
              CheckType: "$CheckType",
              Uploaded_fileID: "$Uploaded_fileID",
              fileName: "$filedata.filename",
            },
          },
        ])
        .sort({ _id: 1 })
        .toArray();

      res.json(result);
      console.log("All Template Fetched");
    } else if (data.Flag.action === "singleTemplate") {
      const result = await db
        .collection("charts")
        .aggregate([
          { $match: { _id: data.id } },
          {
            $lookup: {
              from: "Dataset",
              localField: "Uploaded_fileID",
              foreignField: "_id",
              as: "Uploaded_file",
            },
          },
        ])
        .toArray();

      const temp = result;

      const compressedDataBuffer = Buffer.from(
        temp[0]?.["Uploaded_file"]?.[0]?.["data"],
        "base64"
      );

      const decompressedData = await zlib.inflateSync(compressedDataBuffer);

      temp[0]["Uploaded_file"] = JSON.parse(decompressedData.toString());

      res.json(temp);
      console.log("project details Fetched");
    } else {
      const result = await db
        .collection("charts")
        .aggregate([
          { $match: { _id: { $in: data.Flag.charts } } },
          {
            $lookup: {
              from: "Dataset",
              localField: "Uploaded_fileID",
              foreignField: "_id",
              as: "Uploaded_file",
            },
          },
        ])
        .toArray();

      const temp = result;
      let completedCount = 0;

      // Create a promise for decompression and parsing
      const decompressionPromises = temp.map((item) => {
        return new Promise((resolve, reject) => {
          const compressedDataBuffer = Buffer.from(
            item?.Uploaded_file?.[0]?.data,
            "base64"
          );

          zlib.inflate(compressedDataBuffer, (err, decompressedData) => {
            if (err) {
              console.error("Decompression error:", err);
              reject(err);
            } else {
              item.Uploaded_file = JSON.parse(decompressedData.toString());
              completedCount++;
              resolve();
            }
          });
        });
      });

      // Wait for all promises to complete
      await Promise.all(decompressionPromises);

      res.json(result);
      console.log("template reset details Fetched");
    }
  } catch (error) {
    console.error("GetTemplate ==> ", error);
    res.status(400).send("Error fetching listings!");
  }
});

app.post("/UpdateTemplate/", (req, res) => {
  let data = req.body;
  delete data.Uploaded_file;
  db.collection("charts")
    .updateOne(
      { _id: data["_id"] },
      {
        $set: data,
      }
    )
    .then(function () {
      res.status(200).send("Success");
      console.log("Template details Updated"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while User details Updation on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});

app.post("/GetSingleTemplate", (req, res) => {
  let data = req.body;
  db.collection("charts")
    .aggregate([
      { $match: { _id: data.id } },
      {
        $lookup: {
          from: "Dataset",
          localField: "Uploaded_fileID",
          foreignField: "_id",
          as: "Uploaded_file",
        },
      },
    ])
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
        console.log(
          `${err} ===> Error while Template Fetching on ` +
            new Date().toLocaleString()
        );
      } else {
        let temp = result;
        let compressedDataBuffer = Buffer.from(
          result[0]?.["Uploaded_file"]?.[0]?.["data"],
          "base64"
        );
        // Decompress the data
        zlib.inflate(compressedDataBuffer, (err, decompressedData) => {
          if (err) {
            console.error("Decompression error:", err);
          } else {
            // Use the decompressedData in your application
            // console.log("Decompressed data:", decompressedData.toString());
            temp[0]["Uploaded_file"] = JSON.parse(decompressedData.toString());
            res.json(temp);
            console.log("template reset details Fetched");
          }
        });
      }
    });
});

//Get the Project details based on id (used in project reset function)
app.post("/GetSingleData", (req, res) => {
  let data = req.body;
  console.log("/GetSingleData data", data);
  db.collection(data.CollectionName)
    .aggregate([
      {
        $match: { _id: Number(data.id) },
      },
      {
        $unwind: "$ChartIDs",
      },
      {
        $project: {
          _id: 0,
          key: { $objectToArray: "$ChartIDs" },
          cardValues: {
            $map: {
              input: { $objectToArray: "$cards" },
              as: "card",
              in: "$$card.v",
            },
          },
          DashboardID: "$_id",
        },
      },
      {
        $unwind: "$key",
      },
      {
        $project: {
          key: "$key.k",
          value: { $arrayElemAt: [{ $split: ["$key.v", " - "] }, 0] },
          DashboardID: "$DashboardID",
          cards: "$cardValues",
        },
      },
      {
        $project: {
          key: 1,
          chartID: { $toInt: "$value" },
          DashboardID: "$DashboardID",
          cards: "$cards",
        },
      },
      {
        $lookup: {
          from: "charts",
          localField: "chartID",
          foreignField: "_id",
          as: "ChartDetails",
        },
      },
      {
        $lookup: {
          from: "Dataset",
          localField: "ChartDetails.0.Uploaded_fileID",
          foreignField: "_id",
          as: "DatasetDetails",
        },
      },
      {
        $lookup: {
          from: "Dashboards",
          localField: "DashboardID",
          foreignField: "_id",
          as: "DashboardDetails",
        },
      },
      {
        $lookup: {
          from: "Cards",
          localField: "cards",
          foreignField: "_id",
          as: "CardDetails",
        },
      },
    ])
    .toArray(async (err, result) => {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fethcing projects on ` +
              new Date().toLocaleString()
          );
      } else {
        try {
          let temp = result;
          let completedCount = 0;

          // Iterate through the array and process each item
          temp.forEach((item, i) => {
            let compressedDataBuffer = Buffer.from(
              item.DatasetDetails[0].data,
              "base64"
            );

            zlib.inflate(compressedDataBuffer, (err, decompressedData) => {
              if (err) {
                console.error("Decompression error:", err);
              } else {
                // Assuming the decompressed data is in JSON format
                item.ChartDetails[0]["Uploaded_file"] = JSON.parse(
                  decompressedData.toString()
                );
                delete item.DatasetDetails;
                // Increment the completed count
                completedCount++;
                // If all items have been processed, send the response

                if (completedCount === temp.length) {
                  res.json(temp);
                }
              }
            });
          });
        } catch (error) {
          console.log("reset error", error);
        }
      }
    });
});

app.post("/getDatasetDetails", (req, res) => {
  let data = req.body;
  db.collection("Dataset")
    .aggregate([
      { $match: { _id: data.id, userID: data.userID } },
      {
        $lookup: {
          from: "Dictionary",
          localField: "_id",
          foreignField: "datasetID",
          as: "fileDetails",
        },
      },
      {
        $project: {
          userID: "$userID",
          filename: "$filename",
          // Uploadedfile: "$data",
          datatype: "$fileDetails.dataDictionary.datatype",
          displaynames: "$fileDetails.dataDictionary.displaynames",
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

app.post("/getDatasetDetails", (req, res) => {
  let data = req.body;
  db.collection("Dataset")
    .aggregate([
      { $match: { _id: data.id, userID: data.userID } },
      {
        $lookup: {
          from: "Dictionary",
          localField: "_id",
          foreignField: "datasetID",
          as: "fileDetails",
        },
      },
      {
        $project: {
          userID: "$userID",
          filename: "$filename",
          // Uploadedfile: "$data",
          datatype: "$fileDetails.dataDictionary.datatype",
          displaynames: "$fileDetails.dataDictionary.displaynames",
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

app.post("/InsertTemplate", async (req, res)  => {
  let data = req.body;
  let newId = await autoID("charts")
      data["_id"] = newId;
      db.collection("charts")
        .insertOne(data)
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

  db.collection("charts")
    .deleteOne(
      req.body.flag === "TemplateDelete"
        ? { _id: req.body.id, userID: req.body.userID }
        : { TempName: req.body.TempName, userID: req.body.userID }
    )
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

app.post("/GetDict/", async (req, res) => {
  try {
    const fetchData = async () => {
      const result = await db
        .collection("Dictionary")
        .find({ filename: req.body.SrcName, userID: req.body.userID })
        .toArray();

      if (result.length !== 0) {
        res.json(result);
      } else {
        // If the result is empty,fetchData function will call.
        setTimeout(fetchData, 1000);
      }
    };
    fetchData(); // Call the fetchData function initially
  } catch (err) {
    res
      .status(400)
      .send(
        `${err} ===> Error fetching projects on ` + new Date().toLocaleString()
      );
  }
});

//========= Get DataDictionary ========================
app.post("/GetDataDictionaty/", (req, res) => {
  console.log(" ============== GetDataDictionaty =======> ", req.body);
  db.collection("Dictionary")
    .find({ datasetID: req.body.id })
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
      }
    });
});

// =================== FEEDBACK =======================
app.get("/GetFeedback/", (req, res) => {
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
app.post("/InsertDataDict/", (req, res) => {
  let dataset = req.body;
  db.collection("Dictionary")
    .updateOne(
      { datasetID: dataset.datasetID },
      {
        $set: {
          userID: dataset.userID,
          datasetID: dataset.datasetID,
          filename: dataset.filename,
          dataDictionary: dataset.data,
        },
      },
      { upsert: true }
    )
    .then(function () {
      console.log("Dictionary inserted"); // Success
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
app.post("/InsertFeedback/", (req, res) => {
  let data = req.body;
  data["Date/Time"] = new Date();
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

function fnSaveData(data, alternextId, encrypted, password, res, approvedBY) {
  data.forEach((event, index) => {
    if (index == 0) {
      data[index]._id = alternextId;
    } else {
      data[index]._id = alternextId + 1;
    }
    data[index].Name = data[index].Name;
    data[index].userID = data[index].Email;
    data[index].password = encrypted;
    data[index].createdDate = new Date().toLocaleString();
    data[index].approvedBy = approvedBY;
    data[index].approvedDate = new Date().toLocaleString();
    data[index].Status = "Active";
    data[index].Group = data[index].Group || "External";
    data[index].Role = data[index].Role || "User";
    data[index].FirstTimeUser = "Y";
    alternextId = data[index]._id;
  });
  db.collection("UserDetails")
    .insertMany(data)
    .then(function () {
      const URL = process.env.LOGIN_URL;
      data.forEach((event, index) => {
        content =
          " Dear <b>" +
          capitalizeWords(data[index].Name) +
          "</b>,<br><br/><b><span style='font-size:16px'>&emsp;&emsp; Welcome to SpectraIQ !!</span></b> You are ready to use the product with the following credentials. <br/><br/> <b>User Name : " +
          data[index].userID +
          "</b><br><b>Password : " +
          password +
          "</b></br><br> Please <a href=" +
          URL +
          ">Click here</a> to login to Spectra IQ.<br><br> Note : You will be requested to change the password on your first login attempt. </br> If the above URL does not work, please feel free to reach our Admin in case of any queries.<br/><br>Thank you. <br/>Spectra IQ Team <br /><br>*** This is an automatically generated email, please do not reply ***";
        //Sending mail
        try {
          mailService(
            data[index].userID,
            "Your User Login Created Successfully !!",
            content,
            ""
          );
          if (data.length - 1 == index) {
            res.send("Success");
          }
          console.log("Bulk User "); // Success
        } catch (error) {
          res.send(error);
        }
      });
      // res.send('Success')
    });
}

// Function to get the next sequence value
async function autoID(colName) {
  try {
    const collection = db.collection(colName);
    // Find the highest _id value
    const highestIdDocument = await collection
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    if (highestIdDocument && highestIdDocument.length > 0) {
      const highestId = highestIdDocument[0]._id;
      // Generate the next available ID by incrementing the highest ID by 1
      const nextId = highestId + 1;
      return nextId;
    } else {
      // If no documents found, start with ID 1
      return 1;
    }
  } catch (error) {
    console.error("Error while generating auto ID:", error);
    throw error;
  }
}

//From BulkUser
// app.post("/BulkSignupUser/", (req, res) => {
//   let data = req.body.selectedfile;
//   let approvedBY = req.body.approvedby;
//   let password = "Test123@";
//   bcrypt.hash(password, saltRounds, function (err, hash) {
//     if (err) {
//       console.log(
//         `${err} ===> Error while User Details insertion on ` +
//           new Date().toLocaleString()
//       );
//       res.send("Error"); // Failure
//     } else {
//       // Store 'hash' in your database along with other user data
//       const encrypted = hash;
//       let alternextId;
//       connect();
//       fnGetNextCount() // Assuming "userId" is the field you want to auto-increment
//         .then((nextId) => {
//           alternextId = nextId + 1;
//           fnSaveData(data, alternextId, encrypted, password, res, approvedBY);
//         });

//       // res.send("Success");
//     }
//   });
// });

//From SingleUser
app.post("/NewSignupUser/", (req, res) => {
  let data = req.body;
  let password = "Test123@";
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.log(
        `${err} ===> Error while User Details insertion on ` +
          new Date().toLocaleString()
      );
      res.send("Error"); // Failure
    } else {
      // Store 'hash' in your database along with other user data
      const encrypted = hash;
      autoID("UserDetails") // Assuming "userId" is the field you want to auto-increment
        .then((nextId) => {
          data._id = nextId;
          data.Name = data.Name;
          data.userID = data.userID;
          data.password = encrypted;
          data.createdDate = new Date().toLocaleString();
          data.approvedBy = data.Adminuser;
          data.approvedDate = new Date().toLocaleString();
          data.Status = "Active";
          data.Group = data.Group || "External";
          data.Role = data.Role || "User";
          data.FirstTimeUser = "Y";
          db.collection("UserDetails")
            .insertOne(data)
            .then(function () {
              console.log("User Details inserted"); // Success
              const URL = process.env.LOGIN_URL;
              let content =
                " Dear <b>" +
                capitalizeWords(data.Name) +
                "</b>,<br><br/><b><span style='font-size:16px'>&emsp;&emsp; Welcome to SpectraIQ !!</span></b> You are ready to use the product with the following credentials. <br/><br/> <b>User Name : " +
                data.userID +
                "</b><br><b>Password : " +
                password +
                "</b></br><br> Please <a href=" +
                URL +
                ">Click here</a> to login to Spectra IQ.<br><br> Note : You will be requested to change the password on your first login attempt. </br> If the above URL does not work, please feel free to reach our Admin in case of any queries.<br/><br>Thank you. <br/>Spectra IQ Team <br /><br>*** This is an automatically generated email, please do not reply ***";
              //Sending mail
              try {
                mailService(
                  data.userID,
                  "Your User Login Created Successfully !!",
                  content,
                  data.Adminuser
                );
                res.send("Success");
                console.log("Reset Request"); // Success
                return;
              } catch (error) {
                res.send(error);
              }
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

app.post("/SignupUser/", (req, res) => {
  let data = req.body;
  delete data["Confirmpassword"];
  bcrypt.hash(data["password"], saltRounds, function (err, hash) {
    if (err) {
      console.log(
        `${err} ===> Error while User Details insertion on ` +
          new Date().toLocaleString()
      );
      res.send("Error"); // Failure
    } else {
      // Store 'hash' in your database along with other user data
      const encrypted = hash;
      autoID("UserDetails") // Assuming "userId" is the field you want to auto-increment
        .then((nextId) => {
          data._id = nextId;
          data.createdDate = new Date().toLocaleString();
          data.approvedBy = "NA";
          data.approvedDate = "NA";
          data.Group = "External";
          data.Role = "User";
          data.Status = "Registered";
          data.password = encrypted;
          data.FirstTimeUser = "N";
          data.updatedBy = "NA";
          data.updatedDate = "NA";
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
        if (result == null) {
          res.send("User Not Found");
        } else if (result != null) {
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
  const myDecipher = decipher("forgotEncriptSalt");
  const decryptedText = myDecipher(data.FuserID);
  console.log(" ==========================> ", data);
  bcrypt.hash(data["password"], saltRounds, function (err, hash) {
    if (err) {
      console.log(
        `${err} ===> Error while User Details insertion on ` +
          new Date().toLocaleString()
      );
      res.send("Error"); // Failure
    } else {
      console.log(" hash ==========================> ", hash);
      
      db.collection("UserDetails")
        .updateOne(
          { userID: decryptedText },
          { $set: { password: hash, FirstTimeUser: "N" } }
        )
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
  });
});
app.post("/CheckSignupUser/", (req, res) => {
  let data = req.body;
  
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
          res.status(202).send("User not found");
          console.log(
            "Checking user attempt on " + new Date().toLocaleString()
          );
        }
      }
    }
  );
});

// =================== Insert Cards values by franklin =======================
app.post("/CardSave", async (req, res) => {
  let data = [req.body];
  let newId = await autoID("Cards")
      data[0]["_id"] = newId;
      db.collection("Cards")
        .insertMany(data)
        .then(function () {
          res.status(200).send("Success");
          console.log("Card inserted"); // Success
        })
        .catch(function (error) {
          console.log(
            `${error} ===> Error while inserting Card on ` +
              new Date().toLocaleString()
          ); // Failure
        });
});

// =================== Get All Cards by franklin  =============
app.post("/GetCards", (req, res) => {
  let data = req.body;
  let collection = data.collection;
  let obj = {};
  if (data.flag === "specfig") {
    obj["_id"] = Number(data.id);
  } else {
    obj["userID"] = data.userID;
  }

  
  db.collection(collection)
    .find(obj)
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fetching GetCards! on ` +
              new Date().toLocaleString()
          );
      } else {
        console.log(" GetCards fetched");
        res.json(result);
      }
    });
});

// =================== update the cards based on id =======================
app.post("/UpdateCards", (req, res) => {
  let data = req.body;
  
  db.collection("Cards")
    .updateOne(
      { _id: Number(data._id) },
      {
        $set: data,
      }
    )
    .then(function () {
      res.status(200).send("Success");
      console.log("Cards Updated"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Cards Updation on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});

// =================== DASHBOARD =======================
app.post("/InsertDashboard", async(req, res) => {
  let data = [req.body];
  // data.push(req.body);
  let newId = await autoID("Dashboards")
      data[0]["_id"] = newId;
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

// app.post("/GetDashboard/", (req, res) => {
//   let { userID, flag } = req.body;
//   let obj = {};
//   if (flag === 0) obj = { userID: userID };
//   else obj = { Users: { $in: [userID] } };
//   console.log("/GetDashboard =======> ", obj);
//   
//   db.collection("Dashboards")
//     .find(obj)
//     .toArray(function (err, result) {
//       if (err) {
//         res
//           .status(400)
//           .send(
//             `${err} ===> Error fethcing projects on ` +
//               new Date().toLocaleString()
//           );
//       } else {
//         res.json(result);
//         console.log("Project Fetched");
//       }
//     });
// });

app.post("/GetDashboard/", (req, res) => {
  let { userID, flag } = req.body;
  let obj = {};
  obj = { userID: userID }; //{ $or: [{ userID: { $in: [userID] } }, { Users: { $in: [userID] } }] };
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

app.post("/getAssignedProjects/", (req, res) => {
  let { userID, Group } = req.body;
  let obj = {};
  obj = { $or: [{ Users: { $in: [userID] } }, { Groups: { $in: [Group] } }] };
  console.log("/getAssignedProjects =======> ", obj);
  
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

  console.log("UpdateDashboard data ===========> ", data);
  
  db.collection("Dashboards")
    .updateOne(
      { _id: Number(data.id) }, //, userID: data.userID - removed for assigned project issue
      {
        $set: {
          layouts: data.layouts,
          layoutOption: data.layoutOption,
          charts: data.charts,
          DashboardDescription: data.DashboardDescription,
          filterProps: data?.filterProps || [],
          filter: data?.filter || {},
          selectedFilterDimensions: data?.selectedFilterDimensions || [],
          IndividualFilter: data?.IndividualFilter || [],
          AvailableDimensions: data?.IndividualFilter,
          ChartIDs: data.ChartIDs,
          // Users: data.Users,
          // Groups: data.Groups,
        },
      }
    )
    .then(function () {
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

//========= dinamically deletete the project based on Collection  by franklin =========
app.post("/DeleteDashboard", (req, res) => {
  
  db.collection(req.body.collection)
    .deleteOne({
      _id: Number(req.body.id),
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
  let dataSet = req.body;
  autoID("Dataset").then((nextId) => {
    dataSet._id = dataSet._id || nextId;
    //===================== compress data =========================
    let originalData = JSON.stringify(dataSet.data);
    // Compress the data
    zlib.deflate(originalData, (err, compressedData) => {
      if (err) {
        console.error("Compression error:", err);
      } else {
        // Store the compressedData in MongoDB
        dataSet.data = compressedData.toString("base64");
        db.collection("Dataset")
          .insertOne(dataSet)
          .then(function () {
            res.status(200).send("Success");
            console.log("DataSet inserted"); // Success
          })
          .catch(function (error) {
            console.log(
              `${getLength} ===> Error while dataset insertion on ` +
                new Date().toLocaleString()
            ); // Failure
          });
      }
    });
  });
});

app.post("/GetDataset/", (req, res) => {
  
  db.collection("Dataset")
    // .find({ userID: req.body.userID })
    .aggregate([
      { $match: { userID: req.body.userID } },
      {
        $project: {
          filename: "$filename",
          UserGroup: "$userID",
        },
      },
    ])
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
        console.log("Dataset Fetched ==> /GetDataset");
      }
    });
});
app.post("/DeleteDataSet", (req, res) => {
  
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
app.post("/DeleteDict", (req, res) => {
  
  db.collection("Dictionary")
    .deleteOne({ filename: req.body.id, userID: req.body.userID })
    .then(function () {
      res.status(200).send("Success");
      console.log("Dictionary Deleted"); // Success
    })
    .catch(function (error) {
      console.log(
        `${error} ===> Error while Dataset Deleting on ` +
          new Date().toLocaleString()
      ); // Failure
    });
});

app.post("/UpdateDataSet/", (req, res) => {
  let DSuserID = req.body.userID;
  let DSdatasetID = req.body.datasetID;
  let DSfilename = req.body.filename;
  let DSdata = req.body.data;

  let originalData = JSON.stringify(DSdata.data || DSdata);
  // Compress the data
  zlib.deflate(originalData, (err, compressedData) => {
    if (err) {
      console.error("Compression error:", err);
    } else {
      data = compressedData.toString("base64");
      
      db.collection("Dataset")
        .updateOne(
          { userID: DSuserID, filename: DSfilename, _id: DSdatasetID },
          {
            $set: {
              data: data,
            },
          }
        )
        .then(function () {
          console.log("Dataset updated"); // Success
          res.send("Success");
        })
        .catch(function (error) {
          console.log(
            `${error} ===> Error while Feedback update on ` +
              new Date().toLocaleString()
          );
          res.send("Error"); // Failure
        });
    }
  });
});

// ====== Gte the single updaloaded file data
app.post("/GetIDDataSet/", (req, res) => {
  
  let query = {
    userID: req.body.userID,
  };

  if (req.body.flag === "cardData") {
    query["_id"] = Number(req.body.id);
  } else {
    query["filename"] = req.body.id;
  }
  try {
    db.collection("Dataset")
      .find(query)
      .toArray(function (err, result) {
        if (err) {
          res
            .status(400)
            .send(
              `${err} ===> Error fethcing dataset on ` +
                new Date().toLocaleString()
            );
        } else {
          let compressedDataBuffer = Buffer.from(result[0].data, "base64");
          // Decompress the data
          zlib.inflate(compressedDataBuffer, (err, decompressedData) => {
            if (err) {
              console.error("Decompression error:", err);
            } else {
              // Use the decompressedData in your application
              result[0].data = JSON.parse(decompressedData.toString());
              res.json(result);
              console.log("GetIDDataSet Fetched");
            }
          });
        }
      });
  } catch (error) {
    res.status(202).send();
    console.log("error in => GetIDDataSet", error);
  }
});

app.post("/GetUseDataSet/", (req, res) => {
  
  db.collection("Dataset")
    .aggregate([
      { $match: { userID: req.body.userID, filename: req.body.filename } },
      {
        $lookup: {
          from: "Dictionary",
          localField: "_id",
          foreignField: "datasetID",
          as: "filedata",
        },
      },
      {
        $project: {
          _id: "$_id",
          userID: "$userID",
          filename: "$filename",
          data: "$data",
          filedata: { $arrayElemAt: ["$filedata.dataDictionary", 0] },
        },
      },
    ])
    .toArray(function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `${err} ===> Error fethcing dataset on ` +
              new Date().toLocaleString()
          );
      } else {
        let compressedDataBuffer = Buffer.from(result[0].data, "base64");
        // Decompress the data
        zlib.inflate(compressedDataBuffer, (err, decompressedData) => {
          if (err) {
            console.error("Decompression error:", err);
          } else {
            // Use the decompressedData in your application
            result[0].data = JSON.parse(decompressedData.toString());
            res.json(result);
          }
        });
        //res.json(result);
        console.log("Dataset Fetched ==> /GetUseDataSet");
      }
    });
});
// =================== Chart File Check =======================
app.post("/GetChartsSrc/", (req, res) => {
  
  db.collection("charts")
    .find({ userID: req.body.userID, SrcName: req.body.filename })
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
        console.log("Fetched");
      }
    });
});

//====================== ADMIN ===================
app.post("/GetUsers/", (req, res) => {
  
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
  
  db.collection("Dashboards")
    .aggregate([
      { $match: { _id: Number(data.id) } }, //, userID: data.userID - removed for assign project
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
  
  db.collection("Dashboards")
    .updateOne(
      { _id: Number(data.id) }, //, userID: data.userID - removed for assign project
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

//=========== update the UserDetails collection =======
app.post("/SaveUsers/", (req, res) => {
  let data = req.body;
  const query =
    data.flag === "specific" ? { userID: data.userID } : { _id: data._id };
  console.log(data);
  
  db.collection("UserDetails")
    .updateOne(query, {
      $set: data,
    })
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

// this api call each 5sec for wheather the login time greater then or not
app.post("/checkCurUserLogin/", (req, response) => {
  let data = req.body;
  
  db.collection("UserDetails")
    .find({ userID: data.userID }) // find the user based on the ID
    .toArray(function (err, result) {
      if (err) {
        console.log("error in checkCurUserLogin", err);
        response.status(500).send("Internal Server Error"); // Handle the error
      } else if (result.length > 0 && result[0].loginTime > data.loginTime) {
        let loginTime = new Date().getTime();
        db.collection("UserDetails")
          .updateOne(
            { userID: data.userID }, // update the details based on the userID
            {
              $set: {
                // loginTime: undefined,
                logoutTime: null,
              },
            }
          )
          .then(function () {
            response.status(200).send(true);
          });
      } else {
        response.status(202).send("no need to logout");
      }
    });
});

//======================CAPITALIZE======================
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

//======================MAIL======================

const cipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (text) =>
    text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
};

const decipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
};

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
          if (result.Status == "Inactive") {
            res.send("InActive");
            return;
          } else if (result.Status == "Registered") {
            res.send("Registered");
            return;
          } else if (result.Status == "Rejected") {
            res.send("Rejected");
            return;
          } else if (result.Status == "Active") {
            const myCipher = cipher("forgotEncriptSalt");
            const encryptedEmail = myCipher(email);
            const url = process.env.FORGOT_EMAIL_URL + "=" + encryptedEmail;
            let content =
              "Dear " +
              capitalizeWords(result.Name) +
              ',<br/><br/> Kindly <a href="' +
              url +
              '">Click here</a> to set a new password.<br/><br/>Please feel free to reach our Admin, in case of any issues. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***';
            //Sending mail
            try {
              mailService(email, "Password Reset Request", content, "");
              res.status(200).send("Success");
              console.log("Reset Request"); // Success
              return;
            } catch (error) {
              res.send(error);
            }
          } else {
            res.send("This is not a valid User ID");
            return;
          }
        } else if (result == null) {
          res.send("Not Found");
          console.log("User details Not Found");
          return;
        }
      }
    }
  );
});
//======================DATASET FILENAME CHECK======================
app.post("/GetCheckDataFile/", (req, res) => {
  
  db.collection("Dataset")
    .find({ userID: req.body.userID, filename: req.body.filename })
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
        console.log("Fetched");
      }
    });
});

//======================USER DETAILS MAIL======================

app.post("/userDetailsEmail", (req, res, next) => {
  const useremail = req.body.useremail;
  let content = "";
  console.log("userDetailsEmail ===> ", req.body);
  if (!req.body.flag) {
    res.status(200).send("Success");
  } else {
    try {
      if (req.body.userstatus == "Active") {
        const url = process.env.LOGIN_URL;
        content =
          "Dear " +
          capitalizeWords(req.body.username) +
          ',<br/><br/> We are delighted to inform you that your registration has been successfully <b>Approved!</b> You are now ready to access our system and enjoy its benefits.<br/><br/><b> Login Page:</b><a href="' +
          url +
          '">Click here</a><br/><br/>Please feel free to reach our Admin, in case of any issues. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***';
      } else if (
        req.body.userstatus !== "Active" &&
        req.body.userstatus !== undefined &&
        req.body.userstatus !== "Registered"
      ) {
        content =
          "Dear " +
          capitalizeWords(req.body.username) +
          ",<br/><br/> Your user account has been changed to <b>" +
          req.body.userstatus +
          "</b>. Please contact admin for further details. <br/><br/> Thanking you. <br/>SpectraIQ Team <br/><br />*** This is an automatically generated email, please do not reply ***";
      }

      mailService(useremail, "User Registration Status", content, "");
      res.status(200).send("Success");
      console.log("Reset Request"); // Success
    } catch (error) {
      res.send(error);
    }
  }
});

//============================== From BulkUser =========
app.post("/BulkSignupUser/", (req, res) => {
  let data = req.body.selectedfile;
  insertUserData(data, req, res);
});

// Function to check if a user exists
async function checkUserExists(db, user) {
  const userCollection = db.collection("UserDetails");
  const existingUser = await userCollection.findOne({ userID: user.Email });
  return existingUser !== null;
}

async function insertUserData(data, req, res) {
  try {
    const userCollection = db.collection("UserDetails");
    // Check if all records exist
    const existingUsers = await Promise.all(
      data.map((user) => checkUserExists(db, user))
    );
    if (existingUsers.some((userExists) => userExists)) {
      // If at least one record exists, throw an error
      // throw new Error('User(s) already exist');
      res.send("Users already exist");
    } else {
      // Insert only the records that do not exist
      const newUsers = data.filter((user, index) => !existingUsers[index]);
      if (newUsers.length > 0) {
        let approvedBY = req.body.approvedby;
        let password = "Test123@";
        let alternextId = 0;
        autoID("UserDetails") // Assuming "userId" is the field you want to auto-increment
          .then((nextId) => {
            alternextId = nextId;
          });
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            console.log(
              `${err} ===> Error while User Details insertion on ` +
                new Date().toLocaleString()
            );
            res.send("Error"); // Failure
          } else {
            const encrypted = hash;
            data.forEach((event, index) => {
              data[index]._id = alternextId + 1;
              data[index].Name = data[index].Name;
              data[index].userID = data[index].Email;
              data[index].password = encrypted;
              data[index].createdDate = new Date().toLocaleString();
              data[index].approvedBy = approvedBY;
              data[index].approvedDate = new Date().toLocaleString();
              data[index].Status = "Active";
              data[index].Group = data[index].Group || "External";
              data[index].Role = data[index].Role || "User";
              data[index].FirstTimeUser = "Y";
              alternextId = data[index]._id;
              let datalength = data.length - 1;
              if (datalength === index) {
                db.collection("UserDetails")
                  .insertMany(data)
                  .then(function () {
                    const URL = process.env.LOGIN_URL;
                    data.forEach((event, mailindex) => {
                      content =
                        " Dear <b>" +
                        capitalizeWords(data[mailindex].Name) +
                        "</b>,<br><br/><b><span style='font-size:16px'>&emsp;&emsp; Welcome to SpectraIQ !!</span></b> You are ready to use the product with the following credentials. <br/><br/> <b>User Name : " +
                        data[mailindex].userID +
                        "</b><br><b>Password : " +
                        password +
                        "</b></br><br> Please <a href=" +
                        URL +
                        ">Click here</a> to login to Spectra IQ.<br><br> Note : You will be requested to change the password on your first login attempt. </br> If the above URL does not work, please feel free to reach our Admin in case of any queries.<br/><br>Thank you. <br/>Spectra IQ Team <br /><br>*** This is an automatically generated email, please do not reply ***";

                      //Sending mail
                      try {
                        mailService(
                          data[mailindex].userID,
                          "Your User Login Created Successfully !!",
                          content,
                          ""
                        );
                        let lendecr = data.length - 1;
                        console.log("Bulk User "); // Success
                        if (lendecr === mailindex) {
                          console.log("Success condition met");
                          res.send("Success");
                          return;
                        } else {
                          console.log("Condition not met");
                        }
                      } catch (error) {
                        res.send(error);

                        return;
                      }
                    });
                  });
              }
            });
          }
        });

        console.log("Data inserted successfully");
      } else {
        res.send("Not Success");
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
  }
}
