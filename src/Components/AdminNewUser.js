import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
//npm's
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

//Components
import "../Styles/Login.css";
import Swal from "sweetalert2";

const AdminNewUser = ({ onResponse }) => {
  const [isButtonDisabled, setisButtonDisabled] = useState(false);
  const Groupddl = ["Select", "Sales", "Finance", "Marketing", "External"];
  const Roleddl = ["Select", "Admin", "Creator", "User"];

  const [user, setUser] = React.useState({
    userName: sessionStorage.getItem("UserName").split(",")[0],
    userID: sessionStorage.getItem("UserName").split(",")[1],
    Role: sessionStorage.getItem("Role"),
  });

  const [error, setError] = React.useState({
    Restiction: "",
  });

  const [validation, setvalidation] = React.useState({
    userID: {
      error: false,
      errorMessage: "Please enter",
    },
    Name: {
      error: false,
      errorMessage: "Please enter",
    },
    Role: {
      error: false,
      errorMessage: "Please enter",
    },
    Group: {
      error: false,
      errorMessage: "Please enter",
    },
  });

  const handleDropdownChange = (e, fromddl) => {
    if (e.target.name === "Group") {
      if (e.target.value === "Select") {
        setisButtonDisabled(true);
        setvalidation({
          ...validation,
          Group: {
            ...validation.Group,
            error: true,
            errorMessage: "Select Group",
          },
        });
        return;
      } else {
        setisButtonDisabled(false);
        setvalidation({
          ...validation,
          Group: {
            ...validation.Group,
            error: false,
            errorMessage: "",
          },
        });
      }
    }

    if (e.target.name === "Role") {
      if (e.target.value === "Select") {
        setisButtonDisabled(true);
        setvalidation({
          ...validation,
          Role: {
            ...validation.Role,
            error: true,
            errorMessage: "Select Role",
          },
        });
        return;
      } else {
        setisButtonDisabled(false);
        setvalidation({
          ...validation,
          Role: {
            ...validation.Role,
            error: false,
            errorMessage: "",
          },
        });
      }
    }

    setUserDetails({ ...userDetails, [fromddl]: e.target.value });
  };

  const checkNotEmpty = () => {
    if (
      document.getElementById("Name").value != "" &&
      document.getElementById("UserId").value != "" &&
      validation.userID?.errorMessage == "" &&
      document.getElementById("groupddl").value != "Select" &&
      document.getElementById("roleddl").value != "Select"
    ) {
      setisButtonDisabled(false);
    } else {
      setisButtonDisabled(true);
    }
  };

  const handleDetails = (e, page) => {
    if (e.target.name === "Name") {
      let abc = /^[a-zA-Z ]*$/;
      if (!abc.test(e.target.value)) {
        setisButtonDisabled(true);
        setvalidation({
          ...validation,
          Name: {
            ...validation.Name,
            error: true,
            errorMessage: "Name should contain only alphabets",
          },
        });

        return;
      } else if (
        e.target.value.trim() === undefined ||
        e.target.value.trim().length === 0 ||
        e.target.value.trim() === null
      ) {
        setisButtonDisabled(true);
        setvalidation({
          ...validation,
          [e.target.name]: {
            ...validation[e.target.name],
            error: true,
            errorMessage: "Name should not be empty.",
          },
        });
        return;
      } else {
        setisButtonDisabled(false);
        setvalidation({
          ...validation,
          Name: {
            ...validation.Name,
            error: false,
            errorMessage: "",
          },
        });
      }
    }
    if (e.target.name === "userID") {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(e.target.value)) {
        setisButtonDisabled(true);
        setvalidation({
          ...validation,
          userID: {
            ...validation.userID,
            error: true,
            errorMessage: "Invaild Email Address",
          },
        });
      } else {
        setisButtonDisabled(false);
        setvalidation({
          ...validation,
          userID: {
            ...validation.userID,
            error: false,
            errorMessage: "",
          },
        });
      }
    }

    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  //handleKeyDown is for to restrict the special characters.
  const handleKeyDown = (e) => {
    // if (e.key === " ") {
    //   e.preventDefault();  // Prevent default behavior (space insertion)
    // }

    // List of special characters you want to restrict

    if (e.target.name === "Name") {
      const restrictedCharacters_Name = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "-",
        "=",
        "+",
        "{",
        "}",
        "[",
        "]",
        "|",
        ";",
        ":",
        '"',
        "'",
        "<",
        ">",
        "?",
        "/",
        ",",
        ".",
        "~",
        "_",
        "`",
        "\\",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ];
      if (restrictedCharacters_Name.includes(e.key)) {
        e.preventDefault(); // Prevent default behavior (character insertion)
      }
    }
    if (e.target.name === "userID") {
      const restrictedCharacters_Email = [
        "!",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "-",
        "=",
        "+",
        "{",
        "}",
        "[",
        "]",
        "|",
        ";",
        ":",
        '"',
        "'",
        "<",
        ">",
        "?",
        "/",
        ",",
        "~",
        "\\",
        "`",
      ];
      if (restrictedCharacters_Email.includes(e.key)) {
        e.preventDefault(); // Prevent default behavior (character insertion)
      }
    }
    checkNotEmpty();
  };

  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });
  const [userDetails, setUserDetails] = React.useState({
    Name: "",
    userID: "",
    Group: "",
    Role: "",
    Adminuser: user.userName,
  });

  const CheckUser = async (value) => {
    try {
      let response = await axios.post(
        `http://${path.Location}:${path.Port}/CheckSignupUser`,
        {
          userID: value,
        }
      );
      if (response.status === 200) {
        setvalidation({
          ...validation,
          userID: {
            ...validation.userID,
            error: true,
            errorMessage: "Already exist",
          },
        });
        setisButtonDisabled(true);
        return true;
      } else {
        setisButtonDisabled(false);
        return false;
      }

      // if (
      //   document.getElementById("Name").value !== "" &&
      //   document.getElementById("UserId").value !== "" &&
      //   document.getElementById("groupddl").value !== "Select" &&
      //   document.getElementById("roleddl").value !== "Select" &&
      //   validation.Name?.errorMessage == "" &&
      //   validation.userID?.errorMessage == ""
      // ) {
      //   setisButtonDisabled(false);
      // }
      // return;
    } catch (err) {
      console.error("Error in New user Registration", err);
      return;
    }
  };

  const handlePost = async (page) => {
    if (page === "SingleUser") {
      // To check Already exist email id and Empty fields
      const result = await CheckUser(userDetails.userID);
      if (result) {
        setisButtonDisabled(true);
        return;
      } else {
        // To check empty Name field
        if (userDetails.Name === "") {
          setisButtonDisabled(true);
          setvalidation({
            ...validation,
            Name: {
              ...validation.Name,
              error: true,
              errorMessage: "Name should not be empty.",
            },
          });
          return;
        } else if (validation.Name.error) {
          return;
        } else {
          setisButtonDisabled(false);
          setvalidation({
            ...validation,
            Name: {
              ...validation.Name,
              error: false,
              errorMessage: "",
            },
          });
        }
        // To check empty Email field
        if (userDetails.userID === "") {
          setisButtonDisabled(true);
          setvalidation({
            ...validation,
            userID: {
              ...validation.userID,
              error: true,
              errorMessage: "Email should not be empty",
            },
          });
          return;
        } else if (validation.userID.error) {
          return;
        } else {
          setisButtonDisabled(false);
          setvalidation({
            ...validation,
            userID: {
              ...validation.userID,
              error: false,
              errorMessage: "",
            },
          });
        }

        // To check Group value
        if (userDetails.Group === "" || userDetails.Group === "Select") {
          setisButtonDisabled(true);
          setvalidation({
            ...validation,
            Group: {
              ...validation.Group,
              error: true,
              errorMessage: "Select Group",
            },
          });
          return;
        } else if (validation.Group.error) {
          return;
        } else {
          setisButtonDisabled(false);
          setvalidation({
            ...validation,
            Group: {
              ...validation.Group,
              error: false,
              errorMessage: "",
            },
          });
        }

        // To check Role value
        if (userDetails.Role === "" || userDetails.Role === "Select") {
          setisButtonDisabled(true);
          setvalidation({
            ...validation,
            Role: {
              ...validation.Role,
              error: true,
              errorMessage: "Select Role",
            },
          });
          return;
        } else if (validation.Role.error) {
          return;
        } else {
          setisButtonDisabled(false);
          setvalidation({
            ...validation,
            Role: {
              ...validation.Role,
              error: false,
              errorMessage: "",
            },
          });
        }

        if (
          userDetails.Name !== "" &&
          userDetails.userID != "" &&
          userDetails.Role !== "" &&
          userDetails.Group !== ""
        ) {
          axios
            .post(
              `http://${path.Location}:${path.Port}/NewSignupUser`,
              userDetails
            )
            .then((response) => {
              onResponse();
              Swal.fire({
                icon: "success",
                title: "Registered Successfully",
              });
              document.getElementById("Name").value = "";
              document.getElementById("Email").value = "";
              document.getElementById("groupddl").value = "Select";
              document.getElementById("roleddl").value = "Select";
              setUserDetails({ Name: "", Email: "", Group: "", Role: "" });
              setisButtonDisabled(true);
            })
            .catch((error) => {
              console.log("post error", error);
            });
          return;
        }
      }
    }
  };
  return (
    <div className="container-page textalign">
      <p className="page-title">User Information</p>
      <div className="row col-lg-12">
        <div className="row col-lg-2 fonts">
          <label>Name</label>
        </div>

        <TextField
          error={validation.Name.error}
          helperText={validation.Name.error && validation.Name.errorMessage}
          id="Name"
          className="input-field"
          name="Name"
          placeholder="Name"
          margin="dense"
          onChange={(e) => {
            handleDetails(e, "singleuser");
            checkNotEmpty();
          }}
          onBlur={(e) => {}}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="row col-lg-12">
        <div className="row col-lg-2 fonts">
          <label>Email</label>
        </div>
        <TextField
          error={validation.userID.error}
          helperText={validation.userID.error && validation.userID.errorMessage}
          id="UserId"
          className="input-field"
          name="userID"
          placeholder="Email Address"
          margin="dense"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^a-z0-9@._]+/g, "");
          }}
          onChange={(e) => {
            checkNotEmpty();
          }}
          onKeyDown={handleKeyDown}
          onBlur={async (e) => {
            handleDetails(e, "singleuser");
            let tempCheck = await CheckUser(e.target.value);
            if (tempCheck) {
              setisButtonDisabled(true);
            } else {
              setisButtonDisabled(false);
            }
          }}
        />
      </div>
      <div className="row col-lg-12">
        <div className="row col-lg-2 fonts">
          <label style={{ marginBottom: "5px" }}>Group</label>
        </div>
        <select
          className="select-dpd"
          style={{ marginRight: "5px", height: "40px" }}
          id="groupddl"
          name="Group"
          onChange={(e) => {
            handleDropdownChange(e, "Group");
            checkNotEmpty();
          }}
        >
          {Groupddl.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {validation.Group.error && (
          <FormHelperText error id="username-error" style={{ padding: 0 }}>
            {validation.Group.errorMessage}
          </FormHelperText>
        )}
      </div>
      <div className="row col-lg-12">
        <div className="row col-lg-2 fonts">
          <label style={{ marginBottom: "5px" }}>Role</label>
        </div>
        <select
          className="select-dpd"
          style={{ marginRight: "5px", height: "40px" }}
          id="roleddl"
          name="Role"
          onChange={(e) => {
            handleDropdownChange(e, "Role");
            checkNotEmpty();
          }}
        >
          {Roleddl.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {validation.Role.error && (
          <FormHelperText error id="username-error" style={{ padding: 0 }}>
            {validation.Role.errorMessage}
          </FormHelperText>
        )}
      </div>

      <div className="row col-lg-8 login-btn">
        <Button
          id="saveTemp"
          variant="contained"
          disableRipple="false"
          className="input-field button"
          style={{ backgroundColor: "#6282b3" }}
          onClick={(e) => {
            handlePost("SingleUser");
          }}
        >
          Register
        </Button>
      </div>
      <div
        className="row col-lg-12"
        style={{ float: "right", marginTop: "15px" }}
      ></div>
    </div>
  );
};

export default AdminNewUser;
