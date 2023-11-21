import React, { Fragment, useState, useRef, useEffect } from "react";

//MUI
import "../Styles/Custom.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import { Fade, InputAdornment } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { FormHelperText } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//NPM's
import Papa from "papaparse";
import * as xlsx from "xlsx";
import axios from "axios";
import Swal from "sweetalert2";

//Icons
import ArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Numbers from "@mui/icons-material/Numbers";
import Calendar from "@mui/icons-material/CalendarMonth";
// import Demo from '@mui/icons-material/YouTube';
// import Dashboard from '@mui/icons-material/Dashboard';
import Reload from "@mui/icons-material/Cached";
import Barchart from "@mui/icons-material/BarChart";
import Piechart from "@mui/icons-material/PieChart";
import Linechart from "@mui/icons-material/ShowChart";
import Compositechart from "@mui/icons-material/Leaderboard";
import Scatterplot from "@mui/icons-material/ScatterPlot";
import Barlinechart from "@mui/icons-material/StackedLineChart";
import Serieschart from "@mui/icons-material/MultilineChart";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PeopleIcon from "@mui/icons-material/PeopleOutlineOutlined";
import layout1 from "../../src/Images/layout1.svg";
import layout2 from "../../src/Images/layout2.svg";
import layout3 from "../../src/Images/layout3.svg";
import layout4 from "../../src/Images/layout4.svg";
import layout5 from "../../src/Images/layout5.svg";
import layout6 from "../../src/Images/layout6.svg";
import layout7 from "../../src/Images/layout7.svg";
import layout8 from "../../src/Images/layout8.svg";
import layout9 from "../../src/Images/layout9.svg";
import layout10 from "../../src/Images/layout10.svg";
import layout11 from "../../src/Images/layout11.svg";
import sunburst_chart from "../Images/sunburst-chart.svg";
import layout14 from "../../src/Images/layout14.svg";
import layout15 from "../../src/Images/layout15.svg";

// import Draggable from '../Components/Draggable'

import Data from "../../src/Images/Input-Data.png";
import Project from "../../src/Images/Project.png";
import Dashboard from "../../src/Images/Dashboard.png";
import Template from "../../src/Images/Template.svg";
import Demo from "../../src/Images/Demo.svg";
import Feedback from "../../src/Images/Feedback.svg";
import AdminSettings from "../../src/Images/icon-admin.svg";
import Edit from "../../src/Images/Edit.svg";
import Remove from "../../src/Images/Remove.png";
import Publish from "../../src/Images/Publish.svg";
import Column from "../../src/Images/Column.svg";
import Rows from "../../src/Images/Rows.svg";
import Saved_Templates from "../../src/Images/Saved_Templates.svg";
import Pre_Templates from "../../src/Images/Pre_Templates.svg";
import CardIcon from "../../src/Images/CardIcon.svg";

import Bar from "../../src/Images/Bar-chart.svg";
import Bar_outlined from "../../src/Images/Bar-chart-outlined.svg";
import Pie from "../../src/Images/Pie-chart.svg";
import Line from "../../src/Images/LineIcon.svg";
import Scatter from "../../src/Images/Scatter-chart.svg";
import info from "../../src/Images/icons-info.png";
import { useMyContext } from "../MyContext";
import Dictionary from "../Charts/Dictionary";

