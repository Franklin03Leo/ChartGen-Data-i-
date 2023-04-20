import React, { Fragment } from "react";

//MUI
import '../Styles/Custom.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import styled from "@emotion/styled";
import { Fade, InputAdornment } from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Modal } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useNavigate } from "react-router-dom";
//NPM's
import Papa from "papaparse";
import * as xlsx from "xlsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

//Icons
import DatasetIcon from '@mui/icons-material/Dataset';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Numbers from '@mui/icons-material/Numbers';
import Calendar from '@mui/icons-material/CalendarMonth';
import Demo from '@mui/icons-material/YouTube';
import Dashboard from '@mui/icons-material/Dashboard';
import Reload from '@mui/icons-material/Cached';
import Barchart from '@mui/icons-material/BarChart';
import Piechart from '@mui/icons-material/PieChart';
import Linechart from '@mui/icons-material/ShowChart';
import Compositechart from '@mui/icons-material/Leaderboard';
import Scatterplot from '@mui/icons-material/ScatterPlot';
import Barlinechart from '@mui/icons-material/StackedLineChart';
import Serieschart from '@mui/icons-material/MultilineChart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Project from '@mui/icons-material/AutoAwesomeMotion';
import Collections from '@mui/icons-material/Collections';
import layout1 from '../../src/Images/layout1.svg';
import layout2 from '../../src/Images/layout2.svg';
import layout3 from '../../src/Images/layout3.svg';
import layout4 from '../../src/Images/layout4.svg';
import layout5 from '../../src/Images/layout5.svg';
import layout6 from '../../src/Images/layout6.svg';
import layout7 from '../../src/Images/layout7.svg';
import layout8 from '../../src/Images/layout8.svg';
import layout9 from '../../src/Images/layout9.svg';
import layout10 from '../../src/Images/layout10.svg';
import layout11 from '../../src/Images/layout11.svg';


import Data from '../../src/Images/Input-Data.png';
//Components
import LoadingSpinner from "../Components/LoadingSpinner";

