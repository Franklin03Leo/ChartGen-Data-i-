import React, { useCallback, useEffect } from "react";

//MUI
import './Styles/Custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import styled from "@emotion/styled";
import { Fade } from "@material-ui/core";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Alert from '@mui/material/Alert';

//NPM's
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

//Components
import InputBlock from "./Components/InputBlock";
import ChartBlock from "./Components/ChartBlock";
import Statistics from "./Charts/Statistics";
import DatasetTable from "./Charts/DatasetTable";
import Demo from "./Charts/Demo";
import Dashboard from "./Charts/Dashboard";
import Feedback from "./Components/Feedback";


//Logo
import logo from '../src/Analytic_Brains_Logo.png';

const HomePage = () => {
    const DataTypes = ['#', 'Da', 'Aa']

    const [state, setState] = React.useState({});
    const [enable, setEnable] = React.useState({})
    const [filedata, setData] = React.useState({})
    const [play, setPlay] = React.useState({})
    const [show, Isshow] = React.useState({ 'NOCharts': 0, 'isRendered': false })
    const [navbar, setNavbar] = React.useState({ 'bar': 'Data' });
    const [navwidth, setNavWidth] = React.useState({ 'navArea': '7%', 'inuptArea': '30%', 'ChartArea': '63%' });
    const [value, setValue] = React.useState('1');
    const [changeType, setChangeType] = React.useState({ 'enableChange': false, 'Dimensions_': 'Select', 'DataTypes': '#' })
    const [error, setError] = React.useState({});
    const [feedback, setFeedback] = React.useState({'Issues':undefined});



    // Custom styles
    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: 'black',
            top: 10
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'black',
        },
    }));

    // These functions which are used to get the data from the other components
    const data = (state, enable, navbar, file) => {
        // debugger
        setState(state)
        setEnable(enable)
        setNavbar(navbar)
        setChangeType({ ...changeType, 'Dimensions': file.newArray, 'file': file.Uploaded_file })
    }
    const expand = useCallback((navwidth) => {
        setNavWidth(navwidth);
    }, [navwidth])

    const DataTable = (data) => {
        setData({ 'data': data.data })
    }
    const video = (play) => {
        setPlay({ 'isPlay': play.isPlay })
    }
    const showDashboard = (param) => {
        Isshow({ ...param, 'isRendered': !show.isRendered })
        //setFeedback(undefined)
    }
    const handleFeedback = (params) => {
        setFeedback({'Issues':params})
    }

    //Tab change
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //Changing data type for the columns
    const handleChangeDatatype = (event, flag) => {
        if (flag !== 1)
            setChangeType({ ...changeType, [event.target.name]: event.target.value });
        else {
            let SelectedDimension = changeType.Dimensions_
            let TypeChanged = changeType.DataTypes + ' ' + SelectedDimension.split(' ').splice(1).join(' ')
            let DimensionsCopy = changeType.Dimensions

            let value = SelectedDimension.split(' ').slice(1, 3).join(' ');
            let datatype = SelectedDimension.split(' ').splice(0, 1)[0]
            value = changeType.file[0][value]
            if (changeType.DataTypes === '#') {
                if (isNaN(value - 10)) {
                    setError({ 'mandatoryFields': 'The selected column will not be change as Integer' })
                    return
                }
                else {
                    setError({ 'mandatoryFields': undefined })
                }
            }
            else if (changeType.DataTypes === 'Da') {
                if (!isNaN(value - 10) || (new Date(value) == 'Invalid Date' && new Date(value).getFullYear().toString().length >= 4)) {
                    setError({ 'mandatoryFields': 'The selected column will not be change as Date' })
                    return
                }
                else {
                    setError({ 'mandatoryFields': undefined })
                }
            }
            else if (changeType.DataTypes === 'Bo') {
                if (value.toLowerCase().toString() !== "true" || value.toLowerCase().toString !== "false") {
                    setError({ 'mandatoryFields': 'The selected column will not be change as Boolean' })
                    return
                }
                else {
                    setError({ 'mandatoryFields': undefined })
                }
            }
            else if (changeType.DataTypes === 'Aa') {
                if (datatype !== '#') {
                    setError({ 'mandatoryFields': 'The selected column will not be change as String' })
                    return
                }
                else {
                    setError({ 'mandatoryFields': undefined })
                }
            }


            DimensionsCopy.forEach((element, index) => {
                if (element === changeType.Dimensions_) {
                    DimensionsCopy[index] = TypeChanged
                    setChangeType({ ...changeType, 'Dimensions_': DimensionsCopy[index], 'Dimensions': DimensionsCopy })
                    return
                }
            });

            toast.success('Data type has been changed.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
                autoClose: 2000
            });
            setState({
                ...state,
                'XAxis_': changeType.Dimensions,
                'YAxis_': changeType.Dimensions
            })
            setChangeType({ ...changeType, 'enableChange': false })
            //  event.preven
        }
    }

    return (
        <div>
            <div className="col-lg-12" style={{ width: '100%' }}>
                <ToastContainer />
                <div className="fixed-header">
                    <div className="site-identity">
                        <a href="#">
                            <img src={logo} alt='Logo'></img>
                        </a>
                    </div>
                    <div className="container">
                        Data(i)
                    </div>
                </div>
                <div className="row" style={{ marginRight: '0px', height: 'calc(100vh - 81px)' }}>
                    <InputBlock ChildtoParentHandshake={data} ExpandData={expand} dataTable={DataTable} demoVideo={video} showDashboard={showDashboard} feedback_={handleFeedback} />
                    {/* <div className="" style={{ backgroundColor: '#e9ecef', height: '87vh', width: navwidth.ChartArea }}> */}
                    <div className="" style={{ backgroundColor: '#e9ecef', width: `${navwidth.ChartArea === '63%' ? 'calc(70% - 90px)' : 'calc(100% - 90px)'}`, height: 'calc(100vh - 81px)' }}>
                        {filedata.data === undefined && play.isPlay !== true && show.isShow !== true ?
                            <ChartBlock enable={enable} state={state} />
                            :
                            <>
                                {filedata.data !== undefined && show.isShow !== true ?
                                    <Box sx={{ width: '100%', typography: 'body1' }}>
                                        <TabContext value={value}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                    <Tab label="Dataset" value="1" />
                                                    <Tab label="Statistics" value="2" />
                                                    <Tab label="Data Dictionary" value="3" />
                                                </TabList>
                                            </Box>
                                            <TabPanel value="1">
                                                <DatasetTable params={filedata.data} />
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <Statistics params={filedata.data} />
                                            </TabPanel>
                                            <TabPanel value="3">
                                                <div className="row col-lg-6 borderdivstyle" style={{ margin: "25px 0px 0px 0px" }}>
                                                    <div className="row col-lg-12">
                                                        <div className=" col-lg-12 borderstyle">Change Type</div>
                                                    </div>
                                                    <div className="row col-sm-4 col-md-4 col-lg-5" >
                                                        <TextField
                                                            id="Dimensions_"
                                                            select
                                                            name='Dimensions_'
                                                            label="Dimensions"
                                                            className='input-field '
                                                            onChange={(e) => { handleChangeDatatype(e) }}
                                                            //defaultValue={'Select'}
                                                            value={changeType.Dimensions_}
                                                        >
                                                            <MenuItem key={-1} value={'Select'}>
                                                                {'Select'}
                                                            </MenuItem>
                                                            {changeType.Dimensions.map((option, index) => (
                                                                <MenuItem key={index} value={option}>
                                                                    {option}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>
                                                    {changeType.enableChange === false ?
                                                        <div className="row col-sm-4 col-md-4 col-lg-6">
                                                            <Button variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { setChangeType({ ...changeType, 'enableChange': true }) }}>
                                                                Change Type
                                                            </Button>
                                                        </div>
                                                        :
                                                        <>
                                                            <div className="row col-sm-4 col-md-4 col-lg-3">
                                                                <TextField
                                                                    id="XAxis"
                                                                    select
                                                                    name='DataTypes'
                                                                    label="DataTypes"
                                                                    className='input-field '
                                                                    onChange={(e) => { handleChangeDatatype(e) }}
                                                                    // onBlur={(e) => { handleValidation(e) }}
                                                                    value={changeType.DataTypes}
                                                                >
                                                                    {DataTypes.map((option, index) => (
                                                                        <MenuItem key={option} value={option}>
                                                                            {option}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </div>
                                                            <div className="row col-sm-2 col-md-2 col-lg-2" >
                                                                <BootstrapTooltip title="Change" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                    <Check className='Datatypeicon' style={{ color: 'green' }} fontSize="small" onClick={(e) => { handleChangeDatatype(e, 1) }} />
                                                                </BootstrapTooltip>
                                                            </div>
                                                            <div className="row col-sm-2 col-md-2 col-lg-2" >
                                                                <BootstrapTooltip title="Cancel" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                    <Clear className='Datatypeicon' style={{ color: 'red' }} fontSize="small" onClick={(e) => { setChangeType({ ...changeType, 'enableChange': false }); setError({ 'mandatoryFields': undefined }) }} />
                                                                </BootstrapTooltip>
                                                            </div>
                                                        </>
                                                    }
                                                    {error.mandatoryFields !== undefined ?
                                                        <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ margin: "15px 0px 15px  0px", padding: 0 }}>
                                                            <Alert severity="error">{error.mandatoryFields}</Alert>
                                                        </div>
                                                        : ''
                                                    }
                                                </div>
                                            </TabPanel>
                                        </TabContext>
                                    </Box>
                                    :
                                    ''
                                }
                            </>
                        }
                        {play.isPlay && filedata.data === undefined ?
                            <Demo />
                            :
                            ''
                        }
                        {show.isShow ?
                            <Dashboard params={show} />
                            :
                            ''
                        }
                        {feedback.Issues !== undefined ?
                            <Feedback params={feedback.Issues} />
                            : ''
                        }

                    </div>
                </div>
            </div>
        </div >
    )
}
export default HomePage;