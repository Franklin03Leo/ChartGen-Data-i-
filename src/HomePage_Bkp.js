import React from "react";
// import Grid from '@material-ui/core/Grid';


//MUI
import './Styles/Custom.css';
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
import { Fade, Switch } from "@material-ui/core";

import 'bootstrap/dist/css/bootstrap.min.css';

//NPM's
import Papa from "papaparse";
import * as xlsx from "xlsx";
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MUIDataTable from "mui-datatables";

//Charts
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart"
import Scatter from "./Charts/ScatterPlot";
import LineChart from "./Charts/LineChart";
import Compose from "./Charts/CompositeChart";
import SeriesChart from "./Charts/SeriesChart";
import DatasetTable from "./Charts/DatasetTable";

// import InputBlock from "./Components/InputBlock";
// import ChartBlock from "./Components/ChartBlock";

//Icons
import logo from '../src/Analytic_Brains_Logo.png';
import DatasetIcon from '@mui/icons-material/Dataset';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


import { Box, Modal } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import { useCallback } from "react";


// import StackrowChart from "./Charts/Stackedbar";
const HomePage = () => {

    const ChartType = ['Select', 'Pie Chart', 'Bar Chart', 'ScatterPlot', 'Line Chart', 'Composite Chart', 'Series Chart']
    const Fonts = ['Arial', 'Verdana', 'Tahoma', 'Trebuchet', 'Times New Roman', 'Georgia', 'Garamond', 'Courier']

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
        XAxis: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        YAxis: {
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
        GroupBy: {
            error: false,
            errorMessage: 'Please Select atleast one'
        },
        InputType: {
            error: false,
            errorMessage: 'Please Select atleast one'
        }
    })
    const [disable, isDisable] = React.useState(true);
    const [error, setError] = React.useState({});

    const [state, setState] = React.useState({ 'InputType': 'Enter Inputs', 'Heigth_': 300, 'Width_': 600, 'YAxisPadding': '10', 'SlicesCap': 10, 'Innerradius': 10, 'ExternalRadiusPadding': 60, 'SymbolSize': 7 });
    const [enable, setEnable] = React.useState({})
    const [colors, setColors] = React.useState([]);
    const [navbar, setNavbar] = React.useState({ 'bar': 'Data' });
    const [template, setTemplate] = React.useState({});
    const [enabletemplate, setEnableTemplate] = React.useState(false);
    const [flag, setFlag] = React.useState(false);

    const [navopen, setNavOpen] = React.useState(true);
    const [navwidth, setNavWidth] = React.useState({ 'navArea': '7%', 'inuptArea': '30%', 'ChartArea': '63%' });
    const [isMobile, setIsMobile] = React.useState(false);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
    React.useEffect(() => {
        GenarateChart();
    }, [enabletemplate]);
    //Functions
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
                            setState({
                                ...state, 'Uploaded_file': results.data,
                                'XAxis_': Object.keys(results.data[0]),
                                'YAxis_': Object.keys(results.data[0])
                            })
                            setError({ 'invalidFile': undefined })

                        },
                    });
                }
                else if (event.target.files[0].type === "application/json") {
                    const reader = new FileReader();
                    reader.onload = e => {
                        try {
                            var data = JSON.parse(e.target.result)
                            setState({
                                ...state, 'Uploaded_file': data,
                                'XAxis_': Object.keys(data[0]),
                                'YAxis_': Object.keys(data[0])
                            })
                            setError({ 'invalidFile': undefined })

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
                        setState({
                            ...state, 'Uploaded_file': json,
                            'XAxis_': Object.keys(json[0]),
                            'YAxis_': Object.keys(json[0])
                        })
                        setError({ 'invalidFile': undefined })

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
        else if (event.target.name === 'GroupBy') {
            const unique = [...new Set(state.Uploaded_file.map(item => item[event.target.value]))];
            setState({ ...state, [event.target.name]: event.target.value, 'GroupByValues': unique, })
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
        else {
            setState({ ...state, [event.target.name]: event.target.value });
        }
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false })
        setError({ 'mandatoryFields': undefined })

    }
    const handleValidation = (event) => {
        const numberValues = ['ExternalRadiusPadding', 'Heigth_', 'Width_', 'Innerradius', 'SlicesCap', 'YAxisPadding', 'SymbolSize']
        const mandatoryFields = ['Chart', 'InputType', 'ExternalRadiusPadding', 'Innerradius', 'Heigth_', 'Width_', 'SlicesCap', 'XAxis', 'YAxis', 'YAxisPadding', 'SymbolSize', 'GroupBy']
        if (mandatoryFields.indexOf(event.target.name) !== -1) {
            if (event.target.value === undefined || event.target.value.trim().length === 0) {
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

    }
    const GenarateChart = () => {

        const formFields = Object.keys(formValues);
        for (var i = 0; i < formFields.length; i++) {
            var isTrue = formValues[formFields[i]].error;
            if (isTrue) {
                isDisable(true)
                setError({ 'mandatoryFields': 'Please fill the highlighted fields' })
                return
            }
            else {
                isDisable(false)
            }
        }
        const Common = ['Chart', 'Heigth_', 'Width_', 'XAxis']
        const Pie = ['ExternalRadiusPadding', 'Innerradius', 'SlicesCap']
        //var MissedFields = []
        for (let i = 0; i < Common.length; i++) {
            if (state[Common[i]] === undefined || state[Common[i]] === '' || state[Common[i]] === 'Select') {
                if (Common[i] === 'Width_') Common[i] = 'Width'
                if (Common[i] === 'Heigth_') Common[i] = 'Height'
                setError({ 'mandatoryFields': `Please fill the ${Common[i]} field` })
                return
            }
            else {
                setError({ 'mandatoryFields': undefined })
            }
        }
        if (state.Chart === 'Composite Chart' || state.Chart === 'Series Chart') {
            if (state.GroupBy === undefined || state.GroupBy === '') {
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

        console.log('state value', state)

    }
    const saveChart = () => {
        // domtoimage.toPng(
        //     document.getElementById('Charts'),
        //     { width: 0, height: 0, quality: 1, margin: [50, 200, 50, 50], style: { backgroundColor: 'white' } }
        // )
        domtoimage.toSvg(
            document.getElementById('Charts'),
            { width: 0, height: 0, quality: 1, margin: [50, 200, 50, 50], style: { backgroundColor: 'white' } }
        )
            .then(function (dataUrl) {
                saveAs(dataUrl, state.Chart + ".svg")
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }
    const exportInputs = () => {

        var copystate = {}
        var PieChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Title', 'Innerradius', 'SlicesCap', 'ExternalRadiusPadding', 'XAxis', 'YAxis', 'XAxis_', 'YAxis_']
        var BarChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'YAxisPadding', 'XAxis_', 'YAxis_']
        var ScatterPlot = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'SymbolSize', 'XAxis_', 'YAxis_']
        var LineChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'XAxis_', 'YAxis_']
        var CompositeChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'GroupBy', 'XAxis_', 'YAxis_', 'GroupByValues']
        var Common = ['BGColor', 'LegendColor', 'LegendFont', 'LegendSize', 'LengendPosition', 'TitleColor', 'TitleFont', 'TitleSize', 'TooltipBGColor', 'TooltipColor',
            'TooltipFont', 'TooltipSize', 'TooltipThickness', 'TooltipTickColor', 'xFont', 'xSize', 'xColor', 'xlColor', 'xlFont', 'xlSize', 'yFont', 'yColor', 'ySize', 'ylColor', 'ylFont', 'ylSize']
        for (let i = 0; i < Object.keys(state).length; i++) {
            if (state.Chart === 'Pie Chart') {
                if (PieChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'Bar Chart') {
                if (BarChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'ScatterPlot') {
                if (ScatterPlot.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'Line Chart') {
                if (LineChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'Composite Chart' || state.Chart === 'Series Chart') {
                if (CompositeChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }

            if (Common.indexOf(Object.keys(state)[i]) !== -1) {
                copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
            }
        }
        const json = JSON.stringify(copystate, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = state.Chart + "-Inputs.json";
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }
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
    const handleNavbarChange = (event) => {
        var data = event.currentTarget.dataset.testid;
        var bar = '';
        if (data === 'DatasetIcon') bar = 'Data'
        else if (data === 'SignalCellularAltIcon') bar = 'Charts'
        else if (data === 'Grid3x3Icon') bar = 'Dimensions'
        else if (data === 'LineAxisIcon') bar = 'Axes'
        else if (data === 'ArticleIcon') bar = 'Templates'
        setNavbar({ 'bar': bar })
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false })
        console.log('templates', template);
        // if(!flag)

    }

    const handleShowProps = (e) => {
        e.stopPropagation();
        setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false })
        var value = ''
        if (e.target.name === 'Titleswatch' || e.target.name === 'Axesswatch' || e.target.name === 'Legendswatch') {
            if (e.target.checked) value = 'block'
            else value = 'none'
        }
        else if (e.target.name === 'Tooltipswatch') {
            if (e.target.checked) value = .9
            else value = .0
        }
        else if (e.target.name === 'Barswatch' || e.target.name === 'Pieswatch' || e.target.name === 'Scatterswatch' || e.target.name === 'Lineswatch' ||
            e.target.name === 'Compositeswatch' || e.target.name === 'Seriesswatch') {
            if (e.target.checked) value = 'show'
            else value = 'hide'
        }

        setState({ ...state, [e.target.name]: value, [e.target.name + '_']: e.target.checked });

    }
    const saveTemplate = (action) => {
        if (action !== 'cancel') {
            setTemplate({ ...template, [state.TempName]: state })
            if (flag) {
                toast.success('Your template has been Updated', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
            }
            else {
                toast.success('Your template has been Saved', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 2000
                });
                setNavbar({ 'bar': 'Templates' })
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
    const handleTemplate = (e) => {
        if (e.currentTarget.dataset.testid === 'EditIcon') {
            setState(template[e.currentTarget.id])
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false })
            setNavbar({ 'bar': 'Charts' })
            setFlag(true)

        }
        else if (e.currentTarget.dataset.testid === 'DeleteIcon') {
            setTemplate({ ...template, [e.currentTarget.id]: undefined })
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false })
            toast.success('Your Chart has been Deleted', {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
                autoClose: 2000
            });
            setFlag(flag)
        }
        else if (e.currentTarget.dataset.testid === 'RemoveRedEyeIcon') {
            setEnable({ ...enable, 'Piechart': false, 'Barchart': false, 'Scatter': false, 'Linechart': false, 'Compositechart': false, 'Serieschart': false })
            setEnableTemplate(!enabletemplate)
            setState(template[e.currentTarget.id])
            setFlag(false)
        }
    }

    React.useEffect(() => {
        const handleResize = () => {

            if (window.innerWidth < 1010) {
                setNavOpen(false)
                setNavWidth({ 'navArea': '0%', 'inuptArea': '0%', 'ChartArea': '94%' })

                setIsMobile(true)
            }
            else {
                setNavOpen(true)
                setNavWidth({ 'navArea': '7%', 'inuptArea': '30%', 'ChartArea': '63%' })
                setIsMobile(false)

            }

        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, [])


    //Components
    const NavIcons = () => {
        return (
            <div>
                <div className="Icon">
                    <BootstrapTooltip title="Data" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <DatasetIcon className="Icon_" fontSize="large" color={navbar.bar === 'Data' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div>
                <div className="Icon">
                    <BootstrapTooltip title="Chart" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <SignalCellularAltIcon className="Icon_" fontSize="large" color={navbar.bar === 'Charts' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div>
                <div className="Icon">
                    <BootstrapTooltip title="Dimensions" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <Grid3x3Icon className="Icon_" fontSize="large" color={navbar.bar === 'Dimensions' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div>
                <div className="Icon">
                    <BootstrapTooltip title="Axes" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <LineAxisIcon className="Icon_" fontSize="large" color={navbar.bar === 'Axes' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div>
                <div className="Icon">
                    <BootstrapTooltip title="Templates" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <ArticleIcon className="Icon_" fontSize="large" color={navbar.bar === 'Templates' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} />
                    </BootstrapTooltip>
                </div>
            </div>
        )
    }
    const Chart = useCallback(() => {
        //alert('rendering')
        return (
            <>
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12 container-Inputs">
                    <div className="row col-xs-1 col-sm-8 col-md-8 col-lg-8" >
                    </div>
                    {enable.Barchart || enable.Piechart || enable.Scatter || enable.Linechart || enable.Serieschart ?
                        <div className="row col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: '5px' }}>
                            <div className="col-xs-5 col-sm-8 col-md-8 col-lg-8">
                                <BootstrapTooltip title="Download" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                    <DownloadIcon style={{ float: 'right', cursor: 'pointer' }} onClick={saveChart} className="Icon_" />
                                </BootstrapTooltip>
                            </div>
                            <div className="col-xs-1 col-sm-4 col-md-4 col-lg-4">
                                <BootstrapTooltip title="Export Inputs" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                    <Button variant="contained" className='exptbutton' style={{ backgroundColor: '#6282b3' }} onClick={exportInputs}>
                                        Export
                                    </Button>
                                </BootstrapTooltip>
                            </div>
                        </div>
                        : ''
                    }
                </div>
                <div style={{ backgroundColor: '#e9ecef' }}>
                    {enable.Barchart &&
                        <BarChart params={state} />}
                    {enable.Piechart &&
                        <PieChart params={state} colors={colors} />}
                    {enable.Scatter &&
                        <Scatter params={state} />}
                    {enable.Linechart &&
                        <LineChart params={state} />}
                    {enable.Compositechart &&
                        <Compose params={state} />}
                    {enable.Serieschart &&
                        <SeriesChart params={state} />}
                </div>
            </>
        )
    }, [enable, state, colors])
    const Chartheader = ({ param }) => {
        return (
            <div>
                <span style={{ float: "left", fontWeight: "bold", margin: '15px' }}>{param}</span>
            </div>
        );
    };

    const ExpandCollapse = () => {
        const handleCollapseExpand = useCallback(() => {
            if (navopen && !isMobile) {
                setNavWidth({ 'navArea': '0%', 'inuptArea': '0%', 'ChartArea': '95%' })
                setNavOpen(!navopen)
            }
            else if (navopen && isMobile) {
                setNavWidth({ 'navArea': '0%', 'inuptArea': '0%', 'ChartArea': '94%' })
                setNavOpen(!navopen)
            }
            else if (!navopen && isMobile) {
                setNavWidth({ 'navArea': '15%', 'inuptArea': '60%', 'ChartArea': '94%' })
                setNavOpen(!navopen)
            }
            else if (!navopen && !isMobile) {
                setNavWidth({ 'navArea': '7%', 'inuptArea': '30%', 'ChartArea': '63%' })
                setNavOpen(!navopen)
            }

        }, [navopen, isMobile])
        return (
            <div className="nav-close">
                {navopen ?
                    <BootstrapTooltip title="Collapse Input Area" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <ArrowLeftIcon onClick={(e) => { handleCollapseExpand() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                    </BootstrapTooltip>
                    :
                    <BootstrapTooltip title="Expand Input Area" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="right">
                        <ArrowRightIcon onClick={(e) => { handleCollapseExpand() }} fontSize="medium" style={{ cursor: 'pointer' }} />
                    </BootstrapTooltip>
                }
            </div>
        )
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

                <div className="row" style={{ marginRight: '0px', width: '100%' }}>
                    <div className="nav-bar col-xs-1  col-sm-1 col-md-1 col-lg-1" style={{ width: navwidth.navArea, borderRight: navopen ? '1px solid rgb(0 0 0 / 13%)' : '', backgroundColor: '#f7f5f526' }}>
                        {navopen &&
                            <NavIcons />
                        }
                    </div>
                    <div className="divchart" style={{ width: navwidth.inuptArea }}>
                        {/* <div className="nav-close">
                            {navopen ?
                                <ArrowLeftIcon onClick={(e) => { handleCollapseExpand() }} />
                                :
                                <ArrowRightIcon onClick={(e) => { handleCollapseExpand() }} />
                            }
                        </div> */}
                        <ExpandCollapse />
                        <>
                            <Chartheader param={navbar.bar} />
                            {navbar.bar === 'Data' && <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>

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
                                <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ marginBottom: '10px', margin: "15px" }}>
                                    <Alert severity="error">{error.invalidInputs}</Alert>
                                </div>
                            }
                            {(state.InputType === 'Enter Inputs' && navbar.bar === 'Data') ?
                                <div>
                                    <div className=" col-lg-12" style={{ marginBottom: '    10px', margin: "15px" }}>
                                        <label className="drop-container">
                                            <span className="drop-title">Drop files here</span>
                                            or
                                            <input type="file" name="file" id="uploadFile" accept=".csv, .json, .xlsx, .xls" onChange={handleChange}></input>
                                        </label>
                                    </div>
                                    {error.invalidFile !== undefined &&
                                        <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ marginBottom: '10px', margin: "15px" }}>
                                            <Alert severity="error">{error.invalidFile}</Alert>
                                        </div>
                                    }
                                </div>
                                : ''
                            }

                            {state.Uploaded_file !== undefined && error.invalidInputs === undefined ?
                                <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: "15px 0px 15px 10px" }}>
                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        {(enable.Imported || state.Uploaded_file !== undefined) && navbar.bar === 'Charts' ?

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
                                            </div> : ''
                                        }

                                        {(enable.Imported || state.Uploaded_file !== undefined) && (navbar.bar === 'Dimensions') ?
                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                <TextField
                                                    error={formValues.Heigth_.error}
                                                    helperText={formValues.Heigth_.error && formValues.Heigth_.errorMessage}
                                                    id="Height" className='input-field' name='Heigth_' label="Height*" variant="outlined"
                                                    defaultValue={300}
                                                    value={state.Heigth_}
                                                    onChange={(e) => { handleChange(e) }}
                                                    onBlur={(e) => { handleValidation(e) }}
                                                />
                                            </div>
                                            : ''
                                        }
                                        {(enable.Imported || state.Uploaded_file !== undefined) && (navbar.bar === 'Dimensions') ?
                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                <TextField
                                                    error={formValues.Width_.error}
                                                    helperText={formValues.Width_.error && formValues.Width_.errorMessage}
                                                    id="Width" className='input-field' name='Width_' label="Width*" variant="outlined"
                                                    value={state.Width_}
                                                    defaultValue={600}
                                                    onChange={(e) => { handleChange(e) }}
                                                    onBlur={(e) => { handleValidation(e) }}
                                                />
                                            </div>
                                            : ''
                                        }

                                    </div>
                                    {(enable.Imported || state.Uploaded_file !== undefined) && (navbar.bar === 'Charts') ?
                                        <>
                                            <Accordion className="acd">
                                                <AccordionSummary
                                                    className="acdsummary"
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Typography className="acdTitle">
                                                        Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </Typography>
                                                    <Typography className="acdswatch">
                                                        <div>
                                                            <label class="switch">
                                                                <input type="checkbox" name="Titleswatch" checked={state.Titleswatch_} onChange={handleShowProps}></input>
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                    </Typography>
                                                </AccordionSummary>

                                                <AccordionDetails className="acdDetails">
                                                    <Typography>
                                                        <div className=" col-lg-12" style={{ marginTop: '0px' }}>
                                                            <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
                                                                {navbar.bar === 'Charts' ?
                                                                    <>
                                                                        <p className="row col-lg-12">Title</p>
                                                                        <div className="row col-sm-6 col-md-6 col-lg-5 inputfield">
                                                                            <TextField
                                                                                error={formValues.Title.error}
                                                                                helperText={formValues.Title.error && formValues.Title.errorMessage}
                                                                                id="Title" className='input-field' name='Title' label="Title" variant="outlined"
                                                                                value={state.Title}
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                            {/* <SketchPicker /> */}
                                                                        </div>
                                                                    </>
                                                                    : ''
                                                                }
                                                                {(enable.Imported || state.Uploaded_file !== undefined) && navbar.bar === 'Charts' ?
                                                                    <>
                                                                        <p className="row col-lg-12">Text Style</p>
                                                                        <div className="row col-xs-4 col-sm-4 col-md-4 col-lg-5 inputfield">
                                                                            <TextField
                                                                                //error={formValues.GroupBy.error}
                                                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                id="Font"
                                                                                select
                                                                                name='TitleFont'
                                                                                label="Font"
                                                                                defaultValue={'Arial'}
                                                                                className='input-field'
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                value={state.TitleFont}
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
                                                                                defaultValue={'14'}

                                                                                className='input-field '
                                                                                onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                                value={state.TitleSize}
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
                                                                    : ''
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
                                                        <Typography className="acdswatch">
                                                            <div>
                                                                <label class="switch">
                                                                    <input type="checkbox" name="Legendswatch" checked={state.Legendswatch_} onChange={handleShowProps}></input>
                                                                    <span class="slider round"></span>
                                                                </label>
                                                            </div>
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography>

                                                            <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
                                                                <p className="row col-lg-12">Text Style</p>
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
                                                                    >
                                                                        <MenuItem key={1} value={true} >Horizontal</MenuItem>
                                                                        <MenuItem key={2} value={false}>Vertical</MenuItem>

                                                                    </TextField>
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
                                                        {/* <Typography className="acdTitle" style={{ paddingLeft: '50%' }}> */}
                                                        <Typography className="acdTitle acdswatch">
                                                            <div>
                                                                <label class="switch">
                                                                    <input type="checkbox" name="Tooltipswatch" checked={state.Tooltipswatch_} onChange={handleShowProps}></input>
                                                                    <span class="slider round"></span>
                                                                </label>
                                                            </div>
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography>
                                                            <div className="row col-lg-12" style={{ margin: "0px 0px 15px 10px" }}>
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
                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                </div>
                                                                {/*  <p className="row col-lg-12">Text Style</p>

                                                                 <div className="row col-xs-4 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='TooltipColor'
                                                                        value={state.TooltipColor}
                                                                        id="colorPicker" onChange={handleChange}></input>
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
                                                                    >
                                                                        {(() => {
                                                                            let Item = [];
                                                                            for (let i = 6; i <= 30; i++) {
                                                                                Item.push(<MenuItem key={i} value={i}> {i}  </MenuItem>)
                                                                            }
                                                                            return Item
                                                                        })()}
                                                                    </TextField>
                                                                </div> */}
                                                                <p className="row col-lg-12">Background</p>


                                                                <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='TooltipBGColor'
                                                                        value={state.TooltipBGColor}
                                                                        id="TooltipBGColor" onChange={handleChange}></input>
                                                                </div>
                                                                <p className="row col-lg-12">Border Style</p>

                                                                <div className="row col-xs-12 col-sm-4 col-md-4 col-lg-5 inputfield">
                                                                    <TextField id="Color" className='input-field'
                                                                        value={state.TooltipThickness}
                                                                        name='TooltipThickness' label="Width" variant="outlined"
                                                                        //value={state.Color}
                                                                        onChange={handleChange} />
                                                                </div>
                                                                <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='TooltipTickColor'
                                                                        value={state.TooltipTickColor}
                                                                        id="colorPicker" onChange={handleChange}></input>

                                                                </div>

                                                            </div>


                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            }
                                        </>
                                        : ""
                                    }
                                    {(navbar.bar === 'Axes') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Dimensions</Typography>

                                            </AccordionSummary>

                                            <AccordionDetails >
                                                <Typography >
                                                    <div className="row col-lg-12">
                                                        {(state.Chart === 'Pie Chart') &&
                                                            <div className="col-lg-12">

                                                                {navbar.bar === 'Axes' && <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                                                                    <div className="row col-lg-12">
                                                                        <div className="row col-sm-6 col-md-5 col-lg-5">
                                                                            <TextField
                                                                                error={formValues.XAxis.error}
                                                                                helperText={formValues.XAxis.error && formValues.XAxis.errorMessage}
                                                                                id="XAxis"
                                                                                select
                                                                                name='XAxis'
                                                                                label="Dimension*"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleChange(e) }}
                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                                value={state.XAxis}
                                                                            >
                                                                                {state.XAxis_.map((option, index) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </TextField>
                                                                        </div>
                                                                        <div className="row col-sm-6 col-md-5 col-lg-5">
                                                                            <TextField
                                                                                error={formValues.YAxis.error}
                                                                                helperText={formValues.YAxis.error && formValues.YAxis.errorMessage}
                                                                                id="YAxis"
                                                                                select
                                                                                name='YAxis'
                                                                                label="Group*"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleChange(e) }}
                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                                value={state.YAxis}
                                                                            >
                                                                                <MenuItem key={0} value={'Select'}>
                                                                                    {'Select'}
                                                                                </MenuItem>
                                                                                {state.YAxis_.map((option, index) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </TextField>
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
                                                                    {/* <div className="row col-lg-12">
                                                                        <div className="row col-sm-6 col-md-3 col-lg-5">
                                                                            <TextField
                                                                                error={formValues.YAxis.error}
                                                                                helperText={formValues.YAxis.error && formValues.YAxis.errorMessage}
                                                                                id="YAxis"
                                                                                select
                                                                                name='YAxis'
                                                                                label="Group*"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleChange(e) }}
                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                                value={state.YAxis}
                                                                            >
                                                                                {state.YAxis_.map((option, index) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </TextField>
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                                }
                                                            </div>
                                                        }

                                                        {(state.Chart !== 'Pie Chart') ?
                                                            <>

                                                                {navbar.bar === 'Axes' &&
                                                                    <div className="col-lg-12" style={{ marginTop: '10px' }}>
                                                                        <p className="row col-lg-12">X-Axis</p>
                                                                        <div className="row col-lg-12" style={{ marginTop: '10px' }}>

                                                                            <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-5" >
                                                                                <TextField
                                                                                    error={formValues.XAxis.error}
                                                                                    helperText={formValues.XAxis.error && formValues.XAxis.errorMessage}
                                                                                    id="XAxis"
                                                                                    select
                                                                                    name='XAxis'
                                                                                    label="X-Axis*"
                                                                                    className='input-field '
                                                                                    value={state.XAxis}
                                                                                    onChange={(e) => { handleChange(e) }}
                                                                                    onBlur={(e) => { handleValidation(e) }}
                                                                                >
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
                                                                                        error={formValues.YAxis.error}
                                                                                        helperText={formValues.YAxis.error && formValues.YAxis.errorMessage}
                                                                                        id="YAxis"
                                                                                        select
                                                                                        name='YAxis'
                                                                                        label="Y-Axis*"
                                                                                        value={state.YAxis}
                                                                                        className='input-field '
                                                                                        onChange={(e) => { handleChange(e) }}
                                                                                        defaultValue={'Select'}
                                                                                    //onBlur={(e) => { handleValidation(e) }}
                                                                                    >
                                                                                        <MenuItem key={0} value={'Select'}>
                                                                                            {'Select'}
                                                                                        </MenuItem>
                                                                                        {state.YAxis_.map((option, index) => (
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
                                                                                        value={state.TitleFont}
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
                                                                                        value={state.TitleSize}
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
                                                                }
                                                                {(state.Chart === 'Composite Chart' || state.Chart === 'Series Chart') && navbar.bar === 'Axes' ?
                                                                    <div className="row col-lg-12" style={{ marginTop: '10px' }}>

                                                                        <div className="row col-sm-6 col-md-6 col-lg-5">
                                                                            <TextField
                                                                                error={formValues.GroupBy.error}
                                                                                helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                                                id="GroupBy"
                                                                                select
                                                                                name='GroupBy'
                                                                                label="GroupBy*"
                                                                                className='input-field '
                                                                                onChange={(e) => { handleChange(e) }}
                                                                                onBlur={(e) => { handleValidation(e) }}
                                                                                value={state.GroupBy}
                                                                            >
                                                                                {state.XAxis_.map((option, index) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </TextField>
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
                                    {(enable.Imported || state.Uploaded_file !== undefined) && (state.Chart !== 'Pie Chart') && (navbar.bar === 'Axes') ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Axes Labels</Typography>
                                                <Typography className="acdTitle acdswatch">
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Axesswatch" checked={state.Axesswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12">
                                                        <div className="row col-lg-12">
                                                            <p className="row col-lg-12">X-Axis</p>
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
                                                                        defaultValue={'Arial'}

                                                                        value={state.xlFont}
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
                                                                        defaultValue={14}

                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                        value={state.xlSize}
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
                                                                {/*
                                                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                                                    <TextField
                                                                        //error={formValues.YAxisPadding.error}
                                                                        //helperText={formValues.YAxisPadding.error && formValues.YAxisPadding.errorMessage}
                                                                        id="Rotate" className='input-field' name='Rotate' label="Rotate" variant="outlined"
                                                                        value={state.Rotate}
                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                                </div>
                                                                */}
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
                                                                        defaultValue={'Arial'}
                                                                        className='input-field '
                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                        value={state.ylFont}
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
                                                                        defaultValue={14}
                                                                        className='input-field '
                                                                        onChange={(e) => { handleValidation(e); handleChange(e); }}
                                                                        value={state.ylSize}
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
                                                                        id="colorPicker" onChange={handleChange}></input>
                                                                </div>
                                                            </div>




                                                        </div>

                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''}

                                    {(state.Chart === 'Pie Chart' && navbar.bar === 'Charts') && (enable.Imported || state.Uploaded_file !== undefined) ?
                                        <Accordion className="acd">
                                            <AccordionSummary
                                                className="acdsummary"
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="acdTitle">Pie&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                                <Typography className="acdTitle acdswatch" >
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Pieswatch" checked={state.Pieswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
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
                                                                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                                                    <p className="row col-lg-12">Background</p>
                                                                    <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                        <input type="color" name='BGColor'
                                                                            defaultValue={'#ffffff'}
                                                                            value={state.BGColor}
                                                                            id="colorPicker" onChange={handleChange}>
                                                                        </input>

                                                                    </div>
                                                                </div>
                                                            </>

                                                        }
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
                                                <Typography className="acdTitle acdswatch">
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Barswatch" checked={state.Barswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                                                {/* <div class="element dimensions">
                                                                    <div class="margin">
                                                                        <span class="input margin-top">
                                                                            <TextField
                                                                                id="PadTop" className='input-field' name='PadTop' label="Top" variant="outlined"
                                                                                value={state.PadTop}
                                                                                onChange={(e) => { handleChange(e) }}
                                                                            />
                                                                        </span>
                                                                        <span class="input margin-right">
                                                                            <TextField
                                                                                id="PadRight" className='input-field' name='PadRight' label="Right" variant="outlined"
                                                                                value={state.PadRight}
                                                                                onChange={(e) => { handleChange(e) }}
                                                                            />
                                                                        </span>
                                                                        <span class="input margin-bottom">
                                                                            <TextField
                                                                                id="PadBottom" className='input-field' name='PadBottom' label="Bottom" variant="outlined"
                                                                                value={state.PadBottom}
                                                                                onChange={(e) => { handleChange(e) }}
                                                                            />
                                                                        </span>
                                                                        <span class="input margin-left">
                                                                            <TextField
                                                                                id="PadLeft" className='input-field' name='PadLeft' label="Left" variant="outlined"
                                                                                value={state.PadLeft}
                                                                                onChange={(e) => { handleChange(e) }}
                                                                            />
                                                                        </span>
                                                                    </div>

                                                                    <div class="element hidden">
                                                                    </div>
                                                                </div> */}
                                                                <p className="row col-lg-12">Padding</p>

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
                                                                    <input type="color" name='Color' defaultValue={'#000000'} value={state.Color} id="colorPicker" onChange={handleChange}></input>

                                                                </div>
                                                                <p className="row col-lg-12">Background</p>
                                                                <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                                    <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

                                                                </div>
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
                                                <Typography className="acdTitle acdswatch">
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Scatterswatch" checked={state.Scatterswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                        <div className="row col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ marginTop: '10px' }}>
                                                            <TextField
                                                                error={formValues.SymbolSize.error}
                                                                helperText={formValues.SymbolSize.error && formValues.SymbolSize.errorMessage}
                                                                id="SymbolSize" className='input-field' name='SymbolSize' label="SymbolSize*" variant="outlined"
                                                                value={state.SymbolSize}
                                                                onChange={(e) => { handleValidation(e); handleChange(e); }} />
                                                        </div>
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
                                                            <input type="color" name='Color' defaultValue={"#000000"} value={state.Color} id="colorPicker" onChange={handleChange}></input>

                                                        </div>
                                                        <p className="row col-lg-12">Background</p>
                                                        <div className="row col-xs-12 col-sm-2 col-md-4 col-lg-3 inputfield">
                                                            <input type="color" name='BGColor' defaultValue={'#ffffff'} value={state.BGColor} id="colorPicker" onChange={handleChange}></input>

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
                                                <Typography className="acdTitle acdswatch">
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Lineswatch" checked={state.Lineswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                        {navbar.bar === 'Charts' &&

                                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                                <p className="row col-lg-12">Padding</p>

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
                                                            </div>
                                                        }
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
                                                <Typography className="acdswatch">
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Seriesswatch" checked={state.Seriesswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                                <p className="row col-lg-12">Padding</p>

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
                                                <Typography className="acdTitle acdswatch" style={{ paddingLeft: '48%' }}>
                                                    <div>
                                                        <label class="switch">
                                                            <input type="checkbox" name="Compositeswatch" checked={state.Compositeswatch_} onChange={handleShowProps}></input>
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography>
                                                    <div className=" col-lg-12" style={{ marginTop: '10px' }}>
                                                        {navbar.bar === 'Charts' &&
                                                            <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                                <p className="row col-lg-12">Padding</p>

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
                                                            </div>
                                                        }
                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        : ''
                                    }
                                    <div className="row col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '10px' }}>
                                        {navbar.bar !== 'Templates' && navbar.bar !== 'Data' ?

                                            <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>

                                                <Button disabled={disable} variant="contained" id="ChartGen" className='input-field button' style={{ backgroundColor: '#6282b3' }} onClick={GenarateChart}>
                                                    Genarate Chart
                                                </Button>
                                            </div>
                                            : ''
                                        }
                                        {state.Chart !== 'Select' && state.Chart !== undefined && navbar.bar !== 'Templates' && flag !== true ?
                                            <div className="row col-sm-4 col-md-12 col-lg-6" style={{ marginTop: '10px' }}>
                                                <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { handleOpen() }}>
                                                    Save Template
                                                </Button>
                                            </div>
                                            : ''
                                        }
                                        {state.Chart !== 'Select' && state.Chart !== undefined && navbar.bar !== 'Templates' && flag === true ?
                                            <>
                                                <div className="row col-sm-4 col-md-12 col-lg-3" style={{ marginTop: '10px' }}>
                                                    <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { saveTemplate('update') }}>
                                                        Update Template
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
                                        {error.mandatoryFields !== undefined &&
                                            <div className="col-xs-3 col-sm-10 col-md-10 col-lg-10" style={{ margin: "15px 0px 15px  0px", padding: 0 }}>
                                                <Alert severity="error">{error.mandatoryFields}</Alert>
                                            </div>
                                        }
                                    </div>

                                    {(navbar.bar === 'Templates') && (enable.Imported || state.Uploaded_file !== undefined) ?
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
                                                                            <RemoveRedEyeIcon id={a} style={{ cursor: 'pointer' }} onClick={handleTemplate} />
                                                                        </BootstrapTooltip>
                                                                    </div>
                                                                    <div className="col-sm-1 col-md-1 col-lg-1">
                                                                        <BootstrapTooltip title="Edit" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                            <EditIcon id={a} style={{ cursor: 'pointer' }} onClick={handleTemplate} />
                                                                        </BootstrapTooltip>
                                                                    </div>
                                                                    <div className="col-sm-1 col-md-1 col-lg-1">
                                                                        <BootstrapTooltip title="Delete" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                                                            <DeleteIcon id={a} style={{ cursor: 'pointer' }} onClick={handleTemplate} />
                                                                        </BootstrapTooltip>
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

                            {!navopen && <div className="nav-inputarea">InputArea</div>}
                        </>

                    </div>
                    <div className="" style={{ backgroundColor: '#e9ecef', height: '87vh', width: navwidth.ChartArea }}>
                        {navbar.bar === 'Data' && state.Uploaded_file !== undefined ?

                            <>
                                <DatasetTable params={state.Uploaded_file} />
                            </>
                            :
                            <Chart />

                        }

                    </div>

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
                                    Enter Name
                                </Typography>
                                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <TextField id="ChartName" style={{ width: '100%' }} className='input-field' name='TempName' label="Template Name" variant="outlined"
                                            // value={state.YAxisLabel}
                                            onChange={handleChange} />
                                    </div>
                                </Typography>
                                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <Button variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', float: 'right' }} onClick={(e) => { saveTemplate('save'); handleClose() }}>
                                            Save
                                        </Button>
                                    </div>
                                </Typography>
                            </Box>
                        </Fade>
                    </Modal>
                </div>
            </div>
        </div >

    )
}
export default HomePage;