import React, { useState, useEffect, useRef } from "react";
import info from "../../src/Images/icons-info.png";
import Button from "@mui/material/Button";
import * as xlsx from "xlsx";
import Papa from "papaparse";
import axios from "axios";
import Swal from "sweetalert2";

const AdminBulkUser = () => {
  const inputRef = useRef(null);
  const [user, setUser] = React.useState({
    userName: sessionStorage.getItem("UserName").split(",")[0],
    userID: sessionStorage.getItem("UserName").split(",")[1],
    Role: sessionStorage.getItem("Role"),
  });
  const [isButtonDisabled, setisButtonDisabled] = useState(true);
  useEffect(() => {
    setisButtonDisabled(true);
  }, []);

  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const clearFileName = () => {
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    if (event == "") {
      setSelectedFile(null);
      return;
    }
    const file = event.target.files[0];
    if (file) {
      setisButtonDisabled(false);
      if (
        event.target.files[0].type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        event.target.files[0].type === "application/vnd.ms-excel"
      ) {
        {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(worksheet);
            setSelectedFile(json);
          };
          reader.readAsArrayBuffer(event.target.files[0]);
        }
      } else if (event.target.files[0].type === "text/csv") {
        Papa.parse(event.target.files[0], {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            setSelectedFile(results.data);
          },
        });
      }
    }
  };
  //    const handlePost = (e) => {
  //      if (selectedFile) {
  //          axios
  //            .post(`http://${path.Location}:${path.Port}/BulkSignupUser`, {
  //              selectedfile: selectedFile,
  //              approvedby:user.userID
  //            })
  //            .then((response) => {
  //              if (response.data == 'Success') {
  //                Swal.fire('Registered Successfully');
  //                setisButtonDisabled(true);
  //                clearFileName();
  //                handleFileChange('');
  //                inputRef.current.value = ''
  //              }
  //              else {  Swal.fire('Registeration not Successfully. Please check upload file.');}
  //             })
  //             .catch((error) => {
  //                console.log(error);
  //             });
  //       }
  //       else {
  //          Swal.fire('Please select a file first.');
  //        }

  //  }

  const handlePost = (e) => {
    if (selectedFile) {
      axios
        .post(`http://${path.Location}:${path.Port}/BulkSignupUser`, {
          selectedfile: selectedFile,
          approvedby: user.userID,
        })
        .then((response) => {
          if (response.data == "Success") {
            Swal.fire({
              icon: 'success',
              title: "Registered Successfully"
            });
          } else if (response.data == "Users already exist") {
            Swal.fire(
              {
                icon: 'warning',
                title: "Registeration not Successfully. Users already exist.Please check the upload file."
              }
            );
          } else {
            Swal.fire(
             {
              icon: 'warning',
              title:  "Registeration not Successfully. Please check the upload file."
             }
            );
          }
          setisButtonDisabled(true);
          clearFileName();
          handleFileChange("");
          inputRef.current.value = "";
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire({
        icon: 'warning', 
        title: "Please select a file first."
      });
    }
  };

  return (
    <div>
      <p className="page-title">User Information</p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
      />
      <Button
        id="saveTemp"
        variant="contained"
        disableRipple="false"
        className="input-field button"
        style={{ backgroundColor: "#6282b3", marginLeft: "10px" }}
        onClick={(e) => {
          handlePost(e);
        }}
        disabled={isButtonDisabled}
      >
        Register
      </Button>

      <div style={{ margin: "20px" }}>
        <img src={info} style={{ width: "25px", margin: "5px" }}></img>
        Only upload an Excel or CSV.
      </div>
    </div>
  );
};

export default AdminBulkUser;