const InputArea = ({
  ChildtoParentHandshake,
  ExpandData,
  dataTable,
  demoVideo,
  showDashboard,
  feedback_,
  project_,
  currentPage,
  showCard, // added for card section by franklin
}) => {
  const { message, updateMessage, manageFilter, updateManageFilter } =
    useMyContext();

  // Global variables declaration
  const ChartType = [
    // "Select",
    "Pie Chart",
    "Bar Chart",
    "ScatterPlot",
    "Line Chart",
    "Composite Chart",
    "Series Chart",
    "Bar Line Chart",
    "Sunburst Chart",
  ];
  const Fonts = [
    "Arial",
    "Verdana",
    "Tahoma",
    "Trebuchet",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier",
  ];
  const Group = ["Sales", "Finance", "Marketing", "External"];
  const TooltipContent = ["All", "X", "Y"];
  const LablesContent = ["X", "Y"]; //"Title"
  const GroupByCol = ["Sum", "Count", "Minimum", "Maximum", "Average"];

  // const DataTypes = ['#', 'Da', 'Aa']
  var Type = [];
  var Key_ = [];

  //State declaration
  const [formValues, setFormValues] = React.useState({
    Chart: {
      error: false,
      errorMessage: "Please Select atleast one",
    },
    Heigth_: {
      value: 400,
      error: false,
      errorMessage: "You must enter number",
    },
    Width_: {
      value: 850,
      error: false,
      errorMessage: "You must enter number",
    },
    ExternalRadiusPadding: {
      value: 80,
      error: false,
      errorMessage: "You must enter number",
    },
    Title: {
      error: false,
      errorMessage: "Please enter ",
    },
    Innerradius: {
      value: "",
      error: false,
      errorMessage: "You must enter number",
    },
    SlicesCap: {
      error: false,
      errorMessage: "You must enter number",
    },
    XAxisCopy: {
      error: false,
      errorMessage: "Please Select atleast one",
    },
    YAxisCopy: {
      error: false,
      errorMessage: "Please Select atleast one",
    },
    YAxisPadding: {
      error: false,
      errorMessage: "Please enter",
    },
    SymbolSize: {
      error: false,
      errorMessage: "Please Select atleast one",
    },
    GroupByCopy: {
      error: false,
      errorMessage: "Please Select atleast one",
    },
    InputType: {
      error: false,
      errorMessage: "Please Select atleast one",
    },
    TempName: {
      error: false,
      errorMessage:
        "The given name is already exists, Please provide some other name.",
    },
    DashboardName: {
      error: false,
      errorMessage:
        "The given name is already exists, Please provide some other name.",
    },
    TempDescription: {
      error: false,
      errorMessage:
        "The given name is already exists, Please provide some other name.",
    },
    Category: {
      error: false,
      errorMessage: "Please enter",
    },
    Issue: {
      error: false,
      errorMessage: "Please enter",
    },
    Rows: {
      error: false,
      errorMessage: "Please enter",
      value: 5,
    },
    CardName: {
      error: false,
      errorMessage: "Please enter",
    },
    CardTitle: {
      error: false,
      errorMessage: "Please enter",
    },
    CardValue: {
      error: false,
      errorMessage: "Please enter",
    },
  });
  const [user, setUser] = React.useState({
    userName: sessionStorage.getItem("UserName").split(",")[0],
    userID: sessionStorage.getItem("UserName").split(",")[1],
    Group: sessionStorage.getItem("UserName").split(",")[2],
    Role: sessionStorage.getItem("Role"),
  });
  const [datatype, setDataType] = React.useState({ type: "All" });
  const toPascalCase = (word) => {
    return word
      .split("_") // Split the word by underscores
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter of each part
      .join(""); // Join the parts together without spaces
  };
  const [disable, isDisable] = React.useState(true);
  const [hideTempLayout, setHideTempLayout] = React.useState(false);
  const [error, setError] = React.useState({});
  const [state, setState] = React.useState({
    Chart: "Select",
    XAxisCopy: "Select",
    xFont: "Arial",
    xSize: "12",
    yFont: "Arial",
    ySize: "12",
    YAxisCopy: "Select",
    GroupByCopy: "Select",
    TooltipFont: "Arial",
    TooltipSize: "14",
    LabelsFont: "Arial",
    LabelsSize: "14",
    InputType: "Enter Inputs",
    Heigth_: 280,
    Width_: 850,
    YAxisPadding: "10",
    SlicesCap: 10,
    Innerradius: 10,
    ExternalRadiusPadding: 60,
    SymbolSize: 7,
    TooltipContent: "All",
    TooltipTickColor: "#000000",
    GroupByCol: "Sum",
    Color: "#8495e6",
    SunBurstX_Axis: [],
    LabelsContent: "X",
    TempDescription: "",
    CardLayoutswatch: false,
    userID: sessionStorage.getItem("UserName") !== null && user.userID,
  });

  const [tempState, setTempState] = React.useState(
    JSON.parse(JSON.stringify(state))
  );

  const [enable, setEnable] = React.useState({});
  const [colors, setColors] = React.useState([]);
  const [navbar, setNavbar] = React.useState({
    bar: sessionStorage.getItem("Role") === "Admin" ? "Admin" : "Project",
  });
  const [template, setTemplate] = React.useState({});
  const [dashboard, setDashboard] = React.useState({});
  const [enabletemplate, setEnableTemplate] = React.useState(false);
  const [flag, setFlag] = React.useState(false);
  const [navopen, setNavOpen] = React.useState(
    sessionStorage.getItem("Role") === "Admin" ? false : true
  );
  const [navwidth, setNavWidth] = React.useState(
    sessionStorage.getItem("Role") === "Admin"
      ? { navArea: "70px", inuptArea: "0%", ChartArea: "94%" }
      : {
          navArea: "70px",
          inuptArea: "28%",
          ChartArea: "63%",
        }
  );
  const [isMobile, setIsMobile] = React.useState(false);
  const [open, setOpen] = React.useState({
    Template: false,
    Dashboard: false,
    deleteTemplate: false,
    AxisOrder: false,
    DialogBox: false,
  });
  const [progress, setProgress] = React.useState({ loader: false });
  const [filter, setFilter] = React.useState({});
  const [filteringProps, setfilteringProps] = React.useState({
    customFilter: [],
  });
  const [others, setOthers] = React.useState({
    StaticLayouts: true,
    selectedLayout: "1X2",
    CustomLayouts: false,
    CustomCards: false,
    cardLayout: "",
  });

  const [feedback, setFeedback] = React.useState({
    Categories: [
      "UI",
      "Performance",
      "Dataset",
      "Statistics",
      "Data Dictionary",
      "Template",
      "Dashboard",
      "User Guide",
      "Suggestions",
      "Other",
    ],
    "Reported By":
      sessionStorage.getItem("UserName") !== null &&
      sessionStorage.getItem("UserName").split(",")[0],
  });
  const [feedbackSection, setFeedbackSection] = React.useState([
    "Dataset",
    "Statistics",
    "Data Dictionary",
    "Template",
    "Dashboard",
    "User Guide",
  ]);
  const [feedbackIssue, setIssues] = React.useState(undefined);
  const [dashboardCharts, setdashboardCharts] = React.useState();
  const [projectDetails, setprojectDetails] = React.useState({});
  const [project, setProject] = React.useState({});
  const [assignedProject, setAssignedProject] = React.useState({});
  const [postProject, setpostProject] = React.useState({});
  const [TemplatesCollections, setTemplatesCollections] = React.useState({});
  const [enablesavebutton, setEnablesavebutton] = React.useState(false);
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });
  const [Dataset, setDataset] = React.useState({});
  const [uploaded_fileID, setuploaded_fileID] = useState();
  // React state to track order of items
  const [ItemOrderList, setItemOrderList] = React.useState([]);

  // Data passing
  const [filedata, setData] = React.useState({});
  const [play, setPlay] = React.useState({});
  const [show, setIsshow] = React.useState({});
  // to displays the background color based on click
  const [clickedIndex, setClickedIndex] = React.useState(null);
  const [fileevent, setfileevent] = React.useState(null);

  const [cardCollections, setcardCollections] = React.useState({});

  // handle card data
  const [cardData, setcardData] = useState({
    CardFont: "Arial",
    CardFontSize: 18,
    CardValueColor: "#000000",
    CardValueFont: "Arial",
    CardValueSize: 12,
    cardColor: "#000000",
    GroupByCol: "Sum",
    CardValue: "",
    datasetData: null,
    cardSwatch: false,
    CardTitle: "",
    cardBGColor: "#bbc8dd",
  });

  // custom styles

  const [tempOthers, settempOthers] = React.useState({});

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "black",
      top: 10,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "black",
    },
  }));

  const style = {
    position: "absolute",
    top: "35%",
    left: "50%",
    width: "26%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 5,
    fonts: "12px/13px Poppins",
    borderRadius: "8px",
    boxShadow: "0px 6px 20px #0000001A",
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
  };

  useEffect(() => {
    if (message === "checkGlobalFilter") {
      updateMessage("remove GlobalFilter validate");
      setFilter({ ...filter, filterSwatch: false });
      setfilteringProps({});
    }
  }, [message]);

  useEffect(() => {
    setEnablesavebutton(false);
    currentPage(navbar["bar"]);
  }, [navbar]);

  useEffect(() => {
    showCard(cardData);
  }, [cardData.Generate]);

  useEffect(() => {
    ExpandData(navwidth);
  }, [navwidth]);
  useEffect(() => {
    GenerateChart();
    setError({ mandatoryFields: undefined });
  }, [enabletemplate]);
  useEffect(() => {
    dataTable(filedata);
  }, [filedata]);
  useEffect(() => {
    demoVideo(play);
  }, [play]);
  useEffect(() => {
    showDashboard(show);
  }, [show]);
  useEffect(() => {
    feedback_(feedbackIssue);
  }, [feedbackIssue]);
  useEffect(() => {
    project_(postProject);
  }, [postProject]);

  useEffect(() => {
    GetDashboard();
    getDataSet();
    handleGetUsers();

    const handleResize = () => {
      if (window.innerWidth < 1010) {
        setNavOpen(false);
        setNavWidth({ navArea: "70px", inuptArea: "0%", ChartArea: "94%" });

        setIsMobile(true);
      } else {
        setNavOpen(true);
        setNavWidth({ navArea: "70px", inuptArea: "28%", ChartArea: "63%" });
        setIsMobile(false);
      }
    };

    // window.addEventListener("resize", handleResize);
    return () => {
      //   window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Functions
  const navigate = useNavigate();
  //uploadfile inputRef
  const inputRef = useRef(null);

  //Dataset -Filename check
  const handlefilenameCheck = async (name, event) => {
    try {
      document.querySelector(".loader").style.display = "none";
      const response = await axios.post(
        `http://${path.Location}:${path.Port}/GetCheckDataFile`,
        {
          userID: user.userID,
          filename: name,
        }
      );

      if (response.data.length !== 0) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This filename already exists. Would you like to save it with a different name or replace?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Save As",
          denyButtonText: "Replace",
        });

        if (result.isConfirmed) {
          const newFileName = await Swal.fire({
            title: "Please submit your new file name without extension.",
            input: "text",
            inputAttributes: {
              autocapitalize: "off",
            },
            showCancelButton: true,
            confirmButtonText: "Save",
            showLoaderOnConfirm: true,
            preConfirm: async (fileName) => {
              // You can perform additional validation here if needed
              const fileNameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
              const fileExtension = event.target.files[0].name.split(".").pop();
              const Altername = fileNameWithoutExtension + "." + fileExtension;
              if (fileNameWithoutExtension === "") {
                Swal.showValidationMessage("File name should not be empty");
              } else {
                const response = await axios.post(
                  `http://${path.Location}:${path.Port}/GetCheckDataFile`,
                  {
                    userID: user.userID,
                    filename: Altername,
                  }
                );
                if (response.data.length !== 0) {
                  // Display a custom error message
                  Swal.showValidationMessage("File name already exists");
                } else {
                  await postDataSetRevamp(name, event, Altername, "");
                }
              }
            },
            allowOutsideClick: () => !Swal.isLoading(),
          });

          if (newFileName.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "The new file name has been Saved",
            });
            inputRef.current.value = "";
          } else {
            return true;
          }
        } else if (result.isDenied) {
          const idResponse = await axios.post(
            `http://${path.Location}:${path.Port}/GetIDDataSet`,
            {
              userID: user.userID,
              id: name,
            }
          );
          const newid = idResponse.data[0]._id;
          await postDataSetRevamp(name, event, name, newid, "Update");

          Swal.fire("The file name has been Replaced");
          inputRef.current.value = "";
          document.querySelector(".loader").style.display = "none";
          return;
        } else if (result.isDismissed) {
          return true; // Return true for the dismissed case
        } else {
          inputRef.current.value = "";
          resetScreen();
          handleNavbarChange("");
        }
      } else {
        return; // Return undefined for the case when there's no data
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle any errors that may occur during the async operations here
      // You can throw an error or return a specific value as needed
    }
  };

  // Function to check all layouts are filled in Dashboard Menu (Save Button)
  const checkLayoutSave = () => {
    let layoutCheck = sessionStorage.getItem("IDs");
    let sum = 0;

    if (tempOthers.CustomLayouts === true) {
      sum = Object.values(tempOthers.Cols).reduce(
        (acc, currentValue) => acc + parseFloat(currentValue),
        0
      );
    } else {
      if (tempOthers.selectedLayout === undefined) {
        Swal.fire({
          icon: "error",
          title: "Layouts should not be empty.",
        });
        return false;
      }
      let temp = tempOthers.selectedLayout.split("X");
      sum = temp.reduce(
        (acc, currentValue) => acc + parseFloat(currentValue),
        0
      );
    }

    if (layoutCheck === "{}") {
      Swal.fire({
        icon: "error",
        title: "Layouts should not be empty.",
      });
      return false;
    } else if (Object.keys(JSON.parse(sessionStorage.IDs)).length !== sum) {
      Swal.fire({
        icon: "error",
        title: "Please fill all layouts.",
      });
      return false;
    } else {
      return true;
    }
  };

  // Function to check all layouts are filled in Project Menu (Update Button)
  const checkLayoutUpdate = () => {
    let layoutCheck = sessionStorage.getItem("IDs");
    let sum = 0;

    if (others.CustomLayouts === true) {
      sum = Object.values(others.Cols).reduce(
        (acc, currentValue) => acc + parseFloat(currentValue),
        0
      );
    } else {
      let temp = others.selectedLayout.split("X");
      sum = temp.reduce(
        (acc, currentValue) => acc + parseFloat(currentValue),
        0
      );
    }

    if (layoutCheck === "{}") {
      Swal.fire({
        icon: "error",
        title: "Layouts should not be empty.",
      });
      return false;
    } else if (Object.keys(JSON.parse(sessionStorage.IDs)).length !== sum) {
      Swal.fire({
        icon: "error",
        title: "Please fill all layouts.",
      });
      return false;
    } else {
      return true;
    }
  };

  const checkLayoutPreview = () => {
    let layoutCheck = sessionStorage.getItem("IDs");
    let sum = 0;

    if (others.CustomLayouts === true) {
      sum = Object.values(others.Cols).reduce(
        (acc, currentValue) => acc + parseFloat(currentValue),
        0
      );
    } else {
      let temp = others.selectedLayout.split("X");
      sum = temp.reduce(
        (acc, currentValue) => acc + parseFloat(currentValue),
        0
      );
    }

    if (layoutCheck === "{}") {
      Swal.fire({
        icon: "error",
        title: "Layouts should not be empty.",
      });
      return false;
    } else if (!Object.keys(JSON.parse(sessionStorage.IDs)).length) {
      // setOpen({ Dashboard: true });

      Swal.fire({
        icon: "error",
        title: "Please fill all layouts.",
      });
      return false;
    } else {
      return true;
    }
  };

  //Every fields onChange for store the inputs
  const handleChange = async (event) => {
    setfileevent(event);
    setEnablesavebutton(false);
    if (event.target.name === "file") {
      document.querySelector(".loader").style.display = "block";
      if (event.target.files[0] === undefined) {
        setState({
          ...state,
          Uploaded_file: undefined,
          XAxis_: "",
          YAxis_: "",
        });
        document.querySelector(".loader").style.display = "none";
      } else {
        setState(tempState);
        sessionStorage.setItem("uploadfilename", "");
        sessionStorage.setItem("uploadfilename", event.target.files[0].name);
        const result = await handlefilenameCheck(
          event.target.files[0].name,
          event
        );

        if (result) {
          inputRef.current.value = "";
          return;
        }
        setEnablesavebutton(true);
        if (event.target.files[0].type === "text/csv") {
          Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              if (results.data[0] === undefined || results.data[0] === null) {
                Swal.fire({
                  icon: "error",
                  title: "No data detected in the file.",
                });
                inputRef.current.value = "";
                return;
              } else if (
                Object.keys(results.data[0]).length !==
                Object.keys(results.data[0])
                  .map((value) => value.trim())
                  .filter(Boolean).length
              ) {
                Swal.fire({
                  icon: "error",
                  title: "Please upload a vaild file",
                });
                inputRef.current.value = "";
                return;
              }

              setError({ invalidFile: undefined });
              //
              // ChildtoParentHandshake(state, enable, navbar, {
              //   newArray: newArray,
              //   Uploaded_file: results.data,
              // });
              // setfilteringProps({ ...filteringProps, Dimensions: newArray });
              // setData({ data: results.data }); // commented by fraklin for statistic
              setIssues(undefined);
              postDataSet(event.target.files[0].name, results.data);
              inputRef.current.value = ""; // To reset the upload area after uploading
            },
          });
        } else if (event.target.files[0].type === "application/json") {
          let filename = event.target.files[0].name;
          const reader = new FileReader();
          let fileName = event.target.files[0].name;
          reader.onload = async (e) => {
            try {
              var data = JSON.parse(e.target.result);
              var Type = [];
              var Key_ = [];
              if (data[0] === undefined || data[0] === null) {
                Swal.fire({
                  icon: "error",
                  title: "No data detected in the file.",
                });
                inputRef.current.value = "";
                return;
              } else if (
                Object.keys(data[0]).length !==
                Object.keys(data[0])
                  .map((value) => value.trim())
                  .filter(Boolean).length
              ) {
                Swal.fire({
                  icon: "error",
                  title: "Please upload a vaild file",
                });
                inputRef.current.value = "";
                return;
              }

              setError({ invalidFile: undefined });
              // setData({ data: data }); // commented by fraklin for statistic
              setIssues(undefined);
              // ChildtoParentHandshake(state, enable, navbar, {
              //   newArray: newArray,
              //   Uploaded_file: data,
              // });
              postDataSet(filename, data);
              // postDataSet(event.target.files[0].name, results.data);
            } catch (error) {
              if (data === undefined || data === null) {
                Swal.fire({
                  icon: "error",
                  title: "No data detected in the file.",
                });
                inputRef.current.value = "";
                return;
              } else if (
                Object.keys(data).length !==
                Object.keys(data)
                  .map((value) => value.trim())
                  .filter(Boolean).length
              ) {
                Swal.fire({
                  icon: "error",
                  title: "Please upload a vaild file",
                });
                inputRef.current.value = "";
                return;
              }
              setError({
                invalidFile:
                  "There is s problem with the file, Please check and Try again !!!",
              });

              // document.querySelector(".loader").style.display = "none";
            }
          };
          reader.readAsText(event.target.files[0]);
          inputRef.current.value = ""; // To reset the upload area after uploading
        } else if (
          event.target.files[0].type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          event.target.files[0].type === "application/vnd.ms-excel"
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, {
              type: "array",
              cellText: true,
              cellDates: true,
              dateNF: "dd-mm-yyyy", // Override default date format
            });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(worksheet, { raw: false }); // Use raw: false to keep dates as formatted strings
            var Type = [];
            var Key_ = [];
            if (json[0] === undefined || json[0] === null) {
              Swal.fire({
                icon: "error",
                title: "No data detected in the file.",
              });
              inputRef.current.value = "";
              return;
            } else if (
              Object.keys(json[0]).includes("__EMPTY") ||
              Object.keys(json[0]).length !==
                Object.keys(json[0])
                  .map((value) => value.trim())
                  .filter(Boolean).length
            ) {
              Swal.fire({
                icon: "error",
                title: "Please upload a vaild file",
              });
              inputRef.current.value = "";
              return;
            }

            setError({ invalidFile: undefined });
            // setData({ data: json }); // commented by fraklin for statistic
            setIssues(undefined);
            // ChildtoParentHandshake(state, enable, navbar, {
            //   newArray: newArray,
            //   Uploaded_file: json,
            // });
            postDataSet(event.target.files[0].name, json);
          };
          reader.readAsArrayBuffer(event.target.files[0]);
        } else {
          Swal.fire("Only Excel, JSON, and CSV formats are accepted");
          inputRef.current.value = "";
          setState({
            ...state,
            Uploaded_file: undefined,
            XAxis_: "",
            YAxis_: "",
          });
          document.querySelector(".loader").style.display = "none";
          return;
        }
      }
      setFilter({ ...filter, filterSwatch: false });
      setFlag(false);
    } else if (event.target.name === "colors") {
      const {
        target: { value },
      } = event;
      setColors(typeof value === "string" ? value.split(",") : value);
    } else if (event.target.name === "GroupByCopy") {
      var value = "";
      value = event.target.value.split(" ");
      if (value.length > 1) value = value.slice(1, 30).join(" ");
      else value = event.target.value;
      const unique = [
        ...new Set(state.Uploaded_file.map((item) => item[value])),
      ];
      setState({
        ...state,
        GroupBy: value,
        GroupByValues: unique,
        [event.target.name]: event.target.value,
      });
      setFormValues({
        ...formValues,
        GroupByCopy: {
          ...formValues["GroupByCopy"],
          error: false,
          errorMessage: ``,
        },
      });
      setError({ mandatoryFields: undefined });
    } else if (event.target.name === "InputType") {
      setState({ ...state, [event.target.name]: event.target.value });
    } else if (event.target.name === "Title") {
      setState({
        ...state,
        [event.target.name]: event.target.value,
        TitleFont: "Arial",
        TitleSize: 18,
        TitleColor: "#000000",
      });
    } else if (event.target.name === "XAxisLabel") {
      setState({
        ...state,
        [event.target.name]: event.target.value,
        xlFont: "Arial",
        xlSize: 14,
        xlColor: "#000000",
      });
    } else if (event.target.name === "YAxisLabel") {
      setState({
        ...state,
        [event.target.name]: event.target.value,
        ylFont: "Arial",
        ylSize: 14,
        ylColor: "#000000",
      });
    } else if (event.target.name === "RYAxisLabel") {
      setState({
        ...state,
        [event.target.name]: event.target.value,
        rylFont: "Arial",
        rylSize: 14,
        rylColor: "#000000",
      });
    } else if (event.target.name === "XAxisCopy") {
      var value = "";
      value = event.target.value.split(" ");
      if (value.length > 1) value = value.slice(1, 30).join(" ");
      else value = event.target.value;
      setState({
        ...state,
        XAxis: value,
        [event.target.name]: event.target.value,
      });
      setFormValues({
        ...formValues,
        XAxisCopy: {
          ...formValues["XAxisCopy"],
          error: false,
          errorMessage: ``,
        },
      });
    } else if (event.target.name === "YAxisCopy") {
      var value = "";
      value = event.target.value.split(" ");
      if (value.length > 1) value = value.slice(1, 30).join(" ");
      else value = event.target.value;
      setState({
        ...state,
        YAxis: value,
        [event.target.name]: event.target.value,
      });
      setFormValues({
        ...formValues,
        YAxisCopy: {
          ...formValues["YAxisCopy"],
          error: false,
          errorMessage: `Please select`,
        },
      });
    } else {
      setState({ ...state, [event.target.name]: event.target.value });
    }
    setEnable({
      ...enable,
      Piechart: false,
      Barchart: false,
      Scatter: false,
      Linechart: false,
      Compositechart: false,
      Serieschart: false,
      Barlinechart: false,
    });
    setError({ mandatoryFields: undefined });

    if (event.target.name === "Chart") {
      let Chart = event.target.value;
      if (uploaded_fileID !== null && uploaded_fileID !== undefined) {
        try {
          axios
            .post(`http://${path.Location}:${path.Port}/getDatasetDetails`, {
              userID: user.userID,
              id: uploaded_fileID,
            })
            .then((res) => {
              if (res.status === 200) {
                let result = res.data[0];
                let dataType = [];
                dataType = result.datatype[0].map((val, i) => {
                  return val.split(" ")[0] + " " + result.displaynames[0][i];
                });
                setState({
                  ...state,
                  Uploaded_fileID: result["_id"],
                  Uploaded_file: state["Uploaded_file"], //rename,
                  CheckType: dataType,
                  Chart: Chart,
                  XAxis_: [],
                  YAxis_: [],
                  GroupByCopy_: [],
                  TempName: "",
                  Axesswatch_: false,
                  Titleswatch_: false,
                  Legendswatch_: false,
                  Tooltipswatch_: false,
                  Labelsswatch_: false,
                  Pieswatch_: false,
                  Barswatch_: false,
                  Scatterswatch_: false,
                  Seriesswatch_: false,
                  Compositeswatch_: false,
                  BarLineswatch_: false,
                });
              }
            });
        } catch (error) {
          console.log("error in getDatasetDetails", error);
        }
      } else {
        showValidAxis(event.target.value);
      }
    }
  };

  useEffect(() => {
    if (uploaded_fileID !== null && uploaded_fileID !== undefined) {
      setuploaded_fileID(undefined);
      showValidAxis(state.Chart);
    }
  }, [state.CheckType]);

  // to change the background color based on user click
  const handleBackgroundChange = (index) => {
    setClickedIndex(index);
  };

  const resetMandatoryFields = () => {
    setFormValues((prevState) => ({
      ...prevState,
      Chart: {
        error: false,
        errorMessage: "Please Select atleast one",
      },
      Heigth_: {
        value: 400,
        error: false,
        errorMessage: "You must enter number",
      },
      Width_: {
        value: 850,
        error: false,
        errorMessage: "You must enter number",
      },
      ExternalRadiusPadding: {
        value: 80,
        error: false,
        errorMessage: "You must enter number",
      },
      Innerradius: {
        value: "",
        error: false,
        errorMessage: "You must enter number",
      },
      SlicesCap: {
        error: false,
        errorMessage: "You must enter number",
      },
      XAxisCopy: {
        error: false,
        errorMessage: "Please Select atleast one",
      },
      YAxisCopy: {
        error: false,
        errorMessage: "Please Select atleast one",
      },
      SymbolSize: {
        error: false,
        errorMessage: "Please Select atleast one",
      },
      GroupByCopy: {
        error: false,
        errorMessage: "Please Select atleast one",
      },
      Category: {
        error: false,
        errorMessage: "Please enter",
      },
      Issue: {
        error: false,
        errorMessage: "Please enter",
      },
    }));
    setError({ mandatoryFields: undefined });
  };

  //Validations
  const handleValidation = (event) => {
    const numberValues = [
      "ExternalRadiusPadding",
      "Heigth_",
      "Width_",
      "Innerradius",
      "SlicesCap",
      "YAxisPadding",
      "SymbolSize",
      "Rows",
      "NOCharts",
    ];
    const mandatoryFields = [
      "Chart",
      "InputType",
      "ExternalRadiusPadding",
      "Innerradius",
      "Heigth_",
      "Width_",
      "SlicesCap",
      "XAxisCopy",
      "YAxisCopy",
      "YAxisPadding",
      "SymbolSize",
      "GroupByCopy",
      "Category",
      "Issue",
    ];
    var CheckType = "";
    var CheckType_ = "";

    if (mandatoryFields.indexOf(event.target.name) !== -1) {
      if (
        event.target.value === undefined ||
        event.target.value === "Select" ||
        event.target.value.trim().length === 0
      ) {
        setFormValues({
          ...formValues,
          [event.target.name]: {
            ...formValues[event.target.name],
            error: true,
            errorMessage: "Please enter",
          },
        });
        return;
      } else {
        setFormValues({
          ...formValues,
          [event.target.name]: {
            ...formValues[event.target.name],
            error: false,
          },
        });
        isDisable(false);
      }
    }
    if (
      numberValues.indexOf(event.target.id) !== -1 ||
      numberValues.indexOf(event.target.id) !== -1
    ) {
      if (isNaN(event.target.value)) {
        setFormValues({
          ...formValues,
          [event.target.name]: {
            ...formValues[event.target.name],
            error: true,
            errorMessage: "Please enter number",
          },
        });
      } else if (event.target.name === "Rows") {
        var value = formValues[event.target.name].value;
        if (parseInt(event.target.value) >= value) {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: "The value should be less than " + value,
            },
          });
          setError({ ...error, Disable: true });
        } else if (event.target.value === "0") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: "The value should not be more than 0 ",
            },
          });
          setError({ ...error, Disable: true });
        } else if (event.target.value === "") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: "The value should not be Empty ",
            },
          });

          setError({ ...error, Disable: true });
        } else if (
          parseInt(event.target.value) === null ||
          parseInt(event.target.value) === undefined
        ) {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: "Please provide valid number between 1 to 4",
            },
          });
          setError({ ...error, Disable: true });
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
            },
          });
          others["Cols"] && setError({ ...error, Disable: true });
        }
      } else if (event.target.id === "NOCharts") {
        if (
          event.target.value > 3 ||
          event.target.value === "" ||
          parseInt(event.target.value) === undefined ||
          parseInt(event.target.value) === null ||
          parseInt(event.target.value) === 0
        ) {
          setError({ ...error, Disable: true });
        } else {
          if (
            parseInt(others.Rows) ===
            Object.values(others["Cols"] || {}).filter((val) => val).length
          )
            setError({ ...error, Disable: false });
        }
      } else if (
        event.target.name === "Heigth_" ||
        event.target.name === "Width_" ||
        event.target.name === "ExternalRadiusPadding"
      ) {
        var value = formValues[event.target.name].value;
        if (event.target.value > value) {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: "The value should be less than " + value,
            },
          });
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
            },
          });
          isDisable(false);
        }
      } else {
        setFormValues({
          ...formValues,
          [event.target.name]: {
            ...formValues[event.target.name],
            error: false,
          },
        });
        isDisable(false);
      }
    }

    if (state.Chart === "ScatterPlot") {
      if (
        event.target.name === "XAxisCopy" ||
        event.target.name === "YAxisCopy"
      ) {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Integer";
        if (CheckType !== "#") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
          return;
        }
      } else {
        setFormValues({
          ...formValues,
          [event.target.name]: {
            ...formValues[event.target.name],
            error: false,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
      }
    } else if (state.Chart === "Line Chart") {
      if (event.target.name === "YAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Integer";
        if (CheckType !== "#") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      } else if (event.target.name === "XAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Date";
        if (CheckType === "Da") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select other than ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      }
    } else if (state.Chart === "Series Chart") {
      if (event.target.name === "XAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Date";
        if (CheckType === "Da") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
          return;
        }
      } else if (event.target.name === "YAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Integer";
        if (CheckType !== "#") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      } else if (event.target.name === "GroupByCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Date";
        if (CheckType === "Da") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select other than ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      }
    } else if (state.Chart === "Composite Chart") {
      if (event.target.name === "XAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Date";
        if (CheckType === "Da") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select other than ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      } else if (event.target.name === "YAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Integer";
        if (CheckType !== "#") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      } else if (event.target.name === "GroupByCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "String";
        if (CheckType !== "Aa") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      }
    } else if (
      state.Chart === "Bar Chart" ||
      state.Chart === "Pie Chart" ||
      state.Chart === "Sunburst Chart"
    ) {
      if (event.target.name === "XAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Date";
        if (CheckType === "Da") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select other than ${CheckType_}`,
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      } else if (event.target.name === "YAxisCopy") {
        CheckType = event.target.value.split(" ").splice(0, 1)[0];
        CheckType_ = "Integer";
        if (CheckType !== "#" && state.YAxisCopy !== "Select") {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: true,
              errorMessage: `Please select ${CheckType_}`,
            },
          });

          return;
        } else {
          setFormValues({
            ...formValues,
            [event.target.name]: {
              ...formValues[event.target.name],
              error: false,
              errorMessage: `Please select ${CheckType_}`,
            },
          });
        }
      } else if (event.target.name === "SunBurstX_Axis") {
        if (event.target.value.length === 0) {
          setFormValues({
            ...formValues,
            XAxisCopy: {
              ...formValues["XAxisCopy"],
              error: true,
              errorMessage: `Please select the X-Axis`,
            },
          });
          setError({ mandatoryFields: "Please fill all mandatory fields" });
          return;
        } else {
          setFormValues({
            ...formValues,
            XAxisCopy: {
              ...formValues["XAxisCopy"],
              error: false,
              errorMessage: ``,
            },
          });
          setError({ mandatoryFields: undefined });
        }
      }
    }

    if (event.target.name === "TempName") {
      if (
        state.TempName === undefined ||
        state.TempName.trim().length === 0 ||
        state.TempName === null
      ) {
        setFormValues({
          ...formValues,
          TempName: {
            ...formValues.TempName,
            error: false,
            errorMessage: "Template Name should not be empty",
          },
        });
        return;
      } else {
        setFormValues({
          ...formValues,
          TempName: { ...formValues.TempName, error: false, errorMessage: "" },
        });
      }
    }
    if (event.target.name === "DashboardName") {
      if (
        event.target.value === undefined ||
        event.target.value.trim().length === 0 ||
        event.target.value === null
      ) {
        setFormValues({
          ...formValues,
          DashboardName: {
            ...formValues.DashboardName,
            error: true,
            errorMessage: "Dashboard Name should not be empty",
          },
        });
        return;
      } else {
        setFormValues({
          ...formValues,
          DashboardName: {
            ...formValues.DashboardName,
            error: false,
            errorMessage: "",
          },
        });
      }
    }
    // if(event.target.name === 'TempDescription'){
    //   if (
    //     state.TempDescription === undefined ||
    //     state.TempDescription === "" ||
    //     state.TempDescription === null
    //   ) {
    //     setFormValues({
    //       ...formValues,
    //       TempDescription: {
    //         ...formValues.TempDescription,
    //         error: true,
    //         errorMessage: "Description should not be empty",
    //       },
    //     });
    //     // setTempError({ ...tempError, Disable: true });
    //     return;
    //   }
    // }else{
    //   setFormValues({
    //     ...formValues,
    //     TempName: { ...formValues.TempName, error: false, errorMessage: "" },
    //   });
    //   // setTempError({ ...tempError, Disable: false });
    // }
  };
  //Chart generation
  const GenerateChart = () => {
    let CheckTypeXAxis = "";
    let CheckTypeYAxis = "";
    let CheckTypeGroupBy = "";
    let CheckType_ = "";

    // To check axis cols
    if (state.XAxisCopy !== undefined)
      CheckTypeXAxis = state.XAxisCopy.split(" ").splice(0, 1)[0];
    if (state.YAxisCopy !== undefined)
      CheckTypeYAxis = state.YAxisCopy.split(" ").splice(0, 1)[0];

    if (
      state.Chart === "Bar Chart" ||
      state.Chart === "Pie Chart" ||
      state.Chart === "Composite Chart" ||
      state.Chart === "Line Chart" ||
      state.Chart === "Bar Line Chart"
    ) {
      if (CheckTypeXAxis === "Da" || CheckTypeXAxis === "Select") {
        CheckType_ = "Date";
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: true,
            errorMessage:
              CheckTypeXAxis === "Select"
                ? `Please select the XAxis`
                : `Please select other than ${CheckType_}`,
          },
        });
        if (CheckTypeXAxis === "Da") {
          setError({
            mandatoryFields: `Please select other than ${CheckType_} in the XAxis`,
          });
        }
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else if (
        CheckTypeYAxis !== "#" &&
        CheckTypeYAxis !== "" &&
        CheckTypeYAxis !== "Select"
      ) {
        CheckType_ = "Integer";
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
      } else if (CheckTypeYAxis === "Select") {
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: true,
            errorMessage:
              CheckTypeYAxis === "Select"
                ? `Please select the YAxis`
                : `Please select other than ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else {
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: false,
            errorMessage: `Please select other than ${CheckType_}`,
          },
        });
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: false,
            errorMessage: `Please select  ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    } else if (state.Chart === "Composite Chart") {
      CheckTypeGroupBy = state.GroupByCopy.split(" ").splice(0, 1)[0];
      if (CheckTypeGroupBy !== "Aa") {
        CheckType_ = "String";
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else {
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: false,
            errorMessage: ``,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    } else if (state.Chart === "Series Chart") {
      if (state.GroupByCopy !== undefined)
        CheckTypeGroupBy = state.GroupByCopy.split(" ").splice(0, 1)[0];
      if (CheckTypeXAxis !== "Da") {
        CheckType_ = "Date";
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else if (CheckTypeYAxis !== "#") {
        CheckType_ = "Integer";
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
      }
      if (CheckTypeGroupBy === "Da") {
        CheckType_ = "Date";
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else {
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: false,
            errorMessage: `Please select other than ${CheckType_}`,
          },
        });
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: false,
            errorMessage: `Please select other than ${CheckType_}`,
          },
        });
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: false,
            errorMessage: `Please select  ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    } else if (state.Chart === "ScatterPlot") {
      CheckType_ = "Integer";
      if (CheckTypeXAxis === "#")
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: false,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
      else {
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      }
      if (CheckTypeYAxis === "#") {
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: false,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: undefined });
      } else {
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: true,
            errorMessage: `Please select ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      }
    } else if (state.Chart === "Sunburst Chart") {
      if (state.SunBurstX_Axis.length === 0) {
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: true,
            errorMessage: `Please select the XAxis`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else if (CheckTypeYAxis === "Select") {
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: true,
            errorMessage:
              CheckTypeYAxis === "Select"
                ? `Please select the YAxis`
                : `Please select other than ${CheckType_}`,
          },
        });
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else {
        setFormValues({
          ...formValues,
          XAxisCopy: {
            ...formValues["XAxisCopy"],
            error: false,
            errorMessage: ``,
          },
        });
        setFormValues({
          ...formValues,
          YAxisCopy: {
            ...formValues["YAxisCopy"],
            error: false,
            errorMessage: ``,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    } else if (state.Chart === "Bar Line Chart") {
      if (
        state.GroupBy === undefined ||
        state.GroupBy.trim().length === 0 ||
        state.GroupBy === "Select"
      ) {
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: true,
            errorMessage: `Please select the Group By`,
          },
        });
        return;
      } else {
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: false,
            errorMessage: ``,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    }

    const Common = ["Chart", "Heigth_", "Width_", "XAxisCopy"];
    const Pie = ["ExternalRadiusPadding", "Innerradius", "SlicesCap"];

    //var MissedFields = []
    for (let i = 0; i < Common.length; i++) {
      if (
        (state[Common[i]] === undefined ||
          state[Common[i]] === "" ||
          state[Common[i]] === "Select") &&
        state.Chart !== "Sunburst Chart"
      ) {
        if (Common[i] === "Width_") Common[i] = "Width";
        if (Common[i] === "Heigth_") Common[i] = "Heigth";
        if (Common[i] === "XAxisCopy") Common[i] = "XAxis";
        setError({ mandatoryFields: `Please fill the ${Common[i]} field` });
        return;
      } else {
        setError({ mandatoryFields: undefined });
      }
    }
    if (state.Chart === "Composite Chart" || state.Chart === "Series Chart") {
      if (
        state.GroupBy === undefined ||
        state.GroupBy === "" ||
        state.GroupBy === "Select"
      ) {
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: true,
            errorMessage: `Please select the Group By`,
          },
        });
        return;
      } else {
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: false,
            errorMessage: ``,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    } else if (state.Chart === "Bar Line Chart") {
      if (
        state.GroupBy === undefined ||
        state.GroupBy.trim().length === 0 ||
        state.GroupBy === "Select"
      ) {
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: true,
            errorMessage: `Please select the Group By`,
          },
        });
        return;
      } else {
        setFormValues({
          ...formValues,
          GroupByCopy: {
            ...formValues["GroupByCopy"],
            error: false,
            errorMessage: ``,
          },
        });
        setError({ mandatoryFields: undefined });
      }
    }

    if (state.Chart === "Bar Chart") {
      if (state.YAxisPadding === undefined) {
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else {
        setError({ mandatoryFields: undefined });
        setEnable({ Barchart: true });
      }
    } else if (state.Chart === "Pie Chart") {
      for (let i = 0; i < Pie.length; i++) {
        if (state[Pie[i]] === undefined || state[Pie[i]] === "") {
          setError({ mandatoryFields: "Please fill all mandatory fields" });
          return;
        } else {
          setError({ mandatoryFields: undefined });
          setEnable({ Piechart: true });
        }
      }
    } else if (state.Chart === "ScatterPlot") {
      if (state.SymbolSize === undefined || state.SymbolSize === "") {
        setError({ mandatoryFields: "Please fill all mandatory fields" });
        return;
      } else {
        setError({ mandatoryFields: undefined });
        setEnable({ Scatter: true });
      }
    } else if (state.Chart === "Line Chart") {
      setEnable({ Linechart: true });
    } else if (state.Chart === "Composite Chart") {
      setEnable({ Compositechart: true });
    } else if (state.Chart === "Series Chart") {
      setEnable({ Serieschart: true });
    } else if (state.Chart === "Bar Line Chart") {
      setEnable({ Barlinechart: true });
    } else if (state.Chart === "Sunburst Chart") {
      setEnable({ Barlinechart: true });
    }
    setData({ data: undefined });

    ChildtoParentHandshake(state, enable, navbar, {
      newArray: state.XAxis_,
      Uploaded_file: state.Uploaded_file,
    });
    dataTable(filedata);
    setPlay({ isPlay: undefined });
    setIsshow({ isShow: undefined });
    setIssues(undefined);
    setTimeout(() => {
      document.querySelector(".loader").style.display = "none";
    }, 100);
  };

  //Import input process
  const importInputs = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var data = JSON.parse(e.target.result);
      if (data["Chart"] !== undefined) {
        // document.querySelector('.loader').style.display = 'block';
        setState(data);
        setNavbar({ bar: "Charts" });
        ChildtoParentHandshake(data, enable, navbar, {
          newArray: data.XAxis_,
          Uploaded_file: data.Uploaded_file,
        });
        isDisable(false);
        setError({ invalidInputs: undefined });
        setEnable({
          ...enable,
          Piechart: false,
          Barchart: false,
          Scatter: false,
          Linechart: false,
          Compositechart: false,
          Imported: true,
        });
      } else {
        setError({
          invalidInputs:
            "Invalid Input, Please check the file and Try again !!!",
        });
        setEnable({ ...enable, Imported: false });
      }
    };
    reader.readAsText(event.target.files[0]);
    //  }
  };

  //Save Data..F
  // const SaveData = (event, action) => {
  //   try {
  //     if (action === "Insert") {
  //       axios
  //         .post(`http://${path.Location}:${path.Port}/GetChartsSrc`, {
  //           userID: user.userID,
  //           filename: sessionStorage.getItem("uploadfilename"),
  //         })
  //         .then((response) => {
  //           if (response.data.length > 0) {
  //             Swal.fire({
  //               title: "Are you sure?",
  //               text: "This filename already exists. Would you like to save it with a different name?",
  //               icon: "warning",
  //               showCancelButton: true,
  //               confirmButtonColor: "#3085d6",
  //               cancelButtonColor: "#d33",
  //               confirmButtonText: "Yes",
  //             }).then((result) => {
  //               if (result.isConfirmed) {
  //                 Swal.fire({
  //                   title: "Please submit your new file name.",
  //                   input: "text",
  //                   inputAttributes: {
  //                     autocapitalize: "off",
  //                   },
  //                   showCancelButton: true,
  //                   confirmButtonText: "Save",
  //                   showLoaderOnConfirm: true,
  //                   preConfirm: (login) => {},
  //                   allowOutsideClick: () => !Swal.isLoading(),
  //                 }).then((result) => {
  //                   if (result.isConfirmed) {
  //                     axios
  //                       .post(
  //                         `http://${path.Location}:${path.Port}/DeleteTemplate`,
  //                         {
  //                           SrcName: sessionStorage.getItem("uploadfilename"),
  //                           userID: user.userID,
  //                         }
  //                       )
  //                       .then((response) => {
  //                         state.SrcName = result.value;
  //                         axios
  //                           .post(
  //                             `http://${path.Location}:${path.Port}/InsertTemplate`,
  //                             state
  //                           )
  //                           .then((response) => {
  //                             Swal.fire("Your Data has been Updated");
  //                           })
  //                           .catch((error) => {
  //                             console.log(error);
  //                           });
  //                       });
  //                   }
  //                 });
  //               } else {
  //                 //Deletion of Existing file data and Inserting new Data
  //                 axios
  //                   .post(
  //                     `http://${path.Location}:${path.Port}/DeleteTemplate`,
  //                     {
  //                       SrcName: sessionStorage.getItem("uploadfilename"),
  //                       userID: user.userID,
  //                     }
  //                   )
  //                   .then((response) => {
  //                     state.SrcName = sessionStorage.getItem("uploadfilename");
  //                     axios
  //                       .post(
  //                         `http://${path.Location}:${path.Port}/InsertTemplate`,
  //                         state
  //                       )
  //                       .then((response) => {
  //                         Swal.fire("Your Data has been Updated");
  //                       })
  //                       .catch((error) => {
  //                         console.log(error);
  //                       });
  //                   });
  //               }
  //             });
  //           } else if (response.data.length == 0) {
  //             //Newly insert the file to DB..
  //             const Result = state;
  //             Result.SrcName = sessionStorage.getItem("uploadfilename");
  //             delete Result._id;
  //             axios
  //               .post(
  //                 `http://${path.Location}:${path.Port}/InsertTemplate`,
  //                 Result
  //               )
  //               .then((response) => {
  //                 Swal.fire("Your Data has been Saved");
  //               })
  //               .catch((error) => {
  //                 console.log(error);
  //               });
  //           }
  //         });
  //     }
  //   } catch (error) {
  //     console.log("error", error.message);
  //   }
  // };

  // Sidebar navigation
  const handleNavbarChange = (event) => {
    var data = event.target.name;
    resetScreen();
    if (data === "Admin") {
      setNavOpen(false);
      setNavWidth({ navArea: "70px", inuptArea: "0%", ChartArea: "94%" });
    } else {
      setNavOpen(true);
      setNavWidth({ navArea: "70px", inuptArea: "28%", ChartArea: "63%" });
    }
    setNavbar({ bar: data });
  };
  //property enabling for the swatch
  const handleShowProps = (e) => {
    e.stopPropagation();
    setEnable({
      ...enable,
      Piechart: false,
      Barchart: false,
      Scatter: false,
      Linechart: false,
      Compositechart: false,
      Serieschart: false,
      Barlinechart: false,
    });
    var value = "";
    if (
      e.target.name === "Titleswatch" ||
      e.target.name === "Axesswatch" ||
      e.target.name === "Legendswatch" ||
      e.target.name === "Labelsswatch"
    ) {
      if (e.target.checked) value = "block";
      else value = "none";
    } else if (e.target.name === "Tooltipswatch") {
      if (e.target.checked) value = 0.9;
      else value = 0.0;
    } else if (
      e.target.name === "Barswatch" ||
      e.target.name === "Pieswatch" ||
      e.target.name === "Scatterswatch" ||
      e.target.name === "Lineswatch" ||
      e.target.name === "Compositeswatch" ||
      e.target.name === "Seriesswatch" ||
      e.target.name === "BarLineswatch"
    ) {
      if (e.target.checked) value = "show";
      else value = "hide";
    }

    setState({
      ...state,
      [e.target.name]: value,
      [e.target.name + "_"]: e.target.checked,
    });
  };
  //Template Save/Cancel
  const saveTemplate = (action) => {
    if (action !== "cancel") {
      if (
        state.TempName === undefined ||
        state.TempName.trim().length === 0 ||
        state.TempName === null
      ) {
        setFormValues({
          ...formValues,
          TempName: {
            ...formValues.TempName,
            error: true,
            errorMessage: "Template Name should not be empty",
          },
        });
        return;
      } else {
        setTemplate({ ...template, [state.TempName]: state });
        setDashboard({
          ...dashboard,
          [state.TempName]: { ...state, Width_: null, Heigth_: 250 },
        });
      }

      if (flag) {
        document.querySelector(".loader").style.display = "block";
        PostTemplate("Update");
        GenerateChart();
        Swal.fire({
          icon: "success",
          title: "Your template has been Updated",
        });
        ChildtoParentHandshake(undefined);
        setNavbar({ bar: "Templates" });
        chartReset("Chart_Reset");
        setState((previous) => ({
          ...previous,
          Uploaded_file: undefined,
        }));
      } else {
        if (formValues.TempName === true || state.TempName === undefined) {
          // Enable validation
        }
        Swal.fire({
          icon: "success",
          title: "Your template has been Saved",
        });
        setOpen(false);
        setNavbar({ bar: "Templates" });
        PostTemplate("Insert");
        ChildtoParentHandshake(undefined);
      }
    } else {
      setFlag(false);
      Swal.fire({
        icon: "success",
        title: "Your template updation has been cancelled",
      });
      ChildtoParentHandshake(undefined);
      chartReset("Chart_Reset");
      //! commented by franklin because, when click the cancel button the chart menu is hide
      // setState((previous) => ({
      //   ...previous,
      //   Uploaded_file: undefined,
      // }));
      setNavbar({ bar: "Templates" });
    }
  };

  //Template Edit/Delete
  const handleTemplate = (name, action, id) => {
    try {
      if (action === "Edit") {
        setState(template[name]);
        setEnable({
          ...enable,
          Piechart: false,
          Barchart: false,
          Scatter: false,
          Linechart: false,
          Compositechart: false,
          Serieschart: false,
          Barlinechart: false,
        });
        setNavbar({ bar: "Charts" });
        setFlag(true);
      } else if (action === "Delete") {
        let updatedTemplate = { ...template };
        delete updatedTemplate[name];
        setTemplate(updatedTemplate);
        // setTemplate({ ...template, [name]: undefined });
        setEnable({
          ...enable,
          Piechart: false,
          Barchart: false,
          Scatter: false,
          Linechart: false,
          Compositechart: false,
          Serieschart: false,
          Barlinechart: false,
        });

        axios
          .post(`http://${path.Location}:${path.Port}/DeleteTemplate`, {
            TempName: name,
            id: id,
            userID: user.userID,
            flag: "TemplateDelete",
          })
          .then((response) => {
            Swal.fire("Deleted!", "Your Template has been Deleted.", "success");
            setFlag(flag);
            ChildtoParentHandshake(undefined);
          });
        setOpen({ ...open, Template: false });
        return;
      } else if (action === "templeDelete") {
        let Index = -1;
        for (let i = 0; i < Object.keys(project).length; i++) {
          Index = Object.values(
            project[Object.keys(project)[i]].charts
          ).indexOf(name);
          if (Index !== -1) {
            // setOpen({
            //   ...open,
            //   Template: true,
            //   deleteTemplate: true,
            //   tempName: name,
            //   dashboardName: project[Object.keys(project)[i]].DashboardName,
            // });
            // Swal.fire({
            //   title: `Are you sure want to delete
            //                 "${name}" Template? `,
            //   text: `This will,
            //   impact "${
            //     project[Object.keys(project)[i]].DashboardName
            //   }" Dashboard.`,
            //   icon: "warning",
            //   showCancelButton: true,
            //   confirmButtonColor: "#008000",
            //   cancelButtonColor: "#d33",
            //   confirmButtonText: "Delete",
            // }).then((result) => {
            //   if (result.isConfirmed) {
            //     handleTemplate(name, "Delete", id);
            //   }
            // });
            // Swal.fire(
            //   `Your Template has already been utilized. You cannot delete the template until you remove the associated ${
            //     project[Object.keys(project)[i]].DashboardName
            //   } Dashboard.`
            // );
            Swal.fire({
              icon: "error",
              title: `Your Template has already been utilized. You cannot delete the template until you remove the associated ${
                project[Object.keys(project)[i]].DashboardName
              } Dashboard.`,
            });
            return;
          }
        }
        if (Index === -1) {
          Swal.fire({
            title: `Are you sure want to delete "${name}" Template? `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
          }).then((result) => {
            if (result.isConfirmed) {
              handleTemplate(name, "Delete", id);
            }
          });
          return;
        }
      }

      if (action === "Preview" || action === "Edit") {
        document.querySelector(".loader").style.display = "block";
        axios
          .post(`http://${path.Location}:${path.Port}/GetTemplate`, {
            userID: user.userID,
            id: id,
            Flag: { action: "singleTemplate" },
          })
          .then((response) => {
            template[response.data[0]["TempName"]] = response.data[0];

            setEnable({
              ...enable,
              Piechart: false,
              Barchart: false,
              Scatter: false,
              Linechart: false,
              Compositechart: false,
              Serieschart: false,
              Barlinechart: false,
            });
            setEnableTemplate(!enabletemplate);
            setState(template[name]);
            if (action === "Preview") setFlag(false);
          });
        setTimeout(() => {
          document.querySelector(".loader").style.display = "none";
        }, 0);
        // set Generate - undefind for template preview
        setcardData({
          ...cardData,
          Generate: undefined,
        });
      }
    } catch (error) {
      console.log("error in handleTemplate", error);
    }
  };

  //Template dragging for dashboard
  const allowDrop = (event, collection) => {
    try {
      if (collection === "card") {
        // get the card id when drop the card
        event.dataTransfer.setData("card", event.target.id);
      } else {
        setdashboardCharts({
          ...dashboardCharts,
          [event.target.id]: event.target.id,
        });
        event.dataTransfer.setData("text", event.target.id);
        event.dataTransfer.setData("id", event.target.attributes.name.value);
      }
    } catch (err) {
      console.log("error in AllowDrop", err);
    }
  };

  //Show valid axis
  const showValidAxis = (chart) => {
    if (state["CheckType"]) {
      var Notvalid = [];
      var validXAxis = [];
      var validYAxis = [];
      var validGroupAxis = [];

      if (
        chart === "Bar Chart" ||
        chart === "Pie Chart" ||
        chart === "Line Chart" ||
        chart === "Sunburst Chart" ||
        chart === "Bar Line Chart"
      ) {
        //X Axis
        Notvalid = ["Da"];
        state["CheckType"].map((e) => {
          var value = e.split(" ").splice(0, 1)[0];
          if (Notvalid.indexOf(value) === -1) validXAxis.push(e);
        });

        //Y Axis
        Notvalid = ["Da", "Aa"];
        state["CheckType"].map((e) => {
          var value = e.split(" ").splice(0, 1)[0];
          if (Notvalid.indexOf(value) === -1) validYAxis.push(e);
        });
      } else if (chart === "ScatterPlot") {
        Notvalid = ["Da", "Aa"];
        state["CheckType"].map((e) => {
          var value = e.split(" ").splice(0, 1)[0];
          if (Notvalid.indexOf(value) === -1) {
            validXAxis.push(e);
            validYAxis.push(e);
          }
        });
      } else if (chart === "Series Chart" || chart === "Composite Chart") {
        Notvalid = ["Da"];
        if (chart === "Series Chart") {
          state["CheckType"].map((e) => {
            var value = e.split(" ").splice(0, 1)[0];
            if (Notvalid.indexOf(value) !== -1) {
              validXAxis.push(e);
            }
          });
        } else if (chart === "Composite Chart") {
          state["CheckType"].map((e) => {
            var value = e.split(" ").splice(0, 1)[0];
            if (Notvalid.indexOf(value) === -1) {
              validXAxis.push(e);
            }
          });
        }

        Notvalid = ["Da", "Aa"];
        state["CheckType"].map((e) => {
          var value = e.split(" ").splice(0, 1)[0];
          if (Notvalid.indexOf(value) === -1) {
            validYAxis.push(e);
          }
        });

        Notvalid = ["Aa"];
        state["CheckType"].map((e) => {
          var value = e.split(" ").splice(0, 1)[0];
          if (Notvalid.indexOf(value) !== -1) {
            validGroupAxis.push(e);
          }
        });
      }
      if (chart === "Series Chart" || chart === "Composite Chart") {
        setState({
          ...tempState,
          XAxis_: validXAxis,
          YAxis_: validYAxis,
          GroupByCopy_: validGroupAxis,
          Chart: chart,
          Uploaded_file: state.Uploaded_file,
          Uploaded_fileID: uploaded_fileID || state.Uploaded_fileID,
          CheckType: state["CheckType"],
          _id: state._id,
          TempName: state.TempName,
          fileName: state.fileName,
        });
      } else {
        setState({
          ...tempState,
          XAxis_: validXAxis,
          YAxis_: validYAxis,
          Chart: chart,
          Uploaded_file: state.Uploaded_file,
          Uploaded_fileID: uploaded_fileID || state.Uploaded_fileID,
          fileName: state.fileName,
          CheckType: state["CheckType"],
          _id: state._id,
          TempName: state.TempName,
        });
      }
      validXAxis = [];
      validYAxis = [];
      validGroupAxis = [];
    }
    setuploaded_fileID(undefined);
  };

  //Dynamic filtering for dashboard
  const handleFilter = (action) => {
    try {
      var customFilter = filteringProps.customFilter;
      var props_ = {};
      var props = [];
      let data = [];
      if (filter.data === undefined)
        data = dashboard[Object.keys(dashboard)[0]].Uploaded_file;
      else data = filter.data;
      for (let i = 0; i < customFilter.length; i++) {
        const Dimensions = customFilter[i].split(" ").slice(1, 30).join(" ");
        const unique = data
          .map((item) => item[Dimensions])
          .filter((value, index, self) => self.indexOf(value) === index);
        props_[Dimensions] = unique;
        props_.Dimensions = Dimensions;
        props.push(props_);
        props_ = {};
      }
    } catch (err) {
      console.log("error in handleFilter ==>", err);
    }
    if (action === "Dashboard Insert") {
      return props;
    } else {
      setIsshow({
        ...show,
        isShow: true,
        dashboard,
        NOCharts: others.NOCharts,
        Filter: filter,
        FilterProps: props,
        isBublished: true,
        Build: false,
        filterSwatch: filter.filterSwatch,
      });
    }
  };

  const handleGlobalFilter = (dimentions, uploadedData) => {
    try {
      var customFilter = dimentions;
      var props_ = {};
      var props = [];
      let data = uploadedData;
      for (let i = 0; i < customFilter.length; i++) {
        const Dimensions = customFilter[i].split(" ").slice(1, 30).join(" ");
        const unique = data
          .map((item) => item[Dimensions])
          .filter((value, index, self) => self.indexOf(value) === index);
        props_[Dimensions] = unique;
        props_.Dimensions = Dimensions;
        props.push(props_);
        props_ = {};
      }
    } catch (err) {
      console.log("error in handleFilter ==>", err);
    }
    return props;
  };
  useEffect(() => {
    if (
      parseInt(others.Rows) ===
      Object.values(others["Cols"] || {}).filter((val) => val).length
    )
      setError({ ...error, Disable: false });
  }, [others.Cols]);

  const handleMultiselect = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "SunBurstX_Axis") {
      setState({
        ...state,
        [name]: typeof value === "string" ? value.split(",") : value,
        OrderedList: typeof value === "string" ? value.split(",") : value,
      });
      setItemOrderList(typeof value === "string" ? value.split(",") : value);
    }
    // else if (name === "Users" || name === "Groups") {
    //   setProjectAssigning({
    //     ...projectAssigning,
    //     [name]: typeof value === "string" ? value.split(",") : value,
    //   });
    // }
    else {
      setfilteringProps({
        ...filteringProps,
        [name]: typeof value === "string" ? value.split(",") : value,
      });
    }
  };

  //Expand/Collapse
  const ExpandCollapse = (action) => {
    // navigate("/");
    setTimeout(() => {
      if (navopen && !isMobile) {
        setNavWidth({ navArea: "70px", inuptArea: "0%", ChartArea: "95%" });
      } else if (navopen && isMobile) {
        setNavWidth({ navArea: "70px", inuptArea: "0%", ChartArea: "94%" });
      } else if (!navopen && isMobile) {
        setNavWidth({ navArea: "70px", inuptArea: "60%", ChartArea: "94%" });
      } else if (!navopen && !isMobile) {
        setNavWidth({ navArea: "70px", inuptArea: "28%", ChartArea: "63%" });
      }
      setNavOpen(!navopen);
      if (action === "publish") {
        setIsshow({
          ...show,
          isBublished: !show.isBublished,
          Build: false,
          filterSwatch: filter.filterSwatch,
          DashboardName: projectDetails.DashboardName || "Dashboard",
        });
      } else if (navbar.bar === "Project") {
        if (postProject?.action !== "AssignUser")
          setIsshow({
            ...show,
            isBublished: true,
            action: "Preview",
            filterSwatch:
              typeof show.filterSwatch !== "object"
                ? show.filterSwatch
                  ? true
                  : false
                : false,
          });
      } else {
        setIsshow({
          ...show,
          isBublished: !show.isBublished,
          Build: false,
          filterSwatch: false,
          DashboardName: projectDetails.DashboardName || "Dashboard",
        });
      }
    }, 100);
    // ExpandData(navwidth)
  };

  //To store selected static layout
  const dashboardLayouts = (event, layout) => {
    if (layout === "cards") {
      // set the card layout
      setOthers({ ...others, cardLayout: event.currentTarget.id });
    } else {
      setOthers({ ...others, selectedLayout: event.currentTarget.id });
    }
  };

  //To reset the screen click upon navtabs
  const resetScreen = () => {
    setData({ data: undefined });
    setIsshow({ isShow: undefined });
    setIssues(undefined);
    setPlay({ isPlay: undefined });
    ChildtoParentHandshake(undefined);
  };
  // const handleClose = () => {
  //     setAnchorEl(null);
  // };
  // Service call's
  const PostTemplate = (action) => {
    try {
      if (action === "Update") {
        axios
          .post(`http://${path.Location}:${path.Port}/UpdateTemplate`, state)
          .then((response) => {
            //console.log("data", response.data);
            GetTemplate();
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (action === "Insert") {
        const Result = state;
        delete Result._id;
        delete Result.Uploaded_file;
        axios
          .post(`http://${path.Location}:${path.Port}/InsertTemplate`, Result)
          .then((response) => {
            //console.log("data", response.data);
            GetTemplate();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const GetTemplate = (Tab) => {
    if (user.userID == "") {
      navigate("/");
      return;
    }
    if (
      (Tab === undefined && Object.keys(template).length === 0) ||
      Object.keys(dashboard).length === 0
    )
      document.querySelector(".loader").style.display = "block";
    axios
      .post(`http://${path.Location}:${path.Port}/GetTemplate`, {
        userID: user.userID,
        Flag: { action: "All" },
      })
      .then((response) => {
        let data = response.data;
        if (Tab === "Dashboard" || Tab === "Create Dashboard") {
          let obj = {};
          for (let i = 0; i < data.length; i++) {
            data[i].Width_ = null;
            data[i].Heigth_ = 250;
            obj[data[i].TempName] = data[i];
          }
          setDashboard(obj);
          if (Tab === "Create Dashboard") {
            // added for remove the action
            setOthers({
              ...others,
              StaticLayouts: true,
              CustomLayouts: false,
              Cols: {},
              Rows: "",
              // selectedLayout: data.layouts,
              EditDashboard: false,
            });
            setError({ ...error, Disable: false });
            setTimeout(() => {
              document.querySelector(".loader").style.display = "none";
            }, 0);
          }
        } else {
          let obj = {};
          for (let i = 0; i < data.length; i++) {
            obj[data[i].TempName] = data[i];
          }
          setTemplate(obj);

          if (Tab === undefined) {
            setTimeout(() => {
              if (document.querySelector(".loader") !== null)
                document.querySelector(".loader").style.display = "none";
            }, 100);
          }
        }
        document.querySelector(".loader").style.display = "none";
      });
  };

  const handleFeedback = (action) => {
    if (action !== "Fetch") {
      if (
        feedback["Category"] === "Select" ||
        feedback["Category"] === undefined ||
        feedback.Issue === undefined ||
        feedback.Issue === ""
      ) {
        setError({ mandatoryFields: "Please fill the mandatory Fields" });
        return;
      }
      axios
        .post(`http://${path.Location}:${path.Port}/InsertFeedback`, feedback)
        .then((response) => {
          //console.log("data", response.data);
          axios
            .get(`http://${path.Location}:${path.Port}/GetFeedback`)
            .then((response) => {
              let data = response.data;
              setPlay({ isPlay: undefined });
              setIsshow({ isShow: undefined });
              setData({ data: undefined });
              setIssues(data);
              setFeedback({ ...feedback, Issue: "" });
            });
        });
    } else {
      axios
        .get(`http://${path.Location}:${path.Port}/GetFeedback/`)
        .then((response) => {
          let data = response.data;
          setPlay({ isPlay: undefined });
          setIsshow({ isShow: undefined });
          setData({ data: undefined });
          setIssues(data);
        });
    }
    setError({ mandatoryFields: undefined });
  };

  const handleDashboard = async (action, e) => {
    updateMessage({}); // to empty the filteredValue value in DashboardFiltered Component.
    let tempProjectId = e.currentTarget.id;
    if (action === "Save") {
      if (projectDetails.DashboardName) {
        setOpen({ Dashboard: false });
        PostDashboard("Insert");
        Swal.fire({
          icon: "success",
          title: "Your Project has been Saved.",
        });
        let obj = {};
        obj.action = action;
        setpostProject(obj);
        setNavbar({ bar: "Project" });
        setOthers({ ...tempOthers, EditDashboard: false });
        setprojectDetails({
          ...projectDetails,
          DashboardName: "",
          DashboardDescription: "",
        });
      } else {
        setFormValues({
          ...formValues,
          DashboardName: {
            ...formValues.DashboardName,
            error: true,
            errorMessage: "Dashboard Name should not be empty",
          },
        });
        return;
      }
    } else if (action === "Edit") {
      e.stopPropagation();
      getCards(); // get the all the card data while editing the project by franklin
      let data = project[e.currentTarget.id];
      if (data.layoutOption === "Static") {
        setOthers({
          ...others,
          StaticLayouts: true,
          CustomLayouts: false,
          selectedLayout: data.layouts,
          EditDashboard: true,
          EditingDashboardID: data.DashboardName,
        });
      } else {
        let Cols = {};
        data.layouts[1].map((e, index) => (Cols["Cols" + (index + 1)] = e));
        setOthers({
          ...others,
          StaticLayouts: false,
          CustomLayouts: true,
          Rows: data.layouts[0],
          Cols,
          EditDashboard: true,
          EditingDashboardID: data.DashboardName,
        });
      }
      setNavbar({ bar: "Dashboard" });
      setprojectDetails({
        ...projectDetails,
        id: tempProjectId,
        DashboardDescription: project[e.currentTarget.id].DashboardDescription,
        DashboardName: project[e.currentTarget.id].DashboardName,
      });
      //setFilter(data.filter);
    } else if (action === "Update") {
      const filterProps = handleFilter("Dashboard Insert");
      let obj = {};
      obj.userID = user.userID;
      if (others.StaticLayouts) {
        obj.layouts = others.selectedLayout;
        obj.layoutOption = "Static";
      } else {
        let a = [];
        Object.keys(others.Cols).map((e, i) => {
          if (i < parseInt(others.Rows)) {
            a.push(others.Cols[e]);
          }
        });
        obj.layouts = [others.Rows, a];
        obj.layoutOption = "Custom";
      }
      obj.charts = JSON.parse(sessionStorage.getItem("IDs"));
      // get the card ids from session
      obj.cards = JSON.parse(sessionStorage.getItem("Cards"));
      obj.DashboardName = others.EditingDashboardID;
      obj.DashboardDescription = projectDetails.DashboardDescription;
      obj.id = projectDetails.id;
      try {
        obj.ChartIDs = Object.keys(obj.charts).map((key) => ({
          [key]: dashboard[obj.charts[key]]["_id"] + " - " + obj.charts[key],
        }));
      } catch (error) {
        console.log(" ids ==> ", error);
      }
      if (filter.filterSwatch) {
        delete filter.data;
        obj.filter = filter["filterSwatch"];
        obj.filterProps = []; // !filterProps;
        obj.selectedFilterDimensions = filteringProps.customFilter;
        obj.AvailableDimensions = filteringProps.Dimensions;
      } else {
        obj.filter = {}; //filter;
        obj.filterProps = []; // filterProps;
        obj.selectedFilterDimensions = []; //filteringProps.customFilter;
        obj.AvailableDimensions = [];
        let indivialFilter_ = [];
        Object.keys(JSON.parse(sessionStorage.getItem("IDs"))).forEach(
          (value) => {
            let temp = sessionStorage.getItem(value);
            indivialFilter_.push({ [value]: temp });
            // Clear the session storage current key
            sessionStorage.removeItem(value);
          }
        );
        obj.IndividualFilter = indivialFilter_;
      }

      obj.action = "Update";
      setpostProject(obj);

      axios
        .post(`http://${path.Location}:${path.Port}/UpdateDashboard`, obj)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Your Project has been Updated.",
          });
          GetDashboard();
          sessionStorage.removeItem("Cards");
        });

      setNavbar({ bar: "Project" });
      setOthers({ ...others, EditDashboard: false });
    } else if (action === "Delete") {
      e.stopPropagation();
      // document.querySelector(".loader").style.display = "block";
      Swal.fire({
        title: `Are you sure want to delete "${e.currentTarget.name}" project? `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          // document.querySelector(".loader").style.display = "block";
          axios
            .post(`http://${path.Location}:${path.Port}/DeleteDashboard`, {
              userID: user.userID,
              id: Number(tempProjectId),
              collection: "Dashboards",
            })
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Your Project has been Deleted.",
              });
              GetDashboard();
              let obj = {};
              obj.action = action;
              setpostProject(obj);
              setNavbar({ bar: "Project" });
              setTimeout(() => {
                document.querySelector(".loader").style.display = "none";
              }, 100);
            });
        }
      });
    } else if (action === "AssignUser") {
      e.stopPropagation();
      let obj = {};
      obj.action = action;
      obj.userID = user.userID;
      obj.id = e.currentTarget.id;
      obj.DashboardName = project[e.currentTarget.id]?.["DashboardName"];
      setpostProject(obj);
      setPlay({ isPlay: undefined });
      setIssues(undefined);
      setIsshow({ ...show, isShow: true, Build: false });
    } else if (action === "Cancel") {
      Swal.fire({
        icon: "success",
        title: "Your Project updation has been cancelled",
      });
      let obj = {};
      obj.action = action;
      setpostProject(obj);
      setNavbar({ bar: "Project" });
      setOthers({ ...others, EditDashboard: false });
    } else if (action === "Reset") {
      try {
        let response = await axios.post(
          `http://${path.Location}:${path.Port}/GetSingleData`,
          {
            id: projectDetails.id,
            CollectionName: "Dashboards",
            userID: user.userID,
          }
        );
        if (response) {
          let Result = response.data;
          let obj = { ...Result[0]["DashboardDetails"][0] };
          obj["cards"] = [...Result[0].CardDetails];
          Result.map((val) => {
            val["ChartDetails"][0].Width_ = null;
            val["ChartDetails"][0].Heigth_ = 250;
          });
          obj.action = "Edit";
          obj.others = others.EditDashboard;
          obj.Projectfilter = JSON.parse(
            JSON.stringify(
              Object.fromEntries(
                Result.map((val, i) => [val.key, val.ChartDetails[0]])
              )
            )
          );
          setprojectDetails({
            ...projectDetails,
            DashboardDescription: obj["DashboardDescription"],
          });

          if (typeof obj.filter !== "object" && obj.filter !== false) {
            setFilter({
              filterSwatch: obj.filter,
              data: Result[0]["ChartDetails"][0].Uploaded_file,
            });
            setfilteringProps({
              Dimensions: obj.Projectfilter["chart0"].CheckType,
              customFilter: obj.selectedFilterDimensions,
            });
            obj.Filter = {
              filterSwatch: obj.filter,
              data: Result[0]["ChartDetails"][0].Uploaded_file,
            };
            obj.FilterProps = handleGlobalFilter(
              obj.selectedFilterDimensions,
              Result[0]["ChartDetails"][0].Uploaded_file
            );
          } else {
            setFilter({});
            setfilteringProps({});
          }

          setpostProject(obj);
          setPlay({ isPlay: undefined });
          setIssues(undefined);
          setIsshow({ ...show, isShow: true, Build: false });
        }
      } catch (error) {
        console.log("projectReset =>", error);
      }
    }

    if (action === "Preview" || action === "Edit") {
      try {
        document.querySelector(".loader").style.display = "block";
        // let data = project[e.currentTarget.id] || assignedProject[e.currentTarget.id];
        // if (
        //   user["Role"] === "Admin" ||
        //   user["Role"] === "Creator" ||
        //   Object.keys(dashboard).length === 0
        // ) {
        user["Role"] !== "User" && GetTemplate("Dashboard");
        try {
          let response = await axios.post(
            `http://${path.Location}:${path.Port}/GetSingleData`,
            {
              id: Number(tempProjectId),
              CollectionName: "Dashboards",
              userID: user.userID,
            }
          );
          if (response) {
            let tempCard = [];
            let Result = response.data;
            let obj = { ...Result[0]["DashboardDetails"][0] };
            if (Result[0].cards !== null && Result[0].cards?.length !== 0) {
              tempCard = Result[0].cards.map((value) => {
                return Result[0].CardDetails.filter(
                  (val) => val["_id"] === value
                );
              });
            }
            obj["cards"] = tempCard.flat(); // convert array of object into object
            Result.map((val) => {
              val["ChartDetails"][0].Width_ = null;
              val["ChartDetails"][0].Heigth_ = 250;
            });
            obj.action = action;
            obj.others = others.EditDashboard;
            obj.Projectfilter = JSON.parse(
              JSON.stringify(
                Object.fromEntries(
                  Result.map((val, i) => [val.key, val.ChartDetails[0]])
                )
              )
            );

            if (typeof obj.filter !== "object" && obj.filter !== false) {
              updateManageFilter(true); // hide the Individual filter if the globel filter is on
              setfilteringProps({
                ...filteringProps,
                customFilter: obj.selectedFilterDimensions,
                Dimensions: obj.Projectfilter["chart0"].CheckType,
              });
            } else {
              updateManageFilter(false); // display the Individual filter if the globel filter is off
              setfilteringProps({});
            }

            setFilter({
              ...filter,
              filterSwatch:
                typeof obj.filter !== "object"
                  ? obj.filter
                    ? true
                    : false
                  : false,
              data: Result[0].ChartDetails[0].Uploaded_file, //Result[0].Uploaded_file,
            });
            obj.Filter = {
              filterSwatch: obj.filter,
              data: Result[0]["ChartDetails"][0].Uploaded_file,
            };
            obj.FilterProps = handleGlobalFilter(
              obj.selectedFilterDimensions,
              Result[0]["ChartDetails"][0].Uploaded_file
            );
            setpostProject(obj);
            setPlay({ isPlay: undefined });
            setIssues(undefined);
            setIsshow({
              ...show,
              isShow: true,
              Build: false,
              filterSwatch: obj.filter,
            });
            document.querySelector(".loader").style.display = "none";
          }
        } catch (error) {
          console.log("projectReset =>", error);
        }
      } catch (error) {
        document.querySelector(".loader").style.display = "none";
        console.log("Error ==>", error);
      }
    }
  };

  const PostDashboard = (action) => {
    let obj = {};
    const filterProps = handleFilter("Dashboard Insert");
    if (action === "Insert") {
      obj.userID = user.userID;
      if (tempOthers.StaticLayouts) {
        obj.layouts = tempOthers.selectedLayout;
        obj.layoutOption = "Static";
      } else {
        let a = [];
        Object.keys(tempOthers.Cols).map((e, i) => {
          if (i < parseInt(tempOthers.Rows)) {
            a.push(tempOthers.Cols[e]);
          }
        });
        obj.layouts = [tempOthers.Rows, a];
        obj.layoutOption = "Custom";
      }

      obj.charts = JSON.parse(sessionStorage.getItem("IDs"));
      obj.cards = JSON.parse(sessionStorage.getItem("Cards"));
      try {
        obj.ChartIDs = Object.keys(obj.charts).map((key) => ({
          [key]: dashboard[obj.charts[key]]["_id"] + " - " + obj.charts[key],
        }));
      } catch (error) {
        console.log(" ids ==> ", error);
      }

      obj.DashboardName = projectDetails.DashboardName;
      obj.DashboardDescription = projectDetails.DashboardDescription;
      //commented by franklin - for golobal filter props details right now (9-29-2023)is empty
      if (filter.filterSwatch) {
        delete filter.data;
        obj.filter = filter["filterSwatch"];
        obj.filterProps = []; // !filterProps;
        obj.selectedFilterDimensions = filteringProps.customFilter;
        obj.AvailableDimensions = filteringProps.Dimensions;
      } else {
        obj.filter = {}; //filter;
        obj.filterProps = []; // filterProps;
        obj.selectedFilterDimensions = []; //filteringProps.customFilter;
        obj.AvailableDimensions = [];
        let indivialFilter_ = [];

        try {
          Object.keys(JSON.parse(sessionStorage.getItem("IDs"))).forEach(
            (value) => {
              let temp = sessionStorage.getItem(value);
              indivialFilter_.push({ [value]: temp });
              // Clear the session storage current key
              sessionStorage.removeItem(value);
            }
          );
        } catch (error) {
          console.log("session storage", error);
        }
        obj.IndividualFilter = indivialFilter_;
      }
    }
    axios
      .post(`http://${path.Location}:${path.Port}/InsertDashboard`, obj)
      .then((response) => {
        sessionStorage.removeItem("Cards");
        GetDashboard();
        setIsshow({ isShow: undefined });
      });
  };

  const GetDashboard = async () => {
    if (Object.keys(project).length === 0)
      document.querySelector(".loader").style.display = "block";
    let response = await axios.post(
      `http://${path.Location}:${path.Port}/GetDashboard`,
      {
        userID: user["userID"],
        flag: user["Role"] === "Admin" ? 0 : 1,
      }
    );
    if (response) {
      let data = response.data;
      let objNew = {};
      for (let i = 0; i < data.length; i++) {
        objNew[data[i]._id] = data[i];
      }
      setProject(objNew);
      GetTemplate();

      let assignProjestRes = await axios.post(
        `http://${path.Location}:${path.Port}/getAssignedProjects`,
        {
          userID: user["userID"],
          Group: user.Group,
        }
      );
      if (assignProjestRes) {
        let data = assignProjestRes.data;
        let obj = {};
        for (let i = 0; i < data.length; i++) {
          if (!Object.keys(objNew).includes(data[i]._id.toString())) {
            obj[data[i]._id] = data[i];
          }
        }
        setAssignedProject(obj);
      }

      setTimeout(() => {
        if (document.querySelector(".loader"))
          document.querySelector(".loader").style.display = "none";
      }, 100);
    }
  };

  const GetPreDefinedTemplates = (action, e) => {
    if (action === "Fetch") {
      if (Object.keys(TemplatesCollections).length === 0) {
        document.querySelector(".loader").style.display = "block";
        axios
          .post(`http://${path.Location}:${path.Port}/GetPreDefinedTemplate`)
          .then((response) => {
            let data = response.data;
            let obj = {};
            for (let i = 0; i < data.length; i++) {
              data[i].userID = user.userID;
              delete data[i]._id;
              obj[data[i].TempName] = data[i];
            }
            setTemplatesCollections(obj);
            setTimeout(() => {
              document.querySelector(".loader").style.display = "none";
            }, 100);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      setEnable({
        ...enable,
        Piechart: false,
        Barchart: false,
        Scatter: false,
        Linechart: false,
        Compositechart: false,
        Serieschart: false,
        Barlinechart: false,
      });
      setEnableTemplate(!enabletemplate);
      setState(TemplatesCollections[e.currentTarget.id]);
      setFlag(false);
    }
  };

  const postDataSet = (name, data) => {
    document.querySelector(".loader").style.display = "block";
    if (Dataset[name] !== undefined) {
      // setError({ 'invalidFile': 'There is s problem with the file, Please check and Try again !!!' })
      return;
    }
    let obj = {};
    obj.userID = user.userID;
    obj.filename = name;
    obj.data = data;
    axios
      .post(`http://${path.Location}:${path.Port}/InsertDataSet`, obj)
      .then((response) => {
        saveDataDictionary(user.userID, name, data);
        getDataSet();
        inputRef.current.value = "";
      });
  };

  const saveDataDictionary = (userID, name, Rdata) => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetIDDataSet`, {
        userID: userID,
        id: name,
      })
      .then((response) => {
        const newid = response.data[0]._id;
        setuploaded_fileID(newid);
        let cols = [];
        if (Rdata[0] === undefined || Rdata[0] === null || Rdata[0] === "") {
          Swal.fire({
            icon: "error",
            title: "No data detected in the file.",
          });
          inputRef.current.value = "";
          return;
        } else if (
          Object.keys(Rdata[0]).length !==
          Object.keys(Rdata[0])
            .map((value) => value.trim())
            .filter(Boolean).length
        ) {
          Swal.fire({
            icon: "error",
            title: "Please upload a vaild file",
          });
          inputRef.current.value = "";
          return;
        } else {
          Object.entries(Rdata[0]).forEach(([key, value]) => {
            cols.push(key);
          });
          let value = {};
          var temparray = [];

          cols.forEach((event, index) => {
            let data = Rdata.map((e) => e[event]);
            let dataval = "";
            if (!isNaN(data[0] - 10) || new Date(data[0]) != "Invalid Date") {
              dataval = "Number";
              if (/^\d+(\.\d+)?$/.test(data[0].toString().replace(/,/g, ""))) {
                dataval = "Number";
              } else {
                if (data[0].toString().match(/[A-Za-z]+/)) dataval = "String";
                else dataval = "Date";
              }
            } else if (
              typeof data[0] == "string" &&
              !isNaN(Date.parse(data[0]))
            ) {
              dataval = "Date";
            } else {
              dataval = toPascalCase(typeof data[0]);
            }

            if (dataval == "Number") {
              //  value.graphicon = "histogram"; //Moved to insights
              value.changetype = "# Integers";
              value.datatype = "# Integers";
            } else {
              // value.graphicon = "Category";        //Moved to insights
              if (dataval == "String" || dataval == "Boolean") {
                value.changetype = "Aa Strings";
                value.datatype = "Aa Strings";
              }
              if (dataval == "Date") {
                value.changetype = "Da Date";
                value.datatype = "Da Date";
              }
              // if (dataval == "Boolean") {
              //   value.changetype = "Bo Boolean";
              //   value.datatype = "Bo Boolean";
              // }
            }
            //  value.rowdata = data;//Moved to insights
            value.columns = cols[index];
            value.displaynames = cols[index];
            temparray.push(value);
            value = {};
          });
          setcardData({
            ...cardData,
            Uploaded_file: Rdata,
            Uploaded_fileID: newid,
            filedata: temparray,
          });

          axios
            .post(`http://${path.Location}:${path.Port}/InsertDataDict`, {
              userID: user.userID,
              datasetID: newid,
              filename: name,
              data: temparray,
            })
            .then((response) => {
              setState({
                ...tempState,
                Uploaded_file: Rdata,
                uploaded_fileID: newid,
                fileName: name,
              });
              setData({ data: Rdata, Uploaded_fileID: newid });
              return;
            });
        }
      });
  };

  const postDataSetRevamp = async (
    deletename,
    event,
    Altername,
    newid,
    update
  ) => {
    if (event.target.files[0].type === "text/csv") {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (
            results.data[0] === undefined ||
            results.data[0] === null ||
            results.data[0] === ""
          ) {
            Swal.fire({
              icon: "error",
              title: "No data detected in the file.",
            });
            inputRef.current.value = "";
            return;
          } else if (
            Object.keys(results.data[0]).length !==
            Object.keys(results.data[0])
              .map((value) => value.trim())
              .filter(Boolean).length
          ) {
            Swal.fire({
              icon: "error",
              title: "Please upload a vaild file",
            });
            inputRef.current.value = "";
            return;
          }
          Object.values(results.data[0]).map((value) => {
            if (!isNaN(value - 10)) {
              Type.push("#");
            } else if (
              new Date(value) != "Invalid Date" &&
              new Date(value).getFullYear().toString().length <= 4
            ) {
              Type.push("Da");
            } else if (
              value.toLowerCase() === "true" ||
              value.toLowerCase() === "false"
            ) {
              Type.push("Bo");
            } else Type.push("Aa");
          });
          Object.keys(results.data[0]).map((e) => Key_.push(e));
          var newArray = Type.map((e, i) => e + " " + Key_[i]);

          setState({
            ...tempState,
            Uploaded_file: results.data,
            XAxis_: newArray,
            YAxis_: newArray,
            GroupByCopy_: newArray,
            CheckType: newArray,
            SunBurstX_Axis: [],
          });

          setError({ invalidFile: undefined });
          ChildtoParentHandshake(state, enable, navbar, {
            newArray: newArray,
            Uploaded_file: results.data,
          });
          setfilteringProps({ ...filteringProps, Dimensions: newArray });
          // setData({ data: results.data }); // commented by fraklin for statistic
          setIssues(undefined);
          postDataSetAlter(Altername, results.data, newid, update);
          sessionStorage.setItem("uploadfilename", Altername);
        },
      });
    } else if (event.target.files[0].type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          var data = JSON.parse(e.target.result);

          var Type = [];
          var Key_ = [];
          Object.values(data[0]).map((value) => {
            if (!isNaN(value - 10)) {
              Type.push("# ");
            } else if (
              new Date(value) != "Invalid Date" &&
              new Date(value).getFullYear().toString().length <= 4
            ) {
              Type.push("Da");
            } else if (
              value.toLowerCase() === "true" ||
              value.toLowerCase() === "false"
            ) {
              Type.push("Bo ");
            } else Type.push("Aa ");
          });
          Object.keys(data[0]).map((e) => Key_.push(e));
          var newArray = Type.map((e, i) => e + " " + Key_[i]);

          setState({
            ...state,
            Uploaded_file: data,
            XAxis_: newArray,
            YAxis_: newArray,
            GroupByCopy_: newArray,
            CheckType: newArray,
            SunBurstX_Axis: [],
          });
          setError({ invalidFile: undefined });
          // setData({ data: data }); // commented by fraklin for statistic
          setIssues(undefined);
          ChildtoParentHandshake(state, enable, navbar, {
            newArray: newArray,
            Uploaded_file: data,
          });
          postDataSetAlter(Altername, data, newid, update);
          sessionStorage.setItem("uploadfilename", Altername);
        } catch (error) {
          setError({
            invalidFile:
              "There is s problem with the file, Please check and Try again !!!",
          });
          document.querySelector(".loader").style.display = "none";
        }
      };
      reader.readAsText(event.target.files[0]);
    } else if (
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      event.target.files[0].type === "application/vnd.ms-excel"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        var Type = [];
        var Key_ = [];
        Object.values(json[0]).map((value) => {
          if (!isNaN(value - 10)) {
            Type.push("#");
          } else if (
            new Date(value) != "Invalid Date" &&
            new Date(value).getFullYear().toString().length <= 4
          ) {
            Type.push("Da");
          } else if (
            value.toLowerCase() === "true" ||
            value.toLowerCase() === "false"
          ) {
            Type.push("Bo");
          } else Type.push("Aa");
        });
        Object.keys(json[0]).map((e) => Key_.push(e));
        var newArray = Type.map((e, i) => e + " " + Key_[i]);

        setState({
          ...state,
          Uploaded_file: json,
          XAxis_: newArray,
          YAxis_: newArray,
          GroupByCopy_: newArray,
          CheckType: newArray,
          SunBurstX_Axis: [],
        });
        setError({ invalidFile: undefined });
        // setData({ data: json }); // commented by fraklin for statistic
        setIssues(undefined);
        ChildtoParentHandshake(state, enable, navbar, {
          newArray: newArray,
          Uploaded_file: json,
        });
        postDataSetAlter(Altername, json, newid, update);
        sessionStorage.setItem("uploadfilename", Altername);
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    } else {
      setState({
        ...state,
        Uploaded_file: "",
        XAxis_: "",
        YAxis_: "",
      });
    }

    return;
  };

  const postDataSetAlter = async (name, data, newid, update) => {
    let obj = {};
    obj._id = newid;
    obj.userID = user.userID;
    obj.filename = name;
    obj.data = data;

    if (update) {
      await axios
        .post(`http://${path.Location}:${path.Port}/UpdateDataSet`, {
          userID: user.userID,
          datasetID: newid,
          filename: sessionStorage.getItem("uploadfilename"),
          data: data,
        })
        .then((response) => {
          saveDataDictionary(user.userID, name, data, update);
          getDataSet();
        });
    } else {
      await axios
        .post(`http://${path.Location}:${path.Port}/InsertDataSet`, obj)
        .then((response) => {
          saveDataDictionary(user.userID, name, data);
          getDataSet();
        });
    }
  };

  const getDataSet = () => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetDataSet`, {
        userID: user.userID,
      })
      .then((response) => {
        let data = response.data;
        // let obj = {};
        // for (let i = 0; i < data.length; i++) {
        //   obj[data[i].id] = data[i]._id;
        //   obj[data[i].filename] = data[i].filename;
        // }
        // setDataset(obj);
        setDataset(data);
      });
  };

  const getUseDataSet = (filename) => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetUseDataSet`, {
        userID: user.userID,
        filename: filename,
      })
      .then((response) => {
        let data = response.data;
        let obj = {};
        for (let i = 0; i < data.length; i++) {
          obj[data[i].filename] = data[i].data;
          setData({ data: data[i].data, Uploaded_fileID: data[0]["_id"] });
        }
        setcardData({
          ...cardData,
          Uploaded_file: data[0]["data"],
          Uploaded_fileID: data[0]["_id"],
          filedata: data[0]["filedata"],
        });

        setState({
          ...state,
          Uploaded_file: data[0]["data"],
          Uploaded_fileID: data[0]["_id"],
          fileName: filename,
          Chart: "Select",
        });
        setuploaded_fileID(data[0]["_id"]);
      });
  };
  const handleDataSet = (action, id, DatasetId) => {
    if (fileevent != null && fileevent != "" && fileevent != undefined) {
      if (
        fileevent.target?.files?.[0] != "" &&
        fileevent.target?.files?.[0] != undefined
      ) {
        setState({
          ...state,
          Uploaded_file: undefined,
          XAxis_: "",
          YAxis_: "",
        });
        document.querySelector(".loader").style.display = "none";
      }
    }
    if (action === "Delete") {
      // check wheather the dataset used in template or not
      axios
        .post(`http://${path.Location}:${path.Port}/CheckTemplateExist`, {
          userID: user.userID,
          id: DatasetId,
        })
        .then((res) => {
          if (res.data.length !== 0) {
            Swal.fire({
              icon: "info",
              title:
                "Your dataset has already been utilized. You cannot delete the dataset until you remove the associated template.",
            });
          } else {
            Swal.fire({
              title: "Are you sure?",
              title: "You want to delete this dataset",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                setEnablesavebutton(false);
                axios
                  .post(`http://${path.Location}:${path.Port}/DeleteDict`, {
                    userID: user.userID,
                    id: id,
                  })
                  .then((response) => {
                    axios
                      .post(
                        `http://${path.Location}:${path.Port}/DeleteDataSet`,
                        {
                          userID: user.userID,
                          id: id,
                        }
                      )
                      .then((response) => {
                        Swal.fire(
                          "Deleted!",
                          "Your datset file has been deleted.",
                          "success"
                        );
                        getDataSet();
                        if (uploaded_fileID === DatasetId) dataTable(undefined);
                        sessionStorage.setItem("uploadfilename", "");
                      });
                  });
              } else {
                return;
              }
            });
          }
        });
    } else if (action === "Use") {
      document.querySelector(".loader").style.display = "block";
      setFlag(false);
      setEnablesavebutton(true);
      sessionStorage.setItem("uploadfilename", id);
      // setState({ ...state, Uploaded_fileID: DatasetId });
      getUseDataSet(id);
    }
  };

  const handleGetUsers = () => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetUsers`)
      .then((res) => {
        if (res.status === 200) {
          setUser({ ...user, Users: res.data });
        }
      })
      .catch((error) => {});
  };

  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...ItemOrderList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setState({ ...state, OrderedList: updatedList });
    setItemOrderList(updatedList);
  };
  const fnGettingUniqueCount = (key) => {
    const countMap = new Map();

    state.Uploaded_file.forEach((obj) => {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        countMap.set(value, (countMap.get(value) || 0) + 1);
      }
    });
    return countMap.size;
  };
  // btn.addEventListener('click', addNewItem);

  //Components
  const NavIcons = () => {
    return (
      <>
        <div
          style={{
            visibility: `${
              !navopen && navbar["bar"] !== "Admin" ? "visible" : "hidden"
            }`,
            position: "relative",
            top: "10px",
            left: "5px",
          }}
          onClick={(e) => {
            ExpandCollapse();
          }}
        >
          {/* {!navopen && */}
          <BootstrapTooltip
            title="Expand"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="right"
          >
            <ArrowRightIcon
              // onClick={(e) => {
              //   ExpandCollapse();
              // }}
              fontSize="medium"
              style={{ cursor: "pointer" }}
            />
          </BootstrapTooltip>
          {/* } */}
        </div>
        <div className="NavBar-parent">
          <div
            className="Icon"
            style={{ display: user["Role"] === "User" && "None" }}
          >
            <div className={navbar.bar === "Data" ? "NavBar-active" : "NavBar"}>
              <BootstrapTooltip
                title="Data"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Data}
                  name="Data"
                  color="white"
                  alt="Logo"
                  // onClick={handleNavbarChange}
                  onClick={(event) => {
                    if (navbar.bar === "Data") return;
                    handleNavbarChange(event);
                    // chartReset("Chart_Reset");
                    setFormValues({
                      ...formValues,
                      XAxisCopy: {
                        ...formValues["XAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                      YAxisCopy: {
                        ...formValues["YAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                    });
                  }}
                ></img>
                {/* <DatasetIcon className="Icon_" fontSize="large" color={navbar.bar === 'Data' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} /> */}
              </BootstrapTooltip>
            </div>
          </div>
          {state.Uploaded_file !== undefined &&
            // navbar.bar !== "Templates" &&
            user["Role"] !== "User" && (
              <div className="Icon">
                <div
                  className={
                    navbar.bar === "Charts" ? "NavBar-active" : "NavBar"
                  }
                >
                  <BootstrapTooltip
                    title="Chart"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="right"
                  >
                    <img
                      src={Bar_outlined}
                      name="Charts"
                      color="white"
                      alt="Logo"
                      style={{ height: "16px" }}
                      // onClick={handleNavbarChange}
                      onClick={(event) => {
                        if (navbar.bar === "Charts") return;
                        handleNavbarChange(event);
                        chartReset("Chart_Reset");
                        resetMandatoryFields();
                        setFlag(false);
                      }}
                    ></img>
                    {/* <SignalCellularAltIcon className="Icon_" fontSize="large" color={navbar.bar === 'Charts' ? 'primary' : '#979A9B'} onClick={handleNavbarChange} /> */}
                  </BootstrapTooltip>
                </div>
              </div>
            )}

          {/* cards navmenu portion start */}
          <div
            className="Icon"
            style={{ display: user["Role"] === "User" && "None" }}
          >
            <div
              className={navbar.bar === "Cards" ? "NavBar-active" : "NavBar"}
            >
              <BootstrapTooltip
                title="Cards"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Feedback}
                  name="Cards"
                  color="white"
                  alt="Logo"
                  style={{ height: "22px" }}
                  onClick={(e) => {
                    if (navbar.bar === "Cards") return;
                    handleNavbarChange(e);
                    handleCardData(e);
                    setFormValues({
                      ...formValues,
                      CardTitle: {
                        ...formValues.CardTitle,
                        error: false,
                        errorMessage: "",
                      },
                      CardValue: {
                        ...formValues.CardValue,
                        error: false,
                        errorMessage: "",
                      },
                    });
                  }}
                ></img>
              </BootstrapTooltip>
            </div>
          </div>

          {/* cards navmenu portion end*/}

          <div
            className="Icon"
            style={{ display: user["Role"] === "User" && "None" }}
          >
            <div
              className={
                navbar.bar === "Templates" ? "NavBar-active" : "NavBar"
              }
            >
              <BootstrapTooltip
                title="Templates"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Template}
                  name="Templates"
                  color="white"
                  alt="Logo"
                  style={{ height: "22px" }}
                  onClick={(e) => {
                    if (navbar.bar === "Templates") return;
                    handleNavbarChange(e);
                    GetPreDefinedTemplates("Fetch");
                    // chartReset("Chart_Reset");
                    setFormValues({
                      ...formValues,
                      XAxisCopy: {
                        ...formValues["XAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                      YAxisCopy: {
                        ...formValues["YAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                    });
                    getCards("Fetch");
                    // GetPreDefinedTemplates("Fetch");
                  }}
                ></img>
                {/* <ArticleIcon className="Icon_" fontSize="large" color={navbar.bar === 'Templates' ? 'primary' : '#979A9B'} onClick={(e) => { handleNavbarChange(e); GetTemplate() }} /> */}
              </BootstrapTooltip>
            </div>
          </div>
          <div
            className="Icon"
            style={{ display: user["Role"] === "User" && "None" }}
          >
            <div
              className={
                navbar.bar === "Dashboard" ? "NavBar-active" : "NavBar"
              }
            >
              <BootstrapTooltip
                title="Dashboard"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Dashboard}
                  name="Dashboard"
                  color="white"
                  alt="Logo"
                  style={{ height: "16px", margin: "2px 0px" }}
                  onClick={(e) => {
                    if (navbar.bar === "Dashboard") return;
                    templateLayoutReset();
                    handleNavbarChange(e);
                    GetTemplate("Create Dashboard");
                    setprojectDetails({});
                    getCards("Fetch");
                    sessionStorage.removeItem("Cards");
                    sessionStorage.setItem("IDs", "{}");
                    // chartReset("Chart_Reset");
                    setFormValues({
                      ...formValues,
                      XAxisCopy: {
                        ...formValues["XAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                      YAxisCopy: {
                        ...formValues["YAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                    });
                  }}
                ></img>
              </BootstrapTooltip>
            </div>
          </div>

          <div className="Icon">
            <div
              className={navbar.bar === "Project" ? "NavBar-active" : "NavBar"}
            >
              <BootstrapTooltip
                title="Project"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Project}
                  name="Project"
                  color="white"
                  alt="Logo"
                  onClick={(e) => {
                    if (navbar.bar === "Project") return;
                    handleNavbarChange(e);
                    GetDashboard();
                    GetTemplate("Dashboard");
                    // chartReset("Chart_Reset");
                    setFormValues({
                      ...formValues,
                      XAxisCopy: {
                        ...formValues["XAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                      YAxisCopy: {
                        ...formValues["YAxisCopy"],
                        error: false,
                        errorMessage: ``,
                      },
                    });
                  }}
                ></img>
              </BootstrapTooltip>
            </div>
          </div>

          {/* commented start here - remove Menuicon by franklin */}
          {/* <div className="Nav-divider">{"   "}────</div>
          <div className="Icon">
            <div className={navbar.bar === "Demo" ? "NavBar-active" : "NavBar"}>
              <BootstrapTooltip
                title="Demo"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Demo}
                  name="Demo"
                  color="white"
                  alt="Logo"
                  onClick={handleNavbarChange}
                ></img>

              </BootstrapTooltip>
            </div>
          </div>
          <div className="Icon">
            <div
              className={navbar.bar === "Feedback" ? "NavBar-active" : "NavBar"}
            >
              <BootstrapTooltip
                title="Feedback"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="right"
              >
                <img
                  src={Feedback}
                  name="Feedback"
                  color="white"
                  alt="Logo"
                  onClick={(e) => {
                    handleNavbarChange(e);
                    handleFeedback("Fetch");
                  }}
                ></img>

              </BootstrapTooltip>
            </div>
          </div> */}
          {/* commented End here - remove Menuicon */}

          {user["Role"] === "Admin" && (
            <div className="Icon">
              <div
                className={navbar.bar === "Admin" ? "NavBar-active" : "NavBar"}
              >
                <BootstrapTooltip
                  title="Admin"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="right"
                >
                  <img
                    src={AdminSettings}
                    name="Admin"
                    color="white"
                    alt="Logo"
                    onClick={(e) => {
                      if (navbar.bar === "Admin") return;
                      handleNavbarChange(e);
                      // chartReset("Chart_Reset");
                      setFormValues({
                        ...formValues,
                        XAxisCopy: {
                          ...formValues["XAxisCopy"],
                          error: false,
                          errorMessage: ``,
                        },
                        YAxisCopy: {
                          ...formValues["YAxisCopy"],
                          error: false,
                          errorMessage: ``,
                        },
                      });
                    }}
                  ></img>
                </BootstrapTooltip>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };
  const DashboardIcons = ({ e }) => {
    return (
      <div
        className=""
        style={{
          paddingLeft: 0,
          float: navbar.bar === "Templates" ? "left" : "",
        }}
      >
        {e === "Bar Chart" && navbar.bar === "Templates" ? (
          <img
            src={Bar_outlined}
            name="Feedback"
            color="white"
            alt="Logo"
          ></img>
        ) : e === "Bar Chart" ? (
          <img src={Bar} name="Feedback" color="white" alt="Logo"></img>
        ) : (
          ""
        )}

        {e === "Pie Chart" && (
          // <Piechart fontSize="large" style={{ color: '#6282b3' }} />
          <img src={Pie} alt="Logo"></img>
        )}
        {e === "Composite Chart" && (
          // <Compositechart fontSize="large" style={{ color: '#6282b3' }} />
          <img src={Bar} alt="Logo"></img>
        )}
        {e === "Line Chart" && (
          // <Linechart fontSize="large" style={{ color: '#6282b3' }} />
          <img src={Line} alt="Logo"></img>
        )}
        {e === "ScatterPlot" && (
          // <Scatterplot fontSize="large" style={{ color: '#6282b3' }} />
          <img src={Scatter} alt="Logo"></img>
        )}
        {e === "Bar Line Chart" && (
          // <Barlinechart fontSize="large" style={{ color: '#6282b3' }} />
          <img src={Bar} alt="Logo"></img>
        )}
        {e === "Series Chart" && (
          // <Serieschart fontSize="large" style={{ color: '#6282b3' }} />
          <img src={Line} alt="Logo"></img>
        )}
        {e === "Sunburst Chart" && (
          // <Serieschart fontSize="large" style={{ color: '#6282b3' }} />
          <img src={sunburst_chart} alt="Logo"></img>
        )}
      </div>
    );
  };
  const Chartheader = ({ param }) => {
    return (
      <div className="panal-header">
        <span style={{ float: "left", fontWeight: "bold", margin: "15px" }}>
          {param}
        </span>
        {param === "Project" && user["Role"] !== "User" && (
          <div className="" style={{ float: "right" }}>
            <Button
              variant="contained"
              margin="normal"
              className="input-field button"
              style={{
                backgroundColor: "#6282b3",
                float: "left",
                marginTop: "10px",
              }}
              onClick={(e) => {
                setNavbar({ bar: "Dashboard" });
                setOthers({ ...others, EditDashboard: false });
                GetTemplate("Create Dashboard");
              }}
            >
              New Project
            </Button>
          </div>
        )}
        {param === "Templates" && (
          <div className="" style={{ float: "right" }}>
            {/*  Commented by Franklin - for phase-1 release */}
            {/*  UnCommented by Juan*/}
            <Button
              variant="contained"
              margin="normal"
              className="input-field button"
              style={{
                backgroundColor: "#6282b3",
                float: "left",
                marginTop: "10px",
              }}
              onClick={(e) => {
                setNavbar({ bar: "Data" });
                // setTimeout(() => {
                //   document.getElementById("uploadFile").focus();
                // }, 0);
              }}
            >
              New Template
            </Button>
          </div>
        )}
      </div>
    );
  };

  const Ordering = ({ params }) => {
    return (
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="drag-condiner"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {params.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      className="drag-child"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <span className="spn-drag-child ">:::</span>
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  // reset the chart details when click the cancel button
  const chartReset = (action) => {
    if (action === "Chart_Reset") {
      setState((prevState) => ({
        ...prevState,
        Heigth_: 280,
        Width_: 850,
        Chart: "Select", // Reset the value to the default value
        XAxisCopy: "Select",
        YAxisCopy: "Select",
        GroupByCol: "Sum",
        Rotate: "",
        xFont: "Arial",
        xSize: "12",
        yFont: "Arial",
        ySize: "12",
        xColor: "#000000",
        YAxisPadding: "10",
        yColor: "#000000",
        TempDescription: "",

        //axes lable
        Axesswatch_: false,
        XAxisLabel: "",
        xlFont: "Arial",
        xlSize: "14",
        xlColor: "#000000",
        YAxisLabel: "",
        ylFont: "Arial",
        ylSize: "14",
        ylColor: "#000000",

        // Title toggle
        Titleswatch_: false,
        Title: "",
        TitleFont: "Arial",
        TitleSize: "18",
        TitleColor: "#000000",

        //Lagend
        Legendswatch_: false,
        LengendPosition: false,
        LegendFont: "Arial",
        LegendSize: "12",
        LegendColor: "#000000",

        // Tooltip
        Tooltipswatch_: false,
        TooltipContent: "All",
        TooltipFont: "Arial",
        TooltipSize: "14",
        TooltipColor: "#ffffff",
        TooltipBGColor: "#6282b3",
        TooltipThickness: 0,
        TooltipTickColor: "#000000",

        //Data Label
        Labelsswatch_: false,
        LabelsContent: "X",
        LabelsFont: "Arial",
        LabelsSize: "12",
        LabelsColor: "#000000",

        //pie
        Innerradius: 10,
        SlicesCap: 10,
        ExternalRadiusPadding: 60,
        Pieswatch_: false,
        BGColor: "#ffffff",

        // bar
        Barswatch_: false,
        PadTop: "",
        PadBottom: "",
        PadRight: "",
        PadLeft: "",
        Color: "#8495e6",

        //scater
        SymbolSize: 7,
        Scatterswatch_: false,
        Seriesswatch_: false,
        Compositeswatch_: false,
        BarLineswatch_: false,
        LineColor: "#FF0000",

        // barline
        GroupByCopy: "Select",
        ryFont: null,
        ryColor: "#000000",
        rySize: null,

        //sunbuster
        SunBurstX_Axis: [],
        pFont: null,
        pSize: null,
        pColor: "#000000",
      }));
      ChildtoParentHandshake(undefined);
    } else {
      // get the chart details value from database based on id and collection name
      axios
        .post(`http://${path.Location}:${path.Port}/GetSingleTemplate`, {
          //singleTemplate
          id: state._id,
        })
        .then((res) => {
          if (res.status === 200) {
            setState(res.data[0]);
            setEnableTemplate(!enabletemplate);
            // setuploaded_fileID(res.data[0].Uploaded_fileID);
          }
        })
        .catch((error) => {});
    }
  };

  const globalFilter = async (e) => {
    try {
      let filterCharts = [
        ...new Set(
          [...new Set(Object.values(JSON.parse(sessionStorage.IDs)))].map(
            (val) => dashboard[val]["Uploaded_fileID"]
          )
        ),
      ];
      let sum = 0;
      if (Object.keys(tempOthers).length === 0) {
        if (others.CustomLayouts === true) {
          sum = Object.values(others.Cols).reduce(
            (acc, currentValue) => acc + parseFloat(currentValue),
            0
          );
        } else {
          let temp = others.selectedLayout.split("X");
          sum = temp.reduce(
            (acc, currentValue) => acc + parseFloat(currentValue),
            0
          );
          if (sum === 1) {
            Swal.fire({
              icon: "warning",
              title: "Global filter is not Applicable in single layout",
            });
            return;
          }
        }
      } else {
        if (tempOthers.CustomLayouts === true) {
          sum = Object.values(tempOthers.Cols).reduce(
            (acc, currentValue) => acc + parseFloat(currentValue),
            0
          );
        } else {
          let temp = tempOthers.selectedLayout.split("X");
          sum = temp.reduce(
            (acc, currentValue) => acc + parseFloat(currentValue),
            0
          );
          if (sum === 1) {
            Swal.fire({
              title: "Global filter is not Applicable in single layout",
              icon: "warning",
            });
            return;
          }
        }
      }

      if (Object.keys(JSON.parse(sessionStorage.IDs)).length === sum) {
        if (filterCharts.length === 1) {
          try {
            const response = await axios.post(
              `http://${path.Location}:${path.Port}/GetTemplate`,
              {
                userID: user.userID,
                id: dashboard[Object.values(JSON.parse(sessionStorage.IDs))[0]]
                  ?._id,
                Flag: { action: "singleTemplate" },
              }
            );

            setFilter({
              ...filter,
              filterSwatch: !e.target.checked,
              data: response.data[0].Uploaded_file,
            });
            updateManageFilter(!e.target.checked);
            setfilteringProps({
              ...filteringProps,
              Dimensions:
                dashboard[Object.values(JSON.parse(sessionStorage.IDs))[0]]
                  ?.CheckType,
              customFilter: !e.target.checked
                ? filteringProps.customFilter
                : [],
            });
          } catch (error) {
            // Handle any errors here
            console.error(error);
          }
        } else {
          setFilter({
            ...filter,
            filterSwatch: false,
          });
          setfilteringProps({
            ...filteringProps,
            customFilter: [],
          });
          updateManageFilter(false);
          Swal.fire({
            icon: "warning",
            title:
              "Only you can use the Global Filter if all the dataset is same",
          });
        }
      } else {
        setFilter({
          ...filter,
          filterSwatch: false,
        });
        setfilteringProps({
          ...filteringProps,
          customFilter: [],
        });
        Swal.fire({
          icon: "error",
          title: "Please Fill all the Layouts in Dashboard",
        });
      }
    } catch (err) {
      console.log("error in globalFilter Function =>", err);
    }
  };

  // get the aggrecation value of cards (sum, min, max, avg);
  const handleGroupValue = (data, GroupByval) => {
    let aggregationValue = null;
    try {
      switch (GroupByval) {
        case "Sum":
          aggregationValue = data.reduce(
            (acc, currentValue) =>
              parseInt(acc.toString().replaceAll(",")) +
              parseInt(currentValue.toString().replaceAll(",")),
            0
          );
          break;
        case "Count":
          aggregationValue = data.length;
          break;
        case "Minimum":
          aggregationValue = Math.min(...data);
          break;
        case "Maximum":
          aggregationValue = Math.max(...data);
          break;
        case "Average":
          let sum = data.reduce((acc, currentValue) => acc + currentValue, 0);
          aggregationValue = sum / data.length;
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(" error in handleGroupValue", err);
      aggregationValue = 0;
    }

    return isNaN(aggregationValue)
      ? 0
      : parseFloat(aggregationValue).toFixed(2);
  };

  // it will call each field change in cards by franklin
  const handleCardChange = (event) => {
    try {
      if (
        event.target.name === "datasetData" &&
        event.target.value !== "Select"
      ) {
        let data = [];
        data = cardData.Uploaded_file.map((val) =>
          parseInt(val[event.target.value].toString().replaceAll(","))
        );
        const aggregationValue = handleGroupValue(data, cardData.GroupByCol);

        setcardData({
          ...cardData,
          [event.target.name]: event.target.value,
          CardValue: aggregationValue,
        });
      }
      if (event.target.name === "GroupByCol") {
        if (!cardData?.datasetData) {
          Swal.fire({
            icon: "warning",
            title: "Please select data value",
          });
          return;
        }
        let data = [];
        data = cardData.Uploaded_file.map((val) =>
          parseInt(val[cardData.datasetData].toString().replaceAll(","))
        );
        const aggregationValue = handleGroupValue(data, event.target.value);
        setcardData({
          ...cardData,
          [event.target.name]: event.target.value,
          CardValue: aggregationValue,
        });
      }

      if (event.target.name === "cardSwatch") {
        setcardData({
          ...cardData,
          [event.target.name]: !cardData?.cardSwatch,
        });
      } else if (event.target.name === "CardName") {
        if (
          event.target.value === undefined ||
          event.target.value === "" ||
          event.target.value === null
        ) {
          setFormValues({
            ...formValues,
            CardName: {
              ...formValues.CardName,
              error: true,
              errorMessage: "CardName should not be empty",
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            CardName: {
              ...formValues.CardName,
              error: false,
              errorMessage: "CardName should not be empty",
            },
          });
          setcardData({
            ...cardData,
            [event.target.name]: event.target.value,
          });
        }
      } else if (
        event.target.name !== "datasetData" &&
        event.target.name !== "GroupByCol"
      ) {
        if (
          event.target.name === "CardTitle" ||
          event.target.name === "CardValue"
        ) {
          if (event.target.value.length <= 20) {
            setFormValues({
              ...formValues,
              [event.target.name]: {
                ...formValues[event.target.name],
                error: false,
                errorMessage: "",
              },
            });
            setcardData({
              ...cardData,
              [event.target.name]: event.target.value,
            });
          } else {
            setFormValues({
              ...formValues,
              [event.target.name]: {
                ...formValues[event.target.name],
                error: true,
                errorMessage: `${event.target.name} not more than 20 letter`,
              },
            });
            return;
          }
        } else {
          setcardData({
            ...cardData,
            [event.target.name]: event.target.value,
          });
        }
      } else if (event.target.name === "CardName") {
        if (
          cardData.CardName === undefined ||
          cardData.CardName === "" ||
          cardData.CardName === null
        ) {
          setFormValues({
            ...formValues,
            CardName: {
              ...formValues.CardName,
              error: true,
              errorMessage: "CardName should not be empty",
            },
          });
          return;
        } else {
          setFormValues({
            ...formValues,
            CardName: {
              ...formValues.CardName,
              error: false,
              errorMessage: "CardName should not be empty",
            },
          });
        }
      }
    } catch (err) {
      console.log("error ", err);
    }
  };

  // it will call when cards (preview the card, edit, reset, update)
  const generateCard = async (index, action, id) => {
    if (action === "Preview") {
      setcardData({ ...cardCollections[index], Generate: !cardData.Generate });
    } else if (action === "UpdateReset") {
      let oldValue = cardCollections.filter((val) => val["_id"] === id);
      setcardData({ ...oldValue[0], Generate: false });
    } else if (action === "Update") {
      let obj = cardData;
      delete obj.Uploaded_file;
      delete obj.Generate;
      delete obj.action;
      axios
        .post(`http://${path.Location}:${path.Port}/UpdateCards`, obj)
        .then((response) => {
          const updatedCardCollections = cardCollections.map((item) => {
            if (item._id === id) {
              return cardData;
            }
            return item;
          });
          setcardCollections(updatedCardCollections);
          Swal.fire({
            icon: "success",
            title: "Your Card has been Updated",
          });
          setNavbar({ bar: "Templates" });
        });
    } else if (action === "Edit") {
      let tempData = cardCollections[index];
      tempData["action"] = "Edit";
      if (tempData.Uploaded_fileID) {
        let result = await axios.post(
          `http://${path.Location}:${path.Port}/GetIDDataSet`,
          {
            userID: tempData.userID,
            id: tempData.Uploaded_fileID,
            flag: "cardData",
          }
        );
        if (result) {
          tempData["Uploaded_file"] = result.data[0]["data"];
        }
      }
      setNavbar({ bar: "Cards" });
      setcardData(tempData);
    } else if (action === "Reset") {
      setcardData({
        ...cardData,
        CardFont: "Arial",
        CardFontSize: 18,
        CardValueColor: "#000000",
        CardValueFont: "Arial",
        CardValueSize: 12,
        cardColor: "#000000",
        GroupByCol: "Sum",
        CardValue: "",
        datasetData: null,
        cardSwatch: false,
        cardBGColor: "#bbc8dd",
        cardThickness: "0",
        CardTitle: "",
        borderTickColor: "#000000",
        CardDescription: "",
        CardName: "",
        action: "",
        Generate: undefined,
      });
    } else if (action === "Delete") {
      Swal.fire({
        title: `Are you sure want to delete "${cardCollections[index].CardName}" ? `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let deleteCard = await axios.post(
            `http://${path.Location}:${path.Port}/DeleteDashboard`,
            {
              id: Number(id),
              collection: "Cards",
            }
          );
          if (deleteCard) {
            const updatedCardCollections = cardCollections
              .map((item) => {
                if (item._id === id) {
                  return undefined;
                }
                return item;
              })
              .filter(Boolean);

            if (cardData._id === id) {
              setcardData({
                ...cardData,
                Generate: undefined,
              });
            }
            setcardCollections(updatedCardCollections);
            Swal.fire({
              icon: "success",
              title: "Card has been deleted success",
            });
          }
        } else {
          return;
        }
      });
    } else {
      if (
        !cardData.CardTitle ||
        cardData.CardValue === "" ||
        cardData.CardValue === undefined ||
        formValues.CardTitle.error ||
        formValues.CardValue.error
      ) {
        Swal.fire({
          icon: "error",
          title: "Please fill Card Title and Card value",
        });
        return;
      }
      setcardData({
        ...cardData,
        Generate: !cardData.Generate,
      });
    }
  };

  // get the integer values for card to process the aggrecation values
  const handleCardData = async () => {
    if (cardData.Uploaded_fileID) {
      let getDatatypes = await axios.post(
        `http://${path.Location}:${path.Port}/GetDataDictionaty`,
        {
          id: Number(uploaded_fileID),
        }
      );
      if (getDatatypes) {
        let result = getDatatypes.data[0].dataDictionary;
        try {
          let dataType = result
            .map((val, i) => {
              let temp = val.datatype.split(" ");
              if (temp[0] === "#") return { ["columns"]: val.columns }; //["datatype"]: temp[1],
            })
            .filter((val) => val);

          setcardData({
            ...cardData,
            dataType: dataType,
            Generate: undefined,
            CardFont: "Arial",
            CardFontSize: 18,
            CardValueColor: "#000000",
            CardValueFont: "Arial",
            CardValueSize: 12,
            cardColor: "#000000",
            GroupByCol: "Sum",
            CardValue: "",
            datasetData: null,
            cardSwatch: false,
            cardBGColor: "#bbc8dd",
            cardThickness: "0",
            CardTitle: "",
            borderTickColor: "#000000",
            CardDescription: "",
            CardName: "",
            action: "",
          });
        } catch (error) {
          console.log("cardData ===============> ", error);
        }
      }
    } else {
      generateCard("a", "Reset");
    }
  };

  // save the card details
  const saveCards = async (action) => {
    if (
      cardData.CardName === undefined ||
      cardData.CardName === "" ||
      cardData.CardName === null
    ) {
      setFormValues({
        ...formValues,
        CardName: {
          ...formValues.CardName,
          error: true,
          errorMessage: "CardName should not be empty",
        },
      });
      return;
    } else {
      setFormValues({
        ...formValues,
        CardName: {
          ...formValues.CardName,
          error: false,
          errorMessage: "CardName should not be empty",
        },
      });
    }

    let obj = {};
    obj = cardData;
    if (cardData.cardSwatch) {
      delete obj.Uploaded_file;
      delete obj.filedata;
    }
    obj["userID"] = user.userID;
    let result = await axios.post(
      `http://${path.Location}:${path.Port}/CardSave`,
      obj
    );
    if (result) {
      setOpen({ ...open, cards: false });
      generateCard("a", "Reset");
      Swal.fire({
        icon: "success",
        title: "Your Card has been Saved",
      });
    }
  };

  // get the card details and set it setcardCollections state
  const getCards = async (action) => {
    let obj = {};
    obj["userID"] = user.userID;
    obj["collection"] = "Cards";
    let getResult = await axios.post(
      `http://${path.Location}:${path.Port}/GetCards`,
      obj
    );
    if (getResult) {
      setcardCollections(getResult.data);
      setcardData({
        ...cardData,
        Generate: undefined,
      });
    }
  };

  //for template reset
  const templateLayoutReset = () => {
    setHideTempLayout(false);
    setOthers({
      ...others,
      Rows: "",
      Cols: {},
      selectedLayout: "1X2",
      cardLayout: "",
    });
    setState({
      ...state,
      CardLayoutswatch: false,
    });
    others.selectedLayout = "1X2";
    others.cardLayout = "";
    settempOthers({});
    if (others.CustomLayouts && document.getElementById("NOCharts")) {
      document.getElementById("NOCharts").value = "";
    }
    setError({
      ...error,
      Disable: others.CustomLayouts && others.Rows !== "" ? false : true,
    });
    setError({
      ...error,
      Disable: others.StaticLayouts && hideTempLayout ? false : true,
    });
    setIsshow({ ...show, isShow: undefined });
  };

  return (
    <>
      {/* {progress.loader &&
              < LoadingSpinner />
          } */}
      <div
        className="nav-bar col-xs-1  col-sm-1 col-md-1 col-lg-1"
        style={{
          width: navwidth.navArea,
          // borderRight: navopen ? "1px solid rgb(0 0 0 / 13%)" : "",
          backgroundColor: "#f7f5f526",
        }}
      >
        {/* {navopen && */}
        <NavIcons />
        {/* } */}
      </div>
      {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 divchart" style={{ width: navwidth.inuptArea, overflowY: `${!navopen ? 'hidden' : 'auto'}`, padding: `${navopen ? '' : '0px'}` }}> */}
      <div
        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 divchart"
        style={{
          height: "calc(94vh)",
          width: navwidth.inuptArea,
          overflowY: `${!navopen ? "hidden" : "auto"}`,
          padding: `${navopen ? "" : "0px"}`,
          borderRight: "3px #f1f1f1 solid",
        }}
      >
        <div className="nav-close">
          {navopen ? (
            <BootstrapTooltip
              title="Collapse"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              placement="right"
            >
              <ArrowLeftIcon
                onClick={(e) => {
                  ExpandCollapse();
                }}
                fontSize="medium"
                style={{ cursor: "pointer" }}
              />
            </BootstrapTooltip>
          ) : (
            ""
          )}
        </div>
        <>
          <Chartheader param={navbar.bar} />

          {navbar.bar === "Cards" ? (
            <div className="mt-5">
              <Accordion className="acd">
                <AccordionSummary
                  className="acdsummary"
                  expandIcon={<ExpandMoreIcon />}
                  //     expanded={'true'}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{ width: "100%" }}
                >
                  <Typography className="acdTitle">Card Label</Typography>
                </AccordionSummary>

                <AccordionDetails className="acdDetails">
                  <Typography>
                    <div className="col-lg-12" style={{ marginBottom: "10px" }}>
                      <div className="col-lg-12">
                        <div style={{ margin: "10px 0px 10px 10px" }}>
                          <div className="row-parent">
                            <div className="row width-xlg">
                              <TextField
                                id="CardTitle"
                                error={formValues.CardTitle.error}
                                className="input-field"
                                name="CardTitle"
                                label="Card Title"
                                variant="outlined"
                                value={cardData.CardTitle}
                                onChange={handleCardChange}
                                maxLength={20}
                              />
                            </div>
                          </div>
                          {formValues.CardTitle.error && (
                            <FormHelperText error id="username-error">
                              {formValues.CardTitle.errorMessage}
                            </FormHelperText>
                          )}
                          <p className="row col-lg-12 subTitle">Text Style</p>
                          <div className="row-parent">
                            <div className="row width-lg">
                              <TextField
                                id="cardFont"
                                select
                                name="CardFont"
                                label="Font Family"
                                className="input-field "
                                value={cardData.CardFont}
                                onChange={handleCardChange}
                                defaultValue={"Arial"}
                              >
                                {Fonts.map((option, index) => (
                                  <MenuItem key={option} value={option}>
                                    <span style={{ fontFamily: option }}>
                                      {option}
                                    </span>
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                            <div className="row width-mid-md">
                              <TextField
                                id="CardFontSize"
                                select
                                name="CardFontSize"
                                label="Size"
                                className="input-field"
                                value={cardData.CardFontSize}
                                onChange={handleCardChange}
                                defaultValue={"18"}
                              >
                                {(() => {
                                  let Item = [];
                                  for (let i = 10; i <= 20; i++) {
                                    Item.push(
                                      <MenuItem key={i} value={i}>
                                        {" "}
                                        <span
                                          style={{
                                            fontSize: `${i}px`,
                                          }}
                                        >
                                          {i}
                                        </span>{" "}
                                      </MenuItem>
                                    );
                                  }
                                  return Item;
                                })()}
                              </TextField>
                            </div>
                            <div className="" style={{ width: "20%" }}>
                              <input
                                type="color"
                                name="cardColor"
                                value={cardData.cardColor}
                                defaultValue={"#000000"}
                                id="cardColorPicker"
                                onChange={handleCardChange}
                              ></input>
                            </div>
                          </div>

                          {/* start Bg color */}
                          <p className="row col-lg-12 subTitle">Background</p>
                          <div className="row-parent">
                            <div className="row" style={{ width: "20%" }}>
                              <input
                                type="color"
                                name="cardBGColor"
                                value={cardData.cardBGColor}
                                defaultValue={"#6282b3"}
                                id="cardBGColor"
                                onChange={handleCardChange}
                              ></input>
                            </div>
                          </div>
                          <p className="row col-lg-12 subTitle">Border Style</p>
                          <div className="row-parent">
                            <div className="row width-lg">
                              <TextField
                                type="text"
                                id="Color"
                                className="input-field"
                                value={cardData.cardThickness}
                                name="cardThickness"
                                label="Width"
                                variant="outlined"
                                defaultValue={cardData.cardThickness || "0"}
                                onChange={(e) => {
                                  let inputValue = e.target.value;
                                  // Remove any non-numeric characters
                                  inputValue = inputValue.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  handleCardChange({
                                    target: {
                                      name: e.target.name,
                                      value: inputValue,
                                    },
                                  });
                                }}
                              />
                            </div>
                            <div className="" style={{ width: "20%" }}>
                              <input
                                type="color"
                                name="borderTickColor"
                                value={cardData.borderTickColor}
                                defaultValue={"#000000"}
                                id="cardDataPicker"
                                onChange={handleCardChange}
                              ></input>
                            </div>
                          </div>

                          {/* End BG Color */}
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion className="acd">
                <AccordionSummary
                  className="acdsummary"
                  expandIcon={<ExpandMoreIcon />}
                  //     expanded={'true'}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{ width: "100%" }}
                >
                  <Typography className="acdTitle">Card Value</Typography>
                </AccordionSummary>

                <AccordionDetails className="acdDetails">
                  <Typography>
                    <div className="col-lg-12" style={{ marginBottom: "10px" }}>
                      <div className="col-lg-12">
                        <div
                          className="row-parent"
                          style={{
                            justifyContent: "space-between",
                            paddingBottom: "10px",
                          }}
                        >
                          <div>
                            {cardData?.cardSwatch
                              ? "Dataset Value"
                              : "Static Value"}
                          </div>
                          <div>
                            {cardData?.dataType && (
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  name="cardSwatch"
                                  checked={cardData.cardSwatch}
                                  onChange={handleCardChange}
                                ></input>
                                <span className="slider round"></span>
                              </label>
                            )}
                          </div>
                        </div>
                        {cardData?.cardSwatch ? (
                          <div style={{ display: "flex" }}>
                            <div
                              className="row width-lg"
                              style={{ marginLeft: "10px" }}
                            >
                              <TextField
                                id="datasetData"
                                select
                                name="datasetData"
                                label="Data Values"
                                margin="dense"
                                value={cardData.datasetData}
                                className="input-field "
                                defaultValue={"select"}
                                onChange={handleCardChange}
                              >
                                <MenuItem key={-1} value={"Select"}>
                                  {"Select"}
                                </MenuItem>
                                {cardData?.dataType?.map((option, index) => (
                                  <MenuItem
                                    key={option["columns"]}
                                    value={option["columns"]}
                                  >
                                    {option["columns"]}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                            <div
                              className="row width-lg"
                              style={{ marginLeft: "10px" }}
                            >
                              <TextField
                                id="GroupBy"
                                select
                                name="GroupByCol"
                                label="Group By"
                                margin="dense"
                                value={cardData.GroupByCol}
                                className="input-field "
                                defaultValue={"Sum"}
                                onChange={handleCardChange}
                              >
                                {/* <MenuItem key={-1} value={"Select"}>
                                  {"Select"}
                                </MenuItem> */}
                                {GroupByCol?.map((option, index) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </div>
                        ) : (
                          <div style={{ margin: "10px 0px 10px 10px" }}>
                            <div className="row-parent">
                              <div className="row width-xlg">
                                <TextField
                                  id="CardValue"
                                  error={formValues.CardValue.error}
                                  className="input-field"
                                  name="CardValue"
                                  label="CardValue"
                                  variant="outlined"
                                  value={cardData.CardValue}
                                  onChange={handleCardChange}
                                />
                              </div>
                            </div>
                            {formValues.CardValue.error && (
                              <FormHelperText error id="username-error">
                                {formValues.CardValue.errorMessage}
                              </FormHelperText>
                            )}
                          </div>
                        )}
                        <div style={{ margin: "10px 0px 10px 10px" }}>
                          <p className="row col-lg-12 subTitle">Text Style</p>
                          <div className="row-parent">
                            <div className="row width-lg">
                              <TextField
                                id="CardValue"
                                select
                                name="CardValueFont"
                                label="Font Family"
                                className="input-field "
                                onChange={handleCardChange}
                                value={cardData.CardValueFont}
                                defaultValue={"Arial"}
                              >
                                {Fonts.map((option, index) => (
                                  <MenuItem key={option} value={option}>
                                    <span style={{ fontFamily: option }}>
                                      {option}
                                    </span>
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                            <div className="row width-mid-md">
                              <TextField
                                id="CardValue"
                                select
                                name="CardValueSize"
                                label="Size"
                                className="input-field "
                                onChange={handleCardChange}
                                value={cardData.CardValueSize}
                                defaultValue={"12"}
                              >
                                {(() => {
                                  let Item = [];
                                  for (let i = 10; i <= 20; i++) {
                                    Item.push(
                                      <MenuItem key={i} value={i}>
                                        {" "}
                                        <span
                                          style={{
                                            fontSize: `${i}px`,
                                          }}
                                        >
                                          {i}
                                        </span>{" "}
                                      </MenuItem>
                                    );
                                  }
                                  return Item;
                                })()}
                              </TextField>
                            </div>
                            <div className="" style={{ width: "20%" }}>
                              <input
                                type="color"
                                name="CardValueColor"
                                value={cardData.CardValueColor}
                                defaultValue={"#000000"}
                                id="cardcolorPicker"
                                onChange={handleCardChange}
                              ></input>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <div style={{ marginBottom: "15px", display: "flex" }}>
                <div className="row width-lg" style={{ marginLeft: "10px" }}>
                  <Button
                    variant="contained"
                    id="cardSave"
                    className="input-field button btn-primary"
                    size="small"
                    style={{ backgroundColor: "#6282b3" }}
                    onClick={() => {
                      if (cardData.action === "Edit") {
                        generateCard("a", "Update", cardData["_id"]);
                      } else {
                        if (
                          !cardData.CardTitle ||
                          cardData.CardValue === "" ||
                          cardData.CardValue === undefined ||
                          formValues.CardTitle.error ||
                          formValues.CardValue.error
                        ) {
                          Swal.fire({
                            icon: "error",
                            title: "Please fill Card Title and Card value",
                          });
                          return;
                        }
                        setFormValues({
                          ...formValues,
                          CardName: {
                            ...formValues.CardName,
                            error: false,
                            errorMessage: "CardName should not be empty",
                          },
                        });
                        setOpen({ ...open, cards: true });
                      }
                    }}
                  >
                    {cardData.action === "Edit" ? "Update" : "Save"}
                  </Button>
                </div>
                {cardData.action === "Edit" ? (
                  <>
                    <div
                      className="row width-lg"
                      style={{ marginLeft: "10px" }}
                    >
                      <Button
                        // disabled={disable}
                        variant="contained"
                        id="cardSave"
                        className="input-field button btn-primary"
                        size="small"
                        style={{ backgroundColor: "#6282b3" }}
                        onClick={() => {
                          Swal.fire({
                            icon: "success",
                            title: "Your Card updation has been cancelled",
                          });
                          setNavbar({ bar: "Templates" });
                          setcardData({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div
                      className="row width-lg"
                      style={{ marginLeft: "10px" }}
                    >
                      <Button
                        // disabled={disable}
                        variant="contained"
                        id="cardReset"
                        className="input-field button btn-primary"
                        size="small"
                        style={{ backgroundColor: "#6282b3" }}
                        onClick={(e) => {
                          generateCard("a", "UpdateReset", cardData["_id"]);
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="row width-lg" style={{ marginLeft: "10px" }}>
                    <Button
                      // disabled={disable}
                      variant="contained"
                      id="cardReset"
                      className="input-field button btn-primary"
                      size="small"
                      style={{ backgroundColor: "#6282b3" }}
                      onClick={(e) => {
                        generateCard("a", "Reset");
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                )}

                <div className="row width-lg" style={{ marginLeft: "10px" }}>
                  <Button
                    // disabled={disable}
                    variant="contained"
                    id="cardGenerate"
                    className="input-field button btn-primary"
                    style={{ backgroundColor: "#6282b3" }}
                    onClick={(e) => generateCard()}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {navbar.bar === "Data" && (
            <div
              className="row col-xs-12 col-sm-12 col-md-12 col-lg-12"
              style={{ margin: "0px 0px 0px 13px" }}
            >
              {/* Commented by Deepa --Dropdown options not needed */}
              {/* <div
                className="row col-sm-6 col-md-6 col-lg-5"
                style={{ width: "200px" }}
              >
                <TextField
                  error={formValues.InputType.error}
                  helperText={
                    formValues.InputType.error &&
                    formValues.InputType.errorMessage
                  }
                  id="InputType"
                  select
                  name="InputType"
                  label="Input Type"
                  defaultValue={"Enter Inputs"}
                  className="input-field "
                  onChange={(e) => {
                    handleValidation(e);
                    handleChange(e);
                  }}
                  value={state.InputType}
                >                 
                  <MenuItem key={1} value={"Import Inputs"}>
                    Import Inputs
                  </MenuItem>
                  <MenuItem key={2} value={"Enter Inputs"}>
                    Enter Inputs
                  </MenuItem>
                  <MenuItem key={3} value={"Available Dataset"}>
                    Available Dataset
                  </MenuItem>
                </TextField>
              </div> */}
              {state.InputType === "Import Inputs" ||
              state.InputType === undefined ? (
                <div className="row col-sm-6 col-md-6 col-lg-7">
                  <input
                    type="file"
                    name="file"
                    id="importInputs"
                    accept=".json"
                    onChange={importInputs}
                  ></input>
                </div>
              ) : (
                ""
              )}
            </div>
          )}

          {error.invalidInputs !== undefined && (
            <div
              className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
              style={{ margin: "15px" }}
            >
              <Alert severity="error">{error.invalidInputs}</Alert>
            </div>
          )}

          {navbar.bar === "Data" ? (
            <div>
              <div className=" col-lg-12" style={{ marginBottom: "15px" }}>
                <label className="drop-container">
                  <span className="drop-title">Drop files here</span>
                  <span style={{ padding: "0px 0px" }}>OR</span>
                  <input
                    ref={inputRef}
                    type="file"
                    name="file"
                    id="uploadFile"
                    accept=".csv, .json, .xlsx, .xls"
                    onChange={handleChange}
                  ></input>
                  <div style={{ margin: "-8px" }}>
                    <img
                      src={info}
                      style={{ width: "25px", margin: "5px" }}
                    ></img>
                    Only upload an Excel, CSV, or JSON file.
                  </div>
                </label>
              </div>
              {error.invalidFile !== undefined && (
                <div
                  className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
                  style={{ margin: "15px" }}
                >
                  <Alert severity="error">{error.invalidFile}</Alert>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          {/* {state.InputType === "Available Dataset" && navbar.bar === "Data" ? (
            <>
              {(() => {
                let Item = [];
                for (let a in Dataset) {
                  if (Dataset[a] !== undefined) {
                    Item.push(
                      <div className="row col-lg-12 divdataset-body">
                        <BootstrapTooltip
                          title={Dataset[a]["filename"]}
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="bottom"
                        >
                          <div
                            className="col-lg-6 dataset-name"
                            style={{ width: "187px" }}
                          >
                            {Dataset[a]["filename"]}
                          </div>
                        </BootstrapTooltip>
                        <div className="row col-lg-4 dataset-icon">
                          <div
                            className="col-lg-5 dataset-icon_ buttonwid"
                            onClick={(e) => {
                              handleDataSet(
                                "Use",
                                Dataset[a]["filename"],
                                Dataset[a]["_id"]
                              );
                            }}
                          >
                            Use
                          </div>
                          <div
                            className="col-lg-5 dataset-icon_ buttonwid"
                            onClick={(e) => {
                              handleDataSet("Delete", Dataset[a]["filename"]);
                            }}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                if (Item.length === 0) {
                  Item.push(
                    <div className="row col-lg-12 divdataset-body">
                      <div className="col-lg-10 dataset-name">
                        No Dataset Found !!!
                      </div>
                    </div>
                  );
                }
                return Item;
              })()}
            </>
          ) : (
            ""
          )} */}
          {
            //state.Uploaded_file !== undefined &&
            // state.InputType === "Enter Inputs" &&
            navbar.bar === "Data" ? (
              <>
                {/* <div className="row width-lg" style={{ marginLeft: "10px" }}>
                <Button
                        variant="contained"
                        className="input-field button"
                        style={{ backgroundColor: "#6282b3", float: "left" }}
                        onClick={(e) => {SaveData(e,"Insert");}}>Available Dataset</Button>
                          </div>
                <div className="row width-lg" style={{ marginLeft: "10px" }}>
                {enablesavebutton ? (                    
                    <Button
                        variant="contained"
                        className="input-field button"
                        style={{ backgroundColor: "#6282b3", float: "right" }}
                        onClick={(e) => {SaveData(e,"Insert");}}>Save Data</Button>
                  ) : (
                    ""
                  )}
                            
                          </div> */}
                <div
                  className="row col-sm-6 col-md-3 col-lg-5"
                  style={{ margin: "4px" }}
                >
                  {/* <Button
                  variant="contained"
                  className="input-field button"
                  style={{ backgroundColor: "#6282b3", float: "right" }}
                  onClick={(e) => {
                    setData({ data: state.Uploaded_file });
                    setIsshow({ isShow: undefined });
                    setIssues(undefined);
                  }}
                >
                  Show Data
                </Button> */}

                  {/* {enablesavebutton ? (
                    <Button
                      variant="contained"
                      className="input-field button"
                      style={{ backgroundColor: "#6282b3", float: "right" }}
                      onClick={(e) => {
                        SaveData(e, "Insert");
                      }}
                    >
                      Save Data
                    </Button>
                  ) : (
                    ""
                  )} */}
                </div>
                <div className="custom-title">
                  <b>Available Dataset</b>
                  <div style={{ marginBottom: "3px" }}></div>
                  {(() => {
                    let Item = [];
                    for (let a in Dataset) {
                      if (Dataset[a] !== undefined) {
                        Item.push(
                          <div className="row col-lg-12 divdataset-body">
                            <div className="dataset-tooltip-expand expand-tooltip">
                              <div
                                className="dataset-name"
                                data-title={Dataset[a]["filename"]}
                              >
                                {Dataset[a]["filename"]}
                              </div>
                            </div>
                            <div
                              className="dataset-icon dataset-icon_ buttonwid text-center use-div-button"
                              onClick={(e) => {
                                handleDataSet(
                                  "Use",
                                  Dataset[a]["filename"],
                                  Dataset[a]["_id"]
                                );
                              }}
                            >
                              Use
                            </div>
                            <div
                              className="dataset-icon dataset-icon_ buttonwid text-center delete-div-button"
                              onClick={(e) => {
                                handleDataSet(
                                  "Delete",
                                  Dataset[a]["filename"],
                                  Dataset[a]["_id"]
                                );
                              }}
                            >
                              Delete
                            </div>
                          </div>
                          // </div>
                        );
                      }
                    }
                    if (Item.length === 0) {
                      Item.push(
                        <div className="row col-lg-12 divdataset-body">
                          <div className="col-lg-10 dataset-name">
                            No Dataset Found !!!
                          </div>
                        </div>
                      );
                    }
                    return Item;
                  })()}
                </div>
              </>
            ) : (
              ""
            )
          }
          {/* {state.Uploaded_file === undefined && state.InputType === 'Enter Inputs' && navbar.bar === 'Data' ?
                      <div style={{ color: 'red' }}>Use the file with the less than 300 records for better experience, We are working on for boosting up.</div>
                      : ''
                  } */}
          {(state.Uploaded_file !== undefined &&
            error.invalidInputs === undefined) ||
          template !== undefined ? (
            <>
              {navbar.bar === "Charts" || navbar.bar === "Templates" ? (
                <div
                  className="row col-sm-12 col-md-12 col-lg-12"
                  style={{ margin: "0px 0px 15px 0px" }}
                >
                  {(enable.Imported || state.Uploaded_file !== undefined) &&
                  navbar.bar === "Charts" ? (
                    <div
                      className="row col-xs-12 col-sm-12 col-md-12 col-lg-12"
                      style={{ marginLeft: "10px" }}
                    >
                      {/* <div className="row-parent"> */}
                      <div className="row width-lg" style={{ padding: "0px" }}>
                        <TextField
                          error={formValues.Chart.error}
                          helperText={
                            formValues.Chart.error &&
                            formValues.Chart.errorMessage
                          }
                          id="ChartType"
                          select
                          name="Chart"
                          label="Chart Type*"
                          value={state.Chart}
                          className="input-field "
                          onChange={(e) => {
                            handleValidation(e);
                            handleChange(e);
                            setFlag(false);
                            resetMandatoryFields();
                          }}
                          defaultValue={"Select"}
                          disabled={flag === true ? true : false}
                        >
                          <MenuItem key={-1} value={"Select"}>
                            {"Select"}
                          </MenuItem>
                          {ChartType.map((option, index) => (
                            <MenuItem
                              key={option}
                              value={option}
                              style={{ maxHeight: " 250px !important" }}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      {/* Chart width, height block*/}
                      <div className="row-parent">
                        <div className="row width-lg">
                          <TextField
                            error={formValues.Heigth_.error}
                            helperText={
                              formValues.Heigth_.error &&
                              formValues.Heigth_.errorMessage
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  Px
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            id="Height"
                            className="input-field"
                            name="Heigth_"
                            label="Height*"
                            variant="outlined"
                            value={state.Heigth_}
                            margin="dense"
                            size="small"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Use a regular expression to allow only numeric input
                              if (/^\d*$/.test(inputValue)) {
                                handleChange(e);
                              }
                            }}
                            onBlur={(e) => {
                              handleValidation(e);
                            }}
                          />
                        </div>
                        <div
                          className="width-lg"
                          style={{ marginLeft: "10px" }}
                        >
                          <TextField
                            error={formValues.Width_.error}
                            helperText={
                              formValues.Width_.error &&
                              formValues.Width_.errorMessage
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  Px
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            id="Width"
                            className="input-field"
                            name="Width_"
                            label="Width*"
                            variant="outlined"
                            value={state.Width_}
                            margin="dense"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Use a regular expression to allow only numeric input
                              if (/^\d*$/.test(inputValue)) {
                                handleChange(e);
                              }
                            }}
                            onBlur={(e) => {
                              handleValidation(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {(enable.Imported || state.Uploaded_file !== undefined) &&
                  navbar.bar === "Charts" ? (
                    <>
                      <Accordion className="acd">
                        <AccordionSummary
                          className="acdsummary"
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className="acdTitle">
                            Dimensions
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div
                              className="col-lg-12"
                              style={{ margin: "10px" }}
                            >
                              {(state.Chart === "Pie Chart" ||
                                state.Chart === "Sunburst Chart") && (
                                <div className="col-lg-12">
                                  {/* <div className="row col-lg-12"> */}
                                  <p className="row col-lg-12 subTitle">
                                    X-Axis
                                  </p>
                                  {state.Chart === "Pie Chart" ? (
                                    <div className="row width-xlg">
                                      <TextField
                                        error={formValues.XAxisCopy.error}
                                        helperText={
                                          formValues.XAxisCopy.error &&
                                          formValues.XAxisCopy.errorMessage
                                        }
                                        id="XAxis"
                                        select
                                        name="XAxisCopy"
                                        label={
                                          <Fragment>
                                            <BootstrapTooltip
                                              title="Accepts numbers"
                                              TransitionComponent={Fade}
                                              TransitionProps={{ timeout: 600 }}
                                              placement="bottom"
                                            >
                                              <Numbers fontSize="small" />
                                            </BootstrapTooltip>
                                            &nbsp;
                                            <BootstrapTooltip
                                              title="Accepts strings"
                                              TransitionComponent={Fade}
                                              TransitionProps={{ timeout: 600 }}
                                              placement="bottom"
                                            >
                                              <span
                                                style={{ fontWeight: "700" }}
                                              >
                                                ABC
                                              </span>
                                            </BootstrapTooltip>
                                            &nbsp;
                                            <span style={{ fontWeight: "900" }}>
                                              *
                                            </span>
                                          </Fragment>
                                        }
                                        className="input-field "
                                        margin="dense"
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={(e) => {
                                          handleValidation(e);
                                        }}
                                        value={state.XAxisCopy}
                                        defaultValue={"Select"}
                                      >
                                        <MenuItem key={-1} value={"Select"}>
                                          {"Select"}
                                        </MenuItem>
                                        {state.XAxis_?.map((option, index) => (
                                          <MenuItem key={option} value={option}>
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="row-parent">
                                        <div className="row width-xlg">
                                          <FormControl className="width-xlg">
                                            <InputLabel id="filter">
                                              <Fragment>
                                                <BootstrapTooltip
                                                  title="Accepts numbers"
                                                  TransitionComponent={Fade}
                                                  TransitionProps={{
                                                    timeout: 600,
                                                  }}
                                                  placement="bottom"
                                                >
                                                  <Numbers
                                                    fontSize="small"
                                                    style={{
                                                      fontWeight: "700",
                                                      fontSize: "11px",
                                                    }}
                                                  />
                                                </BootstrapTooltip>
                                                &nbsp;
                                                <BootstrapTooltip
                                                  title="Accepts strings"
                                                  TransitionComponent={Fade}
                                                  TransitionProps={{
                                                    timeout: 600,
                                                  }}
                                                  placement="bottom"
                                                >
                                                  {/* <Text style={{ height: '27px' }} /> */}
                                                  <span
                                                    style={{
                                                      fontWeight: "700",
                                                      fontSize: "11px",
                                                    }}
                                                  >
                                                    ABC
                                                  </span>
                                                </BootstrapTooltip>
                                                &nbsp;
                                                <span
                                                  style={{
                                                    fontWeight: "900",
                                                    fontSize: "11px",
                                                  }}
                                                >
                                                  *
                                                </span>
                                              </Fragment>
                                            </InputLabel>
                                            <Select
                                              labelId="demo-multiple-checkbox-label"
                                              id="demo-multiple-checkbox"
                                              multiple
                                              value={
                                                state.SunBurstX_Axis ===
                                                undefined
                                                  ? []
                                                  : state.SunBurstX_Axis
                                              }
                                              name="SunBurstX_Axis"
                                              onChange={(e) => {
                                                handleMultiselect(e);
                                                handleValidation(e);
                                              }}
                                              input={
                                                <OutlinedInput label="Tag" />
                                              }
                                              renderValue={(selected) =>
                                                selected.join(", ")
                                              }
                                              MenuProps={MenuProps}
                                              placeholder="Dimensions"
                                            >
                                              {state.XAxis_?.map((name) => (
                                                <MenuItem
                                                  key={name}
                                                  value={name}
                                                >
                                                  <Checkbox
                                                    checked={
                                                      state.SunBurstX_Axis ===
                                                      undefined
                                                        ? false
                                                        : state.SunBurstX_Axis.indexOf(
                                                            name
                                                          ) > -1
                                                    }
                                                  />
                                                  <ListItemText
                                                    key={name}
                                                    primary={name}
                                                  />
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                          {formValues.XAxisCopy.error && (
                                            <FormHelperText
                                              error
                                              id="XAxis"
                                              name="XAxisCopy"
                                              style={{ marginTop: "5px" }}
                                            >
                                              {
                                                formValues.XAxisCopy
                                                  .errorMessage
                                              }
                                            </FormHelperText>
                                          )}
                                        </div>
                                      </div>
                                      {/* Selected  X-axis for ordering */}
                                      {state.SunBurstX_Axis !== undefined &&
                                      state.SunBurstX_Axis.length > 1 ? (
                                        <div className="row-parent">
                                          <div className="row width-xlg">
                                            <div
                                              className=""
                                              style={{ padding: "0px" }}
                                            >
                                              <Ordering
                                                params={ItemOrderList}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                  <p className="row col-lg-12 subTitle">
                                    Y-Axis
                                  </p>
                                  <div className="row-parent">
                                    <div className="row width-lg">
                                      <TextField
                                        error={formValues.YAxisCopy.error}
                                        helperText={
                                          formValues.YAxisCopy.error &&
                                          formValues.YAxisCopy.errorMessage
                                        }
                                        id="YAxis"
                                        select
                                        name="YAxisCopy"
                                        label={
                                          <Fragment>
                                            <BootstrapTooltip
                                              title="Accepts numbers"
                                              TransitionComponent={Fade}
                                              TransitionProps={{ timeout: 600 }}
                                              placement="bottom"
                                            >
                                              <Numbers fontSize="small" />
                                            </BootstrapTooltip>
                                            <span style={{ fontWeight: "900" }}>
                                              *
                                            </span>
                                          </Fragment>
                                        }
                                        margin="dense"
                                        className="input-field "
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={(e) => {
                                          handleValidation(e);
                                        }}
                                        value={state.YAxisCopy}
                                        defaultValue={"Select"}
                                      >
                                        <MenuItem key={-1} value={"Select"}>
                                          {"Select"}
                                        </MenuItem>
                                        {state.YAxis_?.map((option, index) => (
                                          <MenuItem key={option} value={option}>
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                    <div
                                      className="row width-lg"
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <TextField
                                        id="GroupBy"
                                        select
                                        name="GroupByCol"
                                        label="Group By"
                                        margin="dense"
                                        value={state.GroupByCol}
                                        className="input-field "
                                        defaultValue={"Sum"}
                                        onChange={(e) => {
                                          handleValidation(e);
                                          handleChange(e);
                                          setFlag(false);
                                        }}
                                      >
                                        {GroupByCol?.map((option, index) => (
                                          <MenuItem key={option} value={option}>
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  </div>
                                  {/* </div> */}
                                  {/* <div className="row col-lg-12"> */}
                                  <p className="row col-lg-12 subTitle">
                                    Text Style
                                  </p>
                                  <div className="row-parent">
                                    <div className="row width-lg">
                                      <TextField
                                        //error={formValues.GroupBy.error}
                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                        id="Font"
                                        select
                                        name="xFont"
                                        label="Font"
                                        className="input-field "
                                        onChange={(e) => {
                                          handleValidation(e);
                                          handleChange(e);
                                        }}
                                        value={state.xFont}
                                      >
                                        {Fonts.map((option, index) => (
                                          <MenuItem key={option} value={option}>
                                            <span
                                              style={{ fontFamily: option }}
                                            >
                                              {option}
                                            </span>
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                    <div className="row width-mid-md">
                                      <TextField
                                        //error={formValues.GroupBy.error}
                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                        id="Font"
                                        select
                                        name="xSize"
                                        label="Size"
                                        className="input-field "
                                        onChange={(e) => {
                                          handleValidation(e);
                                          handleChange(e);
                                        }}
                                        value={state.xSize}
                                      >
                                        {(() => {
                                          let Item = [];
                                          for (let i = 10; i <= 20; i++) {
                                            Item.push(
                                              <MenuItem key={i} value={i}>
                                                {" "}
                                                <span
                                                  style={{ fontSize: `${i}px` }}
                                                >
                                                  {i}
                                                </span>{" "}
                                              </MenuItem>
                                            );
                                          }
                                          return Item;
                                        })()}
                                      </TextField>
                                    </div>
                                    <div className="" style={{ width: "20%" }}>
                                      <input
                                        type="color"
                                        name="pColor"
                                        value={state.pColor}
                                        id="colorPicker"
                                        onChange={handleChange}
                                      ></input>
                                    </div>
                                  </div>
                                  {/* </div> */}
                                </div>
                              )}

                              {state.Chart !== "Pie Chart" &&
                              state.Chart !== "Sunburst Chart" ? (
                                <>
                                  <div className="col-lg-12">
                                    <p className="row col-lg-12 subTitle">
                                      X-Axis
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-mlg">
                                        <TextField
                                          error={formValues.XAxisCopy.error}
                                          helperText={
                                            formValues.XAxisCopy.error &&
                                            formValues.XAxisCopy.errorMessage
                                          }
                                          id="XAxis"
                                          select
                                          name="XAxisCopy"
                                          label={
                                            <Fragment>
                                              {state.Chart !==
                                                "Series Chart" && (
                                                <BootstrapTooltip
                                                  title="Accepts numbers"
                                                  TransitionComponent={Fade}
                                                  TransitionProps={{
                                                    timeout: 600,
                                                  }}
                                                  placement="bottom"
                                                >
                                                  <Numbers fontSize="small" />
                                                </BootstrapTooltip>
                                              )}
                                              &nbsp;
                                              {state.Chart !== "ScatterPlot" &&
                                              state.Chart !== "Series Chart" ? ( //&&
                                                // state.Chart !== "Bar Line Chart"
                                                <BootstrapTooltip
                                                  title="Accepts strings"
                                                  TransitionComponent={Fade}
                                                  TransitionProps={{
                                                    timeout: 600,
                                                  }}
                                                  placement="bottom"
                                                >
                                                  {/* <Text fontSize="large" /> */}
                                                  <span
                                                    style={{
                                                      fontWeight: "700",
                                                    }}
                                                  >
                                                    ABC
                                                  </span>
                                                </BootstrapTooltip>
                                              ) : (
                                                ""
                                              )}
                                              &nbsp;
                                              {state.Chart === "Series Chart" &&
                                              state.Chart !==
                                                "Bar Line Chart" ? (
                                                <BootstrapTooltip
                                                  title="Accepts dates"
                                                  TransitionComponent={Fade}
                                                  TransitionProps={{
                                                    timeout: 600,
                                                  }}
                                                  placement="bottom"
                                                >
                                                  <Calendar fontSize="small" />
                                                </BootstrapTooltip>
                                              ) : (
                                                ""
                                              )}
                                              <span
                                                style={{ fontWeight: "900" }}
                                              >
                                                *
                                              </span>
                                            </Fragment>
                                          }
                                          className="input-field "
                                          value={state.XAxisCopy}
                                          margin="dense"
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                          onBlur={(e) => {
                                            handleValidation(e);
                                          }}
                                          defaultValue={"Select"}
                                        >
                                          <MenuItem key={-1} value={"Select"}>
                                            {"Select"}
                                          </MenuItem>
                                          {state.XAxis_?.map(
                                            (option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </MenuItem>
                                            )
                                          )}
                                        </TextField>
                                      </div>
                                      <div
                                        className="width-mid-md"
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <TextField
                                          error={formValues.YAxisPadding.error}
                                          helperText={
                                            formValues.YAxisPadding.error &&
                                            formValues.YAxisPadding.errorMessage
                                          }
                                          type="text"
                                          id="Rotate"
                                          className="input-field"
                                          name="Rotate"
                                          label="Rotate"
                                          variant="outlined"
                                          value={state.Rotate}
                                          margin="dense"
                                          onChange={(e) => {
                                            let inputValue = e.target.value;
                                            // Remove any non-numeric characters
                                            inputValue = inputValue.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                            handleChange({
                                              target: {
                                                name: e.target.name,
                                                value: inputValue,
                                              },
                                            });
                                          }}
                                          onBlur={(e) => {
                                            handleValidation(e);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    {/* <div className="row col-lg-12" style={{ marginTop: '10px' }}> */}
                                    <p className="row col-lg-12 subTitle">
                                      Text Style
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-lg">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="xFont"
                                          label="Font"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.xFont}
                                        >
                                          {Fonts.map((option, index) => (
                                            <MenuItem
                                              key={option}
                                              value={option}
                                            >
                                              <span
                                                style={{ fontFamily: option }}
                                              >
                                                {option}
                                              </span>
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                      <div className="row width-mid-md">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="xSize"
                                          label="Size"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.xSize}
                                        >
                                          {(() => {
                                            let Item = [];
                                            for (let i = 10; i <= 20; i++) {
                                              Item.push(
                                                <MenuItem key={i} value={i}>
                                                  {" "}
                                                  <span
                                                    style={{
                                                      fontSize: `${i}px`,
                                                    }}
                                                  >
                                                    {i}
                                                  </span>{" "}
                                                </MenuItem>
                                              );
                                            }
                                            return Item;
                                          })()}
                                        </TextField>
                                      </div>
                                      <div
                                        className=""
                                        style={{ width: "20%" }}
                                      >
                                        <input
                                          type="color"
                                          name="xColor"
                                          value={state.xColor}
                                          id="colorPicker"
                                          onChange={handleChange}
                                        ></input>
                                      </div>
                                    </div>
                                    {/* </div> */}
                                    {/* <div className=" col-lg-12" style={{ marginTop: '10px' }}> */}
                                    <p className="row col-lg-12 subTitle">
                                      Y-Axis
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-lg">
                                        <TextField
                                          error={formValues.YAxisCopy.error}
                                          helperText={
                                            formValues.YAxisCopy.error &&
                                            formValues.YAxisCopy.errorMessage
                                          }
                                          id="YAxis"
                                          select
                                          name="YAxisCopy"
                                          label={
                                            <Fragment>
                                              <BootstrapTooltip
                                                title="Accepts numbers"
                                                TransitionComponent={Fade}
                                                TransitionProps={{
                                                  timeout: 600,
                                                }}
                                                placement="bottom"
                                              >
                                                <Numbers fontSize="small" />
                                              </BootstrapTooltip>
                                              <span
                                                style={{ fontWeight: "900" }}
                                              >
                                                *
                                              </span>
                                            </Fragment>
                                          }
                                          value={state.YAxisCopy}
                                          className="input-field "
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                          defaultValue={"Select"}
                                          margin="dense"
                                          onBlur={(e) => {
                                            handleValidation(e);
                                          }}
                                        >
                                          <MenuItem key={-1} value={"Select"}>
                                            {"Select"}
                                          </MenuItem>
                                          {state.YAxis_?.map(
                                            (option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </MenuItem>
                                            )
                                          )}
                                        </TextField>
                                      </div>
                                      <div className="row width-lg removeGutter">
                                        <TextField
                                          id="GroupBy"
                                          select
                                          name="GroupByCol"
                                          label="Group By"
                                          margin="dense"
                                          value={state.GroupByCol}
                                          className="input-field "
                                          defaultValue={"Sum"}
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                            setFlag(false);
                                          }}
                                        >
                                          {GroupByCol.map((option, index) => (
                                            <MenuItem
                                              key={option}
                                              value={option}
                                            >
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                    </div>
                                    {/* {state.Chart === "Bar Chart" && (
                                      <div className="row-parent">
                                        <div className="row width-lg">
                                          <TextField
                                            error={
                                              formValues.YAxisPadding.error
                                            }
                                            helperText={
                                              formValues.YAxisPadding.error &&
                                              formValues.YAxisPadding
                                                .errorMessage
                                            }
                                            type="number"
                                            id="YAxisPadding"
                                            className="input-field"
                                            name="YAxisPadding"
                                            label="Y-Axis Padding*"
                                            variant="outlined"
                                            value={state.YAxisPadding}
                                            margin="dense"
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )} */}
                                    {/* <div className="row col-lg-12"> */}
                                    <p className="row col-lg-12 subTitle">
                                      Text Style
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-lg">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="yFont"
                                          label="Font"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.yFont}
                                        >
                                          {Fonts.map((option, index) => (
                                            <MenuItem
                                              key={option}
                                              value={option}
                                            >
                                              <span
                                                style={{ fontFamily: option }}
                                              >
                                                {option}
                                              </span>
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                      <div className="row width-mid-md">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="ySize"
                                          label="Size"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.ySize}
                                        >
                                          {(() => {
                                            let Item = [];
                                            for (let i = 10; i <= 20; i++) {
                                              Item.push(
                                                <MenuItem key={i} value={i}>
                                                  {" "}
                                                  <span
                                                    style={{
                                                      fontSize: `${i}px`,
                                                    }}
                                                  >
                                                    {i}
                                                  </span>{" "}
                                                </MenuItem>
                                              );
                                            }
                                            return Item;
                                          })()}
                                        </TextField>
                                      </div>
                                      <div
                                        className=""
                                        style={{ width: "20%" }}
                                      >
                                        <input
                                          type="color"
                                          name="yColor"
                                          value={state.yColor}
                                          id="colorPicker"
                                          onChange={handleChange}
                                        ></input>
                                      </div>
                                    </div>
                                    {/* </div> */}
                                    {/* </div> */}
                                  </div>
                                  {state.Chart === "Composite Chart" ||
                                  state.Chart === "Series Chart" ? (
                                    <div className="row-parent">
                                      <div className="row width-xlg">
                                        <TextField
                                          error={formValues.GroupByCopy.error}
                                          helperText={
                                            formValues.GroupByCopy.error &&
                                            formValues.GroupByCopy.errorMessage
                                          }
                                          id="GroupBy"
                                          select
                                          name="GroupByCopy"
                                          label={
                                            <Fragment>
                                              <BootstrapTooltip
                                                title="Accepts strings"
                                                TransitionComponent={Fade}
                                                TransitionProps={{
                                                  timeout: 600,
                                                }}
                                                placement="bottom"
                                              >
                                                {/* <Text fontSize="large" /> */}
                                                <span
                                                  style={{ fontWeight: "700" }}
                                                >
                                                  ABC
                                                </span>
                                              </BootstrapTooltip>

                                              {state.Chart !==
                                              "Composite Chart" ? (
                                                <BootstrapTooltip
                                                  title="Accepts numbers"
                                                  TransitionComponent={Fade}
                                                  TransitionProps={{
                                                    timeout: 600,
                                                  }}
                                                  placement="bottom"
                                                >
                                                  <Numbers fontSize="small" />
                                                </BootstrapTooltip>
                                              ) : (
                                                ""
                                              )}
                                              <span
                                                style={{ fontWeight: "900" }}
                                              >
                                                *
                                              </span>
                                            </Fragment>
                                          }
                                          className="input-field "
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                          onBlur={(e) => {
                                            handleValidation(e);
                                          }}
                                          value={state.GroupByCopy}
                                          defaultValue={"Select"}
                                        >
                                          <MenuItem key={-1} value={"Select"}>
                                            {"Select"}
                                          </MenuItem>
                                          {state.GroupByCopy_?.map(
                                            (option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </MenuItem>
                                            )
                                          )}
                                        </TextField>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {state.Chart === "Bar Line Chart" ? (
                                    <div
                                      className="col-lg-12"
                                      style={{ marginTop: "10px" }}
                                    >
                                      <div className="col-lg-12">
                                        <p className="row col-lg-12 subTitle">
                                          Right Y-Axis
                                        </p>
                                        <div className="row-parent">
                                          <div className="row width-xlg">
                                            <TextField
                                              error={
                                                formValues.GroupByCopy.error
                                              }
                                              helperText={
                                                formValues.GroupByCopy.error &&
                                                formValues.GroupByCopy
                                                  .errorMessage
                                              }
                                              id="GroupBy"
                                              select
                                              name="GroupByCopy"
                                              label={
                                                <Fragment>
                                                  <BootstrapTooltip
                                                    title="Accepts numbers"
                                                    TransitionComponent={Fade}
                                                    TransitionProps={{
                                                      timeout: 600,
                                                    }}
                                                    placement="bottom"
                                                  >
                                                    <Numbers fontSize="small" />
                                                  </BootstrapTooltip>
                                                  <span
                                                    style={{
                                                      fontWeight: "900",
                                                    }}
                                                  >
                                                    *
                                                  </span>
                                                </Fragment>
                                              }
                                              className="input-field "
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                              onBlur={(e) => {
                                                handleValidation(e);
                                              }}
                                              value={state.GroupByCopy}
                                              defaultValue={"Select"}
                                            >
                                              <MenuItem
                                                key={-1}
                                                value={"Select"}
                                              >
                                                {"Select"}
                                              </MenuItem>
                                              {state.YAxis_?.map(
                                                (option, index) => (
                                                  <MenuItem
                                                    key={option}
                                                    value={option}
                                                  >
                                                    {option}
                                                  </MenuItem>
                                                )
                                              )}
                                            </TextField>
                                          </div>
                                        </div>
                                        <div className="row-parent">
                                          {/* <p className="row col-lg-12">Text Style</p> */}
                                          <div className="row width-lg">
                                            <TextField
                                              //error={formValues.GroupBy.error}
                                              // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                              id="Font"
                                              select
                                              name="ryFont"
                                              label="Font"
                                              className="input-field "
                                              onChange={(e) => {
                                                handleValidation(e);
                                                handleChange(e);
                                              }}
                                              value={state.ryFont}
                                              defaultValue={"Arial"}
                                            >
                                              {Fonts.map((option, index) => (
                                                <MenuItem
                                                  key={option}
                                                  value={option}
                                                >
                                                  <span
                                                    style={{
                                                      fontFamily: option,
                                                    }}
                                                  >
                                                    {option}
                                                  </span>
                                                </MenuItem>
                                              ))}
                                            </TextField>
                                          </div>
                                          <div className="row width-mid-md">
                                            <TextField
                                              //error={formValues.GroupBy.error}
                                              // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                              id="Font"
                                              select
                                              name="rySize"
                                              label="Size"
                                              className="input-field "
                                              onChange={(e) => {
                                                handleValidation(e);
                                                handleChange(e);
                                              }}
                                              value={state.rySize}
                                              defaultValue={"12"}
                                            >
                                              {(() => {
                                                let Item = [];
                                                for (let i = 10; i <= 20; i++) {
                                                  Item.push(
                                                    <MenuItem key={i} value={i}>
                                                      {" "}
                                                      <span
                                                        style={{
                                                          fontSize: `${i}px`,
                                                        }}
                                                      >
                                                        {i}
                                                      </span>{" "}
                                                    </MenuItem>
                                                  );
                                                }
                                                return Item;
                                              })()}
                                            </TextField>
                                          </div>
                                          <div
                                            className=""
                                            style={{ width: "20%" }}
                                          >
                                            <input
                                              type="color"
                                              name="ryColor"
                                              value={state.ryColor}
                                              id="colorPicker"
                                              onChange={handleChange}
                                            ></input>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      {state.Chart !== "Pie Chart" ? (
                        // {(enable.Imported || state.Uploaded_file !== undefined) && (state.Chart !== 'Pie Chart') && (navbar.bar === 'Charts') ?
                        <Accordion className="acd">
                          <AccordionSummary
                            className="acdsummary"
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className="acdTitle">
                              Axes Labels
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div
                                className="col-lg-12"
                                style={{ marginBottom: "10px" }}
                              >
                                <div className="col-lg-12">
                                  <div
                                    className="row-parent"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div>Axes</div>
                                    <div>
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          name="Axesswatch"
                                          checked={state.Axesswatch_}
                                          onChange={handleShowProps}
                                        ></input>
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  {state.Axesswatch_ && (
                                    <div
                                      style={{ margin: "10px 0px 10px 10px" }}
                                    >
                                      <p className="row col-lg-12 subTitle">
                                        X-Axis
                                      </p>
                                      <div className="row-parent">
                                        <div className="row width-xlg">
                                          <TextField
                                            id="XAxisLabel"
                                            className="input-field"
                                            name="XAxisLabel"
                                            label="X-AxisLabel"
                                            variant="outlined"
                                            value={state.XAxisLabel}
                                            onChange={handleChange}
                                          />
                                        </div>
                                      </div>
                                      <p className="row col-lg-12 subTitle">
                                        Text Style
                                      </p>
                                      <div className="row-parent">
                                        <div className="row width-lg">
                                          <TextField
                                            //error={formValues.GroupBy.error}
                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                            id="Font"
                                            select
                                            name="xlFont"
                                            label="Font"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.xlFont}
                                            defaultValue={"Arial"}
                                          >
                                            {Fonts.map((option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                <span
                                                  style={{ fontFamily: option }}
                                                >
                                                  {option}
                                                </span>
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </div>
                                        <div className="row width-mid-md">
                                          <TextField
                                            //error={formValues.GroupBy.error}
                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                            id="Font"
                                            select
                                            name="xlSize"
                                            label="Size"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.xlSize}
                                            defaultValue={"14"}
                                          >
                                            {(() => {
                                              let Item = [];
                                              for (let i = 10; i <= 20; i++) {
                                                Item.push(
                                                  <MenuItem key={i} value={i}>
                                                    {" "}
                                                    <span
                                                      style={{
                                                        fontSize: `${i}px`,
                                                      }}
                                                    >
                                                      {i}
                                                    </span>{" "}
                                                  </MenuItem>
                                                );
                                              }
                                              return Item;
                                            })()}
                                          </TextField>
                                        </div>
                                        <div
                                          className=""
                                          style={{ width: "20%" }}
                                        >
                                          <input
                                            type="color"
                                            name="xlColor"
                                            value={state.xlColor}
                                            defaultValue={"#000000"}
                                            id="colorPicker"
                                            onChange={handleChange}
                                          ></input>
                                        </div>
                                      </div>
                                      <p className="row col-lg-12 subTitle">
                                        Y-Axis
                                      </p>
                                      <div className="row-parent">
                                        <div className="row width-lg">
                                          <TextField
                                            id="YAxisLabel"
                                            className="input-field"
                                            name="YAxisLabel"
                                            label="Y-AxisLabel"
                                            variant="outlined"
                                            value={state.YAxisLabel}
                                            onChange={handleChange}
                                          />
                                        </div>
                                      </div>
                                      <p className="row col-lg-12 subTitle">
                                        Text Style
                                      </p>
                                      <div className="row-parent">
                                        <div className="row width-lg">
                                          <TextField
                                            //error={formValues.GroupBy.error}
                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                            id="Font"
                                            select
                                            name="ylFont"
                                            label="Font"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.ylFont}
                                            defaultValue={"Arial"}
                                          >
                                            {Fonts.map((option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                <span
                                                  style={{ fontFamily: option }}
                                                >
                                                  {option}
                                                </span>
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </div>
                                        <div className="row width-mid-md">
                                          <TextField
                                            //error={formValues.GroupBy.error}
                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                            id="Font"
                                            select
                                            name="ylSize"
                                            label="Size"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.ylSize}
                                            defaultValue={"14"}
                                          >
                                            {(() => {
                                              let Item = [];
                                              for (let i = 10; i <= 20; i++) {
                                                Item.push(
                                                  <MenuItem key={i} value={i}>
                                                    {" "}
                                                    <span
                                                      style={{
                                                        fontSize: `${i}px`,
                                                      }}
                                                    >
                                                      {i}
                                                    </span>{" "}
                                                  </MenuItem>
                                                );
                                              }
                                              return Item;
                                            })()}
                                          </TextField>
                                        </div>
                                        <div
                                          className=""
                                          style={{ width: "20%" }}
                                        >
                                          <input
                                            type="color"
                                            name="ylColor"
                                            value={state.ylColor}
                                            defaultValue={"#000000"}
                                            id="colorPicker"
                                            onChange={handleChange}
                                          ></input>
                                        </div>
                                      </div>
                                      {state.Chart === "Bar Line Chart" && (
                                        <>
                                          <p className="row col-lg-12 subTitle">
                                            Right Y-Axis
                                          </p>
                                          <div className="row-parent">
                                            <div className="row width-lg">
                                              <TextField
                                                id="YAxisLabel"
                                                className="input-field"
                                                name="RYAxisLabel"
                                                label="Right Y-Axis Label"
                                                variant="outlined"
                                                value={state.RYAxisLabel}
                                                margin="dense"
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="row-parent">
                                            <div className="row width-lg">
                                              <TextField
                                                //error={formValues.GroupBy.error}
                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                id="Font"
                                                select
                                                name="rylFont"
                                                label="Font"
                                                className="input-field "
                                                onChange={(e) => {
                                                  handleValidation(e);
                                                  handleChange(e);
                                                }}
                                                value={state.rylFont}
                                                defaultValue={"Arial"}
                                              >
                                                {Fonts.map((option, index) => (
                                                  <MenuItem
                                                    key={option}
                                                    value={option}
                                                  >
                                                    <span
                                                      style={{
                                                        fontFamily: option,
                                                      }}
                                                    >
                                                      {option}
                                                    </span>
                                                  </MenuItem>
                                                ))}
                                              </TextField>
                                            </div>
                                            <div className="row width-mid-md">
                                              <TextField
                                                //error={formValues.GroupBy.error}
                                                // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                                id="Font"
                                                select
                                                name="rylSize"
                                                label="Size"
                                                className="input-field "
                                                onChange={(e) => {
                                                  handleValidation(e);
                                                  handleChange(e);
                                                }}
                                                value={state.rylSize}
                                                defaultValue={"12"}
                                              >
                                                {(() => {
                                                  let Item = [];
                                                  for (
                                                    let i = 10;
                                                    i <= 20;
                                                    i++
                                                  ) {
                                                    Item.push(
                                                      <MenuItem
                                                        key={i}
                                                        value={i}
                                                      >
                                                        {" "}
                                                        <span
                                                          style={{
                                                            fontSize: `${i}px`,
                                                          }}
                                                        >
                                                          {i}
                                                        </span>{" "}
                                                      </MenuItem>
                                                    );
                                                  }
                                                  return Item;
                                                })()}
                                              </TextField>
                                            </div>
                                            <div
                                              className=""
                                              style={{ width: "20%" }}
                                            >
                                              <input
                                                type="color"
                                                name="rylColor"
                                                value={state.rylColor}
                                                defaultValue={"#000000"}
                                                id="colorPicker"
                                                onChange={handleChange}
                                              ></input>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ) : (
                        ""
                      )}
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
                            <div
                              className="col-lg-12"
                              style={{ marginBottom: "10px" }}
                            >
                              <div className="col-lg-12">
                                <div
                                  className="row-parent"
                                  style={{ justifyContent: "space-between" }}
                                >
                                  <div>Title</div>
                                  <div>
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        name="Titleswatch"
                                        checked={state.Titleswatch_}
                                        onChange={handleShowProps}
                                      ></input>
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </div>
                                {state.Titleswatch_ && (
                                  <div style={{ margin: "10px 0px 10px 10px" }}>
                                    {/* <p className="row col-lg-12">Title</p> */}
                                    <div className="row-parent">
                                      <div className="row width-xlg">
                                        <TextField
                                          error={formValues.Title.error}
                                          helperText={
                                            formValues.Title.error &&
                                            formValues.Title.errorMessage
                                          }
                                          id="Title"
                                          className="input-field"
                                          name="Title"
                                          label="Title"
                                          variant="outlined"
                                          value={state.Title}
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                        />
                                        {/* <SketchPicker /> */}
                                      </div>
                                    </div>
                                    <p className="row col-lg-12 subTitle">
                                      Text Style
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-lg">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="TitleFont"
                                          label="Font"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.TitleFont}
                                          defaultValue={"Arial"}
                                        >
                                          {Fonts.map((option, index) => (
                                            <MenuItem
                                              key={option}
                                              value={option}
                                            >
                                              <span
                                                style={{ fontFamily: option }}
                                              >
                                                {option}
                                              </span>
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                      <div className="row width-mid-md">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="TitleSize"
                                          label="Size"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.TitleSize}
                                          defaultValue={"18"}
                                        >
                                          {(() => {
                                            let Item = [];
                                            for (let i = 10; i <= 30; i++) {
                                              Item.push(
                                                <MenuItem key={i} value={i}>
                                                  {" "}
                                                  <span
                                                    style={{
                                                      fontSize: `${i}px`,
                                                    }}
                                                  >
                                                    {i}
                                                  </span>{" "}
                                                </MenuItem>
                                              );
                                            }
                                            return Item;
                                          })()}
                                        </TextField>
                                      </div>
                                      <div
                                        className=""
                                        style={{ width: "20%" }}
                                      >
                                        <input
                                          type="color"
                                          name="TitleColor"
                                          value={state.TitleColor}
                                          defaultValue={"#000000"}
                                          id="colorPicker"
                                          onChange={handleChange}
                                        ></input>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      {navbar.bar === "Charts" &&
                      state.Chart !== "Bar Chart" &&
                      state.Chart !== "Line Chart" &&
                      state.Chart !== "ScatterPlot" ? (
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
                              <div
                                className="col-lg-12"
                                style={{ marginBottom: "15px" }}
                              >
                                <div className="col-lg-12">
                                  <div
                                    className="row-parent"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div>Legend</div>
                                    <div>
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          name="Legendswatch"
                                          checked={state.Legendswatch_}
                                          onChange={handleShowProps}
                                        ></input>
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  {state.Legendswatch_ && (
                                    <div
                                      style={{ margin: "10px 0px 10px 10px" }}
                                    >
                                      <div className="row-parent">
                                        <div className="row width-xlg">
                                          <TextField
                                            // error={formValues.InputType.error}
                                            // helperText={formValues.InputType.error && formValues.InputType.errorMessage}
                                            id="LengendPosition"
                                            select
                                            name="LengendPosition"
                                            label="Position"
                                            className="Horizontal"
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.LengendPosition}
                                            defaultValue={false}
                                          >
                                            <MenuItem key={1} value={true}>
                                              Horizontal
                                            </MenuItem>
                                            <MenuItem key={2} value={false}>
                                              Vertical
                                            </MenuItem>
                                          </TextField>
                                        </div>
                                      </div>
                                      <p className="row col-lg-12 subTitle">
                                        Text Style
                                      </p>
                                      <div className="row-parent">
                                        <div className="row width-lg">
                                          <TextField
                                            //error={formValues.GroupBy.error}
                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                            id="Font"
                                            select
                                            name="LegendFont"
                                            label="Font"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.LegendFont}
                                            defaultValue={"Arial"}
                                          >
                                            {Fonts.map((option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                <span
                                                  style={{ fontFamily: option }}
                                                >
                                                  {option}
                                                </span>
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </div>
                                        <div className="row width-mid-md">
                                          <TextField
                                            //error={formValues.GroupBy.error}
                                            // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                            id="Font"
                                            select
                                            name="LegendSize"
                                            label="Size"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.LegendSize}
                                            defaultValue={"12"}
                                          >
                                            {(() => {
                                              let Item = [];
                                              for (let i = 10; i <= 20; i++) {
                                                Item.push(
                                                  <MenuItem key={i} value={i}>
                                                    {" "}
                                                    <span
                                                      style={{
                                                        fontSize: `${i}px`,
                                                      }}
                                                    >
                                                      {i}
                                                    </span>{" "}
                                                  </MenuItem>
                                                );
                                              }
                                              return Item;
                                            })()}
                                          </TextField>
                                        </div>
                                        <div
                                          className=""
                                          style={{ width: "20%" }}
                                        >
                                          <input
                                            type="color"
                                            name="LegendColor"
                                            value={state.LegendColor}
                                            defaultValue={"#000000"}
                                            id="colorPicker"
                                            onChange={handleChange}
                                          ></input>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ) : (
                        ""
                      )}
                      {navbar.bar === "Charts" && (
                        <Accordion className="acd">
                          <AccordionSummary
                            className="acdsummary"
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className="acdTitle">
                              Tooltip&nbsp;
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div
                                className="col-lg-12"
                                style={{ marginBottom: "10px" }}
                              >
                                <div
                                  className="row-parent"
                                  style={{ justifyContent: "space-between" }}
                                >
                                  <div>Tooltip</div>
                                  <div>
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        name="Tooltipswatch"
                                        checked={state.Tooltipswatch_}
                                        onChange={handleShowProps}
                                      ></input>
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </div>
                                {state.Tooltipswatch_ && (
                                  <div style={{ margin: "10px 0px 10px 10px" }}>
                                    <div className="row-parent">
                                      <div className="row width-xlg">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="TContent"
                                          select
                                          name="TooltipContent"
                                          label="Content"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          defaultValue={"All"}
                                          value={state.TooltipContent}
                                          style={{ marginTop: "10px" }}
                                        >
                                          {TooltipContent.map(
                                            (option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </MenuItem>
                                            )
                                          )}
                                          {state.Chart === "Composite Chart" ||
                                          state.Chart === "Series Chart" ? (
                                            //|| state.Chart === "Bar Line Chart"  commented by franklin - in barline chart show an empty
                                            <MenuItem
                                              key={"Group"}
                                              value={"Group"}
                                            >
                                              {"Group"}
                                            </MenuItem>
                                          ) : (
                                            ""
                                          )}
                                        </TextField>
                                      </div>
                                    </div>
                                    <p className="row col-lg-12 subTitle">
                                      Text Style
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-lg">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="TooltipFont"
                                          label="Font"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.TooltipFont}
                                          defaultValue={"Arial"}
                                        >
                                          {Fonts.map((option, index) => (
                                            <MenuItem
                                              key={option}
                                              value={option}
                                            >
                                              <span
                                                style={{ fontFamily: option }}
                                              >
                                                {option}
                                              </span>
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                      <div className="row width-mid-md">
                                        <TextField
                                          //error={formValues.GroupBy.error}
                                          // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                          id="Font"
                                          select
                                          name="TooltipSize"
                                          label="Size"
                                          className="input-field "
                                          onChange={(e) => {
                                            handleValidation(e);
                                            handleChange(e);
                                          }}
                                          value={state.TooltipSize}
                                          defaultValue={"14"}
                                        >
                                          {(() => {
                                            let Item = [];
                                            for (let i = 10; i <= 20; i++) {
                                              Item.push(
                                                <MenuItem key={i} value={i}>
                                                  {" "}
                                                  <span
                                                    style={{
                                                      fontSize: `${i}px`,
                                                    }}
                                                  >
                                                    {i}
                                                  </span>{" "}
                                                </MenuItem>
                                              );
                                            }
                                            return Item;
                                          })()}
                                        </TextField>
                                      </div>
                                      <div
                                        className=""
                                        style={{ width: "20%" }}
                                      >
                                        <input
                                          type="color"
                                          name="TooltipColor"
                                          value={state.TooltipColor}
                                          defaultValue={"#ffffff"}
                                          id="colorPicker"
                                          onChange={handleChange}
                                        ></input>
                                      </div>
                                    </div>
                                    <p className="row col-lg-12 subTitle">
                                      Background
                                    </p>
                                    <div className="row-parent">
                                      <div
                                        className="row"
                                        style={{ width: "20%" }}
                                      >
                                        <input
                                          type="color"
                                          name="TooltipBGColor"
                                          value={state.TooltipBGColor}
                                          defaultValue={"#6282b3"}
                                          id="TooltipBGColor"
                                          onChange={handleChange}
                                        ></input>
                                      </div>
                                    </div>
                                    <p className="row col-lg-12 subTitle">
                                      Border Style
                                    </p>
                                    <div className="row-parent">
                                      <div className="row width-lg">
                                        <TextField
                                          type="text"
                                          id="Color"
                                          className="input-field"
                                          value={state.TooltipThickness}
                                          name="TooltipThickness"
                                          label="Width"
                                          variant="outlined"
                                          defaultValue={
                                            state.TooltipThickness || "0"
                                          }
                                          // onChange={handleChange}
                                          onChange={(e) => {
                                            let inputValue = e.target.value;
                                            // Remove any non-numeric characters
                                            inputValue = inputValue.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                            handleChange({
                                              target: {
                                                name: e.target.name,
                                                value: inputValue,
                                              },
                                            });
                                          }}
                                        />
                                      </div>
                                      <div
                                        className=""
                                        style={{ width: "20%" }}
                                      >
                                        <input
                                          type="color"
                                          name="TooltipTickColor"
                                          value={state.TooltipTickColor}
                                          defaultValue={"#000000"}
                                          id="colorPicker"
                                          onChange={handleChange}
                                        ></input>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      )}
                      {navbar.bar === "Charts" &&
                        state.Chart !== "Sunburst Chart" && (
                          <Accordion className="acd">
                            <AccordionSummary
                              className="acdsummary"
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography className="acdTitle">
                                Data Labels&nbsp;
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography>
                                <div
                                  className="col-lg-12"
                                  style={{ marginBottom: "10px" }}
                                >
                                  <div
                                    className="row-parent"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div>Data Labels</div>
                                    <div>
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          name="Labelsswatch"
                                          checked={state.Labelsswatch_}
                                          onChange={handleShowProps}
                                        ></input>
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                  {state.Labelsswatch_ && (
                                    <div
                                      style={{ margin: "10px 0px 10px 10px" }}
                                    >
                                      <div className="row-parent">
                                        <div className="row width-xlg">
                                          <TextField
                                            id="TContent"
                                            select
                                            name="LabelsContent"
                                            label="Content"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            defaultValue={"X"}
                                            value={state.LabelsContent}
                                            style={{ marginTop: "10px" }}
                                          >
                                            {LablesContent.map(
                                              (option, index) => (
                                                <MenuItem
                                                  key={option}
                                                  value={option}
                                                >
                                                  {option}
                                                </MenuItem>
                                              )
                                            )}
                                          </TextField>
                                        </div>
                                      </div>
                                      <p className="row col-lg-12 subTitle">
                                        Text Style
                                      </p>
                                      <div className="row-parent">
                                        <div className="row width-lg">
                                          <TextField
                                            id="Font"
                                            select
                                            name="LabelsFont"
                                            label="Font"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.LabelsFont}
                                            defaultValue={"Arial"}
                                          >
                                            {Fonts.map((option, index) => (
                                              <MenuItem
                                                key={option}
                                                value={option}
                                              >
                                                <span
                                                  style={{ fontFamily: option }}
                                                >
                                                  {option}
                                                </span>
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </div>
                                        <div className="row width-mid-md">
                                          <TextField
                                            id="Font"
                                            select
                                            name="LabelsSize"
                                            label="Size"
                                            className="input-field "
                                            onChange={(e) => {
                                              handleValidation(e);
                                              handleChange(e);
                                            }}
                                            value={state.LabelsSize}
                                            defaultValue={"12"}
                                          >
                                            {(() => {
                                              let Item = [];
                                              for (let i = 10; i <= 20; i++) {
                                                Item.push(
                                                  <MenuItem key={i} value={i}>
                                                    {" "}
                                                    <span
                                                      style={{
                                                        fontSize: `${i}px`,
                                                      }}
                                                    >
                                                      {i}
                                                    </span>{" "}
                                                  </MenuItem>
                                                );
                                              }
                                              return Item;
                                            })()}
                                          </TextField>
                                        </div>
                                        <div
                                          className=""
                                          style={{ width: "20%" }}
                                        >
                                          <input
                                            type="color"
                                            name="LabelsColor"
                                            value={state.LabelsColor}
                                            defaultValue={"#000000"}
                                            id="colorPicker"
                                            onChange={handleChange}
                                          ></input>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        )}
                    </>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Pie Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">Pie</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className="col-lg-12">
                            <div style={{ marginLeft: "10px 0px 10px 10px" }}>
                              <div className="row-parent">
                                <div className="row width-lg">
                                  <TextField
                                    error={formValues.Innerradius.error}
                                    helperText={
                                      formValues.Innerradius.error &&
                                      formValues.Innerradius.errorMessage
                                    }
                                    type="text"
                                    id="Innerradius"
                                    className="input-field"
                                    name="Innerradius"
                                    label="Innerradius*"
                                    variant="outlined"
                                    value={state.Innerradius}
                                    onChange={(e) => {
                                      let inputValue = e.target.value;
                                      // Remove any non-numeric characters
                                      inputValue = inputValue.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      e.target.value = inputValue; // Update the input value
                                      if (/^\d*$/.test(inputValue)) {
                                        handleValidation(e);
                                        handleChange(e);
                                      }
                                    }}
                                  />
                                </div>
                                <div
                                  className="width-lg"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <TextField
                                    error={formValues.SlicesCap.error}
                                    helperText={
                                      formValues.SlicesCap.error &&
                                      formValues.SlicesCap.errorMessage
                                    }
                                    type="text"
                                    id="SlicesCap"
                                    className="input-field"
                                    name="SlicesCap"
                                    label="SlicesCap*"
                                    variant="outlined"
                                    value={state.SlicesCap}
                                    onChange={(e) => {
                                      let inputValue = e.target.value;
                                      // Remove any non-numeric characters
                                      inputValue = inputValue.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      e.target.value = inputValue; // Update the input value
                                      if (/^\d*$/.test(inputValue)) {
                                        handleValidation(e);
                                        handleChange(e);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="row-parent">
                                <div className="row width-lg">
                                  <TextField
                                    error={
                                      formValues.ExternalRadiusPadding.error
                                    }
                                    helperText={
                                      formValues.ExternalRadiusPadding.error &&
                                      formValues.ExternalRadiusPadding
                                        .errorMessage
                                    }
                                    type="text"
                                    id="ExternalRadiusPadding"
                                    className="input-field"
                                    name="ExternalRadiusPadding"
                                    label="ExternalRadiusPadding*"
                                    variant="outlined"
                                    value={state.ExternalRadiusPadding}
                                    margin="dense"
                                    onChange={(e) => {
                                      let inputValue = e.target.value;
                                      // Remove any non-numeric characters
                                      inputValue = inputValue.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      e.target.value = inputValue; // Update the input value
                                      if (inputValue > 80) {
                                        setFormValues({
                                          ...formValues,
                                          ExternalRadiusPadding: {
                                            value: 80,
                                            error: true,
                                            errorMessage:
                                              "The value should be less than 80",
                                          },
                                        });
                                      } else {
                                        handleValidation(e);
                                        handleChange(e);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '20px' }}> */}
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Pie</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Pieswatch"
                                    checked={state.Pieswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Pieswatch_ && (
                              <div style={{ margin: "10px" }}>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      value={state.BGColor}
                                      defaultValue={"#ffffff"}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Sunburst Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">
                          SunBurst&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography>
                          <div className="col-lg-12">
                            <div
                              className="row-parent"
                              style={{ marginLeft: "10px" }}
                            >
                              <div className="row width-lg">
                                <TextField
                                  error={formValues.Innerradius.error}
                                  helperText={
                                    formValues.Innerradius.error &&
                                    formValues.Innerradius.errorMessage
                                  }
                                  type="text"
                                  id="Innerradius"
                                  className="input-field"
                                  name="Innerradius"
                                  label="Innerradius*"
                                  variant="outlined"
                                  value={state.Innerradius}
                                  margin="dense"
                                  onChange={(e) => {
                                    let inputValue = e.target.value;
                                    // Remove any non-numeric characters
                                    inputValue = inputValue.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    e.target.value = inputValue; // Update the input value
                                    if (/^\d*$/.test(inputValue)) {
                                      handleValidation(e);
                                      handleChange(e);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>SunBurst</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Pieswatch"
                                    checked={state.Pieswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Pieswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      value={state.BGColor}
                                      defaultValue={"#ffffff"}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Bar Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">
                          Bar&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography>
                          <div className="col-lg-12">
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Bar</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Barswatch"
                                    checked={state.Barswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Barswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p className="row col-lg-12 subTitle">
                                  Padding
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "24%" }}>
                                    <TextField
                                      type="text"
                                      InputProps={{
                                        inputProps: { min: 0, max: 50 },
                                      }}
                                      id="PadTop"
                                      className="input-field"
                                      name="PadTop"
                                      label="Top"
                                      variant="outlined"
                                      value={state.PadTop}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                      style={{ fontSize: "10px" }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      InputProps={{
                                        inputProps: { min: 0, max: 50 },
                                      }}
                                      id="PadBottom"
                                      className="input-field"
                                      name="PadBottom"
                                      label="Bottom"
                                      variant="outlined"
                                      value={state.PadBottom}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      InputProps={{
                                        inputProps: { min: 0, max: 50 },
                                      }}
                                      id="PadRight"
                                      className="input-field"
                                      name="PadRight"
                                      label="Right"
                                      variant="outlined"
                                      value={state.PadRight}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      InputProps={{
                                        inputProps: { min: 0, max: 50 },
                                      }}
                                      id="PadLeft"
                                      className="input-field"
                                      name="PadLeft"
                                      label="Left"
                                      variant="outlined"
                                      value={state.PadLeft}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>

                                <p
                                  className="row col-lg-12 subTitle"
                                  style={{ marginTop: "10px" }}
                                >
                                  Bar Color
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="Color"
                                      value={state.Color}
                                      defaultValue={"#8495e6"}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      defaultValue={"#ffffff"}
                                      value={state.BGColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "ScatterPlot" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">
                          Scatter&nbsp;
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography>
                          <div className=" col-lg-12">
                            <div
                              className="row-parent"
                              style={{ marginLeft: "10px" }}
                            >
                              <div className="row width-lg">
                                <TextField
                                  error={formValues.SymbolSize.error}
                                  helperText={
                                    formValues.SymbolSize.error &&
                                    formValues.SymbolSize.errorMessage
                                  }
                                  type="text"
                                  id="SymbolSize"
                                  className="input-field"
                                  name="SymbolSize"
                                  label="SymbolSize*"
                                  variant="outlined"
                                  value={state.SymbolSize}
                                  onChange={(e) => {
                                    let inputValue = e.target.value;
                                    // Remove any non-numeric characters
                                    inputValue = inputValue.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    e.target.value = inputValue; // Update the input value
                                    if (/^\d*$/.test(inputValue)) {
                                      handleValidation(e);
                                      handleChange(e);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Scatter</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Scatterswatch"
                                    checked={state.Scatterswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Scatterswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p className="row col-lg-12 subTitle">
                                  Padding
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "24%" }}>
                                    <TextField
                                      type="text"
                                      id="PadTop"
                                      className="input-field"
                                      name="PadTop"
                                      label="Top"
                                      variant="outlined"
                                      value={state.PadTop}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadBottom"
                                      className="input-field"
                                      name="PadBottom"
                                      label="Bottom"
                                      variant="outlined"
                                      value={state.PadBottom}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadRight"
                                      className="input-field"
                                      name="PadRight"
                                      label="Right"
                                      variant="outlined"
                                      value={state.PadRight}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadLeft"
                                      className="input-field"
                                      name="PadLeft"
                                      label="Left"
                                      variant="outlined"
                                      value={state.PadLeft}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <p
                                  className="row col-lg-12 subTitle"
                                  style={{ marginTop: "10px" }}
                                >
                                  Color
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="Color"
                                      value={state.Color}
                                      defaultValue={"#8495e6"}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      defaultValue={"#ffffff"}
                                      value={state.BGColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Line Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">
                          Line&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className="col-lg-12">
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Line</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Lineswatch"
                                    checked={state.Lineswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Lineswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p className="row col-lg-12 subTitle">
                                  Padding
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "24%" }}>
                                    <TextField
                                      type="text"
                                      id="PadTop"
                                      className="input-field"
                                      name="PadTop"
                                      label="Top"
                                      variant="outlined"
                                      value={state.PadTop}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadBottom"
                                      className="input-field"
                                      name="PadBottom"
                                      label="Bottom"
                                      variant="outlined"
                                      value={state.PadBottom}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadRight"
                                      className="input-field"
                                      name="PadRight"
                                      label="Right"
                                      variant="outlined"
                                      value={state.PadRight}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadLeft"
                                      className="input-field"
                                      name="PadLeft"
                                      label="Left"
                                      variant="outlined"
                                      value={state.PadLeft}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <p
                                  className="row col-lg-12 subTitle"
                                  style={{ marginTop: "10px" }}
                                >
                                  Color
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="Color"
                                      value={state.Color}
                                      defaultValue={"#8495e6"}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      defaultValue={"#ffffff"}
                                      value={state.BGColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Series Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">
                          Series&nbsp;&nbsp;&nbsp;
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography>
                          <div className=" col-lg-12">
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Series</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Seriesswatch"
                                    checked={state.Seriesswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Seriesswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p className="row col-lg-12 subTitle">
                                  Padding
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "24%" }}>
                                    <TextField
                                      type="text"
                                      id="PadTop"
                                      className="input-field"
                                      name="PadTop"
                                      label="Top"
                                      variant="outlined"
                                      value={state.PadTop}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadBottom"
                                      className="input-field"
                                      name="PadBottom"
                                      label="Bottom"
                                      variant="outlined"
                                      value={state.PadBottom}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadRight"
                                      className="input-field"
                                      name="PadRight"
                                      label="Right"
                                      variant="outlined"
                                      value={state.PadRight}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadLeft"
                                      className="input-field"
                                      name="PadLeft"
                                      label="Left"
                                      variant="outlined"
                                      value={state.PadLeft}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <p
                                  className="row col-lg-12 subTitle"
                                  style={{ marginTop: "10px" }}
                                >
                                  Color
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="Color"
                                      value={state.Color}
                                      defaultValue={"#8495e6"}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      defaultValue={"#ffffff"}
                                      value={state.BGColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Composite Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
                    <Accordion className="acd">
                      <AccordionSummary
                        className="acdsummary"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className="acdTitle">
                          Composite&nbsp;&nbsp;
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography>
                          <div className="col-lg-12">
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Composite</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="Compositeswatch"
                                    checked={state.Compositeswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.Compositeswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p
                                  className="row col-lg-12"
                                  style={{ marginTop: "10px" }}
                                >
                                  Padding
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "24%" }}>
                                    <TextField
                                      type="text"
                                      id="PadTop"
                                      className="input-field"
                                      name="PadTop"
                                      label="Top"
                                      variant="outlined"
                                      value={state.PadTop}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadBottom"
                                      className="input-field"
                                      name="PadBottom"
                                      label="Bottom"
                                      variant="outlined"
                                      value={state.PadBottom}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadRight"
                                      className="input-field"
                                      name="PadRight"
                                      label="Right"
                                      variant="outlined"
                                      value={state.PadRight}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadLeft"
                                      className="input-field"
                                      name="PadLeft"
                                      label="Left"
                                      variant="outlined"
                                      value={state.PadLeft}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>

                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      defaultValue={"#ffffff"}
                                      value={state.BGColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {state.Chart === "Bar Line Chart" &&
                  navbar.bar === "Charts" &&
                  (enable.Imported || state.Uploaded_file !== undefined) ? (
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
                          <div className=" col-lg-12">
                            <div
                              className="row-parent inputfield"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div>Bar Line</div>
                              <div>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="BarLineswatch"
                                    checked={state.BarLineswatch_}
                                    onChange={handleShowProps}
                                  ></input>
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {state.BarLineswatch_ && (
                              <div style={{ margin: "10px 0px 10px 10px" }}>
                                <p
                                  className="row col-lg-12"
                                  style={{ marginTop: "10px" }}
                                >
                                  Padding
                                </p>

                                <div className="row-parent">
                                  <div className="row" style={{ width: "24%" }}>
                                    <TextField
                                      type="text"
                                      id="PadTop"
                                      className="input-field"
                                      name="PadTop"
                                      label="Top"
                                      variant="outlined"
                                      value={state.PadTop}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadBottom"
                                      className="input-field"
                                      name="PadBottom"
                                      label="Bottom"
                                      variant="outlined"
                                      value={state.PadBottom}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadRight"
                                      className="input-field"
                                      name="PadRight"
                                      label="Right"
                                      variant="outlined"
                                      value={state.PadRight}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div
                                    className=""
                                    style={{ width: "24%", marginLeft: "10px" }}
                                  >
                                    <TextField
                                      type="text"
                                      id="PadLeft"
                                      className="input-field"
                                      name="PadLeft"
                                      label="Left"
                                      variant="outlined"
                                      value={state.PadLeft}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        // Remove any non-numeric characters
                                        inputValue = inputValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                        e.target.value = inputValue; // Update the input value
                                        if (/^\d*$/.test(inputValue)) {
                                          handleValidation(e);
                                          handleChange(e);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">Color</p>

                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="Color"
                                      defaultValue={"#6282b3"}
                                      value={state.Color}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">
                                  Line Color
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="LineColor"
                                      defaultValue={"#FF0000"}
                                      value={state.LineColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                                <p className="row col-lg-12 subTitle">
                                  Background
                                </p>
                                <div className="row-parent">
                                  <div className="row" style={{ width: "20%" }}>
                                    <input
                                      type="color"
                                      name="BGColor"
                                      defaultValue={"#ffffff"}
                                      value={state.BGColor}
                                      id="colorPicker"
                                      onChange={handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    ""
                  )}
                  {flag && navbar.bar === "Charts" ? (
                    <div>
                      <TextField
                        id="TempDescription"
                        label="Description"
                        value={state.TempDescription}
                        name="TempDescription"
                        fullWidth
                        multiline
                        maxRows={4}
                        onChange={handleChange}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {navbar.bar === "Charts" && (
                    <div className="row-parent" style={{ marginTop: "10px" }}>
                      {state.Chart !== "Select" &&
                      state.Chart !== undefined &&
                      navbar.bar === "Charts" &&
                      flag === false ? (
                        <div
                          className="row width-lg"
                          style={{ marginLeft: "3px" }}
                        >
                          <Button
                            id="saveTemp"
                            variant="contained"
                            className="input-field button"
                            style={{
                              backgroundColor: "#6282b3",
                              lineHeight: "1rem",
                            }}
                            onClick={(e) => {
                              if (
                                state.XAxisCopy != "Select" &&
                                state.YAxisCopy != "Select" &&
                                !!state.Width_ &&
                                !!state.Heigth_
                              ) {
                                setOpen({ Template: true });
                              } else if (state.Chart === "Sunburst Chart") {
                                if (
                                  state.SunBurstX_Axis.length !== 0 &&
                                  state.YAxisCopy != "Select" &&
                                  !!state.Width_ &&
                                  !!state.Heigth_
                                ) {
                                  setOpen({ Template: true });
                                } else {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Please fill all mandatory fields",
                                  });
                                  return;
                                }
                              } else {
                                Swal.fire({
                                  icon: "warning",
                                  title: "Please fill all mandatory fields",
                                });
                                return;
                              }
                            }}
                          >
                            Save as Template
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                      {navbar.bar === "Charts" &&
                      state.Uploaded_file !== undefined &&
                      flag !== true ? (
                        <>
                          <div
                            className="row width-lg"
                            style={{ marginLeft: "10px" }}
                          >
                            <Button
                              // disabled={disable}
                              variant="contained"
                              id="ChartGen"
                              className="input-field button btn-primary"
                              // style={{
                              //   backgroundColor: "#6282b3",
                              //   border: "1px solid #2e89ff",
                              // }}
                              onClick={(e) => {
                                setProgress({ loader: true });
                                GenerateChart();
                              }}
                            >
                              Generate Chart
                            </Button>
                          </div>
                          <div
                            className="row width-lg"
                            style={{ marginLeft: "10px" }}
                          >
                            <Button
                              // disabled={disable}
                              variant="contained"
                              id="CancelChartGen"
                              className="input-field button btn-primary"
                              size="small"
                              // style={{
                              //   backgroundColor: "#6282b3",
                              //   border: "1px solid #2e89ff",
                              // }}
                              onClick={(e) => {
                                chartReset("Chart_Reset");
                                resetMandatoryFields();
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {state.Chart !== "Select" &&
                      state.Chart !== undefined &&
                      navbar.bar === "Charts" &&
                      flag === true ? (
                        <div
                          style={{
                            display: "flex",
                            marginTop: "10px",
                            flexWrap: "wrap",
                            width: "100%",
                          }}
                        >
                          <div
                            className="row width-mid-md"
                            style={{ width: "22%" }}
                          >
                            <Button
                              id="saveTemp"
                              variant="contained"
                              className="input-field button"
                              style={{
                                backgroundColor: "#6282b3",
                                lineHeight: "1rem",
                              }}
                              onClick={(e) => {
                                if (
                                  formValues["Heigth_"]["error"] ||
                                  formValues["Width_"]["error"] ||
                                  formValues["XAxisCopy"]["error"] ||
                                  formValues["YAxisCopy"]["error"]
                                )
                                  return;
                                else saveTemplate("update");
                              }}
                            >
                              Update
                            </Button>
                          </div>
                          <div
                            className="row width-mid-md"
                            style={{ width: "22%" }}
                          >
                            <Button
                              id="saveTemp"
                              variant="contained"
                              className="input-field button "
                              style={{
                                backgroundColor: "#6282b3",
                                lineHeight: "1rem",
                              }}
                              onClick={(e) => {
                                saveTemplate("cancel");
                                resetMandatoryFields();
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                          <div
                            className="row width-lg"
                            style={{ marginLeft: "10px", width: "22%" }}
                          >
                            <Button
                              // disabled={disable}
                              variant="contained"
                              id="CancelChartGen"
                              className="input-field button "
                              size="small"
                              style={{ backgroundColor: "#6282b3" }}
                              onClick={(e) => {
                                chartReset("TemplateReset");
                                resetMandatoryFields();
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                          <div
                            className="row width-lg"
                            style={{ marginLeft: "10px", width: "22%" }}
                          >
                            <Button
                              // disabled={disable}
                              variant="contained"
                              id="CancelChartGen"
                              className="input-field button "
                              size="small"
                              style={{ backgroundColor: "#6282b3" }}
                              onClick={(e) => GenerateChart()}
                            >
                              Preview
                            </Button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}

                  {/* {(navbar.bar === 'Templates') && (enable.Imported || state.Uploaded_file !== undefined) ? */}
                  {navbar.bar === "Templates" ? (
                    <>
                      <Accordion className="acd">
                        <AccordionSummary
                          className="acdsummary"
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className="acdTitle">
                            <img
                              alt="Saved Template"
                              src={Saved_Templates}
                              style={{ marginRight: "10px" }}
                            ></img>
                            Chart Collections
                            <span
                              className="txtOrdinary"
                              style={{ marginLeft: "5px" }}
                            >
                              {`(${Object.keys(template).length})`}
                            </span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            {(() => {
                              let Item = [],
                                AllCharts = [];
                              for (let a in template) {
                                if (template[a] !== undefined) {
                                  Item.push(
                                    <div
                                      // className="col-lg-12 dashboard-layout"
                                      className={`col-lg-12 dashboard-layout ${
                                        clickedIndex === a ? "clicked" : ""
                                      }`}
                                      id={a}
                                      key={a}
                                      onClick={(e) => handleBackgroundChange(a)}
                                    >
                                      <div className="row col-lg-12 template-container-title">
                                        <div
                                          className="col-lg-2"
                                          onClick={(e) => {
                                            handleTemplate(
                                              a,
                                              "Preview",
                                              template[a]["_id"]
                                            );
                                          }}
                                        >
                                          <div
                                            className="row"
                                            style={{ marginLeft: "15px" }}
                                          >
                                            <DashboardIcons
                                              e={template[a].Chart}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          className="col-lg-8"
                                          onClick={(e) => {
                                            handleTemplate(
                                              a,
                                              "Preview",
                                              template[a]["_id"]
                                            );
                                          }}
                                        >
                                          <div className="col-sm-12 col-md-12 col-lg-12">
                                            {a}
                                          </div>
                                          <div className="col-sm-12 col-md-12 col-lg-12">
                                            {template[a].TempDescription}
                                          </div>
                                        </div>
                                        <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                          <BootstrapTooltip
                                            title="Edit"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 600 }}
                                            placement="bottom"
                                          >
                                            <img
                                              src={Edit}
                                              id={a}
                                              color="white"
                                              alt="Logo"
                                              onClick={(e) => {
                                                handleTemplate(
                                                  a,
                                                  "Edit",
                                                  template[a]["_id"]
                                                );
                                              }}
                                            ></img>
                                          </BootstrapTooltip>
                                        </div>
                                        <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                          <BootstrapTooltip
                                            title="Delete"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 600 }}
                                            placement="bottom"
                                          >
                                            <img
                                              src={Remove}
                                              id={a}
                                              color="white"
                                              alt="Logo"
                                              style={{ height: "20px" }}
                                              onClick={(e) => {
                                                handleTemplate(
                                                  a,
                                                  "templeDelete",
                                                  template[a]["_id"]
                                                );
                                              }}
                                              // onClick={(e) => openDelete()}
                                            ></img>
                                          </BootstrapTooltip>
                                          {/* <ConfirmBox
                                            open={openDialog}
                                            message={
                                              "Are you sure you want to delete?"
                                            }
                                            closeDialog={() => {
                                              setOpenDialog(false);
                                            }}
                                            deleteFunction={() => {
                                              deleteTemplateFunction(a);
                                            }}
                                          /> */}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              }
                              if (Item.length === 0) {
                                Item.push(
                                  <div className="col-lg-12 container-template">
                                    <div className="row col-lg-12 container-title">
                                      No Charts Found !!!
                                    </div>
                                  </div>
                                );
                              }
                              return Item;
                            })()}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      {/* commented by franklin */}
                      {/* <Accordion className="acd">
                        <AccordionSummary
                          className="acdsummary"
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className="acdTitle">
                            <img
                              src={Pre_Templates}
                              style={{ marginRight: "10px" }}
                            ></img>
                            Template Collections{" "}
                            <span
                              className="txtOrdinary"
                              style={{ marginLeft: "5px" }}
                            >{`(${Object.keys(TemplatesCollections).length
                              })`}</span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div className="row col-sm-12 col-md-12 col-lg-12 Collections">
                              <>
                                {(() => {
                                  let Item = [];
                                  for (let a in TemplatesCollections) {
                                    if (TemplatesCollections[a] !== undefined) {
                                      Item.push(
                                        <div
                                          className="box box-down cyan"
                                          style={{
                                            cursor: "pointer",
                                            padding: "20px 0px 20px 20px",
                                          }}
                                          id={a}
                                          onClick={(e) => {
                                            GetPreDefinedTemplates(
                                              "Preview",
                                              e
                                            );
                                          }}
                                        >
                                          <div className="container-title">
                                            <div style={{ display: "flex" }}>
                                              <div className="col-lg-3">
                                                <DashboardIcons
                                                  e={
                                                    TemplatesCollections[a]
                                                      .Chart
                                                  }
                                                />
                                              </div>
                                              <div
                                                className="col-lg-8 semi-bold-sm"
                                                style={{ textAlign: "left" }}
                                              >
                                                <div className="col-sm-12 col-md-12 col-lg-12 txtOrdinary">
                                                  {
                                                    TemplatesCollections[a]
                                                      .Chart
                                                  }
                                                </div>
                                                <div
                                                  className="col-sm-12 col-md-12 col-lg-12 semi-bold"
                                                  style={{ marginTop: "5px" }}
                                                >
                                                  {
                                                    TemplatesCollections[a]
                                                      .TempName
                                                  }
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="">
                                            <div
                                              style={{
                                                overflowWrap: "anywhere",
                                                marginTop: "10px",
                                              }}
                                              className="col-sm-12 col-md-12 col-lg-12 txtOrdinary"
                                            >
                                              {
                                                TemplatesCollections[a]
                                                  .TempDescription
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  }
                                  if (Item.length === 0) {
                                    Item.push(
                                      <div
                                        className="col-lg-12 none-tamplate"
                                        onClick={(e) => {
                                          setNavbar({ bar: "Data" });
                                        }}
                                      >
                                        Please Create any template
                                      </div>
                                    );
                                  }
                                  return Item;
                                })()}
                              </>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion> */}

                      {/* Cards list */}
                      <Accordion className="acd">
                        <AccordionSummary
                          className="acdsummary"
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className="acdTitle">
                            <img
                              src={Pre_Templates}
                              style={{ marginRight: "10px" }}
                            ></img>
                            Card Collections{" "}
                            <span
                              className="txtOrdinary"
                              style={{ marginLeft: "5px" }}
                            >{`(${cardCollections.length || 0})`}</span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            {/*  className= Collections */}
                            <div className="row col-sm-12 col-md-12 col-lg-12 ">
                              <>
                                {(() => {
                                  let Item = [],
                                    AllCharts = [];
                                  for (let a in cardCollections) {
                                    if (cardCollections[a] !== undefined) {
                                      Item.push(
                                        <div
                                          className={`col-lg-12 dashboard-layout ${
                                            clickedIndex === a ? "clicked" : ""
                                          }`}
                                          id={a}
                                          key={a}
                                          onClick={(e) =>
                                            handleBackgroundChange(a)
                                          }
                                        >
                                          <div className="row col-lg-12 template-container-title">
                                            <div
                                              className="col-sm-1 col-md-1 col-lg-2"
                                              style={{
                                                marginLeft: "15px",
                                                paddingRight: "10%",
                                              }}
                                            >
                                              <img
                                                src={CardIcon}
                                                style={{
                                                  marginRight: "10px",
                                                  height: "20px",
                                                  opacity: "0.9",
                                                }}
                                              ></img>
                                            </div>
                                            <div
                                              className="col-lg-7"
                                              onClick={(e) => {
                                                generateCard(
                                                  a,
                                                  "Preview",
                                                  cardCollections[a]["_id"]
                                                );
                                              }}
                                            >
                                              <div className="col-sm-12 col-md-12 col-lg-12">
                                                {cardCollections[a]?.CardName}
                                              </div>
                                              <div className="col-sm-12 col-md-12 col-lg-12">
                                                {
                                                  cardCollections[a]
                                                    ?.CardDescription
                                                }
                                              </div>
                                            </div>
                                            <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                              <BootstrapTooltip
                                                title="Edit"
                                                TransitionComponent={Fade}
                                                TransitionProps={{
                                                  timeout: 600,
                                                }}
                                                placement="bottom"
                                              >
                                                <img
                                                  src={Edit}
                                                  id={a}
                                                  color="white"
                                                  alt="Logo"
                                                  onClick={(e) => {
                                                    generateCard(
                                                      a,
                                                      "Edit",
                                                      cardCollections[a]["_id"]
                                                    );
                                                  }}
                                                ></img>
                                              </BootstrapTooltip>
                                            </div>
                                            <div className="col-sm-1 col-md-1 col-lg-1 TemplateIcon">
                                              <BootstrapTooltip
                                                title="Delete"
                                                TransitionComponent={Fade}
                                                TransitionProps={{
                                                  timeout: 600,
                                                }}
                                                placement="bottom"
                                              >
                                                <img
                                                  src={Remove}
                                                  id={a}
                                                  color="white"
                                                  alt="Logo"
                                                  style={{ height: "20px" }}
                                                  onClick={(e) => {
                                                    generateCard(
                                                      a,
                                                      "Delete",
                                                      cardCollections[a]["_id"]
                                                    );
                                                  }}
                                                ></img>
                                              </BootstrapTooltip>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  }
                                  if (Item.length === 0) {
                                    Item.push(
                                      <div className="col-lg-12 container-template">
                                        <div className="row col-lg-12 container-title">
                                          No Cards Found !!!
                                        </div>
                                      </div>
                                    );
                                  }
                                  return Item;
                                })()}
                              </>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}

          {navbar.bar === "Demo" && (
            <div
              className="row col-sm-12 col-md-12 col-lg-12"
              style={{ margin: "15px 0px 15px 0px" }}
            >
              <div className="col-sm-12 col-md-4 col-lg-4"></div>
              <div className="row1-container">
                <div className="box box-down cyan" style={{ width: "unset" }}>
                  <h2>SpectraIQ</h2>
                  <p>Join us on a project tour!</p>
                  <Button
                    id="playVideo"
                    variant="contained"
                    className="input-field button"
                    style={{
                      backgroundColor: "#6282b3",
                      lineHeight: "1rem",
                      float: "right",
                      marginTop: "10px",
                    }}
                    onClick={(e) => {
                      setPlay({ isPlay: true });
                      setData({ data: undefined });
                      setIsshow({ ...show, isShow: undefined });
                      setIssues(undefined);
                    }}
                  >
                    Play
                  </Button>
                </div>
              </div>
            </div>
          )}
          {navbar.bar === "Dashboard" && (
            <>
              <div
                className="row col-lg-12"
                style={{ margin: "15px 0px 15px 0px" }}
              >
                {!others?.EditDashboard && (
                  <div className="row col-lg-12 filterswt">
                    <div style={{ display: "flex", padding: "0px" }}>
                      <div
                        className="semi-bold"
                        style={{ display: "flex", width: "80%" }}
                      >
                        Template Layouts
                      </div>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "10px" }}>Custom</div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="StaticLayouts"
                            disabled={hideTempLayout}
                            checked={others.CustomLayouts}
                            onChange={(e) => {
                              setOthers({
                                ...others,
                                CustomLayouts: e.target.checked,
                                StaticLayouts: !e.target.checked,
                                selectedLayout: "1X2",
                                cardLayout: "",
                                Cols: {},
                                Rows: "",
                              });
                              setFormValues({
                                ...formValues,
                                Rows: {
                                  ...formValues["Rows"],
                                  error: false,
                                },
                              });
                              setError({
                                ...error,
                                Disable: others.CustomLayouts ? false : true,
                              });
                              setHideTempLayout(false);
                            }}
                          ></input>
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    {others.StaticLayouts && (
                      // <DashboardLayouts
                      <div
                        className={`div-layout ${
                          hideTempLayout ? "hideTempDivLayout" : ""
                        }`}
                      >
                        <img
                          alt="Loading..."
                          src={layout1}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "1X0" ? "active" : ""
                          }`}
                          id="1X0"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout2}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "2X0" ? "active" : ""
                          }`}
                          id="2X0"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout3}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "1X1" ? "active" : ""
                          }`}
                          id="1X1"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout4}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "3X0" ? "active" : ""
                          }`}
                          id="3X0"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout5}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "2X1" ? "active" : ""
                          }`}
                          id="2X1"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout6}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "1X2" ? "active" : ""
                          }`}
                          id="1X2"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout7}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "1X1X1" ? "active" : ""
                          }`}
                          id="1X1X1"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout8}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "2X2" ? "active" : ""
                          }`}
                          id="2X2"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout9}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "2X3" ? "active" : ""
                          }`}
                          id="2X3"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout10}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "3X2" ? "active" : ""
                          }`}
                          id="3X2"
                          onClick={dashboardLayouts}
                        ></img>
                        <img
                          alt="Loading..."
                          src={layout11}
                          className={`Dashboardlayout ${
                            others.selectedLayout === "3X3" ? "active" : ""
                          }`}
                          id="3X3"
                          onClick={dashboardLayouts}
                        ></img>
                      </div>
                    )}
                    {others.CustomLayouts && (
                      <>
                        <div
                          className={`row col-xs-12 col-sm-12 col-md-12 col-lg-12 ${
                            hideTempLayout ? "hideTempDivLayout" : ""
                          }`}
                          style={{ marginTop: "15px" }}
                        >
                          <div
                            className="col-xs-8 col-sm-8 col-md-8 col-lg-2"
                            style={{ padding: "16px 0px 0px 0px" }}
                          >
                            <img src={Rows} style={{ float: "left" }}></img>
                          </div>
                          <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                            <TextField
                              type="text"
                              id="NOCharts"
                              className="input-field"
                              name="Rows"
                              label="Total Rows"
                              variant="outlined"
                              margin="dense"
                              error={formValues.Rows.error}
                              helperText={
                                formValues.Rows.error &&
                                formValues.Rows.errorMessage
                              }
                              disabled={hideTempLayout ? true : false}
                              value={others.Rows}
                              onInput={(e) => {
                                // Remove non-numeric characters from the input value
                                e.target.value = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                // Limit the length to 1 character
                                if (e.target.value.length > 1) {
                                  e.target.value = e.target.value.substring(
                                    1,
                                    1
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                const allowedKeys = [
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "Backspace",
                                  "Delete",
                                ];
                                // Allow default behavior only for specified keys
                                if (!allowedKeys.includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                // Check if the input is either empty or a number, and set it to the input value
                                const inputValue = e.target.value;
                                if (inputValue === "" || !isNaN(inputValue)) {
                                  // If it's empty, clear the Cols values
                                  if (inputValue === "") {
                                    const updatedCols = {};
                                    for (
                                      let i = 1;
                                      i <= parseInt(others.Rows);
                                      i++
                                    ) {
                                      updatedCols["Cols" + i] = "";
                                    }
                                    setOthers({
                                      ...others,
                                      Rows: inputValue,
                                      Cols: updatedCols,
                                    });
                                  } else {
                                    setOthers({ ...others, Rows: inputValue });
                                  }
                                } else {
                                  // Prevent non-numeric and non-empty values
                                  e.preventDefault();
                                }

                                handleValidation(e);
                              }}
                            />
                            <div className="warning-msg">
                              Maximum 4 Rows can be added
                            </div>
                          </div>
                        </div>

                        <>
                          {others.Rows !== undefined && others.Rows < 5 ? (
                            <>
                              <div className="divider"></div>
                              <div style={{ marginTop: "15px" }}>
                                {(() => {
                                  let Item = [];
                                  for (
                                    let i = 1;
                                    i <= parseInt(others.Rows);
                                    i++
                                  ) {
                                    Item.push(
                                      <div
                                        className="row col-lg-12"
                                        style={{ marginBottom: "10px" }}
                                      >
                                        <div
                                          className="col-xs-8 col-sm-8 col-md-8 col-lg-2"
                                          style={{
                                            padding: "16px 0px 0px 0px",
                                            visibility:
                                              i === 1 ? `visible` : `hidden`,
                                          }}
                                        >
                                          <img
                                            src={Column}
                                            style={{ float: "left" }}
                                          ></img>
                                        </div>
                                        <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                                          <TextField
                                            type="text"
                                            id="NOCharts"
                                            className="input-field"
                                            name={"Cols" + i}
                                            label={"Row " + i + " Columns"}
                                            variant="outlined"
                                            margin="dense"
                                            disabled={
                                              hideTempLayout ? true : false
                                            }
                                            value={
                                              others["Cols"] !== undefined
                                                ? others["Cols"]["Cols" + i]
                                                : others["Cols" + i]
                                            }
                                            onInput={(e) => {
                                              // Remove non-numeric characters from the input value
                                              e.target.value =
                                                e.target.value.replace(
                                                  /\D/g,
                                                  ""
                                                );
                                            }}
                                            onChange={(e) => {
                                              // Check if the input is either 1, 2, or 3, and set it to the input value
                                              if (
                                                e.target.value === "1" ||
                                                e.target.value === "2" ||
                                                e.target.value === "3"
                                              ) {
                                                setOthers({
                                                  ...others,
                                                  Cols: {
                                                    ...others["Cols"],
                                                    [e.target.name]:
                                                      e.target.value,
                                                  },
                                                });
                                              } else {
                                                setOthers({
                                                  ...others,
                                                  Cols: {
                                                    ...others["Cols"],
                                                    [e.target.name]: "",
                                                  },
                                                });
                                                e.target.value = "";
                                                // If the input is not 1, 2, or 3, prevent the value from changing
                                                e.preventDefault();
                                              }

                                              handleValidation(e);
                                            }}
                                          />
                                          <div
                                            className="warning-msg"
                                            style={{
                                              display:
                                                i === parseInt(others.Rows)
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            3 Columns per Row allowed
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return Item;
                                })()}
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      </>
                    )}
                  </div>
                )}
                {/* {state.Uploaded_file !== undefined && (
                  <div className="row" style={{ padding: "0px" }}>
                    <div style={{ display: "flex" }}>
                      <div
                        className="semi-bold"
                        style={{ display: "flex", width: "80%" }}
                      >
                        Cards
                      </div>
                      <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "10px" }}>Custom</div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="StaticLayouts"
                            checked={others.CustomCards}
                            onChange={(e) => {
                              setOthers({
                                ...others,
                                CustomCards: e.target.checked,
                              });
                            }}
                          ></input>
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )} */}
                {others.CustomCards && (
                  <>
                    <div
                      className="row col-xs-12 col-sm-12 col-md-12 col-lg-12"
                      style={{ marginTop: "15px" }}
                    >
                      <div
                        className="col-xs-8 col-sm-8 col-md-8 col-lg-2"
                        style={{ padding: "16px 0px 0px 0px" }}
                      >
                        <img
                          src={Rows}
                          alt="Cards"
                          style={{ float: "left" }}
                        ></img>
                      </div>
                      <div className="row col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <TextField
                          id="NOCards"
                          className="input-field"
                          name="CardRows"
                          label="Total Cards"
                          variant="outlined"
                          margin="dense"
                          // error={formValues.CardRows.error}
                          // helperText={formValues.CardRows.error && formValues.CardRows.errorMessage}
                          value={others.CardRows}
                          onChange={(e) => {
                            handleValidation(e);
                            setOthers({
                              ...others,
                              CardRows: e.target.value,
                            });
                          }}
                        />
                        <div className="warning-msg">
                          Maximum 4 Cards can be added
                        </div>
                      </div>
                    </div>

                    <>
                      {others.CardRows !== undefined && others.CardRows < 5 ? (
                        <>
                          <div className="divider"></div>
                          <div style={{ marginTop: "15px" }}>
                            {(() => {
                              let Item = [];
                              let IntCols = state.CheckType.filter(
                                (e) => e.split(" ")[0] === "#"
                              );
                              let CardCols = IntCols.map((e) => {
                                if (e.split(" ")[0] === "#")
                                  return e.split(" ").slice(1, 30).join(" ");
                              });
                              for (
                                let i = 1;
                                i <= parseInt(others.CardRows);
                                i++
                              ) {
                                Item.push(
                                  <div
                                    className="row col-lg-12"
                                    style={{ marginBottom: "10px" }}
                                  >
                                    <div
                                      className="col-xs-8 col-sm-8 col-md-8 col-lg-2"
                                      style={{
                                        padding: "16px 0px 0px 0px",
                                        visibility:
                                          i === 1 ? `visible` : `hidden`,
                                      }}
                                    >
                                      <img
                                        src={Column}
                                        alt="Cards"
                                        style={{ float: "left" }}
                                      ></img>
                                    </div>
                                    <div className="row col-xs-8 col-sm-8 col-md-8 col-lg-6">
                                      <TextField
                                        //error={formValues.GroupBy.error}
                                        // helperText={formValues.GroupBy.error && formValues.GroupBy.errorMessage}
                                        id="Card"
                                        select
                                        name={"Card" + i}
                                        label={"Card " + i}
                                        variant="outlined"
                                        margin="dense"
                                        className="input-field "
                                        value={
                                          others["Card"] !== undefined
                                            ? others["Card"]["Card" + i]
                                            : others["Card" + i]
                                        }
                                        onChange={(e) => {
                                          setOthers({
                                            ...others,
                                            Card: {
                                              ...others["Card"],
                                              [e.target.name]: e.target.value,
                                              [e.target.name + "-Count"]:
                                                fnGettingUniqueCount(
                                                  e.target.value
                                                ),
                                            },
                                          });
                                        }}
                                        onBlur={(e) => {
                                          handleValidation(e);
                                        }}
                                        defaultValue={"Select"}
                                      >
                                        <MenuItem key={-1} value={-1}>
                                          <span>{"Select"}</span>
                                        </MenuItem>
                                        {CardCols.map((option, index) => (
                                          <MenuItem key={index} value={option}>
                                            <span>{option}</span>
                                          </MenuItem>
                                        ))}
                                      </TextField>

                                      {/* <div className="warning-msg" style={{ display: i === parseInt(others.Rows) ? 'block' : 'none' }}>3 Cards per Row allowed</div> */}
                                    </div>
                                    {/* This is for having sum, count, avg and total */}
                                    {/* <div className="row col-sm-4 col-md-4 col-lg-4 inputfield">
                                    <TextField
                                      id="GroupBy"
                                      select
                                      name="GroupByCol"
                                      label="Group By"
                                      margin="dense"
                                      value={state.GroupByCol}
                                      className="input-field "
                                      defaultValue={"Sum"}
                                      onChange={(e) => {
                                        handleValidation(e);
                                        handleChange(e);
                                        setFlag(false);
                                      }}
                                    >
                                      {GroupByCol.map((option, index) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </div> */}
                                  </div>
                                );
                              }
                              return Item;
                            })()}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  </>
                )}

                {!others?.EditDashboard && (
                  <>
                    <>
                      <div
                        className="col-lg-12"
                        style={{ marginBottom: "5px" }}
                      >
                        <div
                          className="row-parent"
                          style={{ justifyContent: "space-between" }}
                        >
                          <div className="semi-bold">Cards Layouts</div>
                          <div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                name="CardLayoutswatch"
                                checked={state.CardLayoutswatch}
                                disabled={hideTempLayout}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setState({
                                      ...state,
                                      CardLayoutswatch: true,
                                    });
                                    setOthers({ ...others, cardLayout: "4" });
                                  } else {
                                    setState({
                                      ...state,
                                      CardLayoutswatch: false,
                                    });
                                    setOthers({ ...others, cardLayout: "" });
                                  }
                                }}
                              ></input>
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </>

                    {state.CardLayoutswatch && (
                      <>
                        <div
                          className={`div-layout ${
                            hideTempLayout ? "hideTempDivLayout" : ""
                          }`}
                        >
                          <img
                            alt="Loading..."
                            src={layout1}
                            className={`Dashboardlayout ${
                              others.cardLayout === "1" ? "active" : ""
                            }`}
                            id="1"
                            onClick={(event) =>
                              dashboardLayouts(event, "cards")
                            }
                          ></img>
                          <img
                            alt="Loading..."
                            src={layout2}
                            className={`Dashboardlayout ${
                              others.cardLayout === "2" ? "active" : ""
                            }`}
                            id="2"
                            onClick={(event) =>
                              dashboardLayouts(event, "cards")
                            }
                          ></img>

                          <img
                            alt="Loading..."
                            src={layout4}
                            className={`Dashboardlayout ${
                              others.cardLayout === "3" ? "active" : ""
                            }`}
                            id="3"
                            onClick={(event) =>
                              dashboardLayouts(event, "cards")
                            }
                          ></img>
                          <img
                            alt="Loading..."
                            src={layout14}
                            className={`Dashboardlayout ${
                              others.cardLayout === "4" ? "active" : ""
                            }`}
                            id="4"
                            onClick={(event) =>
                              dashboardLayouts(event, "cards")
                            }
                          ></img>
                        </div>
                      </>
                    )}
                  </>
                )}

                {!others?.EditDashboard && (
                  <div
                    className=""
                    style={{ margin: "15px 0px 15px 0px", display: "flex" }}
                  >
                    <Button
                      id="saveTemp"
                      variant="contained"
                      className="input-field button"
                      style={{ backgroundColor: "#6282b3", width: "226px" }}
                      // disabled={others?.EditDashboard === true ? true : false}
                      disabled={error["Disable"]}
                      onClick={(e) => {
                        setIsshow({
                          ...show,
                          isShow: true,
                          dashboard,
                          Custom: others,
                          CustomLayouts: others.CustomLayouts,
                          StaticLayouts: others.StaticLayouts,
                          selectedLayout: others.selectedLayout,
                          Build: true,
                        });
                        // setPlay({ isPlay: undefined });
                        setIssues(undefined);
                        setfilteringProps({});
                        updateManageFilter(false);
                        settempOthers(others);
                        setHideTempLayout(true);
                        setError({ ...error, Disable: true });
                        setFilter({ ...filter, filterSwatch: false }); // false the globel filter toggle button
                      }}
                    >
                      Apply Layout
                    </Button>
                    {/* reset button */}
                    <Button
                      id="resetTemp"
                      variant="contained"
                      className="input-field button"
                      style={{
                        backgroundColor: "#6282b3",
                        width: "26px",
                        marginLeft: "20px",
                      }}
                      disabled={hideTempLayout ? false : true}
                      onClick={(e) => {
                        templateLayoutReset();
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                )}

                {/* saved templates in dashboard start here */}
                <Accordion className="acd">
                  <AccordionSummary
                    className="acdsummary"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    // style={{ backgroundColor: "#cfced385" }}
                  >
                    <Typography className="acdTitle">
                      <img
                        src={Saved_Templates}
                        name="Data"
                        color="white"
                        alt="Logo"
                        style={{ marginRight: "10px" }}
                      ></img>
                      Chart Collections
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div
                        className="row col-xs-12 col-sm-12 col-md-4 col-lg-12 inputfield row1-container borderdivstyle"
                        style={{ padding: "10px 10px 0px 14px" }}
                      >
                        <>
                          {(() => {
                            let Item = [];
                            for (let a in dashboard) {
                              if (dashboard[a] !== undefined) {
                                Item.push(
                                  <div
                                    className="box box-down cyan dashboard-layout"
                                    style={{ cursor: "grab" }}
                                    draggable="true"
                                    id={a}
                                    name={dashboard[a]["_id"]}
                                    onDragStart={(event) => allowDrop(event)}
                                  >
                                    <div className="row col-lg-12 container-title">
                                      <div className="col-lg-4">
                                        <div className="">
                                          <DashboardIcons
                                            e={dashboard[a].Chart}
                                          />
                                        </div>
                                      </div>
                                      <BootstrapTooltip
                                        title={dashboard[a]?.fileName}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <div className="col-lg-8">
                                          <div className="col-sm-12 col-md-12 col-lg-12">
                                            {dashboard[a].Chart}
                                          </div>
                                          <div className="col-sm-12 col-md-12 col-lg-12">
                                            {a}
                                          </div>
                                        </div>
                                      </BootstrapTooltip>
                                    </div>
                                  </div>
                                );
                              }
                            }
                            if (Item.length === 0) {
                              Item.push(
                                <div
                                  className="col-lg-12 none-tamplate"
                                  onClick={(e) => {
                                    setNavbar({ bar: "Data" });
                                  }}
                                >
                                  Please Create any template
                                </div>
                              );
                            }
                            return Item;
                          })()}
                        </>
                      </div>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                {/* saved templates in dashboard End here */}

                {/* saved Cards in dashboard start here */}
                <Accordion className="acd">
                  <AccordionSummary
                    className="acdsummary"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    // style={{ backgroundColor: "#cfced385" }}
                  >
                    <Typography className="acdTitle">
                      <img
                        src={Pre_Templates}
                        name="Data"
                        color="white"
                        alt="Logo"
                        style={{ marginRight: "10px" }}
                      ></img>
                      Card Collections
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div
                        className="row col-xs-12 col-sm-12 col-md-4 col-lg-12 inputfield row1-container borderdivstyle"
                        // style={{
                        //   padding: "10px 10px 0px 14px",
                        // }}
                      >
                        <>
                          {(() => {
                            let Item = [];
                            for (let a in cardCollections) {
                              if (cardCollections[a] !== undefined) {
                                Item.push(
                                  <div
                                    className="box box-down cyan dashboard-layout"
                                    style={{ cursor: "grab" }}
                                    draggable="true"
                                    id={cardCollections[a]["_id"]}
                                    name={cardCollections[a]["_id"]}
                                    onDragStart={(event) =>
                                      allowDrop(event, "card")
                                    }
                                  >
                                    <div className="row col-lg-12 container-title">
                                      <div className="col-lg-4">
                                        <div className="">
                                          <img
                                            src={CardIcon}
                                            style={{
                                              marginRight: "10px",
                                              height: "20px",
                                              opacity: "0.9",
                                            }}
                                          ></img>
                                        </div>
                                      </div>
                                      <BootstrapTooltip
                                        title={cardCollections[a]?.CardName}
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <div className="col-lg-8">
                                          <div className="col-sm-12 col-md-12 col-lg-12">
                                            {cardCollections[a].CardName}
                                          </div>
                                          <div className="col-sm-12 col-md-12 col-lg-12">
                                            {cardCollections[a].CardDescription}
                                          </div>
                                        </div>
                                      </BootstrapTooltip>
                                    </div>
                                  </div>
                                );
                              }
                            }
                            if (Item.length === 0) {
                              Item.push(
                                <div
                                  className="col-lg-12 none-tamplate"
                                  onClick={(e) => {
                                    setNavbar({ bar: "Data" });
                                  }}
                                >
                                  Please Create any Card
                                </div>
                              );
                            }
                            return Item;
                          })()}
                        </>
                      </div>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                {/* saved cards in dashboard end here */}

                {/* commented start here for adding global filter by franklin   */}
                {show?.isShow && (
                  <div
                    className="row col-lg-12 filterswt"
                    style={{ borderTop: "4px solid #f4f4f8" }}
                  >
                    <div className="row col-xm-9 col-sm-9 col-md-9 col-lg-9 semi-bold">
                      Filter
                    </div>
                    <div className=" col-xm-3 col-sm-3 col-md-3 col-lg-3">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="Filterswatch"
                          checked={filter.filterSwatch}
                          onChange={(e) => {
                            globalFilter(e);
                          }}
                        ></input>
                        <span className="slider round"></span>
                      </label>
                    </div>
                    {filter.filterSwatch && (
                      <>
                        {filteringProps.Dimensions !== undefined ? (
                          <div
                            className="row col-lg-12 borderdivstyle"
                            style={{ margin: "15px 0px 0px 0px" }}
                          >
                            <div
                              className="row col-sm-12 col-md-12 col-lg-12"
                              style={{ padding: "0px" }}
                            >
                              <FormControl
                                sx={{ m: 1, paddingRight: 2, width: 300 }}
                              >
                                <InputLabel id="filter">Dimensions</InputLabel>
                                <Select
                                  labelId="demo-multiple-checkbox-label"
                                  id="demo-multiple-checkbox"
                                  multiple
                                  value={
                                    filteringProps.customFilter === undefined
                                      ? []
                                      : filteringProps.customFilter
                                  }
                                  name="customFilter"
                                  onChange={handleMultiselect}
                                  input={<OutlinedInput label="Tag" />}
                                  renderValue={(selected) =>
                                    selected.join(", ")
                                  }
                                  MenuProps={MenuProps}
                                >
                                  {filteringProps.Dimensions.map((name) => (
                                    <MenuItem key={name} value={name}>
                                      <Checkbox
                                        checked={
                                          filteringProps.customFilter ===
                                          undefined
                                            ? false
                                            : filteringProps.customFilter.indexOf(
                                                name
                                              ) > -1
                                        }
                                      />
                                      <ListItemText key={name} primary={name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                            {error.mandatoryFields !== undefined ? (
                              <div
                                className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
                                style={{
                                  margin: "15px 0px 15px  0px",
                                  padding: 0,
                                }}
                              >
                                <Alert severity="error">
                                  {error.mandatoryFields}
                                </Alert>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <div className="col-lg-12 ">
                            Please upload a file before filtering.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                {/* commented End here for adding global filter by franklin   */}

                {others.EditDashboard && (
                  <>
                    {/* <div className="col-lg-12 borderstyle">
                    <div
                      className="col-lg-8 semi-bold"
                      style={{ display: "contents" }}
                    >
                      <span>Project Assigning</span>
                    </div>
                  </div>

                  <div
                    className="row col-lg-12 borderdivstyle"
                    style={{ margin: "0px" }}
                  >
                    <div className="row col-lg-6" style={{ padding: "0px" }}>
                      <FormControl sx={{ m: 1, paddingRight: 2, width: 300 }}>
                        <InputLabel id="filter">Users</InputLabel>
                        <Select
                          labelId="Users"
                          id="Users"
                          multiple
                          value={
                            projectAssigning.Users === undefined
                              ? []
                              : projectAssigning.Users
                          }
                          name="Users"
                          onChange={handleMultiselect}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                        >
                          {user.Users.map((name) => (
                            <MenuItem key={name["Name"]} value={name["Name"]}>
                              <Checkbox
                                checked={
                                  projectAssigning.Users === undefined
                                    ? false
                                    : projectAssigning.Users.indexOf(
                                        name["Name"]
                                      ) > -1
                                }
                              />
                              <ListItemText
                                key={name["Name"]}
                                primary={name["Name"]}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="row col-lg-6" style={{ padding: "0px" }}>
                      <FormControl sx={{ m: 1, paddingRight: 2, width: 300 }}>
                        <InputLabel id="filter">Group</InputLabel>
                        <Select
                          labelId="Users"
                          id="Users"
                          multiple
                          value={
                            projectAssigning.Groups === undefined
                              ? []
                              : projectAssigning.Groups
                          }
                          name="Groups"
                          onChange={handleMultiselect}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                        >
                          {Group.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox
                                checked={
                                  projectAssigning.Groups === undefined
                                    ? false
                                    : projectAssigning.Groups.indexOf(name) >
                                      -1
                                }
                              />
                              <ListItemText key={name} primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div> */}
                    {/* Description */}
                    <div
                      className="row col-xs-12 col-sm-12 col-md-12 col-lg-12 borderstyle"
                      style={{ margin: "10px 0px" }}
                    >
                      <TextField
                        id="TempDescription"
                        className="Description"
                        label="Dashboard description"
                        name="DashboardDescription"
                        fullWidth
                        margin="dense"
                        multiline
                        maxRows={4}
                        value={projectDetails.DashboardDescription}
                        onChange={(e) => {
                          setprojectDetails({
                            ...projectDetails,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </>
                )}

                {!others.EditDashboard === true ? (
                  <>
                    <div
                      className="row col-sm-4 col-md-12 col-lg-4"
                      style={{ marginTop: "10px" }}
                    >
                      <Button
                        id="saveTemp"
                        variant="contained"
                        className="input-field button btn-primary"
                        onClick={(e) => {
                          let checkDashboardSave = checkLayoutSave();
                          if (checkDashboardSave) {
                            setOpen({ Dashboard: true });
                            setprojectDetails({
                              ...projectDetails,
                              DashboardDescription: "",
                            });
                          }
                        }}
                      >
                        Save
                      </Button>
                    </div>
                    {/* <div
                      className="row col-sm-4 col-md-12 col-lg-8"
                      style={{ marginTop: "10px" }}
                    >
                      <Button
                        id="saveTemp"
                        variant="contained"
                        className="input-field button"
                        onClick={(e) => {
                          ExpandCollapse("publish");
                          handleFilter("Apply Filter");
                          setIssues(undefined);
                        }}
                      >
                        <span style={{ display: "flex" }}>
                          Publish Dashboard{" "}
                          <img
                            alt="Publish"
                            src={Publish}
                            style={{
                              width: "16px",
                              height: "16px",
                              marginLeft: "10px",
                            }}
                          ></img>
                        </span>
                      </Button>
                    </div> */}
                  </>
                ) : (
                  <>
                    <div
                      className="row col-sm-4 col-md-12 col-lg-3"
                      style={{ marginTop: "10px" }}
                    >
                      <Button
                        id="saveTemp"
                        variant="contained"
                        className="input-field button"
                        style={{
                          backgroundColor: "#6282b3",
                          lineHeight: "1rem",
                        }}
                        onClick={(e) => {
                          let checkDashboardUpdate = checkLayoutUpdate();
                          if (checkDashboardUpdate) {
                            handleDashboard("Update", e);
                          }
                        }}
                      >
                        Update
                      </Button>
                    </div>
                    <div
                      className="row col-sm-4 col-md-12 col-lg-3"
                      style={{ marginTop: "10px" }}
                    >
                      <Button
                        id="CancelDashboard"
                        variant="contained"
                        className="input-field button"
                        style={{
                          backgroundColor: "#6282b3",
                          lineHeight: "1rem",
                        }}
                        onClick={(e) => {
                          handleDashboard("Cancel", e);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div
                      className="row col-sm-4 col-md-12 col-lg-3"
                      style={{ marginTop: "10px" }}
                    >
                      <Button
                        id="resetDashboard"
                        // name={project[a]["_id"]}
                        variant="contained"
                        className="input-field button"
                        style={{
                          backgroundColor: "#6282b3",
                          lineHeight: "1rem",
                        }}
                        onClick={(e) => {
                          handleDashboard("Reset", e);
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </>
                )}

                {navbar.bar === "Dashboard" && (
                  <div className="row col-sm-4" style={{ marginTop: "10px" }}>
                    <Button
                      id="previewDashboard"
                      variant="contained"
                      className="input-field button"
                      onClick={(e) => {
                        let checkProjectPreview = checkLayoutPreview();
                        if (checkProjectPreview) {
                          ExpandCollapse("publish");
                          handleFilter("Apply Filter");
                          setIssues(undefined);
                        }
                      }}
                    >
                      <span style={{ display: "flex" }}>
                        Preview{" "}
                        <img
                          alt="Publish"
                          src={Publish}
                          style={{
                            width: "16px",
                            height: "16px",
                            marginLeft: "10px",
                          }}
                        ></img>
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {navbar.bar === "Project" ? (
            <>
              <div
                className=" panal-header"
                style={{
                  marginTop: "18%",
                }}
              >
                <Accordion
                  className="acd"
                  style={{
                    display: user["Role"] === "User" && "None",
                  }}
                >
                  <AccordionSummary
                    className="acdsummary"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="acdTitle">
                      <img
                        src={Project}
                        name="Data"
                        color="white"
                        alt="Logo"
                        style={{ marginRight: "10px" }}
                      ></img>
                      My Projects
                      <span
                        className="txtOrdinary"
                        style={{ marginLeft: "5px" }}
                      >
                        {`(${Object.keys(project).length})`}
                      </span>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <>
                        {(() => {
                          let Item = [];
                          for (let a in project) {
                            if (project[a] !== undefined) {
                              Item.push(
                                <div
                                  id={a}
                                  name={project[a]["_id"]}
                                  key={project[a]["_id"]}
                                  className={`container-template ${
                                    clickedIndex === a ? "clicked" : ""
                                  }`}
                                  onClick={(e) => {
                                    handleDashboard("Preview", e);
                                    handleBackgroundChange(a);
                                  }}
                                  style={{ marginLeft: "6px", width: "100%" }}
                                >
                                  <div
                                    className="container-title"
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <div className="">
                                      <img
                                        src={Project}
                                        name="Data"
                                        color="white"
                                        alt="Logo"
                                      ></img>
                                    </div>
                                    <div
                                      className=""
                                      style={{ width: "65%", display: "flex" }}
                                    >
                                      {project[a]["DashboardName"]}
                                    </div>

                                    <div
                                      className=" TemplateIcon"
                                      style={{
                                        display:
                                          user["Role"] === "User" && "None",
                                      }}
                                    >
                                      <BootstrapTooltip
                                        title="Assign User"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <PeopleIcon
                                          id={a}
                                          name={project[a]["_id"]}
                                          className="temp-icon"
                                          onClick={(e) => {
                                            handleDashboard("AssignUser", e);
                                            handleBackgroundChange(a);
                                          }}
                                        />
                                      </BootstrapTooltip>
                                    </div>
                                    <div
                                      className=" TemplateIcon"
                                      style={{
                                        display:
                                          user["Role"] === "User" && "None",
                                      }}
                                    >
                                      <BootstrapTooltip
                                        title="Edit"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <img
                                          src={Edit}
                                          id={a}
                                          name={project[a]["DashboardName"]}
                                          color="white"
                                          alt="Logo"
                                          onClick={(e) => {
                                            handleDashboard("Edit", e);
                                          }}
                                        ></img>
                                      </BootstrapTooltip>
                                    </div>
                                    <div
                                      className=" TemplateIcon"
                                      style={{
                                        display:
                                          user["Role"] === "User" && "None",
                                      }}
                                    >
                                      <BootstrapTooltip
                                        title="Delete"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <img
                                          src={Remove}
                                          id={a}
                                          name={project[a]["DashboardName"]}
                                          color="white"
                                          alt="Logo"
                                          style={{ height: "20px" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDashboard("Delete", e);
                                          }}
                                        ></img>
                                      </BootstrapTooltip>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 container-description">
                                    <div className="row col-sm-11 col-md-11 col-lg-11">
                                      <div>
                                        {project[a].DashboardDescription}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }

                          if (Item.length === 0) {
                            Item.push(
                              <>
                                <div className="col-lg-12 container-template">
                                  <div className="row col-lg-12 container-title">
                                    No Projects Found !!!
                                  </div>
                                </div>
                              </>
                            );
                          }
                          return Item;
                        })()}
                      </>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                {/* ======================= assigned Project ======================== */}

                <Accordion className="acd">
                  <AccordionSummary
                    className="acdsummary"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="acdTitle">
                      <img
                        src={Project}
                        name="Data"
                        color="white"
                        alt="Logo"
                        style={{ marginRight: "10px" }}
                      ></img>
                      Assigned Projects
                      <span
                        className="txtOrdinary"
                        style={{ marginLeft: "5px" }}
                      >
                        {`(${Object.keys(assignedProject).length})`}
                      </span>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <>
                        {(() => {
                          let Item = [];
                          for (let a in assignedProject) {
                            if (assignedProject[a] !== undefined) {
                              Item.push(
                                <div
                                  id={a}
                                  name={assignedProject[a]["_id"]}
                                  key={assignedProject[a]["_id"]}
                                  className={`container-template ${
                                    clickedIndex === a ? "clicked" : ""
                                  }`}
                                  onClick={(e) => {
                                    handleDashboard("Preview", e);
                                    handleBackgroundChange(a);
                                  }}
                                  style={{ marginLeft: "6px", width: "100%" }}
                                >
                                  <div
                                    className="container-title"
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <div className="">
                                      <img
                                        src={Project}
                                        name="Data"
                                        color="white"
                                        alt="Logo"
                                      ></img>
                                      {/* <ErrorOutlineIcon
                                       name="Data"
                                        color="white"
                                        alt="Logo"/> */}
                                    </div>
                                    <div
                                      className=""
                                      style={{ width: "65%", display: "flex" }}
                                    >
                                      {assignedProject[a]["DashboardName"]}
                                    </div>
                                    <div className=" TemplateIcon">
                                      <BootstrapTooltip
                                        title={
                                          "Assigned By : " +
                                          assignedProject[a].userID
                                        }
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <ErrorOutlineIcon
                                          id={a}
                                          name={
                                            assignedProject[a]
                                              .DashboardDescription
                                          }
                                          className="temp-icon"
                                        />
                                      </BootstrapTooltip>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 container-description">
                                    <div className="row col-sm-11 col-md-11 col-lg-11">
                                      <div>
                                        {
                                          assignedProject[a]
                                            .DashboardDescription
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }

                          if (Item.length === 0) {
                            Item.push(
                              <>
                                <div className="col-lg-12 container-template">
                                  <div className="row col-lg-12 container-title">
                                    No Projects Found !!!
                                  </div>
                                </div>
                              </>
                            );
                          }
                          return Item;
                        })()}
                      </>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            </>
          ) : (
            ""
          )}

          {navbar.bar === "Feedback" && (
            <>
              <div
                className="row col-xs-12 col-sm-12 col-md-12 col-lg-12"
                style={{ margin: "15px 10px 15px 10px" }}
              >
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <TextField
                    error={formValues.Category.error}
                    helperText={
                      formValues.Category.error &&
                      formValues.Category.errorMessage
                    }
                    id="Category"
                    select
                    name="Category"
                    label="Category*"
                    margin="dense"
                    className="input-field "
                    defaultValue={"Select"}
                    onChange={(e) => {
                      setFeedback({ ...feedback, Category: e.target.value });
                    }}
                    onBlur={(e) => {
                      handleValidation(e);
                    }}
                  >
                    <MenuItem key={-1} value={"Select"}>
                      {"Select"}
                    </MenuItem>
                    {feedback.Categories.map((option, index) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                {feedback.Category === "UI" ||
                feedback.Category === "Performance" ||
                feedback.Category === "Suggestions" ? (
                  <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <TextField
                      // error={formValues.Category.error}
                      // helperText={formValues.Category.error && formValues.Category.errorMessage}
                      id="Category"
                      select
                      name="Section"
                      label="Section*"
                      margin="dense"
                      className="input-field "
                      defaultValue={"Select"}
                      onChange={(e) => {
                        setFeedback({ ...feedback, Section: e.target.value });
                      }}
                      //onBlur={(e) => { handleValidation(e) }}
                    >
                      <MenuItem key={-1} value={"Select"}>
                        {"Select"}
                      </MenuItem>
                      {feedbackSection.map((option, index) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                ) : (
                  ""
                )}
                {feedback.Category === "Other" ? (
                  <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <TextField
                      id="NOCharts"
                      className="input-field"
                      name="Other"
                      label="Category"
                      variant="outlined"
                      margin="dense"
                      // error={formValues.Rows.error}
                      // helperText={formValues.Rows.error && formValues.Rows.errorMessage}
                      // value={others.Rows}
                      onChange={(e) => {
                        setFeedback({ ...feedback, Section: e.target.value });
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <TextField
                    id="TempDescription"
                    className="Description"
                    error={formValues.Issue.error}
                    helperText={
                      formValues.Issue.error && formValues.Issue.errorMessage
                    }
                    value={feedback.Issue}
                    label="Issue*"
                    name="Issue"
                    fullWidth
                    margin="dense"
                    multiline
                    maxRows={4}
                    onChange={(e) => {
                      setFeedback({
                        ...feedback,
                        [e.target.name]: e.target.value,
                      });
                    }}
                    onBlur={(e) => {
                      handleValidation(e);
                    }}
                  />
                </div>
                <div
                  className="row width-mid-md"
                  style={{ display: "flex", margin: "0px" }}
                >
                  <Button
                    variant="contained"
                    margin="normal"
                    className="input-field button"
                    style={{ float: "left", marginTop: "10px" }}
                    onClick={(e) => {
                      handleFeedback();
                    }}
                  >
                    Report
                  </Button>
                </div>
              </div>
            </>
          )}
          {/* {!navopen && <div className="nav-inputarea">InputArea</div>} */}
        </>

        {/* Card */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open.cards}
          onClose={(e) => {
            setOpen({ ...open, cards: false });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open.cards}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                className="semi-bold"
              >
                Card
              </Typography>
              <>
                <Typography
                  id="transition-modal-description"
                  sx={{ mt: 2 }}
                  style={{ marginTop: "10%" }}
                >
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <TextField
                        id="Template"
                        error={formValues.CardName.error}
                        // helperText={
                        //   formValues.TempName.error &&
                        //   formValues.TempName.errorMessage
                        // }
                        margin="dense"
                        fullWidth
                        className="input-field"
                        name="CardName"
                        label="Card Name"
                        variant="outlined"
                        onChange={(e) => {
                          handleCardChange(e);
                        }}
                      />
                      {formValues.CardName.error && (
                        <FormHelperText error id="username-error">
                          {formValues.CardName.errorMessage}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 inputfield">
                      <TextField
                        id="TempDescription"
                        className="Description"
                        label="Description"
                        name="CardDescription"
                        fullWidth
                        margin="dense"
                        multiline
                        maxRows={4}
                        onChange={(e) => {
                          handleCardChange(e);
                        }}
                      />
                    </div>
                  </div>
                </Typography>
                <Typography
                  id="transition-modal-description"
                  sx={{ mt: 5 }}
                  style={{ marginTop: "5%" }}
                >
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <Button
                      variant="contained"
                      margin="normal"
                      className="input-field button"
                      style={{ marginRight: "10px" }}
                      // disabled={tempError["Disable"]}
                      onClick={(e) => {
                        saveCards("save");
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      margin="normal"
                      className="input-field button btn-primary"
                      onClick={(e) => {
                        setOpen({ ...open, cards: false });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Typography>
              </>
            </Box>
          </Fade>
        </Modal>

        {/* Template */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open.Template}
          onClose={(e) => {
            setOpen({ ...open, Template: false });
            setFormValues({
              ...formValues,
              TempName: {
                ...formValues.TempName,
                error: false,
                errorMessage: "",
              },
            });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open.Template}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                className="semi-bold"
              >
                Template
              </Typography>
              {open.deleteTemplate ? (
                <>
                  <Typography
                    id="transition-modal-description"
                    sx={{ mt: 2 }}
                    style={{ marginTop: "10%" }}
                  >
                    {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"> */}
                    <Alert severity="warning">
                      Are you sure want to delete{" "}
                      <strong>"{open.tempName}"</strong> Template? This will
                      impact <strong>"{open.dashboardName}"</strong> Dashboard.
                    </Alert>
                    {/* </div> */}
                  </Typography>
                  <Typography
                    id="transition-modal-description"
                    sx={{ mt: 5 }}
                    style={{ marginTop: "5%" }}
                  >
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <Button
                        variant="contained"
                        margin="normal"
                        className="input-field button"
                        style={{ marginRight: "10px" }}
                        onClick={(e) => {
                          handleTemplate(open.tempName, "Delete");
                        }}
                      >
                        Proceed
                      </Button>
                      <Button
                        variant="contained"
                        margin="normal"
                        className="input-field button btn-primary"
                        onClick={(e) => {
                          setOpen({ ...open, Template: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    id="transition-modal-description"
                    sx={{ mt: 2 }}
                    style={{ marginTop: "10%" }}
                  >
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <TextField
                          id="Template"
                          error={formValues.TempName.error}
                          // helperText={
                          //   formValues.TempName.error &&
                          //   formValues.TempName.errorMessage
                          // }
                          margin="dense"
                          fullWidth
                          className="input-field"
                          name="TempName"
                          label="Template Name"
                          variant="outlined"
                          // value={state.YAxisLabel}
                          onChange={(e) => {
                            handleValidation(e);
                            handleChange(e);
                          }}
                        />
                        {formValues.TempName.error && (
                          <FormHelperText error id="username-error">
                            {formValues.TempName.errorMessage}
                          </FormHelperText>
                        )}
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 inputfield">
                        <TextField
                          id="TempDescription"
                          error={formValues.TempDescription.error}
                          className="Description"
                          label="Description"
                          name="TempDescription"
                          fullWidth
                          margin="dense"
                          multiline
                          maxRows={4}
                          onChange={handleChange}
                        />
                        {formValues.TempDescription.error && (
                          <FormHelperText error id="username-error">
                            {formValues.TempDescription.errorMessage}
                          </FormHelperText>
                        )}
                      </div>
                    </div>
                  </Typography>
                  <Typography
                    id="transition-modal-description"
                    sx={{ mt: 5 }}
                    style={{ marginTop: "5%" }}
                  >
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <Button
                        variant="contained"
                        margin="normal"
                        className="input-field button"
                        style={{ marginRight: "10px" }}
                        // disabled={tempError["Disable"]}
                        onClick={(e) => {
                          saveTemplate("save");
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        margin="normal"
                        className="input-field button btn-primary"
                        onClick={(e) => {
                          setOpen({ ...open, Template: false });
                          setFormValues({
                            ...formValues,
                            TempName: {
                              ...formValues.TempName,
                              error: false,
                              errorMessage: "",
                            },
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Typography>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
        {/* Dashboard */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open.Dashboard}
          onClose={(e) => {
            setOpen({ Dashboard: false });
            setFormValues({
              ...formValues,
              DashboardName: {
                ...formValues.DashboardName,
                error: false,
                errorMessage: "",
              },
            });
            setprojectDetails({
              ...projectDetails,
              DashboardName: "",
              DashboardDescription: "",
            });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open.Dashboard}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Dashboard
              </Typography>
              <Typography
                id="transition-modal-description"
                sx={{ mt: 2 }}
                style={{ marginTop: "20px" }}
              >
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <TextField
                      id="Dashboard"
                      error={formValues.DashboardName.error}
                      // helperText={
                      //   formValues.DashboardName.error &&
                      //   formValues.TempName.errorMessage
                      // }
                      margin="dense"
                      fullWidth
                      className="input-field"
                      name="DashboardName"
                      label="Dashboard Name"
                      variant="outlined"
                      // value={state.YAxisLabel}
                      onChange={(e) => {
                        if (
                          e.target.value === undefined ||
                          e.target.value === null ||
                          e.target.value.trim().length === 0
                        ) {
                          setFormValues({
                            ...formValues,
                            [e.target.name]: {
                              ...formValues[e.target.name],
                              error: true,
                              errorMessage:
                                "Dashboard Name should not be empty",
                            },
                          });
                          return;
                        }
                        setprojectDetails({
                          ...projectDetails,
                          [e.target.name]: e.target.value,
                        });
                        handleValidation(e);
                      }}
                    />
                    {formValues.DashboardName.error && (
                      <FormHelperText error id="username-error">
                        {formValues.DashboardName.errorMessage}
                      </FormHelperText>
                    )}
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 inputfield">
                    <TextField
                      id="TempDescription"
                      className="Description"
                      label="Description"
                      name="DashboardDescription"
                      fullWidth
                      margin="dense"
                      multiline
                      maxRows={4}
                      onChange={(e) => {
                        setprojectDetails({
                          ...projectDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </Typography>
              <Typography
                id="transition-modal-description"
                sx={{ mt: 5 }}
                style={{ marginTop: "15px" }}
              >
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Button
                    variant="contained"
                    margin="normal"
                    className="input-field button"
                    style={{ marginRight: "10px" }}
                    // disabled={dashopen["Disable"]}
                    onClick={(e) => {
                      handleDashboard("Save", e);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    margin="normal"
                    className="input-field button btn-primary"
                    onClick={(e) => {
                      setOpen({ Dashboard: false });
                      setFormValues({
                        ...formValues,
                        DashboardName: {
                          ...formValues.DashboardName,
                          error: false,
                          errorMessage: "",
                        },
                      });
                      setprojectDetails({
                        ...projectDetails,
                        DashboardName: "",
                        DashboardDescription: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Typography>
            </Box>
          </Fade>
        </Modal>

        {error.mandatoryFields !== undefined && navbar.bar === "Charts" ? (
          <div
            className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
            style={{ margin: "15px 0px 15px  0px", padding: 0 }}
          >
            <Alert severity="error">{error.mandatoryFields}</Alert>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default React.memo(InputArea);