const InputArea = ({ ChildtoParentHandshake, ExpandData, dataTable, demoVideo, showDashboard, feedback_, project_ }) => {
    // Global variables declaration
    const ChartType = ['Select', 'Pie Chart', 'Bar Chart', 'ScatterPlot', 'Line Chart', 'Composite Chart', 'Series Chart', 'Bar Line Chart']
    const Fonts = ['Arial', 'Verdana', 'Tahoma', 'Trebuchet', 'Times New Roman', 'Georgia', 'Garamond', 'Courier']
    const TooltipContent = ['All', 'X', 'Y']
    const LablesContent = ['X', 'Y', 'Title']
    const GroupByCol = ['Sum', 'Count', 'Minimum', 'Maximum', 'Average']

    // const DataTypes = ['#', 'Da', 'Aa']
    var Type = []
    var Key_ = []

    //State declaration
    const [formValues, setFormValues] = React.useState({
        Chart: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        Heigth_: {
            value: 400,
            error: false,
            errorMessage: 'You must enter number'
        },
        Width_: {
            value: 850,
            error: false,
            errorMessage: 'You must enter number'
        },
        ExternalRadiusPadding: {
            value: 80,
            error: false,
            errorMessage: 'You must enter number'
        },
        Title: {
            error: false,
            errorMessage: 'Please enter '
        },
        Innerradius: {
            value: '',
            error: false,
            errorMessage: 'You must enter number'
        },
        SlicesCap: {
            error: false,
            errorMessage: 'You must enter number'
        },
        XAxisCopy: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        YAxisCopy: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        YAxisPadding: {
            error: false,
            errorMessage: 'Please enter'
        },
        SymbolSize: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        GroupByCopy: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        InputType: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        TempName: {
            error: false,
            errorMessage: 'The given name is already exists, Please provide some other name.'
        },
        Category: {
            error: false,
            errorMessage: 'Please enter'
        },
        Issue: {
            error: false,
            errorMessage: 'Please enter'
        },
        Rows: {
            error: false,
            errorMessage: 'Please enter',
            value: 5
        }

    })
    const [user, setUser] = React.useState({ 'userID': sessionStorage.getItem('UserName').split(',')[1] });
    const [disable, isDisable] = React.useState(true);
    const [error, setError] = React.useState({});
    const [state, setState] = React.useState({
        'InputType': 'Enter Inputs', 'Heigth_': 280, 'Width_': 600, 'YAxisPadding': '10',
        'SlicesCap': 10, 'Innerradius': 10, 'ExternalRadiusPadding': 60, 'SymbolSize': 7, 'TooltipContent': 'All',
        'TooltipTickColor': '#000000', 'GroupByCol': 'Sum', 'Color': '#8495e6',
        'LabelsContent': 'X', 'userID': sessionStorage.getItem('UserName') !== null && user.userID
    });
    const [enable, setEnable] = React.useState({})
    const [colors, setColors] = React.useState([]);
    const [navbar, setNavbar] = React.useState({ 'bar': 'Project' });
    const [template, setTemplate] = React.useState({});
    const [dashboard, setDashboard] = React.useState({});
    const [enabletemplate, setEnableTemplate] = React.useState(false);
    const [flag, setFlag] = React.useState(false);
    const [navopen, setNavOpen] = React.useState(true);
    const [navwidth, setNavWidth] = React.useState({ 'navArea': '90px', 'inuptArea': '28%', 'ChartArea': '63%' });
    const [isMobile, setIsMobile] = React.useState(false);
    const [open, setOpen] = React.useState({ 'Template': false, 'Dashboard': false, 'deleteTemplate': false });
    const [progress, setProgress] = React.useState({ 'loader': false });
    const [filter, setFilter] = React.useState({});
    const [filteringProps, setfilteringProps] = React.useState({ 'customFilter': [] });
    const [others, setOthers] = React.useState({ 'StaticLayouts': true, 'selectedLayout': '1X2','CustomLayouts':false });
    const [feedback, setFeedback] = React.useState({
        'Categories': ['UI', 'Performance', 'Dataset', 'Statistics', 'Data Dictionary', 'Template', 'Dashboard', 'User Guide', 'Suggestions', 'Other'],
        'Reported By': sessionStorage.getItem('UserName') !== null && sessionStorage.getItem('UserName').split(',')[0]
    });
    const [feedbackSection, setFeedbackSection] = React.useState(['Dataset', 'Statistics', 'Data Dictionary', 'Template', 'Dashboard', 'User Guide'])
    const [feedbackIssue, setIssues] = React.useState(undefined);
    const [dashboardCharts, setdashboardCharts] = React.useState();
    const [projectDetails, setprojectDetails] = React.useState({})
    const [project, setProject] = React.useState({});
    const [postProject, setpostProject] = React.useState({});
    const [TemplatesCollections, setTemplatesCollections] = React.useState({});
    const [path, setPath] = React.useState({ 'Location': window.location.hostname }) //49.204.124.69/
    const [Dataset, setDataset] = React.useState({});

    // Data passing
    const [filedata, setData] = React.useState({})
    const [play, setPlay] = React.useState({})
    const [show, setIsshow] = React.useState({})
    // custom styles
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
    const style = {
        position: 'absolute',
        top: '35%',
        left: '50%',
        width: '30%',
        transform: 'translate(-50%, -50%)',
        // width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }
    // React.useEffect(() => {
    //     debugger
    //     console.log('path',process.env.LOCAL_PATH);
    //     if (window.location.hostname === 'localhost') setEnv(process.env.LOCAL_PATH)
    //     else if(window.location.hostname === '49.204.124.69') setEnv(process.env.HOSTED_PATH)
    // })
    //useEffects for re-rendering the component
    React.useEffect(() => {
        // GenerateChart();
        ExpandData(navwidth)
    }, [navwidth]);
    React.useEffect(() => {
        GenerateChart();
        setError({ 'mandatoryFields': undefined })
    }, [enabletemplate]);
    React.useEffect(() => {
        dataTable(filedata);
    }, [filedata]);
    React.useEffect(() => {
        demoVideo(play);
    }, [play]);
    React.useEffect(() => {
        showDashboard(show);
    }, [show]);
    React.useEffect(() => {
        feedback_(feedbackIssue);
    }, [feedbackIssue]);
    React.useEffect(() => {
        project_(postProject);
    }, [postProject]);
    React.useEffect(() => {
        // toast.success('Welcome back, Xavier', {
        //     position: toast.POSITION.BOTTOM_RIGHT,
        //     hideProgressBar: true,
        //     autoClose: 2000
        // });
        //GetTemplate('Dashboard')
        GetDashboard()
        getDataSet()
        const handleResize = () => {

            if (window.innerWidth < 1010) {
                setNavOpen(false)
                setNavWidth({ 'navArea': '90px', 'inuptArea': '0%', 'ChartArea': '94%' })

                setIsMobile(true)
            }
            else {
                setNavOpen(true)
                setNavWidth({ 'navArea': '90px', 'inuptArea': '28%', 'ChartArea': '63%' })
                setIsMobile(false)

            }

        };

        // window.addEventListener("resize", handleResize);
        return () => {
            //   window.removeEventListener("resize", handleResize);
        };
    }, [])

    //Functions
    const navigate = useNavigate();

    //Every fields onChange for store the inputs
    const handleChange = (event) => {
        if (event.target.name === 'file') {
            document.querySelector('.loader').style.display = 'block'
            if (event.target.files[0] === undefined) {
                setState({
                    ...state, 'Uploaded_file': undefined,
                    'XAxis_': '',
                    'YAxis_': ''
                })
            } else {
                if (event.target.files[0].type === "text/csv") {
                    Papa.parse(event.target.files[0], {
                        header: true,
                        skipEmptyLines: true,
                        complete: function (results) {

                            Object.values(results.data[0]).map((value) => {

                                if (!isNaN(value - 10)) {
                                    Type.push('#')
                                }
                                else if (new Date(value) != 'Invalid Date' && new Date(value).getFullYear().toString().length <= 4) {
                                    Type.push('Da')

                                }
                                else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                                    Type.push('Bo')
                                }
                                else
                                    Type.push('Aa')
                            })
                            Object.keys(results.data[0]).map((e) => Key_.push(e))
                            var newArray = Type.map((e, i) => e + ' ' + Key_[i]);

                            setState({
                                ...state, 'Uploaded_file': results.data,
                                'XAxis_': newArray,
                                'YAxis_': newArray,
                                'GroupByCopy_': newArray,
                                'CheckType': newArray
                            })

                            setError({ 'invalidFile': undefined })
                            ChildtoParentHandshake(state, enable, navbar, { 'newArray': newArray, 'Uploaded_file': results.data })
                            setfilteringProps({ ...filteringProps, 'Dimensions': newArray })
                            setData({ 'data': results.data })
                            setIssues(undefined)
                            postDataSet(event.target.files[0].name, results.data)

                        },
                    });
                }
                else if (event.target.files[0].type === "application/json") {
                    const reader = new FileReader();
                    reader.onload = e => {
                        try {
                            var data = JSON.parse(e.target.result)

                            var Type = []
                            var Key_ = []
                            Object.values(data[0]).map((value) => {
                                if (!isNaN(value - 10)) {
                                    Type.push('# ')
                                }
                                else if (new Date(value) != 'Invalid Date' && new Date(value).getFullYear().toString().length <= 4) {
                                    Type.push('Da')
                                }
                                else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                                    Type.push('Bo ')
                                }
                                else
                                    Type.push('Aa ')
                            })
                            Object.keys(data[0]).map((e) => Key_.push(e))
                            var newArray = Type.map((e, i) => e + ' ' + Key_[i]);


                            setState({
                                ...state, 'Uploaded_file': data,
                                'XAxis_': newArray,
                                'YAxis_': newArray,
                                'GroupByCopy_': newArray,
                                'CheckType': newArray
                            })
                            setError({ 'invalidFile': undefined })
                            setData({ 'data': data })
                            setIssues(undefined)
                            ChildtoParentHandshake(state, enable, navbar, { 'newArray': newArray, 'Uploaded_file': data })
                            postDataSet(event.target.files[0].name, data)


                        } catch (error) {
                            setError({ 'invalidFile': 'There is s problem with the file, Please check and Try again !!!' })
                            document.querySelector('.loader').style.display = 'none';
                        }
                    };
                    reader.readAsText(event.target.files[0]);

                }
                else if (event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || event.target.files[0].type === 'application/vnd.ms-excel') {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data = e.target.result;
                        const workbook = xlsx.read(data, { type: "array" });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const json = xlsx.utils.sheet_to_json(worksheet);

                        var Type = []
                        var Key_ = []
                        Object.values(json[0]).map((value) => {

                            if (!isNaN(value - 10)) {
                                Type.push('#')
                            }
                            else if (new Date(value) != 'Invalid Date' && new Date(value).getFullYear().toString().length <= 4) {
                                Type.push('Da')

                            }
                            else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                                Type.push('Bo')
                            }
                            else
                                Type.push('Aa')
                        })
                        Object.keys(json[0]).map((e) => Key_.push(e))
                        var newArray = Type.map((e, i) => e + ' ' + Key_[i]);


                        setState({
                            ...state, 'Uploaded_file': json,
                            'XAxis_': newArray,
                            'YAxis_': newArray,
                            'GroupByCopy_': newArray,
                            'CheckType': newArray
                        })
                        setError({ 'invalidFile': undefined })
                        setData({ 'data': json })
                        setIssues(undefined)
                        ChildtoParentHandshake(state, enable, navbar, { 'newArray': newArray, 'Uploaded_file': json })
                        postDataSet(event.target.files[0].name, json)

                    };
                    reader.readAsArrayBuffer(event.target.files[0]);
                }
                else {
                    setState({
                        ...state, 'Uploaded_file': '',
                        'XAxis_': '',
                        'YAxis_': ''
                    })
                }
            }

            setFlag(false)

        }
        else if (event.target.name === 'colors') {
            const {
                target: { value },
            } = event;
            setColors(
                typeof value === 'string' ? value.split(',') : value,
            );
        }
        else if (event.target.name === 'GroupByCopy') {
            var value = ''
            value = event.target.value.split(' ')
            if (value.length > 1)
                value = value.slice(1, 3).join(' ')
            else
                value = event.target.value
            const unique = [...new Set(state.Uploaded_file.map(item => item[value]))];
            setState({ ...state, 'GroupBy': value, [event.target.name]: event.target.value, 'GroupByValues': unique, })
        }
        else if (event.target.name === 'InputType') {

            setState({ ...state, [event.target.name]: event.target.value })
        }
        else if (event.target.name === 'Title') {
            setState({
                ...state, [event.target.name]: event.target.value,
                'TitleFont': 'Arial',
                'TitleSize': 14,
                'TitleColor': '#f56b6b'
            })
        }
        else if (event.target.name === 'XAxisLabel') {
            setState({
                ...state, [event.target.name]: event.target.value,
                'xlFont': 'Arial',
                'xlSize': 14,
                'xlColor': '#f56b6b'
            })
        }
        else if (event.target.name === 'YAxisLabel') {
            setState({
                ...state, [event.target.name]: event.target.value,
                'ylFont': 'Arial',
                'ylSize': 14,
                'ylColor': '#f56b6b'
            })
        }
        else if (event.target.name === 'RYAxisLabel') {
            setState({
                ...state, [event.target.name]: event.target.value,
                'rylFont': 'Arial',
                'rylSize': 14,
                'rylColor': '#f56b6b'
            })
        }
        else if (event.target.name === 'XAxisCopy') {
            var value = ''
            value = event.target.value.split(' ')
            if (value.length > 1)
                value = value.slice(1, 3).join(' ')
            else
                value = event.target.value
            setState({ ...state, 'XAxis': value, [event.target.name]: event.target.value });
        }
        else if (event.target.name === 'YAxisCopy') {
            var value = ''
            value = event.target.value.split(' ')
            if (value.length > 1)
                value = value.slice(1, 3).join(' ')
            else
                value = event.target.value
            setState({ ...state, 'YAxis': value, [event.target.name]: event.target.value });
        }
        else {
            setState({ ...state, [event.target.name]: event.target.value });
        }
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
        setError({ 'mandatoryFields': undefined })

        if (event.target.name === 'Chart') {
            showValidAxis(event.target.value)
        }
    }
    //Validations
    const handleValidation = (event) => {
        const numberValues = ['ExternalRadiusPadding', 'Heigth_', 'Width_', 'Innerradius', 'SlicesCap', 'YAxisPadding', 'SymbolSize', 'Rows']
        const mandatoryFields = ['Chart', 'InputType', 'ExternalRadiusPadding', 'Innerradius', 'Heigth_', 'Width_', 'SlicesCap',
            'XAxisCopy', 'YAxisPadding', 'SymbolSize', 'GroupByCopy', 'Category', 'Issue']
        var CheckType = ''
        var CheckType_ = ''

        if (mandatoryFields.indexOf(event.target.name) !== -1) {

            if (event.target.value === undefined || event.target.value === 'Select' || event.target.value.trim().length === 0) {
                setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: 'Please enter' } })
                return

            }
            else {
                setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false } })
                isDisable(false)

            }
        }
        if (numberValues.indexOf(event.target.name) !== -1) {
            if (isNaN(event.target.value)) {
                setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: 'Please enter number' } })
            }
            else if (event.target.name === 'Rows') {
                var value = formValues[event.target.name].value;
                if (parseInt(event.target.value) >= value) {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: 'The value should be less than ' + value } })
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false } })
                }
            }
            else if (event.target.name === 'Heigth_' || event.target.name === 'Width_' || event.target.name === 'ExternalRadiusPadding') {
                var value = formValues[event.target.name].value;
                if (event.target.value > value) {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: 'The value should be less than ' + value } })
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false } })
                    isDisable(false)

                }
            }

            else {
                setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false } })
                isDisable(false)

            }
        }

        if (state.Chart === 'ScatterPlot') {
            if (event.target.name === 'XAxisCopy' || event.target.name === 'YAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Integer'
                if (CheckType !== "#") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
            }
            else {
                setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })

            }
        }
        else if (state.Chart === 'Line Chart') {
            if (event.target.name === 'YAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Integer'
                if (CheckType !== "#") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })

                }
            }
            else if (event.target.name === 'XAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Date'
                if (CheckType === "Da") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select other than ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
        }
        else if (state.Chart === 'Series Chart') {
            if (event.target.name === 'XAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Date'
                if (CheckType === "Da") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
            }
            else if (event.target.name === 'YAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Integer'
                if (CheckType !== "#") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
            else if (event.target.name === 'GroupByCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Date'
                if (CheckType === "Da") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select other than ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
        }
        else if (state.Chart === 'Composite Chart') {
            if (event.target.name === 'XAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Date'
                if (CheckType === "Da") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select other than ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
            else if (event.target.name === 'YAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Integer'
                if (CheckType !== "#") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
            else if (event.target.name === 'GroupByCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'String'
                if (CheckType !== "Aa") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
        }

        else if (state.Chart === 'Bar Chart' || state.Chart === 'Pie Chart') {
            if (event.target.name === 'XAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Date'
                if (CheckType === "Da") {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select other than ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
            else if (event.target.name === 'YAxisCopy') {
                CheckType = event.target.value.split(' ').splice(0, 1)[0]
                CheckType_ = 'Integer'
                if (CheckType !== "#" && state.YAxisCopy !== 'Select') {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: true, errorMessage: `Please select ${CheckType_}` } })
                    return
                }
                else {
                    setFormValues({ ...formValues, [event.target.name]: { ...formValues[event.target.name], error: false, errorMessage: `Please select ${CheckType_}` } })
                }
            }
        }
        if (event.target.name === 'TempName') {
            if (template[event.target.value] !== undefined) {
                setFormValues({ ...formValues, 'TempName': { ...formValues.TempName, error: true } })
                return
            }
            else
                setFormValues({ ...formValues, 'TempName': { ...formValues.TempName, error: false } })
        }
    }
    //Chart generation
    const GenerateChart = () => {
        var CheckTypeXAxis = ''
        var CheckTypeYAxis = ''
        var CheckTypeGroupBy = ''
        var CheckType_ = ''
        // To check axis cols
        if (state.XAxisCopy !== undefined)
            CheckTypeXAxis = state.XAxisCopy.split(' ').splice(0, 1)[0]
        if (state.YAxisCopy !== undefined)
            CheckTypeYAxis = state.YAxisCopy.split(' ').splice(0, 1)[0]

        if (state.Chart === 'Bar Chart' || state.Chart === 'Pie Chart' || state.Chart === 'Composite Chart' || state.Chart === 'Line Chart') {
            if (CheckTypeXAxis === "Da") {
                CheckType_ = 'Date'
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['XAxisCopy'], error: true, errorMessage: `Please select other than ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select other than ${CheckType_} in the XAxis` })
                return

            }
            else if (CheckTypeYAxis !== "#" && CheckTypeYAxis !== '') {
                CheckType_ = 'Integer'
                setFormValues({ ...formValues, 'YAxisCopy': { ...formValues['YAxisCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select ${CheckType_} in the YAxis` })

            }
            else {
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['XAxisCopy'], error: false, errorMessage: `Please select other than ${CheckType_}` } })
                setFormValues({ ...formValues, 'YAxisCopy': { ...formValues['YAxisCopy'], error: false, errorMessage: `Please select  ${CheckType_}` } })
            }
        }
        else if (state.Chart === 'Composite Chart') {
            if (state.GroupByCopy !== undefined)
                CheckTypeGroupBy = state.GroupByCopy.split(' ').splice(0, 1)[0]
            if (CheckTypeGroupBy !== "Aa") {
                CheckType_ = 'String'
                setFormValues({ ...formValues, 'GroupByCopy': { ...formValues['GroupByCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select  ${CheckType_} in the GroupBy` })
                return

            }
            else {
                setFormValues({ ...formValues, 'GroupByCopy': { ...formValues['GroupByCopy'], error: false, errorMessage: `Please select other than ${CheckType_}` } })
            }
        }
        else if (state.Chart === 'Series Chart') {
            if (state.GroupByCopy !== undefined)
                CheckTypeGroupBy = state.GroupByCopy.split(' ').splice(0, 1)[0]
            if (CheckTypeXAxis !== "Da") {
                CheckType_ = 'Date'
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['XAxisCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select  ${CheckType_} in the XAxis` })
                return

            }
            else if (CheckTypeYAxis !== "#") {
                CheckType_ = 'Integer'
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['YAxisCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select ${CheckType_} in the YAxis` })
            }
            if (CheckTypeGroupBy === "Da") {
                CheckType_ = 'Date'
                setFormValues({ ...formValues, 'GroupByCopy': { ...formValues['GroupByCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select other than ${CheckType_} in the GroupBy` })
                return

            }
            else {
                setFormValues({ ...formValues, 'GroupByCopy': { ...formValues['GroupByCopy'], error: false, errorMessage: `Please select other than ${CheckType_}` } })
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['XAxisCopy'], error: false, errorMessage: `Please select other than ${CheckType_}` } })
                setFormValues({ ...formValues, 'YAxisCopy': { ...formValues['YAxisCopy'], error: false, errorMessage: `Please select  ${CheckType_}` } })
            }

        }
        else if (state.Chart === 'ScatterPlot') {
            CheckType_ = 'Integer'
            if (CheckTypeXAxis === "#")
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['XAxisCopy'], error: false, errorMessage: `Please select ${CheckType_}` } })
            else {
                setFormValues({ ...formValues, 'XAxisCopy': { ...formValues['XAxisCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select ${CheckType_} in the XAxis` })
                return
            }
            if (CheckTypeYAxis === "#")
                setFormValues({ ...formValues, 'YAxisCopy': { ...formValues['YAxisCopy'], error: false, errorMessage: `Please select ${CheckType_}` } })

            else {
                setFormValues({ ...formValues, 'YAxisCopy': { ...formValues['YAxisCopy'], error: true, errorMessage: `Please select ${CheckType_}` } })
                setError({ 'mandatoryFields': `Please select ${CheckType_} in YAxis` })
                return
            }

        }

        //To check if any col is highlighted
        const formFields = Object.keys(formValues);
        for (var i = 0; i < formFields.length; i++) {
            var isTrue = formValues[formFields[i]].error;
            if (isTrue) {
                //  isDisable(true)
                setError({ 'mandatoryFields': 'Please fill the highlighted fields' })
                return
            }
            else {
                isDisable(false)
            }
        }

        const Common = ['Chart', 'Heigth_', 'Width_', 'XAxisCopy']
        const Pie = ['ExternalRadiusPadding', 'Innerradius', 'SlicesCap']

        //var MissedFields = []
        for (let i = 0; i < Common.length; i++) {
            if (state[Common[i]] === undefined || state[Common[i]] === '' || state[Common[i]] === 'Select') {
                if (Common[i] === 'Width_') Common[i] = 'Width'
                if (Common[i] === 'Heigth_') Common[i] = 'Heigth'
                if (Common[i] === 'XAxisCopy') Common[i] = 'XAxis'
                setError({ 'mandatoryFields': `Please fill the ${Common[i]} field` })
                return
            }
            else {
                setError({ 'mandatoryFields': undefined })
            }
        }
        if (state.Chart === 'Composite Chart' || state.Chart === 'Series Chart') {
            if (state.GroupBy === undefined || state.GroupBy === '' || state.GroupBy === 'Select') {
                setError({ 'mandatoryFields': 'Please fill the GroupBy field' })
                return
            }
            else {
                setError({ 'mandatoryFields': undefined })
            }

        }
        if (state.Chart === 'Bar Chart') {
            if (state.YAxisPadding === undefined) {
                setError({ 'mandatoryFields': `Please fill the YAxisPadding field` })
                return
            }
            else {
                setError({ 'mandatoryFields': undefined })
                setEnable({ 'Barchart': true })
            }
        }
        else if (state.Chart === 'Pie Chart') {
            for (let i = 0; i < Pie.length; i++) {
                if (state[Pie[i]] === undefined || state[Pie[i]] === '') {
                    setError({ 'mandatoryFields': `Please fill the ${Pie[i]} field` })
                    return
                }
                else {
                    setError({ 'mandatoryFields': undefined })
                    setEnable({ 'Piechart': true })
                }
            }


        }
        else if (state.Chart === 'ScatterPlot') {
            if (state.SymbolSize === undefined || state.SymbolSize === '') {
                setError({ 'mandatoryFields': 'Please fill the SymbolSize field' })
                return
            }
            else {
                setError({ 'mandatoryFields': undefined })
                setEnable({ 'Scatter': true })
            }
        }
        else if (state.Chart === 'Line Chart') {
            setEnable({ 'Linechart': true })
        }
        else if (state.Chart === 'Composite Chart') {
            setEnable({ 'Compositechart': true })
        }
        else if (state.Chart === 'Series Chart') {
            setEnable({ 'Serieschart': true })

        }
        else if (state.Chart === 'Bar Line Chart') {
            setEnable({ 'Barlinechart': true })

        }
        setData({ 'data': undefined })


        ChildtoParentHandshake(state, enable, navbar, { 'newArray': state.XAxis_, 'Uploaded_file': state.Uploaded_file })
        dataTable(filedata)
        setPlay({ "isPlay": undefined })
        setIsshow({ "isShow": undefined })
        setIssues(undefined)
        // console.log('Chart Props', state)
        // console.log('Template value', template)
        // console.log('Dashboard value', dashboard)
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
        }, 100);
    }
    //Import input process
    const importInputs = (event) => {
        // if (event.target.files[0] === undefined) {
        //     setState({
        //         ...state, 'Uploaded_file': undefined,
        //         'XAxis_': '',
        //         'YAxis_': ''
        //     })
        // }
        // else {
        const reader = new FileReader();
        reader.onload = e => {
            var data = JSON.parse(e.target.result)
            if (data['Chart'] !== undefined) {
                // document.querySelector('.loader').style.display = 'block';
                setState(data)
                setNavbar({ 'bar': 'Charts' })
                ChildtoParentHandshake(data, enable, navbar, { 'newArray': data.XAxis_, 'Uploaded_file': data.Uploaded_file })
                isDisable(false)
                setError({ 'invalidInputs': undefined })
                setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Imported': true })

            }
            else {

                setError({ 'invalidInputs': 'Invalid Input, Please check the file and Try again !!!' })
                setEnable({ ...enable, 'Imported': false })
            }
        };
        reader.readAsText(event.target.files[0]);
        //  }
    }
    // Sidebar navigation
    const handleNavbarChange = (event) => {
        var data = event.currentTarget.dataset.testid;
        if (data !== 'FeedbackIcon')
            resetScreen()
        var bar = '';
        if (data === 'DatasetIcon') {
            bar = 'Data'
        }
        else if (data === 'SignalCellularAltIcon') {
            bar = 'Charts'

        }
        else if (data === 'Grid3x3Icon') bar = 'Dimensions'
        else if (data === 'LineAxisIcon') bar = 'Axes'
        else if (data === 'ArticleIcon') bar = 'Templates'
        else if (data === 'YouTubeIcon') bar = 'Demo'
        else if (data === 'DashboardIcon') bar = 'Dashboard'
        else if (data === 'FeedbackIcon') bar = 'Feedback'
        else if (data === 'AutoAwesomeMotionIcon') bar = 'Project'
        else if (data === 'CollectionsIcon') bar = 'Collections'

        setNavbar({ 'bar': bar })
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })

    }
    //property enabling for the swatch
    const handleShowProps = (e) => {
        e.stopPropagation();
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
        var value = ''
        if (e.target.name === 'Titleswatch' || e.target.name === 'Axesswatch' || e.target.name === 'Legendswatch' || e.target.name === 'Labelsswatch') {
            if (e.target.checked) value = 'block'
            else value = 'none'
        }
        else if (e.target.name === 'Tooltipswatch') {
            if (e.target.checked) value = .9
            else value = .0
        }
        else if (e.target.name === 'Barswatch' || e.target.name === 'Pieswatch' || e.target.name === 'Scatterswatch' || e.target.name === 'Lineswatch' ||
            e.target.name === 'Compositeswatch' || e.target.name === 'Seriesswatch' || e.target.name === 'BarLineswatch') {
            if (e.target.checked) value = 'show'
            else value = 'hide'
        }

        setState({ ...state, [e.target.name]: value, [e.target.name + '_']: e.target.checked });

    }
    //Template Save/Cancel
    const saveTemplate = (action) => {
        if (action !== 'cancel') {
            setTemplate({ ...template, [state.TempName]: state });
            setDashboard({ ...dashboard, [state.TempName]: { ...state, 'Width_': null, 'Heigth_': 250 } });
            if (flag) {
                document.querySelector('.loader').style.display = 'block';
                PostTemplate('Update');
                GenerateChart();
                toast.success('Your template has been Updated', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
            }
            else {
                if (formValues.TempName === true || state.TempName === undefined) {
                    // Enable validation
                }
                toast.success('Your template has been Saved', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
                setOpen(false);
                setNavbar({ 'bar': 'Templates' });
                PostTemplate('Insert');
            }
        }
        else {
            setFlag(false)
            toast.success('Your template updation has been cancelled', {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
                autoClose: 2000
            })
        }
    }
    //Template Edit/Delete
    const handleTemplate = (name, action) => {
        if (action === 'Edit') {
            setState(template[name])
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
            setNavbar({ 'bar': 'Charts' })
            setFlag(true)

        }
        else if (action === 'Delete') {
            setTemplate({ ...template, [name]: undefined })
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })

            axios.post(`http://${path.Location}:8000/DeleteTemplate`, { 'TempName': name, 'userID': user.userID }).then((response) => {
                console.log('data', response);
                toast.success('Your Chart has been Deleted', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
                setFlag(flag)
            });
            setOpen({ ...open, 'Template': false })
            return;
        }
        else if (action === 'templeDelete') {
            let Index = -1
            for (let i = 0; i < Object.keys(project).length; i++) {
                Index = Object.values(project[Object.keys(project)[i]].charts).indexOf(name)
                if (Index !== -1) {
                    setOpen({ ...open, 'Template': true, 'deleteTemplate': true, 'tempName': name, 'dashboardName': project[Object.keys(project)[i]].DashboardName })
                    return
                }
            }
            if (Index === -1)
                handleTemplate(name, 'Delete')
        }

        if (action === 'Preview' || action === 'Edit') {
            //GetTemplate()
            document.querySelector('.loader').style.display = 'block';
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
            setEnableTemplate(!enabletemplate)
            setState(template[name])
            if (action === 'Preview')
                setFlag(false)
        }
    }

    //Template dragging for dashboard
    const allowDrop = (event) => {
        setdashboardCharts({ ...dashboardCharts, [event.target.id]: event.target.id })
        event.dataTransfer.setData("text", event.target.id);
    }
    //Show valid axis
    const showValidAxis = (chart) => {
        var Notvalid = []
        var validXAxis = []
        var validYAxis = []
        var validGroupAxis = []

        if (chart === 'Bar Chart' || chart === 'Pie Chart' || chart === 'Line Chart') {
            //X Axis
            Notvalid = ['Da']
            state['CheckType'].map((e) => {
                var value = e.split(' ').splice(0, 1)[0]
                if (Notvalid.indexOf(value) === -1)
                    validXAxis.push(e)
            })

            //Y Axis
            Notvalid = ['Da', 'Aa']
            state['CheckType'].map((e) => {
                var value = e.split(' ').splice(0, 1)[0]
                if (Notvalid.indexOf(value) === -1)
                    validYAxis.push(e)
            })
        }
        else if (chart === 'ScatterPlot' || chart === 'Bar Line Chart') {
            Notvalid = ['Da', 'Aa']
            state['CheckType'].map((e) => {
                var value = e.split(' ').splice(0, 1)[0]
                if (Notvalid.indexOf(value) === -1) {
                    validXAxis.push(e)
                    validYAxis.push(e)
                }
            })
        }
        else if (chart === 'Series Chart' || chart === 'Composite Chart') {
            Notvalid = ['Da']
            if (chart === 'Series Chart') {
                state['CheckType'].map((e) => {
                    var value = e.split(' ').splice(0, 1)[0]
                    if (Notvalid.indexOf(value) !== -1) {
                        validXAxis.push(e)
                    }
                })
            }
            else if (chart === 'Composite Chart') {
                state['CheckType'].map((e) => {
                    var value = e.split(' ').splice(0, 1)[0]
                    if (Notvalid.indexOf(value) === -1) {
                        validXAxis.push(e)
                    }
                })
            }

            Notvalid = ['Da', 'Aa']
            state['CheckType'].map((e) => {
                var value = e.split(' ').splice(0, 1)[0]
                if (Notvalid.indexOf(value) === -1) {
                    validYAxis.push(e)
                }
            })

            Notvalid = ['Aa']
            state['CheckType'].map((e) => {
                var value = e.split(' ').splice(0, 1)[0]
                if (Notvalid.indexOf(value) !== -1) {
                    validGroupAxis.push(e)
                }
            })

        }
        if (chart === 'Series Chart' || chart === 'Composite Chart') {
            setState({
                ...state,
                'XAxis_': validXAxis,
                'YAxis_': validYAxis,
                'GroupByCopy_': validGroupAxis,
                'Chart': chart
            })
        }
        else {

            setState({
                ...state,
                'XAxis_': validXAxis,
                'YAxis_': validYAxis,
                'Chart': chart
            })
        }
        validXAxis = []
        validYAxis = []
        validGroupAxis = []

    }
    //Dynamic filtering for dashboard
    const handleFilter = (action) => {
        var customFilter = filteringProps.customFilter
        var props_ = {}
        var props = []
        let data = []
        if (filter.data === undefined) data = dashboard[Object.keys(dashboard)[0]].Uploaded_file
        else data = filter.data
        for (let i = 0; i < customFilter.length; i++) {
            const Dimensions = customFilter[i].split(' ').slice(1, 3).join(' ')
            const unique = data.map((item) => item[Dimensions])
                .filter((value, index, self) => self.indexOf(value) === index);
            props_[Dimensions] = unique;
            props_.Dimensions = Dimensions;
            props.push(props_)
            props_ = {}
        }
        if (action === 'Dashboard Insert') {
            return props
        }
        else {
            //console.log('testing filter props', props);
            setIsshow({ ...show, 'isShow': true, dashboard, 'NOCharts': others.NOCharts, 'Filter': filter, 'FilteringProps': props, 'isBublished': true, 'Build': false })
        }
    }
    const handlecustomFilter = (event) => {
        const {
            target: { value },
        } = event;
        setfilteringProps({ ...filteringProps, [event.target.name]: typeof value === 'string' ? value.split(',') : value, });
    }
    //Expand/Collapse
    const ExpandCollapse = (action) => {
        setTimeout(() => {

            if (navopen && !isMobile) {
                setNavWidth({ 'navArea': '90px', 'inuptArea': '0%', 'ChartArea': '95%' })
            }
            else if (navopen && isMobile) {
                setNavWidth({ 'navArea': '90px', 'inuptArea': '0%', 'ChartArea': '94%' })
            }
            else if (!navopen && isMobile) {
                setNavWidth({ 'navArea': '90px', 'inuptArea': '60%', 'ChartArea': '94%' })
            }
            else if (!navopen && !isMobile) {
                setNavWidth({ 'navArea': '90px', 'inuptArea': '28%', 'ChartArea': '63%' })
            }
            setNavOpen(!navopen)
            if (action === 'publish')
                setIsshow({ ...show, isBublished: !show.isBublished, 'Build': false })
            else
                setIsshow({ ...show, isBublished: !show.isBublished })

        }, 100);
        //ExpandData(navwidth)

    }
    //To store selected static layout
    const dashboardLayouts = (event) => {
        setOthers({ ...others, 'selectedLayout': event.currentTarget.id })
    }

    //To reset the screen click upon navtabs
    const resetScreen = () => {
        setData({ 'data': undefined });
        setIsshow({ "isShow": undefined });
        setIssues(undefined);
        setPlay({ "isPlay": undefined })
        ChildtoParentHandshake(undefined)
    }

    // Service call's
    const PostTemplate = (action) => {
        try {
            if (action === 'Update') {
                axios.post(`http://${path.Location}:8000/DeleteTemplate`, { 'TempName': state.TempName, 'userID': user.userID }).then((response) => {
                    axios.post(`http://${path.Location}:8000/InsertTemplate`, (state))
                        .then((response) => {
                            console.log('data', response.data);
                            GetTemplate()
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
            else if (action === 'Insert') {
                const Result = state
                delete Result._id
                axios.post(`http://${path.Location}:8000/InsertTemplate`, (Result))
                    .then((response) => {
                        console.log('data', response.data);
                        GetTemplate()
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        }
        catch (error) {
            console.log('error', error.message)
        }
    }
    const GetTemplate = (Tab) => {
        if (user.userID == '') {
            navigate('/')
            return
        }
        if ((Tab === undefined && Object.keys(template).length === 0) || Object.keys(dashboard).length === 0)
            document.querySelector('.loader').style.display = 'block';
        axios.post(`http://${path.Location}:8000/GetTemplate`, { 'userID': user.userID, 'Flag': { 'action': 'All' } }).then((response) => {
            let data = response.data;
            if (Tab === 'Dashboard' || Tab === 'Create Dashboard') {
                let obj = {};
                for (let i = 0; i < data.length; i++) {
                    data[i].Width_ = null;
                    data[i].Heigth_ = 250;
                    obj[data[i].TempName] = data[i];
                }
                setDashboard(obj);
                if (Tab === 'Create Dashboard') {
                    setTimeout(() => {
                        document.querySelector('.loader').style.display = 'none';
                    }, 0);
                }
            }
            else {
                let obj = {}
                for (let i = 0; i < data.length; i++) {
                    obj[data[i].TempName] = data[i];
                }
                setTemplate(obj);

                if (Tab === undefined) {
                    setTimeout(() => {
                        document.querySelector('.loader').style.display = 'none';
                    }, 100);
                }
            }
        });
    }
    const handleFeedback = (action) => {
        if (action !== 'Fetch') {
            if ((feedback['Category'] === 'Select' || feedback['Category'] === undefined) || (feedback.Issue === undefined || feedback.Issue === '')) {
                setError({ 'mandatoryFields': 'Please fill the mandatory Fields' })
                return
            }
            axios.post(`http://${path.Location}:8000/InsertFeedback`, feedback).then((response) => {
                console.log('data', response.data);
                axios.get(`http://${path.Location}:8000/GetFeedback`).then((response) => {
                    let data = response.data
                    setPlay({ "isPlay": undefined })
                    setIsshow({ "isShow": undefined })
                    setData({ 'data': undefined })
                    setIssues(data)
                    setFeedback({ ...feedback, 'Issue': '' })
                });
            });
        }
        else {
            axios.get(`http://${path.Location}:8000/GetFeedback/`).then((response) => {
                // debugger
                let data = response.data
                setPlay({ "isPlay": undefined })
                setIsshow({ "isShow": undefined })
                setData({ 'data': undefined })
                setIssues(data)
            })
        }
        setError({ 'mandatoryFields': undefined })
    }
    const handleDashboard = (action, e) => {
        if (action === 'Save') {
            setOpen({ 'Dashboard': false })
            PostDashboard('Insert')
            toast.success('Your Project has been Saved', {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
                autoClose: 2000
            });
        }
        else if (action === 'Edit') {
            let data = project[e.currentTarget.id]
            if (data.layoutOption === 'Static') {
                setOthers({ ...others, 'StaticLayouts': true, 'CustomLayouts': false, 'selectedLayout': data.layouts, 'EditDashboard': true, 'EditingDashboardID': data.DashboardName })
            }
            else {
                let Cols = {}
                data.layouts[1].map((e, index) => (Cols['Cols' + (index + 1)] = e))
                setOthers({ ...others, 'StaticLayouts': false, 'CustomLayouts': true, 'Rows': data.layouts[0], Cols, 'EditDashboard': true, 'EditingDashboardID': data.DashboardName })
            }
            setNavbar({ 'bar': 'Dashboard' })
            setprojectDetails({ 'DashboardDescription': project[e.currentTarget.id].DashboardDescription })
            setfilteringProps({ ...filteringProps, 'customFilter': data.selectedFilterDimensions, 'Dimensions': data.AvailableDimensions })
            //setFilter({ ...filter, 'filterSwatch': data.filter.filterSwatch, 'data': dashboard[Object.values(data.charts)[0]].Uploaded_file })
        }
        else if (action === 'Update') {
            const filterProps = handleFilter('Dashboard Insert')
            let obj = {}
            obj.userID = user.userID
            if (others.StaticLayouts) {
                obj.layouts = others.selectedLayout
                obj.layoutOption = 'Static'
            }
            else {
                let a = []
                Object.keys(others.Cols).map((e, i) => {
                    if (i < parseInt(others.Rows)) {
                        a.push(others.Cols[e])
                    }
                })
                obj.layouts = [others.Rows, a]
                obj.layoutOption = 'Custom'
            }
            obj.charts = JSON.parse(sessionStorage.getItem('IDs'))
            obj.DashboardName = project[others.EditingDashboardID].DashboardName
            obj.DashboardDescription = projectDetails.DashboardDescription

            obj.Filter = filter
            obj.FilterProps = filterProps
            obj.selectedFilterDimensions = filteringProps.customFilter
            obj.AvailableDimensions = filteringProps.Dimensions
            obj.action = 'Update'
            setpostProject(obj);
            document.querySelector('.loader').style.display = 'block'
            axios.post(`http://${path.Location}:8000/UpdateDashboard`, obj).then((response) => {
                toast.success('Your Project has been Updated.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
                //GetDashboard();
            });

        }
        else if (action === 'Delete') {
            document.querySelector('.loader').style.display = 'block';
            axios.post(`http://${path.Location}:8000/DeleteDashboard`, {
                'userID': user.userID,
                'DashboardName': e.currentTarget.id
            }).then((response) => {
                toast.success('Your Project has been Deleted.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
                GetDashboard();
                setTimeout(() => {
                    document.querySelector('.loader').style.display = 'none';
                }, 100);
            })
        }
        if (action === 'Preview' || action === 'Edit') {
            document.querySelector('.loader').style.display = 'block'
            let data = project[e.currentTarget.id] //others.EditingDashboardID
            if (Object.keys(dashboard).length === 0) {
                GetTemplate('Dashboard')
                axios.post(`http://${path.Location}:8000/GetTemplate`, { 'userID': user.userID, 'Flag': { 'action': 'Specific', 'charts': Object.values(data.charts) } }).then((response) => {
                    let Result = response.data;
                    let dashboard_ = {};
                    for (let i = 0; i < Result.length; i++) {
                        Result[i].Width_ = null;
                        Result[i].Heigth_ = 250;
                        dashboard_[Result[i].TempName] = Result[i];
                    }
                    let Uploaded_file = dashboard_[Object.values(data.charts)[0]].Uploaded_file
                    let obj = {}
                    obj.userID = data.userID;
                    obj.layouts = data.layouts;
                    obj.layoutOption = data.layoutOption;
                    obj.charts = data.charts;
                    obj.DashboardName = data.DashboardName;
                    obj.DashboardDescription = data.DashboardDescription;
                    obj.dashboard = dashboard_;
                    obj.Filter = { 'filterSwatch': data.filter.filterSwatch, 'data': Uploaded_file !== undefined ? Uploaded_file : '' };
                    obj.FilterProps = data.filterProps;
                    obj.action = action;
                    setpostProject(obj);
                    setPlay({ 'isPlay': undefined }); setIssues(undefined);
                    setIsshow({ ...show, 'isShow': true, 'Build': false });
                })
            }
            else {
                let Uploaded_file = dashboard[Object.values(data.charts)[0]].Uploaded_file
                let obj = {}
                obj.userID = data.userID;
                obj.layouts = data.layouts;
                obj.layoutOption = data.layoutOption;
                obj.charts = data.charts;
                obj.DashboardName = data.DashboardName;
                obj.DashboardDescription = data.DashboardDescription;
                obj.dashboard = dashboard;
                obj.Filter = { 'filterSwatch': data.filter.filterSwatch, 'data': Uploaded_file !== undefined ? Uploaded_file : '' };
                obj.FilterProps = data.filterProps;
                obj.action = action;
                setpostProject(obj);
                setPlay({ 'isPlay': undefined }); setIssues(undefined);
                setIsshow({ ...show, 'isShow': true, 'Build': false });
            }

        }
    }
    const PostDashboard = (action) => {
        let obj = {}
        const filterProps = handleFilter('Dashboard Insert')
        if (action === 'Insert') {
            obj.userID = user.userID
            if (others.StaticLayouts) {
                obj.layouts = others.selectedLayout
                obj.layoutOption = 'Static'
            }
            else {
                let a = []
                Object.keys(others.Cols).map((e, i) => {
                    if (i < parseInt(others.Rows)) {
                        a.push(others.Cols[e])
                    }
                })
                obj.layouts = [others.Rows, a]
                obj.layoutOption = 'Custom'
            }
            // obj.layouts = JSON.parse(sessionStorage.getItem('dashboard'))['Layouts']
            // obj.layoutOption = JSON.parse(sessionStorage.getItem('dashboard'))['LayoutOption']
            obj.charts = JSON.parse(sessionStorage.getItem('IDs'))
            obj.DashboardName = projectDetails.DashboardName
            obj.DashboardDescription = projectDetails.DashboardDescription
            obj.filter = filter
            obj.filterProps = filterProps
            obj.selectedFilterDimensions = filteringProps.customFilter
            obj.AvailableDimensions = filteringProps.Dimensions
        }
        axios.post(`http://${path.Location}:8000/InsertDashboard`, obj).then((response) => {
            GetDashboard()
        })
    }
    const GetDashboard = () => {
        if (Object.keys(project).length === 0)
            document.querySelector('.loader').style.display = 'block';
        axios.post(`http://${path.Location}:8000/GetDashboard`, { 'userID': user.userID }).then((response) => {
            // console.log('project data', response.data);
            let data = response.data;
            let obj = {};
            for (let i = 0; i < data.length; i++) {
                obj[data[i].DashboardName] = data[i];
            }
            setProject(obj);
            setNavbar({ 'bar': 'Project' });
            // if (Object.keys(project).length !== 0) {
            setTimeout(() => {
                document.querySelector('.loader').style.display = 'none';
            }, 100);
            // }

        })
    }
    const GetPreDefinedTemplates = (action, e) => {
        if (action === 'Fetch') {
            if (Object.keys(TemplatesCollections).length === 0) {
                document.querySelector('.loader').style.display = 'block';
                axios.post(`http://${path.Location}:8000/GetPreDefinedTemplate`)
                    .then((response) => {
                        let data = response.data;
                        let obj = {};
                        for (let i = 0; i < data.length; i++) {

                            data[i].userID = user.userID
                            delete data[i]._id
                            obj[data[i].TempName] = data[i];

                        }
                        setTemplatesCollections(obj);
                        setTimeout(() => {
                            document.querySelector('.loader').style.display = 'none';
                        }, 100);

                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
        else {
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false });
            setEnableTemplate(!enabletemplate);
            setState(TemplatesCollections[e.currentTarget.id]);
            setFlag(false);
        }
    }
    const postDataSet = (name, data) => {
        if (Dataset[name] !== undefined) {
            // setError({ 'invalidFile': 'There is s problem with the file, Please check and Try again !!!' })
            return
        }
        let obj = {}
        obj.userID = user.userID
        obj.filename = name
        obj.data = data
        axios.post(`http://${path.Location}:8000/InsertDataSet`, obj).then((response) => {
            getDataSet()
        })
    }
    const getDataSet = () => {
        axios.post(`http://${path.Location}:8000/GetDataSet`, { 'userID': user.userID }).then((response) => {
            let data = response.data
            let obj = {}
            for (let i = 0; i < data.length; i++) {
                obj[data[i].filename] = data[i].data
            }
            setDataset(obj)
        })
    }
    const handleDataSet = (action, id) => {
        if (action === 'Delete') {
            axios.post(`http://${path.Location}:8000/DeleteDataSet`, { 'userID': user.userID, 'id': id }).then((response) => {
                getDataSet()
            })
        }
        else if (action === 'Use') {
            setState({ ...state, Uploaded_file: Dataset[id] })
            setData({ 'data': Dataset[id] })
        }
    }


    //Components
    const NavIcons = () => {
        return (
            <>
                <div>
                    {!navopen &&
                        <BootstrapTooltip title="Expand" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <ArrowRightIcon onClick={(e) => { ExpandCollapse() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                        </BootstrapTooltip>
                    }
                </div>
                <div>
                    <div className="Icon">
                        <div>
                            <BootstrapTooltip title="Data" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                                {/* <img src={Data} color="white" alt='Logo'></img> */}
                                <DatasetIcon className="Icon_" fontSize="large" color={navbar.bar === 'Data' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                            </BootstrapTooltip>
                        </div>

                    </div>
                    {state.Uploaded_file !== undefined &&
                        <div className="Icon">
                            <BootstrapTooltip title="Chart" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                                <SignalCellularAltIcon className="Icon_" fontSize="large" color={navbar.bar === 'Charts' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                            </BootstrapTooltip>
                        </div>
                    }
                    <div className="Icon">
                        <BootstrapTooltip title="Templates" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <ArticleIcon className="Icon_" fontSize="large" color={navbar.bar === 'Templates' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); GetTemplate() }} />
                        </BootstrapTooltip>
                    </div>

                    <div className="Icon">
                        <BootstrapTooltip title="Dashboard" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <Dashboard className="Icon_" fontSize="large" color={navbar.bar === 'Dashboard' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); GetTemplate('Create Dashboard') }} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Project" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <Project className="Icon_" fontSize="large" color={navbar.bar === 'Project' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); GetDashboard(); GetTemplate('Dashboard') }} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Template Collections" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <Collections className="Icon_" fontSize="large" color={navbar.bar === 'Collections' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); GetPreDefinedTemplates('Fetch', e) }} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Demo" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <Demo className="Icon_" fontSize="large" color={navbar.bar === 'Demo' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Feedback" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <FeedbackIcon className="Icon_" fontSize="large" color={navbar.bar === 'Feedback' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); handleFeedback('Fetch') }} />
                        </BootstrapTooltip>
                    </div>
                </div>

            </>
        )
    }
    const DashboardIcons = ({ e }) => {
        return (
            <div className="col-lg-4" style={{ paddingLeft: 0 }}>
                {e === 'Bar Chart' &&
                    <Barchart fontSize="large" style={{ color: '#6282b3' }} />
                }
                {e === 'Pie Chart' &&
                    <Piechart fontSize="large" style={{ color: '#6282b3' }} />
                }
                {e === 'Composite Chart' &&
                    <Compositechart fontSize="large" style={{ color: '#6282b3' }} />
                }
                {e === 'Line Chart' &&
                    <Linechart fontSize="large" style={{ color: '#6282b3' }} />
                }
                {e === 'ScatterPlot' &&
                    <Scatterplot fontSize="large" style={{ color: '#6282b3' }} />
                }
                {e === 'Bar Line Chart' &&
                    <Barlinechart fontSize="large" style={{ color: '#6282b3' }} />
                }
                {e === 'Series Chart' &&
                    <Serieschart fontSize="large" style={{ color: '#6282b3' }} />
                }
            </div>
        )
    }
    const Chartheader = ({ param }) => {
        return (
            <div>
                <span className="panal-header" style={{ float: "left", fontWeight: "bold", margin: '15px' }}>{param}</span>
            </div>
        );
    };

    return (
        <>
            {/* {progress.loader &&
                < LoadingSpinner />
            } */}
            <div className="nav-bar col-xs-1  col-sm-1 col-md-1 col-lg-1" style={{ width: navwidth.navArea, borderRight: navopen ? '1px solid rgb(0 0 0 / 13%)' : '', backgroundColor: '#f7f5f526' }}>
                {/* {navopen && */}
                <NavIcons />
                {/* } */}
            </div>
            {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 divchart" style={{ width: navwidth.inuptArea, overflowY: `${!navopen ? 'hidden' : 'auto'}`, padding: `${navopen ? '' : '0px'}` }}> */}
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 divchart" style={{ height: 'calc(94vh - 14px)', width: navwidth.inuptArea, overflowY: `${!navopen ? 'hidden' : 'auto'}`, padding: `${navopen ? '' : '0px'}` }}>
                <div className="nav-close">
                    {navopen ?
                        <BootstrapTooltip title="Collapse" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <ArrowLeftIcon onClick={(e) => { ExpandCollapse() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                        </BootstrapTooltip>
                        : ''
                    }
                </div>
                <>
                    <Chartheader param={navbar.bar} />
                    {navbar.bar === 'Data' &&
                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 13px" }}>
                            <div className="row col-sm-6 col-md-6 col-lg-5">
                                <TextField
                                    error={formValues.InputType.error}
                                    helperText={formValues.InputType.error && formValues.InputType.errorMessage}
                                    id="InputType"
                                    select
                                    name='InputType'
                                    label="Input Type"
                                    defaultValue={'Enter Inputs'}
                                    className='input-field '
                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                    value={state.InputType}
                                >
                                    <MenuItem key={1} value={'Import Inputs'} >Import Inputs</MenuItem>
                                    <MenuItem key={2} value={'Enter Inputs'}>Enter Inputs</MenuItem>
                                    <MenuItem key={3} value={'Available Dataset'}>Available Dataset</MenuItem>

                                </TextField>


                            </div>
                            {state.InputType === 'Import Inputs' || state.InputType === undefined ?
                                <div className="row col-sm-6 col-md-6 col-lg-7">

                                    <input type="file" name="file" id="importInputs" accept=".json" onChange={importInputs}></input>

                                </div>
                                : ''
                            }
                        </div>
                    }

                    {error.invalidInputs !== undefined &&
                        <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ margin: "15px" }}>
                            <Alert severity="error">{error.invalidInputs}</Alert>
                        </div>
                    }
                    {(state.InputType === 'Enter Inputs' && navbar.bar === 'Data') ?
                        <div>
                            <div className=" col-lg-12" style={{ margin: "15px" }}>
                                <label className="drop-container">
                                    <span className="drop-title">Drop files here</span>
                                    or
                                    <input type="file" name="file" id="uploadFile" accept=".csv, .json, .xlsx, .xls" onChange={handleChange}></input>
                                </label>
                            </div>

                            {error.invalidFile !== undefined &&
                                <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ margin: "15px" }}>
                                    <Alert severity="error">{error.invalidFile}</Alert>
                                </div>
                            }
                        </div>
                        : ''
                    }
                    {(state.InputType === "Available Dataset" && navbar.bar === 'Data') ?
                        <>
                            {(() => {
                                let Item = [];
                                for (let a in Dataset) {
                                    if (Dataset[a] !== undefined) {
                                        Item.push(
                                            <div className="row col-lg-12 divdataset-body">
                                                <div className="col-lg-5 dataset-name">{a}</div>
                                                <div className="row col-lg-5 dataset-icon">
                                                    <div className="col-lg-5 dataset-icon_" onClick={(e) => { handleDataSet('Use', a) }}>Use</div>
                                                    <div className="col-lg-5 dataset-icon_" onClick={(e) => { handleDataSet('Delete', a) }}>Delete</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                                if (Item.length === 0) {
                                    Item.push(
                                        <div className="row col-lg-12 divdataset-body">
                                            <div className="col-lg-10 dataset-name">No Dataset Found !!!</div>

                                        </div>
                                    )
                                }
                                return Item

                            })()}
                        </>
                        : ''
                    }
                    {state.Uploaded_file !== undefined && state.InputType === 'Enter Inputs' && navbar.bar === 'Data' ?
                        <>
                            <div className="row col-sm-6 col-md-3 col-lg-5" style={{ margin: "15px" }}>
                                <Button variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { setData({ 'data': state.Uploaded_file }); setIsshow({ "isShow": undefined }); setIssues(undefined) }}>
                                    Show Data
                                </Button>
                            </div>
                        </>
                        :
                        ''
                    }
                    {/* {state.Uploaded_file === undefined && state.InputType === 'Enter Inputs' && navbar.bar === 'Data' ?
                        <div style={{ color: 'red' }}>Use the file with the less than 300 records for better experience, We are working on for boosting up.</div>
                        : ''
                    } */}
                    {(state.Uploaded_file !== undefined && error.invalidInputs === undefined) || template !== undefined ?
                        <>
                            {navbar.bar === 'Charts' || navbar.bar === 'Templates' ?
                                <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>
                                    {(enable.Imported || state.Uploaded_file !== undefined) && navbar.bar === 'Charts' ?
                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="row col-sm-6 col-md-6 col-lg-6 inputfield">
                                                <TextField
                                                    error={formValues.Chart.error}
                                                    helperText={formValues.Chart.error && formValues.Chart.errorMessage}
                                                    id="ChartType"
                                                    select
                                                    name='Chart'
                                                    label="Chart Type"
                                                    value={state.Chart}
                                                    className='input-field '
                                                    onChange={(e) => { handleValidation(e); handleChange(e); setFlag(false) }}
                                                >
                                                    {ChartType.map((option, index) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ paddingLeft: '0' }}>
                                                    <TextField
                                                        error={formValues.Heigth_.error}
                                                        helperText={formValues.Heigth_.error && formValues.Heigth_.errorMessage}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="start">Px</InputAdornment>,
                                                        }}
                                                        id="Height" className='input-field' name='Heigth_' label="Height*" variant="outlined"
                                                        value={state.Heigth_}
                                                        margin="dense"
                                                        size="small"
                                                        onChange={(e) => { handleChange(e) }}
                                                        onBlur={(e) => { handleValidation(e) }}
                                                    />
                                                </div>
                                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ paddingLeft: '0' }}>
                                                    <TextField
                                                        error={formValues.Width_.error}
                                                        helperText={formValues.Width_.error && formValues.Width_.errorMessage}

                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="start">Px</InputAdornment>,
                                                        }}
                                                        id="Width" className='input-field' name='Width_' label="Width*" variant="outlined"
                                                        value={state.Width_}
                                                        margin="dense"

                                                        onChange={(e) => { handleChange(e) }}
                                                        onBlur={(e) => { handleValidation(e) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ''
                                    }
                                    {(enable.Imported || state.Uploaded_file !== undefined) && (navbar.bar === 'Charts') ?
                                        <>
                                            {(navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                                <Accordion className="acd">
                                                    <AccordionSummary
                                                        className="acdsummary"
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className="acdTitle">Dimensions</Typography>

                                                    </AccordionSummary>

                                                    <AccordionDetails>
                                                        <Typography>
                                                            <div className="col-lg-12" style={{ margin: "10px 0px 15px 0px" }}>
                                                                {(state.Chart === 'Pie Chart') &&
                                                                    <div className="col-lg-12">
                                                                        <div className="row col-lg-12">
                                                                            <p className="row col-lg-12">X-Axis</p>
                                                                            <div className="row col-sm-6 col-md-5 col-lg-6 inputfield">
                                                                                <TextField
                                                                                    error={formValues.XAxisCopy.error}
                                                                                    helperText={formValues.XAxisCopy.error && formValues.XAxisCopy.errorMessage}
                                                                                    id="XAxis"
                                                                                    select
                                                                                    name='XAxisCopy'
                                                                                    label={
                                                                                        <Fragment>
                                                                                            <BootstrapTooltip title="Accepts numbers" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                <Numbers fontSize="small" />
                                                                                            </BootstrapTooltip>

                                                                                            &nbsp;
                                                                                            <BootstrapTooltip title="Accepts strings" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                {/* <Text style={{ height: '27px' }} /> */}
                                                                                                <span style={{ fontWeight: '700' }}>ABC</span>
                                                                                            </BootstrapTooltip>
                                                                                            &nbsp;
                                                                                            <span style={{ fontWeight: '900' }}>*</span>
                                                                                        </Fragment>
                                                                                    }
                                                                                    className='input-field '
                                                                                    margin="dense"
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                    value={state.XAxisCopy}
                                                                                    defaultValue={'Select'}
                                                                                >
                                                                                    <MenuItem key={-1} value={'Select'}>
                                                                                        {'Select'}
                                                                                    </MenuItem>
                                                                                    {state.XAxis_.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            {option}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                            <p className="row col-lg-12">Y-Axis</p>
                                                                            <div className="row col-sm-6 col-md-5 col-lg-6" >
                                                                                <TextField
                                                                                    error={formValues.YAxisCopy.error}
                                                                                    helperText={formValues.YAxisCopy.error && formValues.YAxisCopy.errorMessage}
                                                                                    id="YAxis"
                                                                                    select
                                                                                    name='YAxisCopy'
                                                                                    label={
                                                                                        <Fragment>
                                                                                            <BootstrapTooltip title="Accepts numbers" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                <Numbers fontSize="small" />
                                                                                            </BootstrapTooltip>
                                                                                            <span style={{ fontWeight: '900' }}>*</span>
                                                                                        </Fragment>
                                                                                    }
                                                                                    margin="dense"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                    value={state.YAxisCopy}
                                                                                    defaultValue={'Select'}
                                                                                >
                                                                                    <MenuItem key={-1} value={'Select'}>
                                                                                        {'Select'}
                                                                                    </MenuItem>
                                                                                    {state.YAxis_.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            {option}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                <TextField
                                                                                    id="GroupBy"
                                                                                    select
                                                                                    name='GroupByCol'
                                                                                    label="Group By"
                                                                                    margin="dense"
                                                                                    value={state.GroupByCol}
                                                                                    className='input-field '
                                                                                    defaultValue={'Sum'}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); setFlag(false) }}
                                                                                >
                                                                                    {GroupByCol.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            {option}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row col-lg-12">
                                                                            <p className="row col-lg-12 inputfield">Text Style</p>
                                                                            <div className="row col-xs-6 col-sm-6 col-md-4 col-lg-6 inputfield">
                                                                                <TextField
                                                                                    //error={formValues.GroupBy.error}
                                                                                    // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                    id="Font"
                                                                                    select
                                                                                    name='pFont'
                                                                                    label="Font"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.pFont}
                                                                                >
                                                                                    {Fonts.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            <span style={{ fontFamily: option }}>{option}</span>
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                <TextField
                                                                                    //error={formValues.GroupBy.error}
                                                                                    // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                    id="Font"
                                                                                    select
                                                                                    name='pSize'
                                                                                    label="Size"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.pSize}
                                                                                >
                                                                                    {(() => {
                                                                                        let Item = [];
                                                                                        for (let i = 10; i <= 30; i++) {
                                                                                            Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                        }
                                                                                        return Item
                                                                                    })()}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                <input type="color" name='pColor'
                                                                                    value={state.pColor}
                                                                                    id="colorPicker" onChange={handleChange}></input>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }

                                                                {(state.Chart !== 'Pie Chart') ?
                                                                    <>
                                                                        <div className="col-lg-12" >
                                                                            <p className="row col-lg-12">X-Axis</p>
                                                                            <div className="row col-lg-12 inputfield" style={{ marginTop: '10px' }}>

                                                                                <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6" >
                                                                                    <TextField
                                                                                        error={formValues.XAxisCopy.error}
                                                                                        helperText={formValues.XAxisCopy.error && formValues.XAxisCopy.errorMessage}
                                                                                        id="XAxis"
                                                                                        select
                                                                                        name='XAxisCopy'
                                                                                        label={
                                                                                            <Fragment>
                                                                                                {state.Chart !== 'Series Chart' &&
                                                                                                    <BootstrapTooltip title="Accepts numbers" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                        <Numbers fontSize="small" />
                                                                                                    </BootstrapTooltip>
                                                                                                }
                                                                                                &nbsp;
                                                                                                {state.Chart !== 'ScatterPlot' && state.Chart !== 'Series Chart' && state.Chart !== 'Bar Line Chart' ?
                                                                                                    <BootstrapTooltip title="Accepts strings" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                        {/* <Text fontSize="large" /> */}
                                                                                                        <span style={{ fontWeight: '700' }}>ABC</span>
                                                                                                    </BootstrapTooltip>
                                                                                                    : ''
                                                                                                }
                                                                                                &nbsp;
                                                                                                {state.Chart === 'Series Chart' && state.Chart !== 'Bar Line Chart' ?
                                                                                                    <BootstrapTooltip title="Accepts dates" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                        <Calendar fontSize="small" />
                                                                                                    </BootstrapTooltip>
                                                                                                    : ''
                                                                                                }
                                                                                                <span style={{ fontWeight: '900' }}>*</span>
                                                                                            </Fragment>
                                                                                        }
                                                                                        className='input-field '
                                                                                        value={state.XAxisCopy}
                                                                                        onChange={(e) => { handleChange(e) }}
                                                                                        onBlur={(e) => { handleValidation(e) }}
                                                                                        defaultValue={'Select'}
                                                                                    >
                                                                                        <MenuItem key={-1} value={'Select'}>
                                                                                            {'Select'}
                                                                                        </MenuItem>
                                                                                        {state.XAxis_.map((option, index) => (
                                                                                            <MenuItem key={option} value={option}>
                                                                                                {option}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                                                    <TextField
                                                                                        //error={formValues.YAxisPadding.error}
                                                                                        //helperText={formValues.YAxisPadding.error && formValues.YAxisPadding.errorMessage}
                                                                                        id="Rotate" className='input-field' name='Rotate' label="Rotate" variant="outlined"
                                                                                        value={state.Rotate}
                                                                                        onChange={(e) => { handleChange(e) }}
                                                                                        onBlur={(e) => { handleValidation(e) }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                                <p className="row col-lg-12 inputfield">Text Style</p>
                                                                                <div className="row col-xs-4 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                    <TextField
                                                                                        //error={formValues.GroupBy.error}
                                                                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                        id="Font"
                                                                                        select
                                                                                        name='xFont'
                                                                                        label="Font"
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                        value={state.xFont}
                                                                                    >
                                                                                        {Fonts.map((option, index) => (
                                                                                            <MenuItem key={option} value={option}>
                                                                                                <span style={{ fontFamily: option }}>{option}</span>
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                    <TextField
                                                                                        //error={formValues.GroupBy.error}
                                                                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                        id="Font"
                                                                                        select
                                                                                        name='xSize'
                                                                                        label="Size"
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                        value={state.xSize}
                                                                                    >
                                                                                        {(() => {
                                                                                            let Item = [];
                                                                                            for (let i = 10; i <= 30; i++) {
                                                                                                Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                            }
                                                                                            return Item
                                                                                        })()}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-4 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                    <input type="color" name='xColor'
                                                                                        value={state.xColor}
                                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                                                <p className="row col-lg-12">Y-Axis</p>
                                                                                <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                                    <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                        <TextField
                                                                                            error={formValues.YAxisCopy.error}
                                                                                            helperText={formValues.YAxisCopy.error && formValues.YAxisCopy.errorMessage}
                                                                                            id="YAxis"
                                                                                            select
                                                                                            name='YAxisCopy'
                                                                                            label={
                                                                                                <Fragment>
                                                                                                    <BootstrapTooltip title="Accepts numbers" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                        <Numbers fontSize="small" />
                                                                                                    </BootstrapTooltip>
                                                                                                    <span style={{ fontWeight: '900' }}>*</span>
                                                                                                </Fragment>

                                                                                            }
                                                                                            value={state.YAxisCopy}
                                                                                            className='input-field '
                                                                                            onChange={(e) => { handleChange(e) }}
                                                                                            defaultValue={'Select'}
                                                                                            onBlur={(e) => { handleValidation(e) }}
                                                                                        >
                                                                                            <MenuItem key={-1} value={'Select'}>
                                                                                                {'Select'}
                                                                                            </MenuItem>
                                                                                            {state.YAxis_.map((option, index) => (
                                                                                                <MenuItem key={option} value={option}>
                                                                                                    {option}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                        </TextField>
                                                                                    </div>
                                                                                    <div className="row col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                        <TextField
                                                                                            id="GroupBy"
                                                                                            select
                                                                                            name='GroupByCol'
                                                                                            label="Group By"
                                                                                            //   margin="dense"
                                                                                            value={state.GroupByCol}
                                                                                            className='input-field '
                                                                                            defaultValue={'Sum'}
                                                                                            onChange={(e) => { handleValidation(e); handleChange(e); setFlag(false) }}
                                                                                        >
                                                                                            {GroupByCol.map((option, index) => (
                                                                                                <MenuItem key={option} value={option}>
                                                                                                    {option}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                        </TextField>
                                                                                    </div>
                                                                                    {state.Chart === 'Bar Chart' &&
                                                                                        <>
                                                                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                                <TextField
                                                                                                    error={formValues.YAxisPadding.error}
                                                                                                    helperText={formValues.YAxisPadding.error && formValues.YAxisPadding.errorMessage}
                                                                                                    id="YAxisPadding" className='input-field' name='YAxisPadding' label="Y-Axis Padding*" variant="outlined"
                                                                                                    value={state.YAxisPadding}
                                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                                            </div>

                                                                                        </>
                                                                                    }

                                                                                </div>
                                                                                <div className="row col-lg-12">
                                                                                    {/* <p className="row col-lg-12">Text Style</p> */}
                                                                                    <div className="row col-xs-4 col-sm-6 col-md-4 col-lg-6 inputfield">
                                                                                        <TextField
                                                                                            //error={formValues.GroupBy.error}
                                                                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                            id="Font"
                                                                                            select
                                                                                            name='yFont'
                                                                                            label="Font"
                                                                                            className='input-field '
                                                                                            onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                            value={state.yFont}
                                                                                        >
                                                                                            {Fonts.map((option, index) => (
                                                                                                <MenuItem key={option} value={option}>
                                                                                                    <span style={{ fontFamily: option }}>{option}</span>
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                        </TextField>
                                                                                    </div>
                                                                                    <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                        <TextField
                                                                                            //error={formValues.GroupBy.error}
                                                                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                            id="Font"
                                                                                            select
                                                                                            name='ySize'
                                                                                            label="Size"
                                                                                            className='input-field '
                                                                                            onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                            value={state.ySize}
                                                                                        >
                                                                                            {(() => {
                                                                                                let Item = [];
                                                                                                for (let i = 10; i <= 30; i++) {
                                                                                                    Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                                }
                                                                                                return Item
                                                                                            })()}
                                                                                        </TextField>
                                                                                    </div>
                                                                                    <div className="row col-xs-4 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                        <input type="color" name='yColor'
                                                                                            value={state.yColor}
                                                                                            id="colorPicker" onChange={handleChange}></input>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {state.Chart === 'Composite Chart' || state.Chart === 'Series Chart' ?
                                                                            <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                                <div className="row col-sm-6 col-md-6 col-lg-6">
                                                                                    <TextField
                                                                                        error={formValues.GroupByCopy.error}
                                                                                        helperText={formValues.GroupByCopy.error && formValues.GroupByCopy.errorMessage}
                                                                                        id="GroupBy"
                                                                                        select
                                                                                        name='GroupByCopy'
                                                                                        label={
                                                                                            <Fragment>
                                                                                                <BootstrapTooltip title="Accepts strings" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                    {/* <Text fontSize="large" /> */}
                                                                                                    <span style={{ fontWeight: '700' }}>ABC</span>
                                                                                                </BootstrapTooltip>

                                                                                                {state.Chart !== 'Composite Chart' ?
                                                                                                    <BootstrapTooltip title="Accepts numbers" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                        <Numbers fontSize="small" />
                                                                                                    </BootstrapTooltip>
                                                                                                    : ''
                                                                                                }
                                                                                                <span style={{ fontWeight: '900' }}>*</span>
                                                                                            </Fragment>
                                                                                        }
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleChange(e) }}
                                                                                        onBlur={(e) => { handleValidation(e) }}
                                                                                        value={state.GroupByCopy}
                                                                                        defaultValue={'Select'}
                                                                                    >
                                                                                        <MenuItem key={-1} value={'Select'}>
                                                                                            {'Select'}
                                                                                        </MenuItem>
                                                                                        {state.GroupByCopy_.map((option, index) => (
                                                                                            <MenuItem key={option} value={option}>
                                                                                                {option}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </TextField>
                                                                                </div>
                                                                            </div>
                                                                            : ''
                                                                        }
                                                                        {state.Chart === 'Bar Line Chart' ?
                                                                            <div className="col-lg-12" style={{ marginTop: '10px' }}>
                                                                                <div className="col-lg-12" >
                                                                                    <p className="row col-lg-12">Right Y-Axis</p>
                                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                                        <div className="row col-sm-6 col-md-6 col-lg-6">
                                                                                            <TextField
                                                                                                error={formValues.GroupByCopy.error}
                                                                                                helperText={formValues.GroupByCopy.error && formValues.GroupByCopy.errorMessage}
                                                                                                id="GroupBy"
                                                                                                select
                                                                                                name='GroupByCopy'
                                                                                                label={
                                                                                                    <Fragment>
                                                                                                        <BootstrapTooltip title="Accepts numbers" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                                            <Numbers fontSize="small" />
                                                                                                        </BootstrapTooltip>
                                                                                                        <span style={{ fontWeight: '900' }}>*</span>
                                                                                                    </Fragment>
                                                                                                }
                                                                                                className='input-field '
                                                                                                onChange={(e) => { handleChange(e) }}
                                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                                                value={state.GroupByCopy}
                                                                                                defaultValue={'Select'}
                                                                                            >
                                                                                                <MenuItem key={-1} value={'Select'}>
                                                                                                    {'Select'}
                                                                                                </MenuItem>
                                                                                                {state.XAxis_.map((option, index) => (
                                                                                                    <MenuItem key={option} value={option}>
                                                                                                        {option}
                                                                                                    </MenuItem>
                                                                                                ))}
                                                                                            </TextField>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                                        {/* <p className="row col-lg-12">Text Style</p> */}
                                                                                        <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                            <TextField
                                                                                                //error={formValues.GroupBy.error}
                                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                                id="Font"
                                                                                                select
                                                                                                name='ryFont'
                                                                                                label="Font"
                                                                                                className='input-field '
                                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                                value={state.ryFont}
                                                                                            >
                                                                                                {Fonts.map((option, index) => (
                                                                                                    <MenuItem key={option} value={option}>
                                                                                                        <span style={{ fontFamily: option }}>{option}</span>
                                                                                                    </MenuItem>
                                                                                                ))}
                                                                                            </TextField>
                                                                                        </div>
                                                                                        <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                            <TextField
                                                                                                //error={formValues.GroupBy.error}
                                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                                id="Font"
                                                                                                select
                                                                                                name='rySize'
                                                                                                label="Size"
                                                                                                className='input-field '
                                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                                value={state.rySize}
                                                                                            >
                                                                                                {(() => {
                                                                                                    let Item = [];
                                                                                                    for (let i = 10; i <= 30; i++) {
                                                                                                        Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                                    }
                                                                                                    return Item
                                                                                                })()}
                                                                                            </TextField>
                                                                                        </div>
                                                                                        <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                            <input type="color" name='ryColor'
                                                                                                value={state.ryColor}
                                                                                                id="colorPicker" onChange={handleChange}></input>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            : ''
                                                                        }
                                                                    </>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                                : ''
                                            }
                                            {(enable.Imported || state.Uploaded_file !== undefined) && (state.Chart !== 'Pie Chart') && (navbar.bar === 'Charts') ?
                                                <Accordion className="acd">
                                                    <AccordionSummary
                                                        className="acdsummary"
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className="acdTitle">Axes Labels</Typography>

                                                    </AccordionSummary>

                                                    <AccordionDetails>
                                                        <Typography>
                                                            <div className="col-lg-12">
                                                                <div className="col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                                    <div className="row col-lg-12" >
                                                                        <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                            Axes
                                                                        </div>
                                                                        <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                            <label className="switch">
                                                                                <input type="checkbox" name="Axesswatch" checked={state.Axesswatch_} onChange={handleShowProps}></input>
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {state.Axesswatch_ &&
                                                                        <>
                                                                            <p className="row col-lg-12" style={{ marginTop: '20px' }}>X-Axis</p>
                                                                            <div className="row col-lg-12 inputfield" style={{ marginTop: '10px' }}>
                                                                                <div className="row col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                                                                    <TextField id="XAxisLabel" className='input-field' name='XAxisLabel' label="X-AxisLabel" variant="outlined"
                                                                                        value={state.XAxisLabel}
                                                                                        onChange={handleChange} />
                                                                                </div>

                                                                            </div>
                                                                            <p className="row col-lg-12 inputfield">Text Style</p>
                                                                            <div className="row col-lg-12" >
                                                                                <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                    <TextField
                                                                                        //error={formValues.GroupBy.error}
                                                                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                        id="Font"
                                                                                        select
                                                                                        name='xlFont'
                                                                                        label="Font"
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                        value={state.xlFont}
                                                                                        defaultValue={'Arial'}
                                                                                    >
                                                                                        {Fonts.map((option, index) => (
                                                                                            <MenuItem key={option} value={option}>
                                                                                                <span style={{ fontFamily: option }}>{option}</span>
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                    <TextField
                                                                                        //error={formValues.GroupBy.error}
                                                                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                        id="Font"
                                                                                        select
                                                                                        name='xlSize'
                                                                                        label="Size"
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                        value={state.xlSize}
                                                                                        defaultValue={'14'}
                                                                                    >
                                                                                        {(() => {
                                                                                            let Item = [];
                                                                                            for (let i = 10; i <= 30; i++) {
                                                                                                Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                            }
                                                                                            return Item
                                                                                        })()}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                    <input type="color" name='xlColor'
                                                                                        value={state.xlColor}
                                                                                        defaultValue={'#000000'}
                                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                                </div>
                                                                            </div>
                                                                            <p className="row col-lg-12">Y-Axis</p>
                                                                            <div className="row col-lg-12 inputfield" style={{ marginTop: '10px' }}>
                                                                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                                                                    <TextField id="YAxisLabel" className='input-field' name='YAxisLabel' label="Y-AxisLabel" variant="outlined"
                                                                                        value={state.YAxisLabel}
                                                                                        onChange={handleChange} />
                                                                                </div>

                                                                            </div>
                                                                            <p className="row col-lg-12 inputfield">Text Style</p>
                                                                            <div className="row col-lg-12" >
                                                                                <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                    <TextField
                                                                                        //error={formValues.GroupBy.error}
                                                                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                        id="Font"
                                                                                        select
                                                                                        name='ylFont'
                                                                                        label="Font"
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                        value={state.ylFont}
                                                                                        defaultValue={'Arial'}
                                                                                    >
                                                                                        {Fonts.map((option, index) => (
                                                                                            <MenuItem key={option} value={option}>
                                                                                                <span style={{ fontFamily: option }}>{option}</span>
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                    <TextField
                                                                                        //error={formValues.GroupBy.error}
                                                                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                        id="Font"
                                                                                        select
                                                                                        name='ylSize'
                                                                                        label="Size"
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                        value={state.ylSize}
                                                                                        defaultValue={'14'}
                                                                                    >
                                                                                        {(() => {
                                                                                            let Item = [];
                                                                                            for (let i = 10; i <= 30; i++) {
                                                                                                Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                            }
                                                                                            return Item
                                                                                        })()}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                    <input type="color" name='ylColor'
                                                                                        value={state.ylColor}
                                                                                        defaultValue={'#000000'}
                                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                                </div>
                                                                            </div>
                                                                            {state.Chart === 'Bar Line Chart' &&
                                                                                <>
                                                                                    <p className="row col-lg-12">Right Y-Axis</p>
                                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                                        <div className="row col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                                                                            <TextField id="YAxisLabel" className='input-field' name='RYAxisLabel' label="Right Y-Axis Label" variant="outlined"
                                                                                                value={state.RYAxisLabel}
                                                                                                onChange={handleChange} />
                                                                                        </div>

                                                                                    </div>
                                                                                    <div className="row col-lg-12" style={{ marginTop: '20px' }}>
                                                                                        <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                            <TextField
                                                                                                //error={formValues.GroupBy.error}
                                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                                id="Font"
                                                                                                select
                                                                                                name='rylFont'
                                                                                                label="Font"
                                                                                                className='input-field '
                                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                                value={state.rylFont}
                                                                                                defaultValue={'Arial'}
                                                                                            >
                                                                                                {Fonts.map((option, index) => (
                                                                                                    <MenuItem key={option} value={option}>
                                                                                                        <span style={{ fontFamily: option }}>{option}</span>
                                                                                                    </MenuItem>
                                                                                                ))}
                                                                                            </TextField>
                                                                                        </div>
                                                                                        <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                            <TextField
                                                                                                //error={formValues.GroupBy.error}
                                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                                id="Font"
                                                                                                select
                                                                                                name='rylSize'
                                                                                                label="Size"
                                                                                                className='input-field '
                                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                                value={state.rylSize}
                                                                                                defaultValue={'14'}
                                                                                            >
                                                                                                {(() => {
                                                                                                    let Item = [];
                                                                                                    for (let i = 10; i <= 30; i++) {
                                                                                                        Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                                    }
                                                                                                    return Item
                                                                                                })()}
                                                                                            </TextField>
                                                                                        </div>
                                                                                        <div className="row col-xs-4 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                            <input type="color" name='rylColor'
                                                                                                value={state.rylColor}
                                                                                                defaultValue={'#000000'}
                                                                                                id="colorPicker" onChange={handleChange}></input>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                                : ''}
                                            <Accordion className="acd">
                                                <AccordionSummary
                                                    className="acdsummary"
                                                    expandIcon={<ExpandMoreIcon />}
                                                    //     expanded={'true'}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Typography className="acdTitle">
                                                        Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </Typography>
                                                </AccordionSummary>

                                                <AccordionDetails className="acdDetails">
                                                    <Typography>
                                                        <div className="row col-lg-12" style={{ marginTop: '0px' }}>

                                                            <div className="row col-lg-12 inputfield" >
                                                                <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                    Title
                                                                </div>
                                                                <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                    <label className="switch">
                                                                        <input type="checkbox" name="Titleswatch" checked={state.Titleswatch_} onChange={handleShowProps}></input>
                                                                        <span className="slider round"></span>
                                                                    </label>
                                                                </div>

                                                            </div>
                                                            {state.Titleswatch_ &&
                                                                <>
                                                                    {/* <p className="row col-lg-12">Title</p> */}
                                                                    <div className="row col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                        <TextField
                                                                            error={formValues.Title.error}
                                                                            helperText={formValues.Title.error && formValues.Title.errorMessage}
                                                                            id="Title" className='input-field' name='Title' label="Title" variant="outlined"
                                                                            value={state.Title}
                                                                            onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                        {/* <SketchPicker /> */}
                                                                    </div>

                                                                    <p className="row col-lg-12 inputfield">Text Style</p>
                                                                    <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                        <TextField
                                                                            //error={formValues.GroupBy.error}
                                                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                            id="Font"
                                                                            select
                                                                            name='TitleFont'
                                                                            label="Font"
                                                                            className='input-field '
                                                                            onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                            value={state.TitleFont}
                                                                            defaultValue={'Arial'}

                                                                        >
                                                                            {Fonts.map((option, index) => (
                                                                                <MenuItem key={option} value={option}>
                                                                                    <span style={{ fontFamily: option }}>{option}</span>
                                                                                </MenuItem>
                                                                            ))}
                                                                        </TextField>
                                                                    </div>
                                                                    <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                        <TextField
                                                                            //error={formValues.GroupBy.error}
                                                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                            id="Font"
                                                                            select
                                                                            name='TitleSize'
                                                                            label="Size"
                                                                            className='input-field '
                                                                            onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                            value={state.TitleSize}
                                                                            defaultValue={'14'}
                                                                        >
                                                                            {(() => {
                                                                                let Item = [];
                                                                                for (let i = 10; i <= 30; i++) {
                                                                                    Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                }
                                                                                return Item
                                                                            })()}
                                                                        </TextField>
                                                                    </div>
                                                                    <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                        <input type="color" name='TitleColor'
                                                                            value={state.TitleColor}
                                                                            defaultValue={'#000000'}
                                                                            id="colorPicker" onChange={handleChange}></input>
                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                            {navbar.bar === 'Charts' && (state.Chart !== 'Bar Chart' && state.Chart !== 'Line Chart' && state.Chart !== 'ScatterPlot') ?
                                                <Accordion className="acd">
                                                    <AccordionSummary
                                                        className="acdsummary"
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className="acdTitle">Legend</Typography>

                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography>

                                                            <div className="col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                                <div className="row col-lg-12">
                                                                    <div className="row col-lg-12" >
                                                                        <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                            Legend
                                                                        </div>
                                                                        <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                            <label className="switch">
                                                                                <input type="checkbox" name="Legendswatch" checked={state.Legendswatch_} onChange={handleShowProps}></input>
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {state.Legendswatch_ &&
                                                                        <>
                                                                            {/* <p className="row col-lg-12 inputfield" style={{ marginTop: '20px' }}>Text Style</p> */}

                                                                            <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield" >
                                                                                <TextField
                                                                                    //error={formValues.GroupBy.error}
                                                                                    // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                    id="Font"
                                                                                    select
                                                                                    name='LegendFont'
                                                                                    label="Font"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.LegendFont}
                                                                                    defaultValue={'Arial'}
                                                                                >
                                                                                    {Fonts.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            <span style={{ fontFamily: option }}>{option}</span>
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                <TextField
                                                                                    //error={formValues.GroupBy.error}
                                                                                    // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                    id="Font"
                                                                                    select
                                                                                    name='LegendSize'
                                                                                    label="Size"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.LegendSize}
                                                                                    defaultValue={'14'}
                                                                                >
                                                                                    {(() => {
                                                                                        let Item = [];
                                                                                        for (let i = 10; i <= 30; i++) {
                                                                                            Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                        }
                                                                                        return Item
                                                                                    })()}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                <input type="color" name='LegendColor'
                                                                                    value={state.LegendColor}
                                                                                    defaultValue={'#000000'}
                                                                                    id="colorPicker" onChange={handleChange}></input>
                                                                            </div>
                                                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                <TextField
                                                                                    // error={formValues.InputType.error}
                                                                                    // helperText={formValues.InputType.error && formValues.InputType.errorMessage}
                                                                                    id="LengendPosition"
                                                                                    select
                                                                                    name='LengendPosition'
                                                                                    label="Position"
                                                                                    className='Horizontal'
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.LengendPosition}
                                                                                    defaultValue={false}
                                                                                >
                                                                                    <MenuItem key={1} value={true} >Horizontal</MenuItem>
                                                                                    <MenuItem key={2} value={false}>Vertical</MenuItem>

                                                                                </TextField>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>

                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                                : ''
                                            }
                                            {navbar.bar === 'Charts' &&
                                                <Accordion className="acd">
                                                    <AccordionSummary
                                                        className="acdsummary"
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className="acdTitle">Tooltip&nbsp;</Typography>

                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography>
                                                            <div className="row col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                                <div className="row col-lg-12" >
                                                                    <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                        Tooltip
                                                                    </div>
                                                                    <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                        <label className="switch">
                                                                            <input type="checkbox" name="Tooltipswatch" checked={state.Tooltipswatch_} onChange={handleShowProps}></input>
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                {state.Tooltipswatch_ &&
                                                                    <>
                                                                        <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield" style={{ marginTop: '20px' }}>
                                                                            <TextField
                                                                                //error={formValues.GroupBy.error}
                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                id="TContent"
                                                                                select
                                                                                name='TooltipContent'
                                                                                label="Content"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                defaultValue={'All'}
                                                                                value={state.TooltipContent}
                                                                                style={{ marginTop: '10px' }}
                                                                            >

                                                                                {TooltipContent.map((option, index) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                ))}
                                                                                {state.Chart === 'Composite Chart' || state.Chart === 'Series Chart' || state.Chart === 'Bar Line Chart' ?
                                                                                    <MenuItem key={'Group'} value={'Group'}>
                                                                                        {'Group'}
                                                                                    </MenuItem>
                                                                                    : ''
                                                                                }
                                                                            </TextField>
                                                                        </div>
                                                                        <p className="row col-lg-12 inputfield">Text Style</p>
                                                                        <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                            <TextField
                                                                                //error={formValues.GroupBy.error}
                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                id="Font"
                                                                                select
                                                                                name='TooltipFont'
                                                                                label="Font"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                value={state.TooltipFont}
                                                                                defaultValue={'Arial'}
                                                                            >
                                                                                {Fonts.map((option, index) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        <span style={{ fontFamily: option }}>{option}</span>
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                            <TextField
                                                                                //error={formValues.GroupBy.error}
                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                id="Font"
                                                                                select
                                                                                name='TooltipSize'
                                                                                label="Size"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                value={state.TooltipSize}
                                                                                defaultValue={'14'}
                                                                            >
                                                                                {(() => {
                                                                                    let Item = [];
                                                                                    for (let i = 10; i <= 30; i++) {
                                                                                        Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                    }
                                                                                    return Item
                                                                                })()}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                            <input type="color" name='TooltipColor'
                                                                                value={state.TooltipColor}
                                                                                defaultValue={'#ffffff'}
                                                                                id="colorPicker" onChange={handleChange}></input>
                                                                        </div>
                                                                        <p className="row col-lg-12">Background</p>
                                                                        <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                            <input type="color" name='TooltipBGColor'
                                                                                value={state.TooltipBGColor}
                                                                                defaultValue={'#6282b3'}
                                                                                id="TooltipBGColor" onChange={handleChange}></input>
                                                                        </div>
                                                                        <p className="row col-lg-12 inputfield">Border Style</p>

                                                                        <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                            <TextField id="Color" className='input-field'
                                                                                value={state.TooltipThickness}
                                                                                name='TooltipThickness' label="Width" variant="outlined"
                                                                                defaultValue={'0'}
                                                                                onChange={handleChange} />
                                                                        </div>
                                                                        <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                            <input type="color" name='TooltipTickColor'
                                                                                value={state.TooltipTickColor}
                                                                                defaultValue={'#000000'}
                                                                                id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                    </>
                                                                }

                                                            </div>


                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            }
                                            {navbar.bar === 'Charts' &&
                                                <Accordion className="acd">
                                                    <AccordionSummary
                                                        className="acdsummary"
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className="acdTitle">Data Labels&nbsp;</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography>
                                                            <div className="col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                                <div className="row col-lg-12">
                                                                    <div className="row col-lg-12" >
                                                                        <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-4" >
                                                                            Data Labels
                                                                        </div>
                                                                        <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                            <label className="switch">
                                                                                <input type="checkbox" name="Labelsswatch" checked={state.Labelsswatch_} onChange={handleShowProps}></input>
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {state.Labelsswatch_ &&
                                                                        <>
                                                                            <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield" style={{ marginTop: '20px' }}>
                                                                                <TextField
                                                                                    id="TContent"
                                                                                    select
                                                                                    name='LabelsContent'
                                                                                    label="Content"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    defaultValue={'X'}
                                                                                    value={state.LabelsContent}
                                                                                    style={{ marginTop: '10px' }}
                                                                                >

                                                                                    {LablesContent.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            {option}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                            <p className="row col-lg-12 inputfield">Text Style</p>
                                                                            <div className="row col-xs-6 col-sm-6 col-md-6 col-lg-6 inputfield">
                                                                                <TextField
                                                                                    id="Font"
                                                                                    select
                                                                                    name='LabelsFont'
                                                                                    label="Font"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.LabelsFont}
                                                                                    defaultValue={'Arial'}
                                                                                >
                                                                                    {Fonts.map((option, index) => (
                                                                                        <MenuItem key={option} value={option}>
                                                                                            <span style={{ fontFamily: option }}>{option}</span>
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-4 inputfield">
                                                                                <TextField
                                                                                    id="Font"
                                                                                    select
                                                                                    name='Labelsize'
                                                                                    label="Size"
                                                                                    className='input-field '
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                    value={state.LabelsSize}
                                                                                    defaultValue={'14'}
                                                                                >
                                                                                    {(() => {
                                                                                        let Item = [];
                                                                                        for (let i = 10; i <= 30; i++) {
                                                                                            Item.push(<MenuItem key={i} value={i}> <span style={{ fontSize: `${i}px` }}>{i}</span> </MenuItem>)
                                                                                        }
                                                                                        return Item
                                                                                    })()}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-2 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                <input type="color" name='LabelsColor'
                                                                                    value={state.LabelsColor}
                                                                                    defaultValue={'#000000'}
                                                                                    id="colorPicker" onChange={handleChange}></input>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            }
                                        </>
                                        : ''
                                    }
                                    {(state.Chart === 'Pie Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Pie&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className="col-lg-12">
                                                        <div className="col-lg-12" >
                                                            {navbar.bar === 'Charts' &&
                                                                <>
                                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                                                        <div className="row col-sm-12 col-md-12 col-lg-6" >
                                                                            <TextField
                                                                                error={formValues.Innerradius.error}
                                                                                helperText={formValues.Innerradius.error && formValues.Innerradius.errorMessage}
                                                                                id="Innerradius" className='input-field' name='Innerradius' label="Innerradius*" variant="outlined"
                                                                                value={state.Innerradius}
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                        </div>
                                                                        <div className="row col-sm-12 col-md-12 col-lg-6"   >
                                                                            <TextField
                                                                                error={formValues.SlicesCap.error}
                                                                                helperText={formValues.SlicesCap.error && formValues.SlicesCap.errorMessage}
                                                                                id="SlicesCap" className='input-field' name='SlicesCap' label="SlicesCap*" variant="outlined"
                                                                                value={state.SlicesCap}
                                                                                onChange={(e) => { handleChange(e) }}
                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                            />
                                                                        </div>
                                                                        <div className="row col-sm-12 col-md-12 col-lg-6" style={{ marginTop: '20px' }} >
                                                                            <TextField
                                                                                error={formValues.ExternalRadiusPadding.error}
                                                                                helperText={formValues.ExternalRadiusPadding.error && formValues.ExternalRadiusPadding.errorMessage}
                                                                                id="ExternalRadiusPadding" className='input-field' name='ExternalRadiusPadding' label="ExternalRadiusPadding*" variant="outlined"
                                                                                value={state.ExternalRadiusPadding}
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                        </div>

                                                                    </div>
                                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '20px' }}>
                                                                        <div className="row col-lg-12" >
                                                                            <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                                Pie
                                                                            </div>
                                                                            <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                                <label className="switch">
                                                                                    <input type="checkbox" name="Pieswatch" checked={state.Pieswatch_} onChange={handleShowProps}></input>
                                                                                    <span className="slider round"></span>
                                                                                </label>
                                                                            </div>

                                                                        </div>
                                                                        {state.Pieswatch_ &&
                                                                            <>
                                                                                <p className="row col-lg-12">Background</p>
                                                                                <div className="row col-xs-12 col-sm-2 col-md-2 col-lg-2 inputfield">
                                                                                    <input type="color" name='BGColor'
                                                                                        value={state.BGColor}
                                                                                        defaultValue={'#ffffff'}
                                                                                        id="colorPicker" onChange={handleChange}>
                                                                                    </input>

                                                                                </div>
                                                                            </>
                                                                        }

                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {(state.Chart === 'Bar Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Bar&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className="col-lg-12" style={{ marginTop: '10px' }}>
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                                <div className="row col-lg-12" >
                                                                    <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                        Bar
                                                                    </div>
                                                                    <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                        <label className="switch">
                                                                            <input type="checkbox" name="Barswatch" checked={state.Barswatch_} onChange={handleShowProps}></input>
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                    </div>

                                                                </div>
                                                                {state.Barswatch_ &&
                                                                    <>
                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Padding</p>

                                                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                    value={state.PadTop}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3"   >
                                                                                <TextField
                                                                                    id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                    value={state.PadBottom}
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                    value={state.PadRight}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                    value={state.PadLeft}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>

                                                                        </div>

                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Bar Color</p>

                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='Color' value={state.Color} defaultValue={'#8495e6'} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                        <p className="row col-lg-12">Background</p>
                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {(state.Chart === 'ScatterPlot' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Scatter&nbsp;</Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6" >
                                                                <TextField
                                                                    error={formValues.SymbolSize.error}
                                                                    helperText={formValues.SymbolSize.error && formValues.SymbolSize.errorMessage}
                                                                    id="SymbolSize" className='input-field' name='SymbolSize' label="SymbolSize*" variant="outlined"
                                                                    value={state.SymbolSize}
                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                            </div>
                                                            <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                    Scatter
                                                                </div>
                                                                <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                    <label className="switch">
                                                                        <input type="checkbox" name="Scatterswatch" checked={state.Scatterswatch_} onChange={handleShowProps}></input>
                                                                        <span className="slider round"></span>
                                                                    </label>
                                                                </div>

                                                            </div>
                                                            {state.Scatterswatch_ &&
                                                                <>
                                                                    <p className="row col-lg-12" style={{ marginTop: '10px' }}>Padding</p>

                                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                                                        <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                            <TextField
                                                                                id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                value={state.PadTop}
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                        </div>
                                                                        <div className="row col-sm-12 col-md-12 col-lg-3"   >
                                                                            <TextField
                                                                                id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                value={state.PadBottom}
                                                                                onChange={(e) => { handleChange(e) }}
                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                            />
                                                                        </div>
                                                                        <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                            <TextField
                                                                                id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                value={state.PadRight}
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                        </div>
                                                                        <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                            <TextField
                                                                                id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                value={state.PadLeft}
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                        </div>

                                                                    </div>
                                                                    <p className="row col-lg-12" style={{ marginTop: '10px' }}>Color</p>

                                                                    <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                        <input type="color" name='Color' defaultValue={'#000000'} value={state.Color} id="colorPicker" onChange={handleChange}></input>

                                                                    </div>
                                                                    <p className="row col-lg-12">Background</p>
                                                                    <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                        <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {(state.Chart === 'Line Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Line&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <div className="col-lg-12">
                                                        <div className=" col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                            {navbar.bar === 'Charts' &&

                                                                <>
                                                                    <div className="row col-lg-12">
                                                                        <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                            Line
                                                                        </div>
                                                                        <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                            <label className="switch">
                                                                                <input type="checkbox" name="Lineswatch" checked={state.Lineswatch_} onChange={handleShowProps}></input>
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>

                                                                    </div>
                                                                    {state.Lineswatch_ &&
                                                                        <>
                                                                            <p className="row col-lg-12" style={{ marginTop: '10px' }}>Padding</p>

                                                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                                                                <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                    <TextField
                                                                                        id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                        value={state.PadTop}
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                                </div>
                                                                                <div className="row col-sm-12 col-md-12 col-lg-3"   >
                                                                                    <TextField
                                                                                        id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                        value={state.PadBottom}
                                                                                        onChange={(e) => { handleChange(e) }}
                                                                                        onBlur={(e) => { handleValidation(e) }}
                                                                                    />
                                                                                </div>
                                                                                <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                    <TextField
                                                                                        id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                        value={state.PadRight}
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                                </div>
                                                                                <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                    <TextField
                                                                                        id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                        value={state.PadLeft}
                                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                                </div>

                                                                            </div>
                                                                            <p className="row col-lg-12" style={{ marginTop: '10px' }}>Color</p>

                                                                            <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                                <input type="color" name='Color' defaultValue={'#6282b3'} value={state.Color} id="colorPicker" onChange={handleChange}></input>

                                                                            </div>
                                                                            <p className="row col-lg-12">Background</p>
                                                                            <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                                <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                            </div>
                                                                        </>
                                                                    }
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {(state.Chart === 'Series Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Series&nbsp;&nbsp;&nbsp;</Typography>

                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" >
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>

                                                                <div className="row col-lg-12">
                                                                    <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                        Series
                                                                    </div>
                                                                    <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                        <label className="switch">
                                                                            <input type="checkbox" name="Seriesswatch" checked={state.Seriesswatch_} onChange={handleShowProps}></input>
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                    </div>

                                                                </div>
                                                                {state.Seriesswatch_ &&
                                                                    <>
                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Padding</p>

                                                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                    value={state.PadTop}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3"   >
                                                                                <TextField
                                                                                    id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                    value={state.PadBottom}
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                    value={state.PadRight}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                    value={state.PadLeft}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>

                                                                        </div>
                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Color</p>

                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='Color' defaultValue={'#6282b3'} value={state.Color} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                        <p className="row col-lg-12">Background</p>
                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {(state.Chart === 'Composite Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Composite&nbsp;&nbsp;</Typography>
                                                {/* <Typography className="acdTitle acdswatch" style={{ paddingLeft: '48%' }}>
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" name="Compositeswatch" checked={state.Compositeswatch_} onChange={handleShowProps}></input>
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </Typography> */}
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>
                                                                <div className="row col-lg-12">
                                                                    <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                        Composite
                                                                    </div>
                                                                    <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                        <label className="switch">
                                                                            <input type="checkbox" name="Compositeswatch" checked={state.Compositeswatch_} onChange={handleShowProps}></input>
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                    </div>

                                                                </div>
                                                                {state.Compositeswatch_ &&
                                                                    <>
                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Padding</p>

                                                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                    value={state.PadTop}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3"   >
                                                                                <TextField
                                                                                    id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                    value={state.PadBottom}
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                    value={state.PadRight}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                    value={state.PadLeft}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>

                                                                        </div>

                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Background</p>
                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {(state.Chart === 'Bar Line Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Bar Line</Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" >
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "0px 0px 15px 0px" }}>

                                                                <div className="row col-lg-12">
                                                                    <div className="row col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                                                        Bar Line
                                                                    </div>
                                                                    <div className="row col-xm-4 col-sm-4 col-md-4 col-lg-4" >
                                                                        <label className="switch">
                                                                            <input type="checkbox" name="BarLineswatch" checked={state.BarLineswatch_} onChange={handleShowProps}></input>
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                    </div>

                                                                </div>
                                                                {state.BarLineswatch &&
                                                                    <>
                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Padding</p>

                                                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                    value={state.PadTop}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3"   >
                                                                                <TextField
                                                                                    id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                    value={state.PadBottom}
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                    value={state.PadRight}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>
                                                                            <div className="row col-sm-12 col-md-12 col-lg-3" >
                                                                                <TextField
                                                                                    id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                    value={state.PadLeft}
                                                                                    onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            </div>

                                                                        </div>
                                                                        <p className="row col-lg-12" style={{ marginTop: '10px' }}>Color</p>

                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='Color' defaultValue={'#6282b3'} value={state.Color} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                        <p className="row col-lg-12">Line Color</p>

                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='LineColor' defaultValue={'#FF0000'} value={state.LineColor} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                        <p className="row col-lg-12">Background</p>
                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    {flag && navbar.bar === 'Charts' ?
                                        <div className="col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <TextField
                                                    id="TempDescription" label="Description" value={state.TempDescription} name="TempDescription" fullWidth multiline maxRows={4}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        : ''
                                    }
                                    {navbar.bar === 'Charts' &&
                                        <div className="row col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                            {navbar.bar === 'Charts' && state.Uploaded_file !== undefined && flag !== true ?

                                                <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                                    <Button disabled={disable} variant="contained" id="ChartGen" className='input-field button' style={{ backgroundColor: '#6282b3' }} onClick={(e) => { setProgress({ 'loader': true }); GenerateChart() }}>
                                                        Generate Chart
                                                    </Button>
                                                </div>
                                                : ''
                                            }
                                            {state.Chart !== 'Select' && state.Chart !== undefined && navbar.bar === 'Charts' && flag === false ?
                                                <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { setOpen({ 'Template': true }) }}>
                                                        Save Template
                                                    </Button>
                                                </div>
                                                : ''
                                            }
                                            {state.Chart !== 'Select' && state.Chart !== undefined && navbar.bar === 'Charts' && flag === true ?
                                                <>
                                                    <div className="row col-sm-4 col-md-12 col-lg-3" style={{ marginTop: '10px' }}>
                                                        <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { saveTemplate('update') }}>
                                                            Update
                                                        </Button>
                                                    </div>
                                                    <div className="row col-sm-4 col-md-12 col-lg-3" style={{ marginTop: '10px' }}>
                                                        <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { saveTemplate('cancel') }}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </>
                                                : ''
                                            }

                                        </div>
                                    }
                                    {/* {(navbar.bar === 'Templates') && (enable.Imported || state.Uploaded_file !== undefined) ? */}
                                    {(navbar.bar === 'Templates') ?
                                        <>
                                            {(() => {
                                                let Item = [];
                                                for (let a in template) {
                                                    if (template[a] !== undefined) {
                                                        Item.push(
                                                            <div className="col-lg-12 container-template" >
                                                                <div className="row col-lg-12 container-title">
                                                                    <div style={{ fontWeight: 'bold' }} className="row col-sm-9 col-md-9 col-lg-9" >
                                                                        {a}
                                                                    </div>

                                                                    <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                                                        <BootstrapTooltip title="Preview" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                            <RemoveRedEyeIcon id={a} className='temp-icon' onClick={(e) => { handleTemplate(a, 'Preview') }} />
                                                                        </BootstrapTooltip>
                                                                    </div>
                                                                    <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                                                        <BootstrapTooltip title="Edit" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                            <EditIcon id={a} className='temp-icon' onClick={(e) => { handleTemplate(a, 'Edit') }} />
                                                                        </BootstrapTooltip>
                                                                    </div>
                                                                    <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                                                        <BootstrapTooltip title="Delete" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                            <DeleteIcon id={a} className='temp-icon' onClick={(e) => { handleTemplate(a, 'templeDelete') }} />
                                                                        </BootstrapTooltip>
                                                                    </div>

                                                                </div>
                                                                <div className="col-lg-12 container-description">
                                                                    <div className="row col-sm-12 col-md-12 col-lg-12" >
                                                                        <div>{template[a].TempDescription}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                }
                                                if (Item.length === 0) {
                                                    Item.push(
                                                        <div className="col-lg-12 container-template" >
                                                            <div className="row col-lg-12 container-title">
                                                                No Template Found !!!
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return Item

                                            })()}
                                        </>
                                        : ''
                                    }
                                </div>
                                : ''
                            }
                        </>
                        : ''
                    }
                    {navbar.bar === 'Demo' &&
                        <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>
                            <div className="col-sm-12 col-md-4 col-lg-4">
                            </div>
                            <div className="row1-container">
                                <div className="box box-down cyan">
                                    <h2>Data(i)</h2>
                                    <p>Join us on a project tour!</p>
                                    <Button id="playVideo" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem', float: 'right', marginTop: '10px' }} onClick={(e) => { setPlay({ 'isPlay': true }); setData({ 'data': undefined }); setIsshow({ ...show, 'isShow': undefined }); setIssues(undefined) }}>
                                        Play
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                    {navbar.bar === 'Dashboard' &&
                        <>
                            <div className="row col-lg-12" style={{ margin: "15px 0px 15px 13px" }}>
                                <div className="row col-lg-12 filterswt">
                                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9 semi-bold" >
                                        Layouts
                                    </div>
                                    <div className="col-xm-3 col-sm-3 col-md-3 col-lg-3" style={{ display: 'contents' }} >
                                        <div style={{ marginRight: '10px' }}>Custom</div>
                                        <label className="switch">
                                            <input type="checkbox" name="StaticLayouts" checked={others.CustomLayouts} onChange={(e) => { setOthers({ ...others, 'CustomLayouts': e.target.checked, 'StaticLayouts': !e.target.checked }) }}></input>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    {others.StaticLayouts &&
                                        // <DashboardLayouts 
                                        <div className="div-layout">
                                            <img alt="Loading..." src={layout1} className={`Dashboardlayout ${others.selectedLayout === "1X0" ? 'active' : ''}`} id="1X0" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout2} className={`Dashboardlayout ${others.selectedLayout === "2X0" ? 'active' : ''}`} id="2X0" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout3} className={`Dashboardlayout ${others.selectedLayout === "1X1" ? 'active' : ''}`} id="1X1" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout4} className={`Dashboardlayout ${others.selectedLayout === "3X0" ? 'active' : ''}`} id="3X0" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout5} className={`Dashboardlayout ${others.selectedLayout === "2X1" ? 'active' : ''}`} id="2X1" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout6} className={`Dashboardlayout ${others.selectedLayout === "1X2" ? 'active' : ''}`} id="1X2" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout7} className={`Dashboardlayout ${others.selectedLayout === "1X1X1" ? 'active' : ''}`} id="1X1X1" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout8} className={`Dashboardlayout ${others.selectedLayout === "2X2" ? 'active' : ''}`} id="2X2" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout9} className={`Dashboardlayout ${others.selectedLayout === "2X3" ? 'active' : ''}`} id="2X3" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout10} className={`Dashboardlayout ${others.selectedLayout === "3X2" ? 'active' : ''}`} id="3X2" onClick={dashboardLayouts}></img>
                                            <img alt="Loading..." src={layout11} className={`Dashboardlayout ${others.selectedLayout === "3X3" ? 'active' : ''}`} id="3X3" onClick={dashboardLayouts}></img>
                                        </div>
                                    }
                                    {others.CustomLayouts &&
                                        <>
                                            <div className="row col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                                <TextField id="NOCharts" className='input-field' name='Rows' label="Rows" variant="outlined" margin="dense"
                                                    error={formValues.Rows.error}
                                                    helperText={formValues.Rows.error && formValues.Rows.errorMessage}
                                                    value={others.Rows}
                                                    onChange={(e) => { handleValidation(e); setOthers({ ...others, 'Rows': e.target.value }) }}
                                                />
                                            </div>
                                            <div className="row col-xs-5 col-sm-5 col-md-5 col-lg-6">
                                                <div style={{ color: 'red' }}>Columns per row should be less than 4</div>
                                            </div>
                                            <>
                                                {others.Rows !== undefined && others.Rows < 5 ?
                                                    <div className="row col-lg-12">
                                                        {(() => {
                                                            let Item = [];
                                                            for (let i = 1; i <= parseInt(others.Rows); i++) {
                                                                Item.push(
                                                                    <div className="row col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                                                        <TextField id="NOCharts" className='input-field' name={"Cols" + i} label={"Row " + i + " Columns"} variant="outlined" margin="dense"
                                                                            value={others['Cols'] !== undefined ? others['Cols']["Cols" + i] : others["Cols" + i]}
                                                                            onChange={(e) => { setOthers({ ...others, 'Cols': { ...others['Cols'], [e.target.name]: e.target.value } }) }}
                                                                            onBlur={(e) => { handleValidation(e) }}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                            return Item
                                                        })()}
                                                    </div>
                                                    : ''
                                                }
                                            </>
                                        </>
                                    }
                                </div>
                                {/* <div className="row col-lg-12 filterswt">
                                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9 semi-bold" >
                                        Custom Layout
                                    </div>
                                    <div className=" col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                        <label className="switch">
                                            <input type="checkbox" name="CustomLayouts" checked={others.CustomLayouts} onChange={(e) => { setOthers({ ...others, 'CustomLayouts': e.target.checked, 'StaticLayouts': !e.target.checked }) }}></input>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    {others.CustomLayouts &&
                                        <>
                                            <div className="row col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                                <TextField id="NOCharts" className='input-field' name='Rows' label="Rows" variant="outlined" margin="dense"
                                                    error={formValues.Rows.error}
                                                    helperText={formValues.Rows.error && formValues.Rows.errorMessage}
                                                    value={others.Rows}
                                                    onChange={(e) => { handleValidation(e); setOthers({ ...others, 'Rows': e.target.value }) }}
                                                />
                                            </div>
                                            <div className="row col-xs-5 col-sm-5 col-md-5 col-lg-6">
                                                <div style={{ color: 'red' }}>Columns per row should be less than 4</div>
                                            </div>
                                            <>
                                                {others.Rows !== undefined && others.Rows < 5 ?
                                                    <div className="row col-lg-12">
                                                        {(() => {
                                                            let Item = [];
                                                            for (let i = 1; i <= parseInt(others.Rows); i++) {
                                                                Item.push(
                                                                    <div className="row col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                                                        <TextField id="NOCharts" className='input-field' name={"Cols" + i} label={"Row " + i + " Columns"} variant="outlined" margin="dense"
                                                                            value={others['Cols'] !== undefined ? others['Cols']["Cols" + i] : others["Cols" + i]}
                                                                            onChange={(e) => { setOthers({ ...others, 'Cols': { ...others['Cols'], [e.target.name]: e.target.value } }) }}
                                                                            onBlur={(e) => { handleValidation(e) }}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                            return Item
                                                        })()}
                                                    </div>
                                                    : ''
                                                }
                                            </>
                                        </>
                                    }
                                </div> */}
                                <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                        onClick={e => {
                                            setIsshow({
                                                ...show, 'isShow': true, dashboard, 'Custom': others, 'CustomLayouts': others.CustomLayouts
                                                , 'StaticLayouts': others.StaticLayouts, 'selectedLayout': others.selectedLayout, 'Build': true
                                            });
                                            setPlay({ 'isPlay': undefined }); setIssues(undefined)
                                        }}>
                                        Apply Layout
                                    </Button>
                                </div>
                                <div className="row col-xs-12 col-sm-12 col-md-4 col-lg-12 inputfield row1-container borderdivstyle" style={{ marginTop: "10px", maxHeight: '50vh', overflowY: 'auto' }}>
                                    <div className="col-lg-12 borderstyle">
                                        <div className="col-lg-8 semi-bold" style={{ display: 'contents' }}>Templates</div>
                                        {/* <div className="col-lg-1" style={{ cursor: 'pointer' }}>
                                            <BootstrapTooltip title="Refresh" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                                                <Reload onClick={e => { setIsshow({ ...show, 'isShow': true, dashboard, 'NOCharts': others.NOCharts }) }} />
                                            </BootstrapTooltip>
                                        </div> */}
                                    </div>
                                    {(() => {
                                        let Item = [];
                                        for (let a in dashboard) {
                                            if (dashboard[a] !== undefined) {
                                                Item.push(
                                                    <div className="col-lg-5 box box-down cyan" style={{ cursor: 'grab', padding: '20px 0px 20px 20px;' }} draggable="true" id={a} onDragStart={(event) => { allowDrop(event) }}>
                                                        <div className="col-lg-12 container-title">
                                                            <div className="row col-lg-12">
                                                                <div className="col-lg-4"><DashboardIcons e={dashboard[a].Chart} /></div>
                                                                <div className="col-lg-8" style={{ paddingLeft: '0px' }}>{dashboard[a].Chart}</div>
                                                                {/* <>
                                                                    {filter[a] !== undefined && filter[a].Mode === true ?
                                                                        <div className="col-lg-2">
                                                                            <BootstrapTooltip title="Filter On" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                <FilterOn style={{ fontSize: '22px', cursor: 'pointer' }} onClick={(e) => { handleFilter(a, 'On') }} />
                                                                            </BootstrapTooltip>
                                                                        </div>
                                                                        : <div className="col-lg-2">
                                                                            <BootstrapTooltip title="Filter Off" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                                <FilterOff style={{ fontSize: '22px', cursor: 'pointer' }} onClick={(e) => { handleFilter(a, 'Off') }} />
                                                                            </BootstrapTooltip>
                                                                        </div>
                                                                    }
                                                                </> */}
                                                            </div>
                                                            <div style={{ fontWeight: 'bold' }} className="col-sm-12 col-md-12 col-lg-12" >
                                                                {a}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        }
                                        if (Item.length === 0) {
                                            Item.push(
                                                <div className="col-lg-12 none-tamplate" onClick={(e) => { setNavbar({ 'bar': 'Data' }) }}>
                                                    Please Create any template
                                                </div>
                                            )
                                        }
                                        return Item

                                    })()}
                                </div>
                                <div className="row col-lg-12 filterswt">
                                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9 semi-bold" >
                                        Filter
                                    </div>
                                    <div className=" col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                        <label className="switch">
                                            <input type="checkbox" name="Filterswatch" checked={filter.filterSwatch}
                                                onChange={(e) => { setFilter({ ...filter, 'filterSwatch': e.target.checked, 'data': dashboard[Object.keys(dashboard)[0]].Uploaded_file }); setfilteringProps({ ...filteringProps, 'Dimensions': dashboard[Object.keys(dashboard)[0]].CheckType }) }}></input>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    {filter.filterSwatch &&
                                        <>
                                            {filteringProps.Dimensions !== undefined ?
                                                <div className="row col-lg-12 borderdivstyle" style={{ margin: "25px 0px 0px 0px" }}>
                                                    <div className="row col-sm-12 col-md-12 col-lg-12" >
                                                        <FormControl sx={{ m: 1, paddingRight: 2, width: 300 }}>
                                                            <InputLabel id="filter">Dimensions</InputLabel>
                                                            <Select
                                                                labelId="demo-multiple-checkbox-label"
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                value={filteringProps.customFilter === undefined ? [] : filteringProps.customFilter}
                                                                name='customFilter'
                                                                onChange={handlecustomFilter}
                                                                input={<OutlinedInput label="Tag" />}
                                                                renderValue={(selected) => selected.join(', ')}
                                                                MenuProps={MenuProps}
                                                            >
                                                                {filteringProps.Dimensions.map((name) => (
                                                                    <MenuItem key={name} value={name}>
                                                                        <Checkbox checked={filteringProps.customFilter === undefined ? false : filteringProps.customFilter.indexOf(name) > -1} />
                                                                        <ListItemText key={name} primary={name} />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    {/* <div className="col-sm-6 col-md-6 col-lg-6">
                                                <Button variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'left' }} onClick={(e) => { }}>
                                                    Filter
                                                </Button>
                                            </div> */}


                                                    {error.mandatoryFields !== undefined ?
                                                        <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ margin: "15px 0px 15px  0px", padding: 0 }}>
                                                            <Alert severity="error">{error.mandatoryFields}</Alert>
                                                        </div>
                                                        : ''
                                                    }
                                                </div>
                                                :
                                                <div className="col-lg-12 " >
                                                    Please upload a file before filtering.
                                                </div>
                                            }

                                        </>
                                    }
                                </div>
                                {others.EditDashboard &&
                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                        <TextField
                                            id="TempDescription" className="Description" label="Description" name="DashboardDescription" fullWidth margin="dense" multiline maxRows={4}
                                            value={projectDetails.DashboardDescription}
                                            onChange={(e) => { setprojectDetails({ ...projectDetails, [e.target.name]: e.target.value }) }}
                                        />
                                    </div>
                                }
                                {/* <div className="row col-sm-4 col-md-12 col-lg-5" style={{ marginTop: '10px' }}>
                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                        onClick={e => {
                                            setIsshow({
                                                ...show, 'isShow': true, dashboard, 'Custom': others, 'CustomLayouts': others.CustomLayouts
                                                , 'StaticLayouts': others.StaticLayouts, 'selectedLayout': others.selectedLayout
                                            });
                                            setPlay({ 'isPlay': undefined }); setIssues(undefined)
                                        }}>
                                        Build Dashboard
                                    </Button>
                                </div> */}
                                {!others.EditDashboard === true ?
                                    <>
                                        <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                            <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                                onClick={(e) => { ExpandCollapse('publish'); handleFilter('Apply Filter'); setIssues(undefined) }}>
                                                Publish Dashboard
                                            </Button>
                                        </div>
                                        <div className="row col-sm-4 col-md-12 col-lg-4" style={{ marginTop: '10px' }}>
                                            <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                                onClick={(e) => { setOpen({ 'Dashboard': true }) }}>
                                                Save
                                            </Button>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="row col-sm-4 col-md-12 col-lg-3" style={{ marginTop: '10px' }}>
                                            <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                                onClick={(e) => { handleDashboard('Update', e) }}>
                                                Update
                                            </Button>
                                        </div>
                                        <div className="row col-sm-4 col-md-12 col-lg-3" style={{ marginTop: '10px' }}>
                                            <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                                onClick={(e) => { setOthers({ ...others, 'EditDashboard': false }) }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                }

                            </div>
                        </>
                    }
                    {(navbar.bar === 'Project') ?
                        <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>
                            <>
                                {(() => {
                                    let Item = [];
                                    for (let a in project) {
                                        if (project[a] !== undefined) {
                                            Item.push(
                                                <div className="col-lg-12 container-template" >
                                                    <div className="row col-lg-12 container-title">
                                                        <div style={{ fontWeight: 'bold' }} className="row col-sm-9 col-md-9 col-lg-9" >
                                                            {a}
                                                        </div>

                                                        <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                                            <BootstrapTooltip title="Preview" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                <RemoveRedEyeIcon id={a} className='temp-icon' onClick={(e) => { handleDashboard('Preview', e) }} />
                                                            </BootstrapTooltip>
                                                        </div>
                                                        <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                                            <BootstrapTooltip title="Edit" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                <EditIcon id={a} className='temp-icon' onClick={(e) => { handleDashboard('Edit', e) }} />
                                                            </BootstrapTooltip>
                                                        </div>
                                                        <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                                            <BootstrapTooltip title="Delete" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                <DeleteIcon id={a} className='temp-icon' onClick={(e) => { handleDashboard('Delete', e) }} />
                                                            </BootstrapTooltip>
                                                        </div>

                                                    </div>
                                                    <div className="col-lg-12 container-description">
                                                        <div className="row col-sm-12 col-md-12 col-lg-12" >
                                                            <div>{project[a].DashboardDescription}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }

                                    if (Item.length === 0) {
                                        Item.push(
                                            <>
                                                <div className="col-lg-12 container-template" >
                                                    <div className="row col-lg-12 container-title">
                                                        No Projects Found !!!
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                    Item.push(
                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'left', marginTop: '10px' }}
                                                onClick={(e) => { setNavbar({ 'bar': 'Dashboard' }); setOthers({ ...others, 'EditDashboard': false }); GetTemplate('Dashboard') }}>
                                                Create new project
                                            </Button>
                                        </div>
                                    )
                                    return Item

                                })()}
                            </>
                        </div>
                        : ''
                    }
                    {(navbar.bar === 'Collections') ?
                        <div className="row col-sm-12 col-md-12 col-lg-12 Collections" style={{ margin: "15px 0px 15px 10px" }}>
                            <>
                                {(() => {
                                    let Item = [];
                                    for (let a in TemplatesCollections) {
                                        if (TemplatesCollections[a] !== undefined) {
                                            Item.push(
                                                <div className="col-lg-5 box box-down cyan" style={{ cursor: 'pointer', padding: '20px 0px 20px 20px;' }} id={a} onClick={(e) => { GetPreDefinedTemplates('Preview', e) }}>
                                                    <div className="col-lg-12 container-title">
                                                        <div className="row col-lg-12">
                                                            <div className="col-lg-4"><DashboardIcons e={TemplatesCollections[a].Chart} /></div>
                                                            <div className="col-lg-8" style={{ paddingLeft: '0px' }}>{TemplatesCollections[a].Chart}</div>
                                                        </div>
                                                    </div>
                                                    <div className="row col-lg-12 PredefinedTempBody">
                                                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }} className="col-sm-12 col-md-12 col-lg-12" >
                                                            {TemplatesCollections[a].TempName}
                                                        </div>
                                                        <div style={{ fontSize: '13px', overflowWrap: 'anywhere' }} className="col-sm-12 col-md-12 col-lg-12" >
                                                            {TemplatesCollections[a].TempDescription}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                    if (Item.length === 0) {
                                        Item.push(
                                            <div className="col-lg-12 none-tamplate" onClick={(e) => { setNavbar({ 'bar': 'Data' }) }}>
                                                Please Create any template
                                            </div>
                                        )
                                    }
                                    return Item

                                })()}
                            </>
                        </div>
                        : ''
                    }
                    {navbar.bar === 'Feedback' &&
                        <>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: '15px 0px 15px 10px' }}>
                                {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <TextField id="Username"
                                        error={formValues.UName.error}
                                        helperText={formValues.UName.error && formValues.UName.errorMessage}
                                        margin="dense" fullWidth className='input-field' name='UName' label="User Name*" variant="outlined"
                                        // value={state.YAxisLabel}
                                        onChange={(e) => { setFeedback({ ...feedback, 'Reported By': e.target.value }) }}
                                        onBlur={(e) => { handleValidation(e) }}
                                    />
                                </div> */}
                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                    <TextField
                                        error={formValues.Category.error}
                                        helperText={formValues.Category.error && formValues.Category.errorMessage}
                                        id="Category"
                                        select
                                        name='Category'
                                        label='Category*'
                                        margin="dense"
                                        className='input-field '
                                        defaultValue={'Select'}
                                        onChange={(e) => { setFeedback({ ...feedback, 'Category': e.target.value }) }}
                                        onBlur={(e) => { handleValidation(e) }}
                                    >
                                        <MenuItem key={-1} value={'Select'}>
                                            {'Select'}
                                        </MenuItem>
                                        {feedback.Categories.map((option, index) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                {feedback.Category === 'UI' || feedback.Category === 'Performance' || feedback.Category === 'Suggestions' ?
                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                        <TextField
                                            // error={formValues.Category.error}
                                            // helperText={formValues.Category.error && formValues.Category.errorMessage}
                                            id="Category"
                                            select
                                            name='Section'
                                            label='Section*'
                                            margin="dense"
                                            className='input-field '
                                            defaultValue={'Select'}
                                            onChange={(e) => { setFeedback({ ...feedback, 'Section': e.target.value }) }}
                                        //onBlur={(e) => { handleValidation(e) }}
                                        >
                                            <MenuItem key={-1} value={'Select'}>
                                                {'Select'}
                                            </MenuItem>
                                            {feedbackSection.map((option, index) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    : ''
                                }
                                {feedback.Category === 'Other' ?
                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <TextField id="NOCharts" className='input-field' name='Other' label="Category" variant="outlined" margin="dense"
                                            // error={formValues.Rows.error}
                                            // helperText={formValues.Rows.error && formValues.Rows.errorMessage}
                                            // value={others.Rows}
                                            onChange={(e) => { setFeedback({ ...feedback, 'Section': e.target.value }) }}
                                        />
                                    </div>
                                    : ''
                                }
                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <TextField
                                        id="TempDescription"
                                        className="Description"
                                        error={formValues.Issue.error}
                                        helperText={formValues.Issue.error && formValues.Issue.errorMessage}
                                        value={feedback.Issue}
                                        label="Issue*" name="Issue" fullWidth margin="dense" multiline maxRows={4}
                                        onChange={(e) => { setFeedback({ ...feedback, [e.target.name]: e.target.value }) }}
                                        onBlur={(e) => { handleValidation(e) }}
                                    />
                                </div>
                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ display: 'flex' }}>
                                    <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'left', marginTop: '10px' }} onClick={(e) => { handleFeedback() }}>
                                        Report
                                    </Button>
                                </div>
                            </div>
                        </>
                    }
                    {/* {!navopen && <div className="nav-inputarea">InputArea</div>} */}
                </>
                {/* Template */}
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open.Template}
                    onClose={(e) => { setOpen({ ...open, 'Template': false }) }}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open.Template}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h6" component="h2">
                                Template
                            </Typography>
                            {open.deleteTemplate ?
                                <>
                                    <Typography id="transition-modal-description" sx={{ mt: 2 }} style={{ marginTop: '10px' }}>
                                        {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"> */}
                                        <Alert severity="warning">Are you sure want to delete <strong>"{open.tempName}"</strong> Template?
                                            This will impact <strong>"{open.dashboardName}"</strong> Dashboard.</Alert>
                                        {/* </div> */}
                                    </Typography>
                                    <Typography id="transition-modal-description" sx={{ mt: 5 }} style={{ marginTop: '10px' }}>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                            <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { setOpen({ ...open, 'Template': false }) }}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right', marginRight: '10px' }} onClick={(e) => { handleTemplate(open.tempName, 'Delete') }}>
                                                Proceed
                                            </Button>
                                        </div>
                                    </Typography>
                                </>
                                :
                                <>
                                    <Typography id="transition-modal-description" sx={{ mt: 2 }} style={{ marginTop: '10px' }}>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <TextField id="Template"
                                                    error={formValues.TempName.error}
                                                    helperText={formValues.TempName.error && formValues.TempName.errorMessage}
                                                    margin="dense" fullWidth className='input-field' name='TempName' label="Template Name" variant="outlined"
                                                    // value={state.YAxisLabel}
                                                    onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                />
                                            </div>
                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <TextField
                                                    id="TempDescription" className="Description" label="Description" name="TempDescription" fullWidth margin="dense" multiline maxRows={4}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </Typography>
                                    <Typography id="transition-modal-description" sx={{ mt: 5 }} style={{ marginTop: '10px' }}>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                            <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { setOpen({ ...open, 'Template': false }) }}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right', marginRight: '10px' }} onClick={(e) => { saveTemplate('save') }}>
                                                Save
                                            </Button>
                                        </div>
                                    </Typography>
                                </>
                            }
                        </Box>
                    </Fade>
                </Modal>
                {/* Dashboard */}
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open.Dashboard}
                    onClose={(e) => { setOpen({ 'Dashboard': false }) }}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open.Dashboard}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h6" component="h2">
                                Dashboard
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }} style={{ marginTop: '10px' }}>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <TextField id="Dashboard"
                                            // error={formValues.TempName.error}
                                            //helperText={formValues.TempName.error && formValues.TempName.errorMessage}
                                            margin="dense" fullWidth className='input-field' name='DashboardName' label="Dashboard Name" variant="outlined"
                                            // value={state.YAxisLabel}
                                            onChange={(e) => { setprojectDetails({ ...projectDetails, [e.target.name]: e.target.value }) }}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <TextField
                                            id="TempDescription" className="Description" label="Description" name="DashboardDescription" fullWidth margin="dense" multiline maxRows={4}
                                            onChange={(e) => { setprojectDetails({ ...projectDetails, [e.target.name]: e.target.value }) }}
                                        />
                                    </div>
                                </div>
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 5 }} style={{ marginTop: '10px' }}>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                    <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { setOpen({ 'Dashboard': false }) }}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right', marginRight: '10px' }} onClick={(e) => { handleDashboard('Save') }}>
                                        Save
                                    </Button>
                                </div>
                            </Typography>
                        </Box>
                    </Fade>
                </Modal>

                {error.mandatoryFields !== undefined && (navbar.bar === 'Charts' || navbar.bar === 'Dashboard' || navbar.bar === 'Templates' || navbar.bar === 'Feedback') ?
                    <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ margin: "15px 0px 15px  0px", padding: 0 }}>
                        <Alert severity="error">{error.mandatoryFields}</Alert>
                    </div>
                    : ''
                }
            </div>

        </>
    )
}
export default React.memo(InputArea)