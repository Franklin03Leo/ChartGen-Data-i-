import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { InputAdornment } from "@material-ui/core";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
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
import Swal from "sweetalert2";

const Login = () => {
  const buttonRef = React.useRef(null);

  //To maintain validationsignup errors in this state
  const [validationSignUp, setValidationSignUp] = React.useState({});
  //To maintain validationReset errors in this state
  const [validationReset, setValidationReset] = React.useState({});
  //To maintain validationForgot errors in this state
  const [validationForgot, setValidationForgot] = React.useState({});

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
  const [showPassword, setShowPassword] = React.useState({
    signinPassword: false,
    signupPassword: false,
    signupConfirmPassword: false,
    forgetPassword: false,
    forgetConfirmPassword: false,
  });
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

  const handleClickShowPassword = (event) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [event.currentTarget.id]: !prevShowPassword[event.currentTarget.id],
    }));
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
        "\\",
        "`",
      ];
      if (restrictedCharacters_Name.includes(e.key)) {
        e.preventDefault(); // Prevent default behavior (character insertion)
      }
    }
    if (e.target.name === "userID" || e.target.name === "RuserID") {
      if (e.key === 32 || e.key === " ") {
        // Prevent the default action of the space key
        e.preventDefault();
      }
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
        "`",
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
    } else {
      setPage("Login");
    }
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
    setValidationReset({ ...{ RuserID: null } });
    setPage("Login");
    navigate("/");
  };

  const handleDetails = async (e, page) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    if (page === "Sign Up") {
      try {
        if (e.target.name === "Name") {
          setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value.trim(),
          });
        } else {
          setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
          });
        }

        let { name, value } = e.target,
          iValidation = validationSignUp;
        if (name === "userID") value = value.toLowerCase();

        if (name === "Name") {
          let abc = /^[a-zA-Z ]*$/;
          iValidation = {
            ...iValidation,
            Name:
              value === ""
                ? "Name should not be empty"
                : !abc.test(value)
                ? "Name should contain only alphabets"
                : null,
          };
        }
        if (name === "userID") {
          iValidation = {
            ...iValidation,
            userId:
              value === ""
                ? "EmailID should not be empty"
                : value.length <= 3
                ? "Please enter valid email"
                : !emailRegex.test(value)
                ? "Invalid email address"
                : (await CheckUser(value))
                ? "Already Exist"
                : null,
          };
        }

        if (name === "password") {
          iValidation = {
            ...iValidation,
            password:
              value === ""
                ? "Password should not be empty"
                : !passwordRegex.test(value)
                ? "Password must contain at least 8 characters (Upper,lowercase special character,number)"
                : null,
          };
        }

        if (name === "Confirmpassword") {
          iValidation = {
            ...iValidation,
            Confirmpassword:
              value === "" ? "Confirm password should not be empty" : null,
          };
        }

        if (
          (name === "password" || name === "Confirmpassword") &&
          userDetails["password"] &&
          userDetails["Confirmpassword"]
        ) {
          let msg = null;
          if (value !== userDetails["Confirmpassword"])
            msg = "Password did not match";
          iValidation = {
            ...iValidation,
            Confirmpassword: msg,
          };
          if (value === userDetails["password"])
            iValidation = {
              ...iValidation,
              Confirmpassword: null,
            };

          if (name === "Confirmpassword" && value === "")
            iValidation = {
              ...iValidation,
              Confirmpassword: "Confirm password should not be empty",
            };
          if (name === "Confirmpassword" && value === userDetails["password"])
            iValidation = {
              ...iValidation,
              Confirmpassword: null,
            };
        }
        setValidationSignUp({ ...iValidation });
      } catch (err) {
        console.error("Error during handleInputChange(signup):", error);
      }

      // if (e.target.name === "Name") {
      //   let abc = /^[a-zA-Z ]*$/;
      //   if (!e.target.value) {
      //     setvalidation({
      //       ...validation,
      //       Name: {
      //         ...validation.Name,
      //         error: true,
      //         errorMessage: "Name field cannot be empty.",
      //       },
      //     });
      //     return;
      //   } else if (!abc.test(e.target.value)) {
      //     setvalidation({
      //       ...validation,
      //       Name: {
      //         ...validation.Name,
      //         error: true,
      //         errorMessage: "Name should contain only alphabets",
      //       },
      //     });
      //     return;
      //   } else {
      //     setvalidation({
      //       ...validation,
      //       Name: {
      //         ...validation.Name,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   }
      // }
      // if (e.target.name === "password") {
      //   password[e.target.name] = e.target.value;
      //   setPassword({ ...password, [e.target.name]: e.target.value });
      //   if (!e.target.value) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: true,
      //         errorMessage: "Password field cannot be empty.",
      //       },
      //     });
      //     return;
      //   } else if (!passwordRegex.test(e.target.value)) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: true,
      //         errorMessage:
      //           "Password must contain at least 8 characters (Upper,lowercase special character,number)",
      //       },
      //     });
      //   } else if (
      //     confpassval["Confirmpassword"] !== password["password"] &&
      //     !validation.Confirmpassword.error
      //   ) {
      //     setvalidation({
      //       ...validation,
      //       Confirmpassword: {
      //         ...validation.Confirmpassword,
      //         error: true,
      //         errorMessage: "Password did not match",
      //       },
      //     });
      //     return;
      //   } else {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: false,
      //         errorMessage: "",
      //       },
      //       Confirmpassword: {
      //         ...validation.Confirmpassword,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   }
      //   if (passwordRegex.test(e.target.value)) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   }
      //   if (
      //     confpassval["Confirmpassword"] === password["password"] &&
      //     passwordRegex.test(e.target.value)
      //   ) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: false,
      //         errorMessage: "",
      //       },
      //       Confirmpassword: {
      //         ...validation.Confirmpassword,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   }
      // }
      // if (e.target.name === "Confirmpassword") {
      //   confpassval[e.target.name] = e.target.value;
      //   setconfpassval({ ...confpassval, [e.target.name]: e.target.value });
      //   if (!e.target.value) {
      //     setvalidation({
      //       ...validation,
      //       Confirmpassword: {
      //         ...validation.Confirmpassword,
      //         error: true,
      //         errorMessage: "Confirm password field cannot be empty.",
      //       },
      //     });
      //     return;
      //   } else if (userDetails.password !== e.target.value) {
      //     setvalidation({
      //       ...validation,
      //       Confirmpassword: {
      //         ...validation.Confirmpassword,
      //         error: true,
      //         errorMessage: "Password did not match",
      //       },
      //     });
      //     return;
      //   } else if (userDetails.password === e.target.value) {
      //     setvalidation({
      //       ...validation,
      //       Confirmpassword: {
      //         ...validation.Confirmpassword,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   } else {
      //     if (passwordRegex.test(e.target.value)) {
      //       setvalidation({
      //         ...validation,
      //         Confirmpassword: {
      //           ...validation.Confirmpassword,
      //           error: false,
      //           errorMessage: "",
      //         },
      //         password: {
      //           ...validation.password,
      //           error: false,
      //           errorMessage: "",
      //         },
      //       });
      //     }
      //   }
      // }
      // if (e.target.name === "userID") {
      //   if (!e.target.value) {
      //     //if (!validation.RuserID.error) {
      //     setvalidation({
      //       ...validation,
      //       RuserID: {
      //         ...validation.RuserID,
      //         error: true,
      //         errorMessage: "Email ID cannot be empty",
      //       },
      //     });
      //     //}
      //     return;
      //   } else if (!emailRegex.test(e.target.value)) {
      //     setvalidation({
      //       ...validation,
      //       RuserID: {
      //         ...validation.RuserID,
      //         error: true,
      //         errorMessage: "Invalid email address",
      //       },
      //     });
      //     return;
      //   } else {
      //     setvalidation({
      //       ...validation,
      //       RuserID: {
      //         ...validation.RuserID,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   }
      // }
      // //converting email value to lowercase and store it userDetails state
      // if (e.target.name === "userID") {
      //   try {
      //     let tempEmail = e.target.value.toLowerCase();
      //     let userExist = await CheckUser(tempEmail);
      //     if (userExist) {
      //       return;
      //     } else {
      //       setvalidation({
      //         ...validation,
      //         RuserID: {
      //           ...validation.RuserID,
      //           error: false,
      //           errorMessage: "",
      //         },
      //       });
      //     }
      //   } catch (err) {
      //     console.log("Error in signup userID", err);
      //   }
      //   setUserDetails({
      //     ...userDetails,
      //     [e.target.name]: e.target.value.toLowerCase(),
      //   });
      // } else {
      //   setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
      // }
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
      //converting email value to lowercase and store it userDetails state
      if (e.target.name === "userID") {
        setUser({ ...user, [e.target.name]: e.target.value.toLowerCase() });
        return;
      } else {
        setUser({ ...user, [e.target.name]: e.target.value });
      }
    } else if (page === "Forgot") {
      try {
        setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
        let { name, value } = e.target,
          forgotErrorValidation = validationForgot;

        if (name === "password") {
          forgotErrorValidation = {
            ...forgotErrorValidation,
            password:
              value === ""
                ? "Password should not be empty"
                : !passwordRegex.test(value)
                ? "Password must contain at least 8 characters (Upper,lowercase special character,number)"
                : null,
          };
        }

        if (name === "FConfirmpassword") {
          forgotErrorValidation = {
            ...forgotErrorValidation,
            FConfirmpassword:
              value === "" ? "Confirm password should not be empty" : null,
          };
        }

        if (
          (name === "password" || name === "FConfirmpassword") &&
          forgotuser["password"] &&
          forgotuser["FConfirmpassword"]
        ) {
          let msg = null;
          if (value !== forgotuser["FConfirmpassword"])
            msg = "Password did not match";
          forgotErrorValidation = {
            ...forgotErrorValidation,
            FConfirmpassword: msg,
          };
          if (value === forgotuser["password"])
            forgotErrorValidation = {
              ...forgotErrorValidation,
              FConfirmpassword: msg,
            };
          if (name === "FConfirmpassword" && value === "")
            forgotErrorValidation = {
              ...forgotErrorValidation,
              FConfirmpassword: "Confirm password should not be empty",
            };
          if (name === "FConfirmpassword" && value === forgotuser["password"])
            forgotErrorValidation = {
              ...forgotErrorValidation,
              FConfirmpassword: null,
            };
        }
        setValidationForgot({ ...forgotErrorValidation });
      } catch (err) {
        console.log("Error occured in Forgot password page:", err);
      }

      // if (e.target.name === "password") {

      //   setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
      //   if (
      //     e.target.value === undefined ||
      //     e.target.value === null ||
      //     e.target.value === ""
      //   ) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: true,
      //         errorMessage: "Please enter",
      //       },
      //     });
      //     setError({ ...error, Disable: true });
      //   } else if (!passwordRegex.test(e.target.value)) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: true,
      //         errorMessage:
      //           "Password must contain at least 8 characters (Upper,lowercase special character,number)",
      //       },
      //     });
      //     setError({ ...error, Disable: true });
      //   } else if (forgotuser["FConfirmpassword"] !== forgotuser["password"]) {
      //     setError({ ...error, Disable: true });
      //   } else {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: false,
      //         errorMessage: "",
      //       },
      //       FConfirmpassword: {
      //         ...validation.FConfirmpassword,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //     setError({ ...error, Disable: false });
      //   }
      //   if (passwordRegex.test(e.target.value)) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //   }
      //   if (
      //     forgotuser["FConfirmpassword"] === forgotuser["password"] &&
      //     passwordRegex.test(e.target.value)
      //   ) {
      //     setvalidation({
      //       ...validation,
      //       password: {
      //         ...validation.password,
      //         error: false,
      //         errorMessage: "",
      //       },
      //       FConfirmpassword: {
      //         ...validation.FConfirmpassword,
      //         error: false,
      //         errorMessage: "",
      //       },
      //     });
      //     setError({ ...error, Disable: false });
      //   }
      // }
      // if (e.target.name === "FConfirmpassword") {
      //   forgotuser[e.target.name] = e.target.value;
      //   setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
      //   if (
      //     e.target.value === undefined ||
      //     e.target.value === null ||
      //     e.target.value === ""
      //   ) {
      //     setvalidation({
      //       ...validation,
      //       FConfirmpassword: {
      //         ...validation.FConfirmpassword,
      //         error: true,
      //         errorMessage: "please enter",
      //       },
      //     });
      //     setError({ ...error, Disable: true });
      //   } else if (forgotuser["password"] !== e.target.value) {
      //     setvalidation({
      //       ...validation,
      //       FConfirmpassword: {
      //         ...validation.FConfirmpassword,
      //         error: true,
      //         errorMessage: "Password did not match",
      //       },
      //     });
      //     setError({ ...error, Disable: true });
      //   } else {
      //     if (passwordRegex.test(e.target.value)) {
      //       setvalidation({
      //         ...validation,
      //         FConfirmpassword: {
      //           ...validation.FConfirmpassword,
      //           error: false,
      //           errorMessage: "",
      //         },
      //         password: {
      //           ...validation.password,
      //           error: false,
      //           errorMessage: "",
      //         },
      //       });
      //       setError({ ...error, Disable: false });

      //       setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
      //       setError({ ...error, Disable: false });
      //     }
      //   }
      // }

      if (e.target.name === "RuserID") {
        try {
          setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
          let { value } = e.target,
            FuserIDValidation = validationReset;

          FuserIDValidation = {
            ...FuserIDValidation,
            RuserID:
              value === ""
                ? "EmailID should not be empty"
                : value.length <= 3
                ? "Please enter valid email"
                : !emailRegex.test(value)
                ? "Invalid email address"
                : (await CheckUser2(value))
                ? "User does not exist"
                : null,
          };
          setValidationReset({ ...FuserIDValidation });
        } catch (err) {
          console.log("Forgot RuserID issue:", err);
        }
        // if (
        //   e.target.value === undefined ||
        //   e.target.value === null ||
        //   e.target.value === ""
        // ) {
        //   setvalidation({
        //     ...validation,
        //     RuserID: {
        //       ...validation.RuserID,
        //       error: true,
        //       errorMessage: "Email Address should not be empty.",
        //     },
        //   });
        //   setError({ ...error, Disable: true });
        // } else if (!emailRegex.test(e.target.value)) {
        //   setvalidation({
        //     ...validation,
        //     RuserID: {
        //       ...validation.RuserID,
        //       error: true,
        //       errorMessage: "Invalid email address",
        //     },
        //   });
        //   setError({ ...error, Disable: true });
        // } else {
        //   setvalidation({
        //     ...validation,
        //     RuserID: {
        //       ...validation.RuserID,
        //       error: false,
        //       errorMessage: "",
        //     },
        //   });
        //   setError({ ...error, Disable: false });
        // }
        // //converting email value to lowercase and store it userDetails state
        // if (e.target.name === "RuserID") {
        //   setForgotUser({
        //     ...forgotuser,
        //     [e.target.name]: e.target.value.toLowerCase(),
        //   });
        //   return;
        // } else {
        //   setForgotUser({ ...forgotuser, [e.target.name]: e.target.value });
        // }
      }
    }
  };
  function generateRandomKey() {
    // Generate a random key (you can use a more secure method)
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  function encrypt(text, key) {
    // Perform encryption logic (replace with your encryption algorithm)
    // For simplicity, we'll use a basic XOR operation here
    let encryptedText = "";
    for (let i = 0; i < text.length; i++) {
      encryptedText += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return encryptedText;
  }

  // const handleValidateSignUp = async ({ target }) => {
  //   let { name, value } = target,
  //     emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  //     passwordRegex =
  //       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/,
  //     iValidation = validationSignUp;
  //   if (name === "userID") value = value.toLowerCase();

  //   if (name === "Name") {
  //     let abc = /^[a-zA-Z ]*$/;
  //     iValidation = {
  //       ...iValidation,
  //       Name:
  //         value === ""
  //           ? "Name should not be empty"
  //           : !abc.test(value)
  //           ? "Name should contain only alphabets"
  //           : null,
  //     };
  //   }
  //   if (name === "userID") {
  //     iValidation = {
  //       ...iValidation,
  //       userId:
  //         value === ""
  //           ? "Email ID cannot be empty"
  //           : !emailRegex.test(value)
  //           ? "Invalid email address"
  //           : (await CheckUser(value))
  //           ? "Already Exist"
  //           : null,
  //     };
  //   }

  //   if (name === "password") {
  //     iValidation = {
  //       ...iValidation,
  //       password:
  //         value === ""
  //           ? "Password should not be empty"
  //           : !passwordRegex.test(value)
  //           ? "Password must contain at least 8 characters (Upper,lowercase special character,number)"
  //           : null,
  //     };
  //   }

  //   if (name === "Confirmpassword") {
  //     iValidation = {
  //       ...iValidation,
  //       Confirmpassword:
  //         value === "" ? "Confirm password should not be empty" : null,
  //     };
  //   }
  //   if (
  //     (name === "password" || name === "Confirmpassword") &&
  //     userDetails["password"] &&
  //     userDetails["Confirmpassword"]
  //   ) {
  //     let msg = null;
  //     if (userDetails["password"] !== userDetails["Confirmpassword"])
  //       msg = "Password did not match";
  //     iValidation = {
  //       ...iValidation,
  //       Confirmpassword: msg,
  //     };
  //   }
  //   setValidationSignUp({ ...iValidation });
  // };

  useEffect(() => {
    console.log("validation", validationSignUp);
  }, [validationSignUp]);

  const handlePost = async (page) => {
    if (page === "Sign Up") {
      if (
        Object.values(validationSignUp).filter((item) => item).length === 0 &&
        Object.values(userDetails).filter((item) => item).length === 4 &&
        userDetails.password === userDetails.Confirmpassword
      ) {
        axios
          .post(`http://${path.Location}:${path.Port}/SignupUser`, userDetails)
          .then((response) => {
            setUserDetails({
              Name: null,
              userID: null,
              password: null,
              Confirmpassword: null,
            });
            setconfpassval({});
            setPage("Welcome");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let abc = /^[a-zA-Z ]*$/,
          emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        setValidationSignUp({
          ...{
            Name: !userDetails.Name
              ? "Name should not be empty"
              : !abc.test(userDetails.Name)
              ? "Name should contain only alphabets"
              : null,

            userId: !userDetails.userID
              ? "EmailID should not be empty"
              : userDetails.userID.length <= 3
              ? "Please enter valid email"
              : !emailRegex.test(userDetails.userID)
              ? "Invalid email address"
              : (await CheckUser(userDetails.userID))
              ? "Already Exist"
              : null,

            password: !userDetails.password
              ? "Password should not be empty"
              : !passwordRegex.test(userDetails.password)
              ? "Password must contain at least 8 characters (Upper,lowercase special character,number)"
              : null,

            Confirmpassword: !userDetails.Confirmpassword
              ? "Confirm password should not be empty"
              : userDetails.password !== userDetails.Confirmpassword
              ? "Password did not match"
              : null,
          },
        });
      }
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
        .then(async (res) => {
          if (res.data === "User Not Found") {
            setError({
              Restiction:
                "Either user id or password is incorrect. please try again.",
            });
            return;
          } else if (res.data === "IncorrectPassword") {
            setError({
              Restiction:
                "Either user id or password is incorrect. please try again.",
            });
            return;
          } else if (res.status === 200) {
            // get the user details from the response
            const {
              Name,
              userID,
              Role,
              Status,
              FirstTimeUser,
              Group,
              loginTime,
              logoutTime,
              _id,
            } = res.data;
            sessionStorage.setItem("UserName", [
              Name,
              userID,
              Group || "External",
            ]);
            sessionStorage.setItem("Role", Role || "User");
            if (Status === "Active" && FirstTimeUser === "N") {
              // check the user if not login before || the login and logout time exist properly by franklin
              if (
                ((loginTime === undefined || loginTime === null) &&
                  logoutTime === undefined) ||
                (!!loginTime && !!logoutTime)
              ) {
                // get the current time
                let loginTime = new Date().getTime();
                let obj = {
                  _id: _id,
                  loginTime: loginTime,
                  logoutTime: null,
                };
                // get the current time to Userdatails collection, when user login
                let result = await axios.post(
                  `http://${path.Location}:${path.Port}/SaveUsers`,
                  obj
                );
                // if status is duccess, it will navigate to the home page
                if (result.status === 200) {
                  sessionStorage.setItem("loginTime", loginTime);
                  navigate("/home");
                }
              } else if (
                loginTime !== undefined &&
                (logoutTime === undefined || logoutTime === null)
              ) {
                // if login time is exist and logout time is not exist it will show the alert
                Swal.fire({
                  title: `This Login is currently being used.
                  Do you still want to close the other Session?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#008000",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    // when user click yes, it will update the current time to user dateis
                    let loginTime = new Date().getTime();
                    let obj = {
                      _id: _id,
                      loginTime: loginTime,
                      logoutTime: null,
                    };
                    let result = await axios.post(
                      `http://${path.Location}:${path.Port}/SaveUsers`,
                      obj
                    );
                    // if status is duccess, it will navigate to the home page
                    if (result.status === 200) {
                      sessionStorage.setItem("loginTime", loginTime);
                      navigate("/home");
                    }
                  } else {
                    return;
                  }
                });
              } else {
                console.log("You have mistake in logic");
                navigate("/home");
              }
            } else if (Status === "Active" && FirstTimeUser === "Y") {
              const key = generateRandomKey();
              // Encrypt the email address
              const encryptedEmail = encrypt(userID, key);
              window.location.href = "/Forgot?userid=" + encryptedEmail;
              sessionStorage.setItem("userID", userID);
            } else if (Status === "Registered") {
              setError({
                Restiction: "Access denied. Admin approval needed for login",
              });
            } else if (
              Status === "Rejected" ||
              Status === "Inactive" ||
              Status === "Suspended" ||
              Status === "Deleted"
            ) {
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
      if (
        Object.values(validationForgot).filter((item) => item).length === 0 &&
        forgotuser.password &&
        forgotuser.FConfirmpassword
      ) {
        let linkA = window.location.href.split("userid=");
        forgotuser["FuserID"] = linkA[1];

        axios
          .post(`http://${path.Location}:${path.Port}/ForgotUser`, forgotuser)
          .then((res) => {
            if (res.status === 200) {
              setPage("PasswordUpdate");
              sessionStorage.removeItem("userID");
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              alert("Please contact administrator!!!");
            }
          });
      } else {
        let passwordRegex =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        setValidationForgot({
          ...{
            password: !forgotuser.password
              ? "Password should not be empty"
              : !passwordRegex.test(forgotuser.password)
              ? "Password must contain at least 8 characters (Upper,lowercase special character,number)"
              : null,

            FConfirmpassword: !forgotuser.FConfirmpassword
              ? "Confirm password should not be empty"
              : forgotuser.password !== forgotuser.FConfirmpassword
              ? "Password did not match"
              : null,
          },
        });
      }
    } else if (page === "Reset") {
      // if (!forgotuser?.["RuserID"]) {
      //   setvalidation({
      //     ...validation,
      //     RuserID: {
      //       ...validation.RuserID,
      //       error: true,
      //       errorMessage: "Please Enter the Email Address",
      //     },
      //   });
      //   setError({ ...error, Disable: true });
      // } else {
      //   setvalidation({
      //     ...validation,
      //     RuserID: {
      //       ...validation.RuserID,
      //       error: false,
      //       errorMessage: "",
      //     },
      //   });
      //   setError({ ...error, Disable: false });
      // }
      // if (!forgotuser?.["RuserID"]) {
      //   setError({ ...error, Disable: true });
      //   return;
      // } else {
      //   setError({ ...error, Disable: false });
      // }

      if (
        Object.values(validationReset).filter((item) => item).length === 0 &&
        forgotuser.RuserID
      ) {
        axios
          .post(`http://${path.Location}:${path.Port}/sendMail`, forgotuser)
          .then((res) => {
            document.getElementById("userId").value = "";
            forgotuser.RuserID = "";
            if (
              res.data === "InActive" ||
              res.data === "Registered" ||
              res.data === "Rejected" ||
              res.data === "Not Found"
            ) {
              setPage("Unsuccess");
            }
            if (res.data === "Success") {
              setPage("Success");
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setPage("Unsuccess");
            }
            if (error.response.status === 303) {
              setPage("Unsuccess");
            }
          });
      } else {
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        setValidationReset({
          ...{
            RuserID: !forgotuser.RuserID
              ? "EmailID should not be empty"
              : forgotuser.RuserID.length <= 3
              ? "Please enter valid email"
              : !emailRegex.test(forgotuser.RuserID)
              ? "Invalid email address"
              : (await CheckUser2(forgotuser.RuserID))
              ? "User does not exist"
              : null,
          },
        });
      }
    }
  };
  // const updateMultipleFields = (updates) => {
  //   setvalidation((prevValidation) => ({
  //     ...prevValidation,
  //     ...updates,
  //   }));
  // };
  const CheckUser = async (val) => {
    try {
      const response = await axios.post(
        `http://${path.Location}:${path.Port}/CheckSignupUser`,
        {
          userID: val || userDetails.userID,
        }
      );

      if (response.status === 200) {
        setvalidation({
          ...validation,
          RuserID: {
            ...validation.RuserID,
            error: true,
            errorMessage: "Already exist",
          },
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error in CheckUser Function", error);
    }
  };

  //for forgot password purpose
  const CheckUser2 = async (value) => {
    try {
      const response = await axios.post(
        `http://${path.Location}:${path.Port}/CheckSignupUser`,
        {
          userID: value,
        }
      );
      if (response.status !== 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error in CheckUser Function", error);
    }
  };

  const resetSignUpLoginFields = () => {
    setvalidation({
      ...validation,
      password: {
        ...validation.password,
        error: false,
        errorMessage: "",
      },
      userID: {
        ...validation.userID,
        error: false,
        errorMessage: "",
      },
      Name: {
        ...validation.Name,
        error: false,
        errorMessage: "",
      },
      Confirmpassword: {
        ...validation.Confirmpassword,
        error: false,
        errorMessage: "",
      },
      RuserID: {
        ...validation.RuserID,
        error: false,
        errorMessage: "",
      },
    });

    setUserDetails({
      Name: "",
      userID: "",
      password: "",
      Confirmpassword: "",
    });
    setconfpassval({});
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
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9@._]+/g,
                        ""
                      );
                    }}
                    onChange={(e) => {
                      e.target.value = e.target.value.toLowerCase();
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
                      type={showPassword.signinPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            id="signinPassword"
                            onClick={(e) => handleClickShowPassword(e)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.signinPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
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
                        setvalidation({
                          ...validation,
                          password: {
                            ...validation.password,
                            error: false,
                            errorMessage: "",
                          },
                          RuserID: {
                            ...validation.RuserID,
                            error: false,
                            errorMessage: "",
                          },
                        });
                        user.userID = "";
                        user.password = "";
                        setUserDetails({
                          ...{
                            Name: null,
                            userID: null,
                            password: null,
                            Confirmpassword: null,
                          },
                        });
                        setValidationSignUp({
                          ...{
                            Name: null,
                            userID: null,
                            password: null,
                            Confirmpassword: null,
                          },
                        });
                        setPage("Sign Up");
                        setError({ Restiction: "" });
                        setShowPassword({
                          ...showPassword,
                          signinPassword: false,
                          signupPassword: false,
                          signupConfirmPassword: false,
                          forgetPassword: false,
                          forgetConfirmPassword: false,
                        });
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: " space-between",
                  }}
                >
                  <h5 className="page-title">Reset password</h5>
                  <CloseIcon
                    type="button"
                    class="close"
                    aria-label="Close"
                    style={{
                      width: "25px",
                      position: "relative",
                      bottom: " 20%",
                      left: " 15%",
                    }}
                    onClick={handleClickClose}
                  />
                </div>
                <div className="row col-lg-12">
                  <TextField
                    error={validationReset.RuserId}
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
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9@._]+/g,
                        ""
                      );
                    }}
                    onChange={(e) => {
                      // Convert the input to lowercase and update the value
                      e.target.value = e.target.value.toLowerCase();
                      handleDetails(e, "Forgot");
                    }}
                  />
                  {validationReset.RuserID && (
                    <FormHelperText
                      error
                      id="username-error"
                      style={{ marginTop: "-5px" }}
                    >
                      {validationReset.RuserID}
                    </FormHelperText>
                  )}
                </div>
                <div className="row col-lg-12 login-btn">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    disableRipple
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3" }}
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

                <div className="row col-lg-12 line-space">
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      error={validationForgot.password}
                      id="password"
                      name="password"
                      type={showPassword.forgetPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            id="forgetPassword"
                            onClick={(e) => handleClickShowPassword(e)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.forgetPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Forgot");
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    {validationForgot.password && (
                      <FormHelperText error id="username-error">
                        {validationForgot.password}
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
                      error={validationForgot.FConfirmpassword}
                      id="password"
                      name="FConfirmpassword"
                      type={
                        showPassword.forgetConfirmPassword ? "text" : "password"
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            id="forgetConfirmPassword"
                            onClick={(e) => handleClickShowPassword(e)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.forgetConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Forgot");
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    {validationForgot.FConfirmpassword && (
                      <FormHelperText error id="username-error">
                        {validationForgot.FConfirmpassword}
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
                <div className="row col-lg-12" style={{ marginTop: "-25px" }}>
                  <TextField
                    error={validationSignUp.Name}
                    id="Name"
                    className="input-field"
                    name="Name"
                    label="Name"
                    variant="outlined"
                    margin="dense"
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^a-zA-Z ]+/g, "")
                        .replace(/\s+/g, " ");
                    }}
                    onChange={(e) => {
                      handleDetails(e, "Sign Up");
                    }}
                    // onBlur={handleValidateSignUp}
                  />
                  {validationSignUp.Name && (
                    <FormHelperText
                      error
                      id="username-error"
                      style={{ marginTop: "-5px" }}
                    >
                      {validationSignUp.Name}
                    </FormHelperText>
                  )}
                </div>
                <div className="row col-lg-12" style={{ marginTop: "1px" }}>
                  <TextField
                    error={validationSignUp.userId}
                    id="UserId"
                    className="input-field"
                    name="userID"
                    label="Email Address"
                    variant="outlined"
                    margin="dense"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9@._]+/g,
                        ""
                      );
                    }}
                    onChange={(e) => {
                      // Convert the input to lowercase and update the value
                      e.target.value = e.target.value.toLowerCase();
                      handleDetails(e, "Sign Up");
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  {validationSignUp.userId && (
                    <FormHelperText
                      error
                      id="username-error"
                      style={{ marginTop: "-5px" }}
                    >
                      {validationSignUp.userId}
                    </FormHelperText>
                  )}
                </div>
                <div className="row col-lg-12" style={{ marginTop: "8px" }}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      error={validationSignUp.password}
                      id="password"
                      name="password"
                      type={showPassword.signupPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            id="signupPassword"
                            onClick={(e) => handleClickShowPassword(e)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.signupPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Sign Up");
                      }}
                      onKeyDown={handleKeyDown}
                      // onBlur={handleValidateSignUp}
                    />
                    {validationSignUp.password && (
                      <FormHelperText
                        error
                        id="username-error"
                        style={{
                          margin: "4px 0 0 0",
                          padding: "0 0 0 12px",
                          lineHeight: "12px",
                        }}
                      >
                        {validationSignUp.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="row col-lg-12" style={{ marginTop: "12px" }}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      error={validationSignUp.Confirmpassword}
                      id="password"
                      name="Confirmpassword"
                      type={
                        showPassword.signupConfirmPassword ? "text" : "password"
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            id="signupConfirmPassword"
                            onClick={(e) => handleClickShowPassword(e)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword.signupConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                      margin="dense"
                      onChange={(e) => {
                        handleDetails(e, "Sign Up");
                      }}
                      onKeyDown={handleKeyDown}
                      // onBlur={handleValidateSignUp}
                    />
                    {validationSignUp.Confirmpassword && (
                      <FormHelperText
                        error
                        id="username-error"
                        style={{
                          marginTop: "-2px",
                          paddingLeft: "12px",
                          marginBottom: "0px",
                        }}
                      >
                        {validationSignUp.Confirmpassword}
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
                    style={{ backgroundColor: "#6282b3", marginTop: "0px" }}
                    onClick={(e) => {
                      handlePost("Sign Up");
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
                <div
                  className="row col-lg-12"
                  style={{ float: "right", marginTop: "5px" }}
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
                        resetSignUpLoginFields();
                        setPage("Login");
                        setShowPassword({
                          ...showPassword,
                          signinPassword: false,
                          signupPassword: false,
                          signupConfirmPassword: false,
                          forgetPassword: false,
                          forgetConfirmPassword: false,
                        });
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
                <span
                  className="forgot"
                  onClick={(e) => {
                    setPage("Login");
                    window.location.href = "/";
                  }}
                >
                  {" "}
                  Sign in
                </span>
              </div>
            )}
            {page === "Welcome" && (
              <div className="container-page">
                <p className="page-title">User Registration</p>
                <div className="div-welcome">
                  Your registration is successful. You will receive an email,
                  once your registration is approved. Thanks.
                </div>
                <span
                  className="forgot"
                  onClick={(e) => {
                    resetSignUpLoginFields();
                    setPage("Login");
                  }}
                >
                  {" "}
                  Sign in
                </span>
              </div>
            )}
            {page === "Unsuccess" && (
              <div className="container-page">
                <button
                  type="button"
                  className="close btn btn-sm btn-light text-center"
                  aria-label="Close"
                  style={{
                    backgroundColor: "#fff",
                    width: "25px",
                    float: "right",
                    marginLeft: "auto",
                    outline: "none",
                    border: "none",
                  }}
                  onClick={handleClickClose}
                >
                  <span aria-hidden="true">
                    <CloseIcon></CloseIcon>
                  </span>
                </button>
                <p className="page-title">Reset Password</p>
                <div className="div-welcome" style={{ color: "red" }}>
                  Unable to reset your password. Please contact admin for
                  further details.
                </div>
              </div>
            )}
            {page === "Success" && (
              <div className="container-page">
                <CloseIcon
                  type="button"
                  class="close"
                  aria-label="Close"
                  style={{
                    width: "25px",
                    float: "right",
                    marginLeft: "267px",
                  }}
                  onClick={handleClickClose}
                />
                <p className="page-title">Reset Password</p>
                <div className="div-welcome" style={{ color: "blue" }}>
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
