import React, { Fragment } from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Fade, InputAdornment } from "@material-ui/core";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import {
    OutlinedInput,
    FormControl,
    InputLabel,
    FormHelperText
} from "@mui/material";
//Icons
import User from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//npm's
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

//Components
import '../Styles/Login.css';
import login from '../../src/Images/Login.png';
const Login = () => {
    const [validation, setvalidation] = React.useState({
        userID: {
            error: false,
            errorMessage: 'Please enter'
        },
        FuserID: {
            error: false,
            errorMessage: 'Please enter'
        },
        RuserID: {
            error: false,
            errorMessage: 'Please enter'
        },
        password: {
            error: false,
            errorMessage: 'Please enter'
        },
        Confirmpassword: {
            value: 400,
            error: false,
            errorMessage: 'Password did not match, Please try again...'
        },
        FConfirmpassword: {
            value: 400,
            error: false,
            errorMessage: 'Password did not match, Please try again...'
        }
    })
    const [showPassword, setShowPassword] = React.useState(false);
    const [page, setPage] = React.useState('Login')
    const [userDetails, setUserDetails] = React.useState({})
    const [user, setUser] = React.useState({})
    const [forgotuser, setForgotUser] = React.useState({})
    const [path, setPath] = React.useState({ 'Location': window.location.hostname })
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    React.useEffect(() => {
        sessionStorage.setItem('UserName', [','])
        // if (window.location.host === "localhost:3000") setPath({ 'Location': 'localhost' })
        // else if (window.location.host === "49.204.124.69:8081") setPath({ 'Location': '49.204.124.69' })
    }, [])
    // document.addEventListener("keyup", function (event) {
    //     if (event.key === 'Enter') {
    //         alert('Enter is pressed!');
    //         event.preventDefault();
    //     }
    // });
    const handleDetails = (e, page) => {
        if (page === 'Sign Up') {
            if (e.target.name === 'Confirmpassword') {
                if (userDetails.password !== e.target.value)
                    setvalidation({ ...validation, Confirmpassword: { ...validation.Confirmpassword, error: true, errorMessage: 'Password did not match' } })
                else {
                    setvalidation({ ...validation, Confirmpassword: { ...validation.Confirmpassword, error: false, errorMessage: 'Incorrect Password' } })
                }
            }
            else {
                if (e.target.value !== undefined) {
                    setvalidation({ ...validation, [e.target.name]: { ...validation[e.target.name], error: false, errorMessage: 'Please enter' } })
                }
            }
            if (e.target.name !== 'Confirmpassword') {
                setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
            }
        }
        else if (page === 'Login') {
            if (e.target.value !== undefined) {
                setvalidation({ ...validation, [e.target.name]: { ...validation[e.target.name], error: false, errorMessage: 'Please enter' } })
            }
            setUser({ ...user, [e.target.name]: e.target.value })
        }
        else if (page === 'Forgot') {
            if (e.target.name === 'FConfirmpassword') {
                if (forgotuser.password !== e.target.value)
                    setvalidation({ ...validation, FConfirmpassword: { ...validation.FConfirmpassword, error: true, errorMessage: 'Password did not match' } })
                else {
                    setvalidation({ ...validation, FConfirmpassword: { ...validation.FConfirmpassword, error: false, errorMessage: 'Incorrect Password' } })
                }
            }
            else {

                setForgotUser({ ...forgotuser, [e.target.name]: e.target.value })
            }
        }
    }
    const handlePost = (page) => {

        if (page === 'Sign Up') {
            axios.post(`http://${path.Location}:8000/SignupUser`, (userDetails))
                .then((response) => {
                    toast.success('Registered successfully.', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                        autoClose: 2000
                    })
                    setPage('Login')
                    //navigate('/home')
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else if (page === 'Login') {
            if (user.userID === undefined || user.userID === '') {
                setvalidation({ ...validation, userID: { ...validation.userID, error: true, errorMessage: 'Please enter' } })
                return
            }
            else {
                setvalidation({ ...validation, userID: { ...validation.userID, error: false, errorMessage: 'Please enter' } })
            }
            axios.post(`http://${path.Location}:8000/SigninUser`, user)
                .then((res) => {
                    if (res.status === 200) {
                        sessionStorage.setItem('UserName', [res.data.Name, res.data.userID])
                        navigate('/home')
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setvalidation({ ...validation, password: { ...validation.password, error: true, errorMessage: 'Incorrect Password' } })
                    }
                });
        }
        else if (page === 'Forgot') {
            axios.post(`http://${path.Location}:8000/ForgotUser`, forgotuser)
                .then((res) => {
                    if (res.status === 200) {
                        toast.success('Your password has been updated', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                            autoClose: 2000
                        })
                        setPage('Login')
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        alert('Please contact administrator!!!')
                    }
                });
        }

    }
    const CheckUser = () => {
        axios.post(`http://${path.Location}:8000/CheckSignupUser`, { 'userID': userDetails.userID })
            .then((res) => {
                if (res.status === 200) {
                    //sessionStorage.setItem('UserName', [res.data.Name, res.data.userID])
                    setvalidation({ ...validation, RuserID: { ...validation.RuserID, error: true, errorMessage: 'Already exist' } })
                    return
                    //navigate('/home')
                }
            })
            .catch(error => {
                if (error.response.status === 404) {
                    setvalidation({ ...validation, RuserID: { ...validation.RuserID, error: false, errorMessage: 'Already exist' } })
                }
            });
    }
    return (
        <>
            <ToastContainer />
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-card" style={{ backgroundImage: `url(${login})` }} >
                        {page === 'Login' &&
                            <div className="container-page">
                                <h5 className="page-title">
                                    Sign In
                                </h5>
                                <div className="row col-lg-12">
                                    <TextField
                                        error={validation.userID.error}
                                        helperText={validation.userID.error && validation.userID.errorMessage}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" ><IconButton edge="end" tabIndex={-1}><User /></IconButton></InputAdornment>,
                                        }}
                                        id="UserID" className='input-field' name='userID' label="UserID" variant="outlined"
                                        margin="dense"
                                        onChange={(e) => { handleDetails(e, 'Login') }}
                                    />
                                </div>
                                <div className="row col-lg-12 line-space" >
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            error={validation.password.error}
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            margin="dense"
                                            onChange={(e) => { handleDetails(e, 'Login') }}
                                        />
                                        {validation.password.error && (
                                            <FormHelperText error id="username-error">
                                                {validation.password.errorMessage}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </div>
                                <div className="line-space fgtpwd" tabIndex={0}>
                                    <div className="forgot" onClick={(e) => { setPage('Forgot') }}>
                                        Forgot Password
                                    </div>
                                </div>
                                <div className="row col-lg-12 login-btn">
                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3' }}
                                        onClick={(e) => { handlePost('Login') }}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                                <div className="row col-lg-12" style={{ marginTop: '15px' }}>
                                    <div style={{ fontSize: '11px' }}>
                                        Don’t have an account? <span className="forgot" onClick={(e) => { setPage('Sign Up') }}>Sign up</span>
                                    </div>
                                </div>
                            </div>
                        }
                        {page === 'Forgot' &&
                            <div className="container-page">
                                <h5 className="page-title">
                                    Forgot password
                                </h5>
                                <div className="row col-lg-12">
                                    <TextField
                                        error={validation.FuserID.error}
                                        helperText={validation.FuserID.error && validation.FuserID.errorMessage}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end"><IconButton edge="end" tabIndex={-1}><User /></IconButton></InputAdornment>,
                                        }}
                                        id="userId" className='input-field' name='FuserID' label="UserID" variant="outlined"
                                        margin="dense"
                                        onChange={(e) => { handleDetails(e, 'Forgot') }}
                                    />
                                </div>
                                <div className="row col-lg-12 line-space">
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            margin="dense"
                                            onChange={(e) => { handleDetails(e, 'Forgot') }}
                                        />
                                    </FormControl>
                                </div>
                                <div className="row col-lg-12 line-space" style={{ marginTop: '10px' }}>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                        <OutlinedInput
                                            error={validation.FConfirmpassword.error}
                                            id="password"
                                            name="FConfirmpassword"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Confirm Password"
                                            margin="dense"
                                            onChange={(e) => { handleDetails(e, 'Forgot') }}
                                        />
                                        {validation.FConfirmpassword.error && (
                                            <FormHelperText error id="username-error">
                                                {validation.FConfirmpassword.errorMessage}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </div>
                                <div className="row col-lg-12 login-btn">
                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3' }}
                                        onClick={(e) => { handlePost('Forgot') }}
                                    >
                                        Change
                                    </Button>
                                </div>
                                <div className="row line-space" style={{ float: 'right' }}>
                                    <div style={{ fontSize: '11px' }}>
                                        <span className="forgot" onClick={(e) => { setPage('Login') }}>Sign in</span>
                                    </div>
                                </div>
                            </div>
                        }
                        {page === 'Sign Up' &&
                            <div className="container-page">
                                <h5 className="page-title">
                                    Sign Up
                                </h5>
                                <div className="row col-lg-12">
                                    <TextField
                                        //error={validation.Heigth_.error}
                                        //helperText={validation.Heigth_.error && validation.Heigth_.errorMessage}

                                        id="Name" className='input-field' name='Name' label="Name" variant="outlined"
                                        //value={state.Heigth_}
                                        margin="dense"
                                        onChange={(e) => { handleDetails(e, 'Sign Up') }}
                                    //onBlur={(e) => { handleValidation(e) }}
                                    />
                                </div>
                                <div className="row col-lg-12">
                                    <TextField
                                        error={validation.RuserID.error}
                                        helperText={validation.RuserID.error && validation.RuserID.errorMessage}
                                        id="UserId" className='input-field' name='userID' label="Email Address" variant="outlined"
                                        //value={state.Heigth_}
                                        margin="dense"
                                        onChange={(e) => { handleDetails(e, 'Sign Up') }}
                                        onBlur={(e) => { CheckUser() }}
                                    />
                                </div>
                                <div className="row col-lg-12 line-space">
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            margin="dense"
                                            onChange={(e) => { handleDetails(e, 'Sign Up') }}
                                        />
                                    </FormControl>
                                </div>
                                <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                        <OutlinedInput
                                            error={validation.Confirmpassword.error}
                                            id="password"
                                            name="Confirmpassword"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Confirm Password"
                                            margin="dense"
                                            onChange={(e) => { handleDetails(e, 'Sign Up') }}
                                        />
                                        {validation.Confirmpassword.error && (
                                            <FormHelperText error id="username-error">
                                                {validation.Confirmpassword.errorMessage}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </div>
                                <div className="row col-lg-12 login-btn">
                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3' }}
                                        onClick={(e) => { handlePost('Sign Up') }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                                <div className="row col-lg-12" style={{ float: 'right', marginTop: '15px' }}>
                                    <div style={{ fontSize: '11px' }}>
                                        Have an account?<span className="forgot" onClick={(e) => { setPage('Login') }}>Sign in</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )

}
export default React.memo(Login);