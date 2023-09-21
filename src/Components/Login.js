import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { InputAdornment } from "@material-ui/core";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
} from "@mui/material";
//Icons
import User from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//npm's
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

//Components
import "../Styles/Login.css";

import ABlogo from "../../src/Analytic_Brains_Logo.png";
import SpectraIQlogo from "../../src/Spectra_logo.png";

const Login = () => {
  const buttonRef = React.useRef(null);

  const [validation, setvalidation] = React.useState({
    userID: {
      error: false,
      errorMessage: "Please enter",
    },
    FuserID: {
      error: false,
      errorMessage: "Please enter",
    },
    RuserID: {
      error: false,
      errorMessage: "Please enter",
    },
    Name: {
      error: false,
      errorMessage: "Please enter",
    },
    password: {
      error: false,
      errorMessage: "Please enter",
    },
    Confirmpassword: {
      value: 400,
      error: false,
      errorMessage: "Password did not match, Please try again...",
    },
    FConfirmpassword: {
      value: 400,
      error: false,
      errorMessage: "Password did not match, Please try again...",
    },
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [page, setPage] = React.useState("Login");
  const [userDetails, setUserDetails] = React.useState({
    Name: "",
    userID: "",
    password: "",
    Confirmpassword: "",
  });
  const [user, setUser] = React.useState({});
  const [forgotuser, setForgotUser] = React.useState({});
  const [password, setPassword] = useState({});
  const [confpassval, setconfpassval] = React.useState({});
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });
  const [error, setError] = React.useState({
    Restiction: "",
  });
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //Decryption Function...
  const decryptedEmail =(encryptedEmail) => {
    return encryptEmail(encryptedEmail); // ROT13 is self-reversible
  }
  const encryptEmail =(email) => {
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
      ];
      if (restrictedCharacters_Email.includes(e.key)) {
        e.preventDefault(); // Prevent default behavior (character insertion)
      }
    }
  };
  React.useEffect(() => {
    sessionStorage.setItem("UserName", [","]);
    const handleKeyPress = (e) => {
      if (
        (e.code === "Enter" || e.code === "NumpadEnter") &&
        buttonRef.current !== null
      ) {
        buttonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    if (window.location.pathname === "/Forgot") {
        setPage("Forgot");
      // const iduser = window.location.search.split('=')
      // const key = generateRandomKey();
      // console.log('key '+key)
      // const emailadd = decryptEmail(iduser[1],key);    
      // alert(emailadd)
      // console.log('testtt '+JSON.stringify(emailadd))
    }
    else {  setPage("Login"); }
    // return () => {
    //     window.removeEventListener('keydown', handleKeyPress);
    // };
  }, []);

  useEffect(() => {}, [forgotuser]);

  // const forgotValidation = (name, message) => {
  //   if (!forgotuser[name]) {
  //     setvalidation({
  //       ...validation,
  //       name: {
  //         ...validation[name],
  //         error: true,
  //         errorMessage: message,
  //       },
  //     });
  //   } else {
  //     setvalidation({
  //       ...validation,
  //       name: {
  //         ...validation[name],
  //         error: false,
  //       },
  //     });
  //   }
  // };
  const handleClickClose = () => { 
    setPage('Login');
    navigate('/');
  }
  const handleDetails = (e, page) => {
    if (page === "Sign Up") {
      if (e.target.name === "Name") {
        let abc = /^[a-zA-Z ]*$/;
        if (!abc.test(e.target.value)) {
          setvalidation({
            ...validation,
            Name: {
              ...validation.Name,
              error: true,
              errorMessage: "Name should contain only alphabets",
            },
          });
          setError({ ...error, Disable: true });
          return;
        } else if (e.target.value === undefined) {
          setvalidation({
            ...validation,
            [e.target.name]: {
              ...validation[e.target.name],
              error: true,
              errorMessage: "Please enter",
            },
          });
          setError({ ...error, Disable: true });
          return;
        } else {
          setvalidation({
            ...validation,
            Name: {
              ...validation.Name,
              error: false,
              errorMessage: "",
            },
          });

          setError({ ...error, Disable: false });
        }
      }

      if (e.target.name === "password") {
        password[e.target.name] = e.target.value;
        setPassword({ ...password, [e.target.name]: e.target.value });
        const passwordRegex =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
        if (!passwordRegex.test(e.target.value)) {
          setvalidation({
            ...validation,
            password: {
              ...validation.password,
              error: true,
              errorMessage: "Password is not valid",
            },
          });
          setError({ ...error, Disable: true });
        } else {
          setvalidation({
            ...validation,
            password: {
              ...validation.password,
              error: false,
              errorMessage: "",
            },
          });
          setError({ ...error, Disable: false });
        }
      }

      if (e.target.name === "Confirmpassword") {
        confpassval[e.target.name] = e.target.value;
        setconfpassval({ ...confpassval, [e.target.name]: e.target.value });
        if (userDetails.password !== e.target.value) {
          setvalidation({
            ...validation,
            Confirmpassword: {
              ...validation.Confirmpassword,
              error: true,
              errorMessage: "Password did not match",
            },
          });
          setError({ ...error, Disable: true });
        } else {
          setvalidation({
            ...validation,
            Confirmpassword: {
              ...validation.Confirmpassword,
              error: false,
              errorMessage: "Incorrect Password",
            },
          });
          setError({ ...error, Disable: false });
        }
      }

      if (e.target.name === "userID") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e.target.value)) {
          setvalidation({
            ...validation,
            RuserID: {
              ...validation.RuserID,
              error: true,
              errorMessage: "Invalid email address",
            },
          });
          setError({ ...error, Disable: true });
        } else {
          setvalidation({
            ...validation,
            RuserID: {
              ...validation.RuserID,
              error: false,
              errorMessage: "",
            },
          });

          setError({ ...error, Disable: false });
        }
      }

      setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
      //}
    } else if (page === "Login") {
      if (e.target.value !== undefined) {
        setvalidation({
          ...validation,
          [e.target.name]: {
            ...validation[e.target.name],
            error: false,
            errorMessage: "Please Enter ",
          },
        });
      }
      setUser({ ...user, [e.target.name]: e.target.value });
    } else if (page === "Forgot") {
      // if (e.target.name === "FuserID") {
      //   //forgotValidation(e.target.name, "Please Enter the User");
      //   if (!forgotuser?.["FuserID"]) {
      //     setvalidation({
      //       ...validation,
      //       FuserID: {
      //         ...validation.FuserID,
      //         error: true,
      //         errorMessage: "Please Enter the UserId",
      //       },
      //     });
      //   } else {
      //     setvalidation({
      //       ...validation,
      //       FuserID: {
      //         ...validation.FuserID,
      //         error: false,
      //         errorMessage: "Please enter",
      //       },
      //     });
      //   }
      // }

      if (e.target.name === "password") {
        if (
          forgotuser.FConfirmpassword !== undefined &&
          forgotuser.FConfirmpassword?.trim("") !== "" &&
          forgotuser.FConfirmpassword !== e.target.value
        ) {
          setvalidation({
            ...validation,
            password: {
              ...validation.password,
              error: true,
              errorMessage: "password did not match",
            },
          });
        } else {
          setvalidation({
            ...validation,
            password: {
              ...validation.password,
              error: false,
            },
          });
        }
      }
      if (e.target.name === "FConfirmpassword") {
        if (forgotuser.password !== e.target.value) {
          setvalidation({
            ...validation,
            FConfirmpassword: {
              ...validation.FConfirmpassword,
              error: true,
              errorMessage: "Password did not match",
            },
          });
          setError({ ...error, Disable: true });
          // return;
        } else {
          setvalidation({
            ...validation,
            FConfirmpassword: {
              ...validation.FConfirmpassword,
              error: false,
              errorMessage: "Incorrect Password",
            },
          });
        }
      }

      setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
      setError({ ...error, Disable: false });
    }
  };
  const handlePost = (page) => {
    if (page === "Sign Up") {
      if (
        userDetails.Name === "" ||
        userDetails.Name === null ||
        userDetails.Name === undefined
      ) {
        setvalidation({
          ...validation,
          Name: {
            ...validation.Name,
            error: true,
            errorMessage: "Name field cannot be empty.",
          },
        });
        return;
      } else if (
        userDetails.userID === "" ||
        userDetails.userID === null ||
        userDetails.userID === undefined
      ) {
        setvalidation({
          ...validation,
          RuserID: {
            ...validation.RuserID,
            error: true,
            errorMessage: "Email field cannot be empty.",
          },
        });
        return;
      } else if (
        userDetails.password === "" ||
        userDetails.password === null ||
        userDetails.password === undefined
      ) {
        setvalidation({
          ...validation,
          password: {
            ...validation.password,
            error: true,
            errorMessage: "Password field cannot be empty.",
          },
        });
        return;
      } else if (
        confpassval.Confirmpassword === undefined ||
        confpassval.Confirmpassword === "" ||
        confpassval.Confirmpassword === null
      ) {
        setvalidation({
          ...validation,
          Confirmpassword: {
            ...validation.Confirmpassword,
            error: true,
            errorMessage: "Confirm password field cannot be empty.",
          },
        });
        return;
      }

      axios
        .post(`http://${path.Location}:${path.Port}/SignupUser`, userDetails)
        .then((response) => {
          setPage("Welcome");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (page === "Login") {
      if (user.userID === undefined || user.userID === "") {
        setvalidation({
          ...validation,
          userID: {
            ...validation.userID,
            error: true,
            errorMessage: "Please Enter User ID",
          },
        });
        return;
      } else {
        setvalidation({
          ...validation,
          userID: {
            ...validation.userID,
            error: false,
            errorMessage: "Please enter",
          },
        });
      }

      if (user.password === undefined || user.password === "") {
        setvalidation({
          ...validation,
          password: {
            ...validation.password,
            error: true,
            errorMessage: "Please Enter Password",
          },
        });
        return;
      } else {
        setvalidation({
          ...validation,
          password: {
            ...validation.password,
            error: false,
            errorMessage: "Please enter",
          },
        });
      }

      axios
        .post(`http://${path.Location}:${path.Port}/SigninUser`, user)
        .then((res) => {
          if (res.data === 'User Not Found') {
            setError({
              Restiction: "Email ID does not exist.",
            });
            return;
          }   
          else if (res.data === 'IncorrectPassword') {           
            setError({
              Restiction: "Incorrect Password",
            });
            return;
           }  
           else if (res.status === 200) {
            const { Name, userID, Role, Status } = res.data;
            sessionStorage.setItem("UserName", [Name, userID]);
            sessionStorage.setItem("Role", Role || "User");
            if (Status === "Active") {
              navigate("/home");
            } else if (Status === "Registered") {
              setError({
                Restiction: "Access denied. Admin approval needed for login",
              });
            }           
             else if (Status === "Rejected" || Status === "Inactive" ||
               Status === "Suspended" || Status === "Deleted") {
              setError({
                Restiction: "Login restricted. Awaiting admin approval.",
              });
            }
            setTimeout(() => {
              setError({ Restiction: "" });
            }, 5000);
          }
          //}
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.log("eeeeee", error.response.status);
            setvalidation({
              ...validation,
              password: {
                ...validation.password,
                error: true,
                errorMessage: "Incorrect Password",
              },
            });
          }
        });
    } else if (page === "Forgot") {
      let linkA = window.location.href.split('userid=');     
      // Decrypt the email address
      const encryptedEmail = linkA[1];
      forgotuser["FuserID"] = decryptedEmail(encryptedEmail);
      // if (!forgotuser?.["FuserID"]) {
      //   setvalidation({
      //     ...validation,
      //     FuserID: {
      //       ...validation.FuserID,
      //       error: true,
      //       errorMessage: "Please Enter the UserId",
      //     },
      //   });
      // } else {
      //   setvalidation({
      //     ...validation,
      //     FuserID: {
      //       ...validation.FuserID,
      //       error: false,
      //       errorMessage: "Please enter",
      //     },
      //   });
      // }
      if (
       // !forgotuser?.["FuserID"] ||
        !forgotuser?.["password"] ||
        !forgotuser?.["FConfirmpassword"]
      ) {
        setError({ ...error, Disable: true });
        return;
      } else {
        setError({ ...error, Disable: false });
      }
      axios
        .post(`http://${path.Location}:${path.Port}/ForgotUser`, forgotuser)
        .then((res) => {
          if (res.status === 200) {
            setPage("PasswordUpdate");
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
            alert("Please contact administrator!!!");
          }
        });
    }
    else if (page === "Reset") {
      if (!forgotuser?.["RuserID"]) {
        setvalidation({
          ...validation,
          RuserID: {
            ...validation.RuserID,
            error: true,
            errorMessage: "Please Enter the Email Address",
          },
        });
      } else {
        setvalidation({
          ...validation,
          RuserID: {
            ...validation.RuserID,
            error: false,
            errorMessage: "Please enter",
          },
        });
      }
      if (
        !forgotuser?.["RuserID"]
      ) {
        setError({ ...error, Disable: true });
        return;
      } else {
        setError({ ...error, Disable: false });
      }
      axios
      .post(`http://${path.Location}:${path.Port}/sendMail`, forgotuser)
        .then((res) => {
          document.getElementById("userId").value = '';
          if (res.data === 'InActive' || res.data === 'Registered' || res.data === 'Rejected'
            || res.data === 'Not Found') {            
            setPage("Unsuccess");            
          }     
           if (res.data === 'Success') {
                setPage("Success");                    
            }            
       }
      )
      .catch((error) => {
        if (error.response.status === 404) {
          setPage("Unsuccess"); 
        }
        if (error.response.status === 303) { 
          setPage("Unsuccess");      }
      });
      
     }
  };

  const CheckUser = () => {
    axios
      .post(`http://${path.Location}:${path.Port}/CheckSignupUser`, {
        userID: userDetails.userID,
      })
      .then((res) => {
        if (res.status === 200) {
          //sessionStorage.setItem('UserName', [res.data.Name, res.data.userID])
          setvalidation({
            ...validation,
            RuserID: {
              ...validation.RuserID,
              error: true,
              errorMessage: "Already exist",
            },
          });
          return;
          //navigate('/home')
        }
      })
      .catch((error) => {
        console.log("Error in CheckUser Function", error);
        // if (error.response.status === 404) {
        //   setvalidation({
        //     ...validation,
        //     RuserID: {
        //       ...validation.RuserID,
        //       error: false,
        //       errorMessage: "Already exist",
        //     },
        //   });
        // }
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="login-wrapper">
        <div className="login-header">
          <div>
            <img src={SpectraIQlogo} alt="Logo"></img>
          </div>
        </div>
        <div className="login-container">
          <div className="login-card">
            {page === "Login" && (
              <div className="container-page">
                <p className="page-title">Sign in to Spectraiq</p>
                <div className="row col-lg-12">
                  <TextField
                    error={validation.userID.error}
                    helperText={
                      validation.userID.error && validation.userID.errorMessage
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" tabIndex={-1}>
                            <User />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="UserID"
                    className="input-field"
                    name="userID"
                    label="User ID"
                    variant="outlined"
                    margin="dense"
                    onChange={(e) => {
                      handleDetails(e, "Login");
                    }}
                  />
                  {/* {validation.userID.error && (
                    <FormHelperText error id="username-error">
                      {validation.userID.errorMessage}
                    </FormHelperText>
                  )} */}
                </div>
                <div className="row col-lg-12 line-space">
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      error={validation.password.error}
                      helperText={
                        validation.password.error &&
                        validation.password.errorMessage
                      }
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Login");
                      }}
                    />
                    {validation.password.error && (
                      <FormHelperText error id="username-error">
                        {validation.password.errorMessage}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="line-space fgtpwd" tabIndex={0}>
                  <div
                    className="forgot"
                    color="#717171"
                    onClick={(e) => {
                      setPage("Reset");
                    }}
                  >
                    Forgot your Password?
                  </div>
                </div>
                <div className="row col-lg-12 login-btn">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    disableRipple
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3" }}
                    ref={buttonRef}
                    onClick={(e) => {
                      handlePost("Login");
                    }}
                  >
                    Sign in
                  </Button>
                </div>
                <div className="row col-lg-12" style={{ marginTop: "15px" }}>
                  <div
                    className="forgot"
                    style={{ color: "#222D4B", textDecoration: "none" }}
                  >
                    Don’t have an account?{" "}
                    <span
                      className="forgot"
                      color="#717171"
                      onClick={(e) => {
                        setPage("Sign Up");
                      }}
                    >
                      Sign up
                    </span>
                  </div>
                </div>
              </div>
            )}
             {page === "Reset" && (
              <div className="container-page">
                <h5 className="page-title">Reset password</h5>
                <div className="row col-lg-12">
                  <TextField
                    error={validation.RuserID.error}
                    helperText={
                      validation.RuserID.error &&
                      validation.RuserID.errorMessage
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" tabIndex={-1}>
                            <User />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="userId"
                    className="input-field"
                    name="RuserID"
                    label="Email Address"
                    variant="outlined"
                    margin="dense"
                    onChange={(e) => {
                      handleDetails(e, "Forgot");
                    }}
                  />
                </div> 
                <div className="row col-lg-12 login-btn">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    disableRipple
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3" }}
                    disabled={error["Disable"]}
                    onClick={(e) => {
                      handlePost("Reset");
                    }}
                  >
                    Reset Password
                  </Button>
                </div>
                {/* <div className="row line-space" style={{ float: "right" }}>
                  <div style={{ fontSize: "11px" }}>
                    <span
                      className="forgot"
                      onClick={(e) => {
                        setPage("Login");
                      }}
                    >
                      Sign in
                    </span>
                  </div>
                </div> */}
              </div>
            )}

            {page === "Forgot" && (
              <div className="container-page">
                <h5 className="page-title">Forgot password</h5>
                {/* <div className="row col-lg-12">
                  <TextField
                    error={validation.FuserID.error}
                    helperText={
                      validation.FuserID.error &&
                      validation.FuserID.errorMessage
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" tabIndex={-1}>
                            <User />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="userId"
                    className="input-field"
                    name="FuserID"
                    label="User ID"
                    variant="outlined"
                    margin="dense"
                    onChange={(e) => {
                      handleDetails(e, "Forgot");
                    }}
                  />
                </div> */}
                <div className="row col-lg-12 line-space">
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Forgot");
                      }}
                    />
                    {validation.password.error && (
                      <FormHelperText error id="username-error">
                        {validation.password.errorMessage}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div
                  className="row col-lg-12 line-space"
                  style={{ marginTop: "10px" }}
                >
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      error={validation.FConfirmpassword.error}
                      id="password"
                      name="FConfirmpassword"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Forgot");
                      }}
                    />
                    {validation.FConfirmpassword.error && (
                      <FormHelperText error id="username-error">
                        {validation.FConfirmpassword.errorMessage}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                <div className="row col-lg-12 login-btn">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    disableRipple
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3" }}
                    disabled={error["Disable"]}
                    onClick={(e) => {
                      handlePost("Forgot");
                    }}
                  >
                    Change
                  </Button>
                </div>
                {/* <div className="row line-space" style={{ float: "right" }}>
                  <div style={{ fontSize: "11px" }}>
                    <span
                      className="forgot"
                      onClick={(e) => {
                        setPage("Login");
                      }}
                    >
                      Sign in
                    </span>
                  </div>
                </div> */}
              </div>
            )}

            {page === "Sign Up" && (
              <div className="container-page">
                <p className="page-title">Create Account</p>
                <div className="row col-lg-12">
                  <TextField
                    error={validation.Name.error}
                    // helperText={
                    //   validation.Name.error && validation.Name.errorMessage
                    // }
                    id="Name"
                    className="input-field"
                    name="Name"
                    label="Name"
                    variant="outlined"
                    //value={state.Heigth_}
                    margin="dense"
                    onChange={(e) => {
                      handleDetails(e, "Sign Up");
                    }}
                    onKeyDown={handleKeyDown}
                    // onBlur={(e) => { handleValidation(e) }}
                  />
                  {validation.Name.error && (
                    <FormHelperText error id="username-error">
                      {validation.Name.errorMessage}
                    </FormHelperText>
                  )}
                </div>
                <div className="row col-lg-12">
                  <TextField
                    error={validation.RuserID.error}
                    helperText={
                      validation.RuserID.error &&
                      validation.RuserID.errorMessage
                    }
                    id="UserId"
                    className="input-field"
                    name="userID"
                    label="Email Address"
                    variant="outlined"
                    margin="dense"
                    onChange={(e) => {
                      handleDetails(e, "Sign Up");
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={(e) => {
                      CheckUser();
                    }}
                  />
                </div>
                <div className="row col-lg-12 line-space">
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      error={validation.password.error}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Sign Up");
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    {validation.password.error && (
                      <FormHelperText error id="username-error">
                        {validation.password.errorMessage}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="row col-lg-12" style={{ marginTop: "10px" }}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      error={validation.Confirmpassword.error}
                      id="password"
                      name="Confirmpassword"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Sign Up");
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    {validation.Confirmpassword.error && (
                      <FormHelperText error id="username-error">
                        {validation.Confirmpassword.errorMessage}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="row col-lg-12 login-btn">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    disableRipple="false"
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3" }}
                    onClick={(e) => {
                      handlePost("Sign Up");
                    }}
                    disabled={error["Disable"]}
                  >
                    Sign Up
                  </Button>
                </div>
                <div
                  className="row col-lg-12"
                  style={{ float: "right", marginTop: "15px" }}
                >
                  <div
                    className="forgot"
                    style={{
                      color: "#222D4B",
                      textDecoration: "none",
                      fontWeight: "normal",
                    }}
                  >
                    Already Have an account?{" "}
                    <span
                      className="forgot"
                      onClick={(e) => {
                        setPage("Login");
                      }}
                    >
                      {" "}
                      Sign in
                    </span>
                  </div>
                </div>
              </div>
            )}
            {page === "PasswordUpdate" && (
              <div className="container-page">
                <p className="page-title">Forgot Password</p>
                <div className="div-welcome">
                  Your Password has been updated.
                </div>
                <span className="forgot" onClick={(e) => {setPage("Login");  window.location.href = '/';}}>{" "} Sign in</span>
              </div>
            )}
            {page === "Welcome" && (
              <div className="container-page">
                <p className="page-title">User Registration</p>
                <div className="div-welcome">
                  Your registration is successful. You will receive an email, once your registration is approved. Thanks.
                </div>
                <span className="forgot" onClick={(e) => {setPage("Login");}}>{" "} Sign in</span>
              </div>
            )}
            {page === "Unsuccess" && (
              <div className="container-page">
                <button type="button" class="close" aria-label="Close"
                  style={{
                  width: "25px",float:"right", marginLeft:"267px"}}  onClick={handleClickClose}>
                  <span aria-hidden="true">&times;</span>
                  </button>  
              <p className="page-title">Reset Password</p>                
              <div className="div-welcome" style={{color:'red'}}>
              Unable to reset your password. Please contact admin for further details.
                  </div>  
                  
              </div>    
             )}  
            {page === "Success" && (
              <div className="container-page">
                <button type="button" class="close" aria-label="Close"
                  style={{
                  width: "25px",float:"right", marginLeft:"267px"}}  onClick={handleClickClose}>
                  <span aria-hidden="true">&times;</span>
                  </button> 
                  <p className="page-title">Reset Password</p>
                <div className="div-welcome" style={{color:'blue'}}>
                      <p>Please check your mail.To reset the password</p>  
                      </div>
                    </div>
            )}
            
            {error["Restiction"] && page === "Login" && (
              <div className="row" style={{ margin: "15px 0px 0px 0px" }}>
                <Alert severity="error">{error["Restiction"]}</Alert>
              </div>
            )}
          </div>
        </div>

        <div className="footer">
          <div
            className="footer-copy forgot"
            style={{ color: "#222D4B", textDecoration: "none" }}
          >
            Copyright © {new Date().getFullYear()} Spectraiq, All rights
            reserved. Privacy Policy | Legal
          </div>
          <div className="footer-powered">
            <div
              className="forgot"
              style={{ color: "#1D1D1D", textDecoration: "none" }}
            >
              Powered by
            </div>
            <img src={ABlogo} alt="Logo"></img>
          </div>
        </div>
      </div>
    </>
  );
};
export default React.memo(Login);
