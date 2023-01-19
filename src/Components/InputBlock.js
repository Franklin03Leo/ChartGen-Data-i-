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
import { alpha } from '@mui/material/styles';
import { Fade, InputAdornment } from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Modal } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';

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
import FilterOn from '@mui/icons-material/FilterAltOutlined';
import FilterOff from '@mui/icons-material/FilterAltOffOutlined';
import Barchart from '@mui/icons-material/BarChart';
import Piechart from '@mui/icons-material/PieChart';
import Linechart from '@mui/icons-material/ShowChart';
import Compositechart from '@mui/icons-material/Leaderboard';
import Scatterplot from '@mui/icons-material/ScatterPlot';
import Barlinechart from '@mui/icons-material/StackedLineChart';
import Serieschart from '@mui/icons-material/MultilineChart';
import FeedbackIcon from '@mui/icons-material/Feedback';


const InputArea = ({ ChildtoParentHandshake, ExpandData, dataTable, demoVideo, showDashboard, feedback_ }) => {

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
        UName: {
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
    const [disable, isDisable] = React.useState(true);
    const [error, setError] = React.useState({});
    const [state, setState] = React.useState({
        'InputType': 'Enter Inputs', 'Heigth_': 300, 'Width_': 600, 'YAxisPadding': '10',
        'SlicesCap': 10, 'Innerradius': 10, 'ExternalRadiusPadding': 60, 'SymbolSize': 7, 'TooltipContent': 'All', 'TooltipTickColor': '#000000', 'GroupByCol': 'Sum',
        'LabelsContent': 'X'
    });
    const [enable, setEnable] = React.useState({})
    const [colors, setColors] = React.useState([]);
    const [navbar, setNavbar] = React.useState({ 'bar': 'Data' });
    const [template, setTemplate] = React.useState({});
    const [dashboard, setDashboard] = React.useState({});
    const [enabletemplate, setEnableTemplate] = React.useState(false);
    const [flag, setFlag] = React.useState(false);
    const [navopen, setNavOpen] = React.useState(true);
    const [navwidth, setNavWidth] = React.useState({ 'navArea': '90px', 'inuptArea': '30%', 'ChartArea': '63%' });
    const [isMobile, setIsMobile] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [progress, setProgress] = React.useState({ 'loader': false });
    const [filter, setFilter] = React.useState({});
    const [filteringProps, setfilteringProps] = React.useState({ 'customFilter': [] });
    const [others, setOthers] = React.useState({});
    const [feedback, setFeedback] = React.useState({});
    const [feedbackIssue, setIssues] = React.useState(undefined);
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
        transform: 'translate(-50%, -50%)',
        width: 400,
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
        const handleResize = () => {

            if (window.innerWidth < 1010) {
                setNavOpen(false)
                setNavWidth({ 'navArea': '90px', 'inuptArea': '0%', 'ChartArea': '94%' })

                setIsMobile(true)
            }
            else {
                setNavOpen(true)
                setNavWidth({ 'navArea': '90px', 'inuptArea': '30%', 'ChartArea': '63%' })
                setIsMobile(false)

            }

        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, [])

    //Functions
    // For the modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //Every fields onChange for store the inputs
    const handleChange = (event) => {
        if (event.target.name === 'file') {
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
                            //setChangeType({ ...changeType, 'Dimensions': newArray })
                            setError({ 'invalidFile': undefined })
                            ChildtoParentHandshake(state, enable, navbar, { 'newArray': newArray, 'Uploaded_file': results.data })
                            setfilteringProps({ ...filteringProps, 'Dimensions': newArray })
                            setData({ 'data': results.data })
                            setIssues(undefined)

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
                            //setChangeType({ ...changeType, 'Dimensions': newArray })
                            setError({ 'invalidFile': undefined })
                            setData({ 'data': data })
                            setIssues(undefined)
                            ChildtoParentHandshake(state, enable, navbar, { 'newArray': newArray, 'Uploaded_file': data })

                        } catch (error) {
                            setError({ 'invalidFile': 'There is s problem with the file, Please check and Try again !!!' })

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
                        //setChangeType({ ...changeType, 'Dimensions': newArray })
                        setError({ 'invalidFile': undefined })
                        setData({ 'data': json })
                        setIssues(undefined)
                        ChildtoParentHandshake(state, enable, navbar, { 'newArray': newArray, 'Uploaded_file': json })
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
            // setData({'data':undefined})
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
            'XAxisCopy', 'YAxisPadding', 'SymbolSize', 'GroupByCopy', 'UName', 'Issue']
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
        console.log('Chart Props', state)
        console.log('Template value', template)
        console.log('Dashboard value', dashboard)
        //setTimeout(() => {

        setProgress({ 'loader': false })
        // }, 2000);


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
                setState(data)
                setNavbar({ 'bar': 'Data' })
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
        var bar = '';
        if (data === 'DatasetIcon') bar = 'Data'
        else if (data === 'SignalCellularAltIcon') bar = 'Charts'
        else if (data === 'Grid3x3Icon') bar = 'Dimensions'
        else if (data === 'LineAxisIcon') bar = 'Axes'
        else if (data === 'ArticleIcon') bar = 'Templates'
        else if (data === 'YouTubeIcon') bar = 'Demo'
        else if (data === 'DashboardIcon') bar = 'Dashboard'
        else if (data === 'FeedbackIcon') bar = 'Feedback'
        setNavbar({ 'bar': bar })
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
        // console.log('templates', template);
        // if(!flag)

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
            setTemplate({ ...template, [state.TempName]: state })
            setDashboard({ ...dashboard, [state.TempName]: { ...state, 'Width_': null, 'Heigth_': 250 } })
            if (flag) {

                postMethod('Update')
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
                setOpen(false)
                setNavbar({ 'bar': 'Templates' })
                postMethod('Insert')
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
    const handleTemplate = (e) => {
        if (e.currentTarget.dataset.testid === 'EditIcon') {
            setState(template[e.currentTarget.id])
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
            setNavbar({ 'bar': 'Charts' })
            setFlag(true)

        }
        else if (e.currentTarget.dataset.testid === 'DeleteIcon') {
            setTemplate({ ...template, [e.currentTarget.id]: undefined })
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })

            axios.delete(`http://localhost:8000/DeleteTemplate/${[e.currentTarget.id]}`).then((response) => {
                console.log('data', response);
            });

            toast.success('Your Chart has been Deleted', {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
                autoClose: 2000
            });
            setFlag(flag)
        }
        else if (e.currentTarget.dataset.testid === 'RemoveRedEyeIcon') {
            GetTemplate()
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false, 'Barlinechart': false })
            setEnableTemplate(!enabletemplate)
            setState(template[e.currentTarget.id])
            setFlag(false)
        }
    }

    //Template draggin for dashboard
    const allowDrop = (event) => {
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
    const handleFilter = (template, action) => {
        var customFilter = filteringProps.customFilter
        var props_ = {}
        var props = []
        for (let i = 0; i < customFilter.length; i++) {
            const Dimensions = customFilter[i].split(' ').slice(1, 3).join(' ')
            const unique = state.Uploaded_file.map((item) => item[Dimensions])
                .filter((value, index, self) => self.indexOf(value) === index);
            props_[Dimensions] = unique;
            props_.Dimensions = Dimensions;
            props.push(props_)
            props_ = {}
        }
        console.log('testing filter props', props);

        // if (action !== "Apply Filter") {
        //     if (action === "Off") {
        //         if (dashboard[template].XAxisCopy === undefined) {
        //             setError({ 'mandatoryFields': 'X-Axis is mandatory, Please update the template.' })
        //             return
        //         }
        //         const Dimensions = dashboard[template].XAxisCopy.split(' ').slice(1, 3).join(' ')
        //         const unique = dashboard[template].Uploaded_file.map((item) => item[Dimensions])
        //             .filter((value, index, self) => self.indexOf(value) === index);

        //         setFilter({ ...filter, [template]: { ...filter[template], 'Mode': true, 'Axis': unique, 'Dimensions': Dimensions } })
        //         setError({ 'mandatoryFields': undefined })
        //     }
        //     else
        //         setFilter({ ...filter, [template]: { ...filter[template], 'Mode': false } })
        // }
        // else {
        setIsshow({ ...show, 'isShow': true, dashboard, 'NOCharts': others.NOCharts, 'Filter': filter, 'FilteringProps': props, 'isBublished': true })
        // }
    }
    const handlecustomFilter = (event) => {
        const {
            target: { value },
        } = event;
        setfilteringProps({ ...filteringProps, [event.target.name]: typeof value === 'string' ? value.split(',') : value, });
    }
    const ExpandCollapse = () => {
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
            setNavWidth({ 'navArea': '90px', 'inuptArea': '30%', 'ChartArea': '63%' })
        }
        setNavOpen(!navopen)
        setIsshow({ ...show, isBublished: !show.isBublished })
        //ExpandData(navwidth)

    }
    const dashboardLayouts = (event) => {
        setOthers({ ...others, 'selectedLayout': event.currentTarget.id })
    }

    const postMethod = (action) => {
        try {
            var copystate = {}
            var Common = ['Uploaded_file', 'TempDescription', 'TempName', 'Chart', 'Heigth_', 'Width_', 'XAxis', 'YAxis', 'XAxis_', 'YAxis_', 'YAxisCopy', 'XAxisCopy', 'GroupByCol', 'GroupByCopy_', 'Title', 'Innerradius', 'YAxisPadding', 'SlicesCap', 'XAxisLabel', 'YAxisLabel',
                'SymbolSize', 'GroupBy', 'GroupByValues', 'ExternalRadiusPadding', 'BGColor', 'LegendColor', 'LegendFont', 'LegendSize', 'LengendPosition', 'TitleColor', 'TitleFont', 'TitleSize', 'TooltipBGColor', 'TooltipColor',
                'TooltipFont', 'TooltipSize', 'TooltipThickness', 'TooltipTickColor', 'xFont', 'xSize', 'xColor', 'xlColor', 'xlFont', 'xlSize', 'yFont', 'yColor', 'ySize',
                'ylColor', 'ylFont', 'ylSize', 'Axesswatch', 'Axesswatch_', 'Titleswatch', 'Titleswatch_', 'Tooltipswatch', 'Tooltipswatch_', 'Legendswatch', 'Legendswatch_', 'InputType']

            for (let i = 0; i < Common.length; i++) {
                if (state[Common[i]] !== undefined) {
                    //if (typeof (state[Common[i]]) === 'object') {
                    copystate[Common[i]] = JSON.parse(JSON.stringify(state[Common[i]]).replaceAll("#", 'Hash'))
                    //}
                    //else{
                    // copystate[Common[i]] = state[Common[i]].replaceAll("#", 'Hash')

                    // }
                }
            }
            let doc_ = [];
            var docs = state
            // // doc_.push(docs)
            //   doc_.push(JSON.parse(JSON.stringify(docs).replaceAll("#",'Hash')))
            // for (const key in docs) {
            //     if (docs.hasOwnProperty(key)) {
            //         //if(typeof docs[key] === 'object'){
            //         docs[key] = docs[key].replace("#", 'Hash')
            //         //}
            //     }
            // }
            //JSON.stringify(docs, null, 2)
            console.log('file', docs);
            // docs =  JSON.stringify(docs).replaceAll("\\",'').replaceAll("#",'Hash')
            //doc_ = JSON.stringify(doc_); JSON.stringify(copystate, null, 2)
            if (action === 'Update') {
                axios.delete(`http://localhost:8000/DeleteTemplate/${state.TempName}`).then((response) => {
                    console.log('data', response);
                });
                let data = JSON.stringify(state)
                data = data.replaceAll('Hash', '#')
                data = JSON.parse(data)
                let obj = {}
                //for (let i = 0; i < data.length; i++) {
                obj[data.TempName] = data
                //}

                setState({ ...state, [state.TempName]: obj })
            }
            axios.post(`http://localhost:8000/InsertTemplate/${JSON.stringify(copystate)}`).then((response) => {
                console.log('data', response.data);
            });



            // axios.post(`http://localhost:8000/UpdateTemplate/${state.TempName}-${JSON.stringify(copystate)}`).then((response) => {
            //     console.log('data', response);
            // });
        }
        catch (error) {
            console.log('error', error.message)
        }
    }
    const GetTemplate = async (Tab) => {
        await axios.get(`http://localhost:8000/GetTemplate/`).then((response) => {
            // debugger
            let data = JSON.stringify(response.data)
            data = data.replaceAll('Hash', '#')
            data = JSON.parse(data)
            if (Tab === 'Dashboard') {
                let obj = {}
                for (let i = 0; i < data.length; i++) {
                    data[i].Width_ = null
                    data[i].Heigth_ = 250
                    obj[data[i].TempName] = data[i]
                }
                setDashboard(obj)
                //console.log('Template from DB', obj);
            }
            else {
                let obj = {}
                for (let i = 0; i < data.length; i++) {
                    obj[data[i].TempName] = data[i]
                }
                setTemplate(obj)
            }

            // console.log('Template from DB', obj);
        });
    }
    const handleFeedback = (action) => {
        if (action !== 'Get alone') {
            if ((feedback['Reported By'] === undefined || feedback['Reported By'] === '') || (feedback.Issue === undefined || feedback.Issue === '')) {
                setError({ 'mandatoryFields': 'Please fill the mandatory Fields' })
                return
            }
            axios.post(`http://localhost:8000/InsertFeedback/${JSON.stringify(feedback)}`).then((response) => {
                console.log('data', response.data);
                axios.get(`http://localhost:8000/GetFeedback/`).then((response) => {
                    // debugger
                    let data = response.data
                    setPlay({ "isPlay": undefined })
                    setIsshow({ "isShow": undefined })
                    setData({ 'data': undefined })
                    setIssues(data)
                });
            });
        }
        else {
            axios.get(`http://localhost:8000/GetFeedback/`).then((response) => {
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

    //Components
    const NavIcons = () => {
        return (
            <>
                <div>
                    {!navopen &&
                        <BootstrapTooltip title="Expand Input Area" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <ArrowRightIcon onClick={(e) => { ExpandCollapse() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                        </BootstrapTooltip>
                    }
                </div>
                <div>
                    <div className="Icon">
                        <div>
                            <BootstrapTooltip title="Data" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                                <DatasetIcon className="Icon_" fontSize="large" color={navbar.bar === 'Data' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                            </BootstrapTooltip>
                        </div>

                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Chart" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <SignalCellularAltIcon className="Icon_" fontSize="large" color={navbar.bar === 'Charts' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                        </BootstrapTooltip>
                    </div>
                    {/* <div className="Icon">
                    <BootstrapTooltip title="Dimensions" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <Grid3x3Icon className="Icon_" fontSize="large" color={navbar.bar === 'Dimensions' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div>
                <div className="Icon">
                    <BootstrapTooltip title="Axes" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <LineAxisIcon className="Icon_" fontSize="large" color={navbar.bar === 'Axes' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div> */}
                    <div className="Icon">
                        <BootstrapTooltip title="Templates" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <ArticleIcon className="Icon_" fontSize="large" color={navbar.bar === 'Templates' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); GetTemplate() }} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Demo" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <Demo className="Icon_" fontSize="large" color={navbar.bar === 'Demo' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Dashboard" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <Dashboard className="Icon_" fontSize="large" color={navbar.bar === 'Dashboard' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e);; GetTemplate('Dashboard') }} />
                        </BootstrapTooltip>
                    </div>
                    <div className="Icon">
                        <BootstrapTooltip title="Feedback" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <FeedbackIcon className="Icon_" fontSize="large" color={navbar.bar === 'Feedback' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); handleFeedback('Get alone') }} />
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
                <span style={{ float: "left", fontWeight: "bold", margin: '15px' }}>{param}</span>
            </div>
        );
    };

    return (
        <>
            <div className="nav-bar col-xs-1  col-sm-1 col-md-1 col-lg-1" style={{ width: navwidth.navArea, borderRight: navopen ? '1px solid rgb(0 0 0 / 13%)' : '', backgroundColor: '#f7f5f526' }}>
                {/* {navopen && */}
                <NavIcons />
                {/* } */}
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 divchart" style={{ height: 'calc(100vh - 81px)', width: navwidth.inuptArea, overflowY: `${!navopen ? 'hidden' : 'auto'}`, padding: `${navopen ? '' : '0px'}` }}>
                <div className="nav-close">
                    {navopen ?
                        <BootstrapTooltip title="Collapse Input Area" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                            <ArrowLeftIcon onClick={(e) => { ExpandCollapse() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                        </BootstrapTooltip>
                        : ''
                        // <BootstrapTooltip title="Expand Input Area" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        //     <ArrowRightIcon onClick={(e) => { ExpandCollapse() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                        // </BootstrapTooltip>
                    }
                </div>
                <>
                    <Chartheader param={navbar.bar} />
                    {navbar.bar === 'Data' && <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 13px" }}>

                        <div className="row col-sm-6 col-md-6 col-lg-5">
                            <TextField
                                error={formValues.InputType.error}
                                helperText={formValues.InputType.error && formValues.InputType.errorMessage}
                                id="InputType"
                                select
                                name='InputType'
                                label="Input Type"
                                defaultValue={'Import Inputs'}
                                className='input-field '
                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                value={state.InputType}
                            >
                                <MenuItem key={1} value={'Import Inputs'} >Import Inputs</MenuItem>
                                <MenuItem key={2} value={'Enter Inputs'}>Enter Inputs</MenuItem>

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
                    {state.Uploaded_file !== undefined && navbar.bar === 'Data' ?
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
                    {state.Uploaded_file === undefined && navbar.bar === 'Data' ?
                        <div style={{ color: 'red' }}>Use the file with the less than 300 records for better experience, We are working on for boosting up.</div>
                        : ''
                    }
                    {(state.Uploaded_file !== undefined && error.invalidInputs === undefined) || template !== undefined ?
                        <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>
                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                {(enable.Imported || state.Uploaded_file !== undefined) && navbar.bar === 'Charts' ?
                                    <>
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

                                    </>
                                    : ''
                                }

                                {(enable.Imported || state.Uploaded_file !== undefined) && (navbar.bar === 'Charts') ?
                                    <>
                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                    </>
                                    : ''
                                }

                            </div>
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
                                                    <div className="row col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>
                                                        {(state.Chart === 'Pie Chart') &&
                                                            <div className="col-lg-12">

                                                                <div className="row col-lg-12" >
                                                                    <div className="row col-lg-12">
                                                                        <p className="row col-lg-12">X-Axis</p>
                                                                        <div className="row col-sm-6 col-md-5 col-lg-6">
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
                                                                        <p className="row col-lg-12">Text Style</p>
                                                                        <div className="row col-xs-4 col-sm-6 col-md-4 col-lg-5 inputfield">
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
                                                                                        {option}
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
                                                                                    for (let i = 6; i <= 30; i++) {
                                                                                        Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                    }
                                                                                    return Item
                                                                                })()}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='pColor'
                                                                                value={state.pColor}
                                                                                id="colorPicker" onChange={handleChange}></input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                        {(state.Chart !== 'Pie Chart') ?
                                                            <>

                                                                <div className="col-lg-12" >
                                                                    <p className="row col-lg-12">X-Axis</p>
                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>

                                                                        <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-5" >
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
                                                                        <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-5">
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
                                                                        <p className="row col-lg-12">Text Style</p>
                                                                        <div className="row col-xs-4 col-sm-6 col-md-4 col-lg-5 inputfield">
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
                                                                                        {option}
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
                                                                                    for (let i = 6; i <= 30; i++) {
                                                                                        Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                    }
                                                                                    return Item
                                                                                })()}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='xColor'
                                                                                value={state.xColor}
                                                                                id="colorPicker" onChange={handleChange}></input>
                                                                        </div>
                                                                    </div>
                                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                                        <p className="row col-lg-12">Y-Axis</p>
                                                                        <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-5">
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
                                                                            <div className="row col-sm-6 col-md-6 col-lg-5 inputfield">
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
                                                                                    <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-5">
                                                                                        <TextField
                                                                                            error={formValues.YAxisPadding.error}
                                                                                            helperText={formValues.YAxisPadding.error && formValues.YAxisPadding.errorMessage}
                                                                                            id="YAxisPadding" className='input-field' name='YAxisPadding' label="Y-AxisPadding*" variant="outlined"
                                                                                            value={state.YAxisPadding}
                                                                                            onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                                    </div>

                                                                                </>
                                                                            }

                                                                        </div>
                                                                        <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                            <p className="row col-lg-12">Text Style</p>
                                                                            <div className="row col-xs-4 col-sm-6 col-md-4 col-lg-5 inputfield">
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
                                                                                            {option}
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
                                                                                        for (let i = 6; i <= 30; i++) {
                                                                                            Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                        }
                                                                                        return Item
                                                                                    })()}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                                <input type="color" name='yColor'
                                                                                    value={state.yColor}
                                                                                    id="colorPicker" onChange={handleChange}></input>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {state.Chart === 'Composite Chart' || state.Chart === 'Series Chart' ?
                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>

                                                                        <div className="row col-sm-6 col-md-6 col-lg-5">
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
                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                        <p className="row col-lg-12">Right Y-Axis</p>

                                                                        <div className="row col-sm-6 col-md-6 col-lg-5" style={{ marginTop: '10px' }}>
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
                                                                        <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                            <p className="row col-lg-12">Text Style</p>
                                                                            <div className="row col-xs-4 col-sm-6 col-md-4 col-lg-5 inputfield">
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
                                                                                            {option}
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
                                                                                        for (let i = 6; i <= 30; i++) {
                                                                                            Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                        }
                                                                                        return Item
                                                                                    })()}
                                                                                </TextField>
                                                                            </div>
                                                                            <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                                <input type="color" name='ryColor'
                                                                                    value={state.ryColor}
                                                                                    id="colorPicker" onChange={handleChange}></input>
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
                                                    <div className=" col-lg-12">
                                                        <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
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
                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-5">
                                                                            <TextField id="XAxisLabel" className='input-field' name='XAxisLabel' label="X-AxisLabel" variant="outlined"
                                                                                value={state.XAxisLabel}
                                                                                onChange={handleChange} />
                                                                        </div>

                                                                    </div>
                                                                    <div className="row col-lg-12" style={{ marginTop: '20px' }}>
                                                                        <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                        {option}
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
                                                                                    for (let i = 6; i <= 30; i++) {
                                                                                        Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                    }
                                                                                    return Item
                                                                                })()}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                            <input type="color" name='xlColor'
                                                                                value={state.xlColor}
                                                                                defaultValue={'#000000'}
                                                                                id="colorPicker" onChange={handleChange}></input>
                                                                        </div>
                                                                    </div>
                                                                    <p className="row col-lg-12">Y-Axis</p>
                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                        <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-5">
                                                                            <TextField id="YAxisLabel" className='input-field' name='YAxisLabel' label="Y-AxisLabel" variant="outlined"
                                                                                value={state.YAxisLabel}
                                                                                onChange={handleChange} />
                                                                        </div>

                                                                    </div>
                                                                    <div className="row col-lg-12" style={{ marginTop: '20px' }}>
                                                                        <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                        {option}
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
                                                                                    for (let i = 6; i <= 30; i++) {
                                                                                        Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                    }
                                                                                    return Item
                                                                                })()}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
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
                                                                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-5">
                                                                                    <TextField id="YAxisLabel" className='input-field' name='RYAxisLabel' label="Right Y-AxisLabel" variant="outlined"
                                                                                        value={state.RYAxisLabel}
                                                                                        onChange={handleChange} />
                                                                                </div>

                                                                            </div>
                                                                            <div className="row col-lg-12" style={{ marginTop: '20px' }}>
                                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                                {option}
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
                                                                                            for (let i = 6; i <= 30; i++) {
                                                                                                Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                                            }
                                                                                            return Item
                                                                                        })()}
                                                                                    </TextField>
                                                                                </div>
                                                                                <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
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
                                            {/* <Typography className="acdswatch">
                                                <div>
                                                    <label className="switch">
                                                        <input type="checkbox" name="Titleswatch" checked={state.Titleswatch_} onChange={handleShowProps}></input>
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            </Typography> */}
                                        </AccordionSummary>

                                        <AccordionDetails className="acdDetails">
                                            <Typography>
                                                <div className=" col-lg-12" style={{ marginTop: '0px' }}>
                                                    <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>

                                                        <div className="row col-lg-12" >
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
                                                                <div className="row col-sm-6 col-md-6 col-lg-5 inputfield" style={{ marginTop: '20px' }}>
                                                                    <TextField
                                                                        error={formValues.Title.error}
                                                                        helperText={formValues.Title.error && formValues.Title.errorMessage}
                                                                        id="Title" className='input-field' name='Title' label="Title" variant="outlined"
                                                                        value={state.Title}
                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                    {/* <SketchPicker /> */}
                                                                </div>

                                                                <p className="row col-lg-12">Text Style</p>
                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                {option}
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
                                                                            for (let i = 6; i <= 30; i++) {
                                                                                Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                            }
                                                                            return Item
                                                                        })()}
                                                                    </TextField>
                                                                </div>
                                                                <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='TitleColor'
                                                                        value={state.TitleColor}
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
                                    {navbar.bar === 'Charts' && (state.Chart !== 'Bar Chart' && state.Chart !== 'Line Chart' && state.Chart !== 'ScatterPlot') ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Legend</Typography>
                                                {/* <Typography className="acdswatch">
                                                    <div>
                                                        <label className="switch">
                                                            <input type="checkbox" name="Legendswatch" checked={state.Legendswatch_} onChange={handleShowProps}></input>
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography> */}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>

                                                    <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
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
                                                                <p className="row col-lg-12" style={{ marginTop: '20px' }}>Text Style</p>
                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                {option}
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
                                                                            for (let i = 6; i <= 30; i++) {
                                                                                Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                            }
                                                                            return Item
                                                                        })()}
                                                                    </TextField>
                                                                </div>
                                                                <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='LegendColor'
                                                                        value={state.LegendColor}
                                                                        defaultValue={'#000000'}
                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                </div>

                                                                <div className="row col-xs-12 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                {/* <Typography className="acdTitle" style={{ paddingLeft: '50%' }}> */}
                                                {/* <Typography className="acdTitle acdswatch">
                                                    <div>
                                                        <label className="switch">
                                                            <input type="checkbox" name="Tooltipswatch" checked={state.Tooltipswatch_} onChange={handleShowProps}></input>
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography> */}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
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
                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield" style={{ marginTop: '20px' }}>
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
                                                                            <MenuItem value={'Group'}>
                                                                                {'Group'}
                                                                            </MenuItem>
                                                                            : ''
                                                                        }
                                                                    </TextField>
                                                                </div>
                                                                <p className="row col-lg-12">Text Style</p>
                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                {option}
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
                                                                            for (let i = 6; i <= 30; i++) {
                                                                                Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                            }
                                                                            return Item
                                                                        })()}
                                                                    </TextField>
                                                                </div>
                                                                <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='TooltipColor'
                                                                        value={state.TooltipColor}
                                                                        defaultValue={'#ffffff'}
                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                </div>
                                                                <p className="row col-lg-12">Background</p>
                                                                <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='TooltipBGColor'
                                                                        value={state.TooltipBGColor}
                                                                        defaultValue={'#6282b3'}
                                                                        id="TooltipBGColor" onChange={handleChange}></input>
                                                                </div>
                                                                <p className="row col-lg-12">Border Style</p>

                                                                <div className="row col-xs-12 col-sm-4 col-md-4 col-lg-5 inputfield">
                                                                    <TextField id="Color" className='input-field'
                                                                        value={state.TooltipThickness}
                                                                        name='TooltipThickness' label="Width" variant="outlined"
                                                                        defaultValue={'0'}
                                                                        onChange={handleChange} />
                                                                </div>
                                                                <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
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
                                                    <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
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
                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield" style={{ marginTop: '20px' }}>
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
                                                                <p className="row col-lg-12">Text Style</p>
                                                                <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
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
                                                                                {option}
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
                                                                            for (let i = 6; i <= 30; i++) {
                                                                                Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                            }
                                                                            return Item
                                                                        })()}
                                                                    </TextField>
                                                                </div>
                                                                <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='LabelsColor'
                                                                        value={state.LabelsColor}
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
                                </>
                                : ""
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
                                        {/* <Typography className="acdTitle acdswatch" >
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" name="Pieswatch" checked={state.Pieswatch_} onChange={handleShowProps}></input>
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </Typography> */}
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Typography>
                                            <div className="col-lg-12">
                                                <div className="row col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>
                                                    {navbar.bar === 'Charts' &&
                                                        <>
                                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
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
                                        {/* <Typography className="acdTitle acdswatch">
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" name="Barswatch" checked={state.Barswatch_} onChange={handleShowProps}></input>
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </Typography> */}
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Typography>
                                            <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                {navbar.bar === 'Charts' &&
                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>
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
                                                                    <input type="color" name='Color' value={state.Color} defaultValue={'#000000'} id="colorPicker" onChange={handleChange}></input>

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
                                        {/* <Typography className="acdTitle acdswatch">
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" name="Scatterswatch" checked={state.Scatterswatch_} onChange={handleShowProps}></input>
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </Typography> */}
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Typography>
                                            <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>
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
                                        {/* <Typography className="acdTitle acdswatch">
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" name="Lineswatch" checked={state.Lineswatch_} onChange={handleShowProps}></input>
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </Typography> */}
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Typography>
                                            <div className="col-lg-12">
                                                <div className="row col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>
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
                                        {/* <Typography className="acdswatch">
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" name="Seriesswatch" checked={state.Seriesswatch_} onChange={handleShowProps}></input>
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </Typography> */}
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Typography>
                                            <div className=" col-lg-12" >
                                                {navbar.bar === 'Charts' &&
                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>

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
                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>
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
                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "10px 0px 15px 10px" }}>

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
                            <div className="row col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                {navbar.bar !== 'Templates' && navbar.bar !== 'Data' && navbar.bar !== 'Demo' && navbar.bar !== 'Dashboard' && navbar.bar !== 'Feedback' && state.Uploaded_file !== undefined ?

                                    <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative' }}> */}
                                        <Button disabled={disable} variant="contained" id="ChartGen" className='input-field button' style={{ backgroundColor: '#6282b3' }} onClick={(e) => { setProgress({ 'loader': true }); GenerateChart() }}>
                                            Generate Chart
                                        </Button>
                                        {/* {progress.loader && <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        // color: 'green',
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        marginTop: '-12px',
                                                        marginLeft: '-12px',
                                                    }}
                                                />
                                                }
                                            </Box>
                                        </Box> */}
                                    </div>
                                    : ''
                                }
                                {state.Chart !== 'Select' && state.Chart !== undefined && navbar.bar !== 'Templates' && navbar.bar !== 'Data' && navbar.bar !== 'Demo' && flag !== true && navbar.bar !== 'Dashboard' && navbar.bar !== 'Feedback' ?
                                    <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                        <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { handleOpen() }}>
                                            Save Template
                                        </Button>
                                    </div>
                                    : ''
                                }
                                {state.Chart !== 'Select' && state.Chart !== undefined && navbar.bar !== 'Templates' && navbar.bar !== 'Data' && navbar.bar !== 'Demo' && flag === true && navbar.bar !== 'Dashboard' && navbar.bar !== 'Feedback' ?
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

                                                            <div className="col-sm-1 col-md-1 col-lg-1">
                                                                <BootstrapTooltip title="Preview" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                    <RemoveRedEyeIcon id={a} className='temp-icon' onClick={handleTemplate} />
                                                                </BootstrapTooltip>
                                                            </div>
                                                            <div className="col-sm-1 col-md-1 col-lg-1">
                                                                <BootstrapTooltip title="Edit" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                    <EditIcon id={a} className='temp-icon' onClick={handleTemplate} />
                                                                </BootstrapTooltip>
                                                            </div>
                                                            <div className="col-sm-1 col-md-1 col-lg-1">
                                                                <BootstrapTooltip title="Delete" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                    <DeleteIcon id={a} className='temp-icon' onClick={handleTemplate} />
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
                    {navbar.bar === 'Demo' &&
                        <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>
                            <div className="col-sm-12 col-md-4 col-lg-4">
                            </div>
                            <div class="row1-container">
                                <div class="box box-down cyan">
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
                                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9" >
                                        Layouts
                                    </div>
                                    <div className=" col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                        <label className="switch">
                                            <input type="checkbox" name="StaticLayouts" checked={others.StaticLayouts} onChange={(e) => { setOthers({ ...others, 'StaticLayouts': e.target.checked, 'CustomLayouts': !e.target.checked }) }}></input>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    {others.StaticLayouts &&
                                        // <DashboardLayouts 
                                        <>
                                            <div className="row col-sx-12 col-sm-12 col-md-12 col-lg-12 prt-dashboardLayouts">
                                                {/* 1 X 1 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "1X1" ? 'active' : ''}`} id="1X1"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-10 col-sm-10 col-md-10 col-lg-10 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-10 col-sm-10 col-md-10 col-lg-10 layoutContainer">
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* 1 X 2 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "1X2" ? 'active' : ''}`} id="1X2"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-10 col-sm-10 col-md-10 col-lg-10 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* 1 X 3 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "1X3" ? 'active' : ''}`} id="1X3"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-11 col-sm-11 col-md-11 col-lg-11 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-3 col-sm-3 col-md-3 col-lg-3 layoutContainer" >
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* 2 X 1 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "2X1" ? 'active' : ''}`} id="2X1"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>

                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-10 col-sm-10 col-md-10 col-lg-10 layoutContainer">
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* 2 X 2 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "2X2" ? 'active' : ''}`} id="2X2"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* 2 X 3 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "2X3" ? 'active' : ''}`} id="2X3"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-6 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-3 col-sm-3 col-md-3 col-lg-3 layoutContainer" >
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* 3 X 1 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "3X1" ? 'active' : ''}`} id="3X1"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-10 col-sm-10 col-md-10 col-lg-10 layoutContainer">
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* 3 X 2 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "3X2" ? 'active' : ''}`} id="3X2"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-3 col-sm-3 col-md-3 col-lg-3 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-5 col-sm-5 col-md-5 col-lg-6 layoutContainer">
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* 3 X 3 */}
                                                <div className={`col-sx-5 col-sm-5 col-md-5 col-lg-5  Dashboardlayout-1 ${others.selectedLayout === "3X3" ? 'active' : ''}`} id="3X3"
                                                    onClick={dashboardLayouts}>
                                                    <div className="row col-lg-12" style={{ margin: '0px 0px 10px 0px' }}>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-3 col-sm-3 col-md-3 col-lg-3 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer" >
                                                        </div>
                                                        <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4 layoutContainer">
                                                        </div>
                                                        <div className="col-sx-3 col-sm-3 col-md-3 col-lg-3 layoutContainer" >
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="row col-lg-12 filterswt">
                                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9" >
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
                                                                            value={others["Cols" + i]}
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
                                <div className="row col-xs-12 col-sm-12 col-md-4 col-lg-12 inputfield row1-container borderdivstyle" style={{ marginTop: "10px", maxHeight: '50vh', overflowY: 'auto' }}>
                                    <div className="col-lg-12 borderstyle">
                                        <div className="col-lg-8" style={{ display: 'contents' }}>Templates</div>
                                        <div className="col-lg-1" style={{ cursor: 'pointer' }}>
                                            <BootstrapTooltip title="Refresh" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                                                <Reload onClick={e => { setIsshow({ ...show, 'isShow': true, dashboard, 'NOCharts': others.NOCharts }) }} />
                                            </BootstrapTooltip>
                                        </div>
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
                                                                <div className="col-lg-8">{dashboard[a].Chart}</div>
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
                                                <div className="col-lg-12 " >
                                                    Please Create any template
                                                </div>
                                            )
                                        }
                                        return Item

                                    })()}
                                </div>
                                <div className="row col-lg-12 filterswt">
                                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9" >
                                        Filter
                                    </div>
                                    <div className=" col-xm-3 col-sm-3 col-md-3 col-lg-3" >
                                        <label className="switch">
                                            <input type="checkbox" name="Filterswatch" checked={filter.filterSwatch} onChange={(e) => { setFilter({ ...filter, 'filterSwatch': e.target.checked, 'data': state.Uploaded_file }) }}></input>
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
                                                                        <ListItemText primary={name} />
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
                                <div className="row col-sm-4 col-md-12 col-lg-5" style={{ marginTop: '10px' }}>
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
                                </div>
                                <div className="row col-sm-4 col-md-12 col-lg-5" style={{ marginTop: '10px' }}>
                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }}
                                        onClick={(e) => { ExpandCollapse(); handleFilter(undefined, 'Apply Filter'); setIssues(undefined) }}>
                                        Publish Dashboard
                                    </Button>
                                </div>


                            </div>
                        </>
                    }
                    {navbar.bar === 'Feedback' &&
                        <>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <TextField id="Username"
                                        error={formValues.UName.error}
                                        helperText={formValues.UName.error && formValues.UName.errorMessage}
                                        margin="dense" fullWidth className='input-field' name='UName' label="User Name*" variant="outlined"
                                        // value={state.YAxisLabel}
                                        onChange={(e) => { setFeedback({ ...feedback, 'Reported By': e.target.value }) }}
                                        onBlur={(e) => { handleValidation(e) }}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <TextField
                                        id="TempDescription"
                                        className="Description"
                                        error={formValues.Issue.error}
                                        helperText={formValues.Issue.error && formValues.Issue.errorMessage}
                                        label="Issue*" name="Issue" fullWidth margin="dense" multiline maxRows={4}
                                        onChange={(e) => { setFeedback({ ...feedback, [e.target.name]: e.target.value }) }}
                                        onBlur={(e) => { handleValidation(e) }}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ display: 'flex' }}>
                                    <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'left', marginTop: '10px' }} onClick={(e) => { handleFeedback() }}>
                                        Report
                                    </Button>
                                </div>
                            </div>
                        </>
                    }
                    {/* {!navopen && <div className="nav-inputarea">InputArea</div>} */}
                </>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h6" component="h2">
                                Template
                            </Typography>
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
                                    <Button variant="contained" margin="normal" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { saveTemplate('save') }}>
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
export default InputArea