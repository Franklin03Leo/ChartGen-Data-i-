import React, { useCallback } from "react";

//MUI
import "./Styles/Custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import { Fade } from "@material-ui/core";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Alert from "@mui/material/Alert";
import { Box, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
//NPM's
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//Components
import InputBlock from "./Components/InputBlock";
import ChartBlock from "./Components/ChartBlock";
import Statistics from "./Charts/Statistics";
import Dictionary from "./Charts/Dictionary";
import DatasetTable from "./Components/DatasetTable";
import Demo from "./Components/Demo";
import Dashboard from "./Charts/Dashboard";
import Feedback from "./Components/Feedback";
import Header from "./Components/Header";
import AdminView from "./Components/Admin";
import AssignProject from "./Components/AssignProject";
import CardBlock from "./Components/CardBlock";

import EmptyPage from "../src/Images/EmptyPage.png";

const HomePage = () => {
  const DataTypes = ["#", "Da", "Aa"];

  const [state, setState] = React.useState({});
  const [enable, setEnable] = React.useState({});
  const [filedata, setData] = React.useState({});
  const [play, setPlay] = React.useState({});
  const [show, Isshow] = React.useState({ NOCharts: 0, isRendered: false });
  const [navbar, setNavbar] = React.useState();
  const [navwidth, setNavWidth] = React.useState({
    navArea: "7%",
    inuptArea: "28%",
    ChartArea: "63%",
  });
  const [value, setValue] = React.useState("1");
  const [changeType, setChangeType] = React.useState({
    enableChange: false,
    Dimensions_: "Select",
    DataTypes: "#",
  });
  const [error, setError] = React.useState({});
  const [feedback, setFeedback] = React.useState({ Issues: undefined });
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [project, setProject] = React.useState({});

  const [open, setOpen] = React.useState({
    SessionExpiry: false,
    StayConnected: false,
  });
  const [assignUser, setAssignUser] = React.useState({});
  const [cardData, setcardData] = React.useState({}); // added for card values maintain
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });
  //onst [seconds, setSeconds] = React.useState();
  // Custom styles
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
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "5px",
  };

  let timeout;
  document.getElementById("root").addEventListener("mousemove", async () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (window.location.pathname === "/home") {
        setOpen({ ...open, SessionExpiry: true });
        handleLogout(); // update the logoutTime in userDetails collection
        window.onbeforeunload = (e) => {
          navigate("/");
          sessionStorage.clear();
        };
      }
    }, 1000 * 60 * 30);
  });

  // this funtion used to update the logoutTime when user is expired
  const handleLogout = async () => {
    // get the current Time
    let logoutTime = new Date().getTime();
    const obj = {
      userID: sessionStorage.getItem("UserName").split(",")[1] || "",
      logoutTime: logoutTime,
      flag: "specific",
    };
    // update the logout time when the session is logged out
    let result = await axios.post(
      `http://${path.Location}:${path.Port}/SaveUsers`,
      obj
    );
    if (result) {
      console.log("Logout successful");
    }
  };

  // this function call each 5sec, for check the loginTime in back end
  const checkUserLogin = async () => {
    if (sessionStorage.getItem("loginTime")) {
      // get the details from session storge
      let obj = {
        userID: sessionStorage.getItem("UserName").split(",")[1],
        loginTime: sessionStorage.getItem("loginTime"),
      };
      // send request to backend for checking the logout time
      let result = await axios.post(
        `http://${path.Location}:${path.Port}/checkCurUserLogin`,
        obj
      );
      // if status is success its clear the session details
      if (result.status === 200) {
        navigate("/");
        sessionStorage.clear();
        console.log("logout successfully");
      }
    }
  };
  setInterval(checkUserLogin, 5000);

  // These functions which are used to get the data from the other components
  const data = (state, enable, navbar, file) => {
    setData({ data: undefined });
    try {
      setState(state);
      if (state !== undefined) {
        setEnable(enable);
        //setNavbar(navbar)
        setChangeType({
          ...changeType,
          Dimensions: file.newArray,
          file: file.Uploaded_file,
        });
      }
    } catch (error) {
      console.log("Error  ==>1", error);
    }
  };

  const expand = useCallback(
    (navwidth) => {
      setNavWidth(navwidth);
    },
    [navwidth]
  );

  const DataTable = (data) => {
    if (data?.Uploaded_fileID) {
      setData({ data: data?.data, Uploaded_fileID: data?.Uploaded_fileID });
    } else {
      setData({ ...filedata, data: data?.data });
    }
  };
  const video = (play) => {
    setPlay({ isPlay: play.isPlay });
  };

  const showDashboard = (param) => {
    Isshow({ ...param, isRendered: !show.isRendered });
    //setFeedback(undefined)
  };

  const handleFeedback = (params) => {
    setFeedback({ Issues: params });
  };

  //Tab change
  const handleChange = (event, newValue) => {
    document.querySelector(".loader").style.display = "block";
    setValue(newValue);
  };

  //Changing data type for the columns
  const handleChangeDatatype = (event, flag) => {
    if (flag !== 1) {
      setChangeType({ ...changeType, [event.target.name]: event.target.value });
    } else {
      let SelectedDimension = changeType.Dimensions_;
      let TypeChanged =
        changeType.DataTypes +
        " " +
        SelectedDimension.split(" ").splice(1).join(" ");
      let DimensionsCopy = changeType.Dimensions;

      let value = SelectedDimension.split(" ").slice(1, 30).join(" ");
      let datatype = SelectedDimension.split(" ").splice(0, 1)[0];
      value = changeType.file[0][value];
      if (changeType.DataTypes === "#") {
        if (isNaN(value - 10)) {
          setError({
            mandatoryFields:
              "The selected column will not be change as Integer",
          });
          return;
        } else {
          setError({ mandatoryFields: undefined });
        }
      } else if (changeType.DataTypes === "Da") {
        if (
          !isNaN(value - 10) ||
          (new Date(value) == "Invalid Date" &&
            new Date(value).getFullYear().toString().length >= 4)
        ) {
          setError({
            mandatoryFields: "The selected column will not be change as Date",
          });
          return;
        } else {
          setError({ mandatoryFields: undefined });
        }
      } else if (changeType.DataTypes === "Bo") {
        if (
          value.toLowerCase().toString() !== "true" ||
          value.toLowerCase().toString !== "false"
        ) {
          setError({
            mandatoryFields:
              "The selected column will not be change as Boolean",
          });
          return;
        } else {
          setError({ mandatoryFields: undefined });
        }
      } else if (changeType.DataTypes === "Aa") {
        if (datatype !== "#") {
          setError({
            mandatoryFields: "The selected column will not be change as String",
          });
          return;
        } else {
          setError({ mandatoryFields: undefined });
        }
      }

      DimensionsCopy.forEach((element, index) => {
        if (element === changeType.Dimensions_) {
          DimensionsCopy[index] = TypeChanged;
          setChangeType({
            ...changeType,
            Dimensions_: DimensionsCopy[index],
            Dimensions: DimensionsCopy,
          });
          return;
        }
      });
      Swal.fire({
        icon: 'success',
        title: "Data type has been changed.",
      });
      setState({
        ...state,
        XAxis_: changeType.Dimensions,
        YAxis_: changeType.Dimensions,
      });
      setChangeType({ ...changeType, enableChange: false });
      //  event.preven
    }
  };

  //Get the project details for preview
  const handleProject = (params) => {
    setProject(params);
    if (params.action === "AssignUser") {
      setAssignUser(params);
      Isshow({});
      setData({ data: undefined });
    } else if (
      // hide the dashboard based on the action
      params.action === "Update" ||
      params.action === "Cancel" ||
      params.action === "Save" ||
      params.action === "Delete"
    ) {
      Isshow({ isShow: undefined });
    } else {
      setAssignUser(params);
      if (params.userID !== undefined) {
        Isshow({ ...show, isShow: true, PreviewProject: true });
        setData({ data: undefined });
      }
    }
  };
  const handlePage = (params) => {
    console.log("Current page", params);
    setNavbar(params);
    setAssignUser({});
  };

  // it will call when card preview is clicked bu franklin
  const showCard = (params) => {
    setcardData(params);
  };
  const navigate = useNavigate();

  return (
    <div>
      <div className="col-lg-12" style={{ width: "100%" }}>
        <div className="loader"></div>
        <ToastContainer />
        <Header />
        <div
          className="row"
          style={{
            background: "#F4F4F8",
            marginRight: "0px",
            height: "calc(94vh -14px)",
            paddingTop: "6vh",
          }}
        >
          <InputBlock
            ChildtoParentHandshake={data}
            ExpandData={expand}
            dataTable={DataTable}
            demoVideo={video}
            showDashboard={showDashboard}
            feedback_={handleFeedback}
            project_={handleProject}
            currentPage={handlePage}
            showCard={showCard} // it will call when card preview is clicked bu franklin
          />
          <div
            className=""
            style={{
              backgroundColor: "#F4F4F8 ",
              width: `${
                navwidth.ChartArea === "63%"
                  ? "calc(72% - 90px)"
                  : "calc(100% - 90px)"
              }`,
              height: "calc(94vh)",
            }}
          >
            {/* {
            filedata.data === undefined 
            play.isPlay !== true &&
            show.isShow !== true &&
           feedback.Issues === undefined 
            ? ( */}
            <>
              {(navbar === "Charts" || navbar === "Templates") &&
                cardData?.Generate === undefined && ( //  display if the generated card is undefind by franklin
                  <ChartBlock enable={enable} state={state} />
                )}
            </>
            {/* ) : ( */}
            <>
              {navbar === "Data" && filedata.data !== undefined ? (
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Data" value="1" />
                        <Tab label="Data Dictionary" value="2" />
                        <Tab label="Insights" value="3" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <DatasetTable params={filedata.data} />
                    </TabPanel>
                    <TabPanel value="2">
                      <Dictionary
                        params={filedata.data}
                        renderSetData={DataTable}
                        Uploaded_fileID={filedata.Uploaded_fileID}
                      />
                    </TabPanel>
                    <TabPanel value="3">
                      <Statistics
                        params={filedata.data}
                        Uploaded_fileID={filedata.Uploaded_fileID}
                      />
                    </TabPanel>
                  </TabContext>
                </Box>
              ) : (
                ""
              )}
            </>
            {/* )} */}

            {navbar === "Demo" ? <Demo /> : ""}

            {(navbar === "Project" || navbar === "Dashboard") &&
              show.isShow !== undefined && (
                // assignUser?.action !== "AssignUser" ? (
                <Dashboard params={show.PreviewProject ? project : show} />
              )}
            {assignUser?.action === "AssignUser" && navbar === "Project" && (
              <AssignProject params={assignUser} />
            )}
            {/* added for cards block by franklin*/}
            {(navbar === "Cards" || navbar === "Templates") &&
            cardData?.Generate !== undefined ? (
              <CardBlock params={cardData} />
            ) : (
              ""
            )}
            {/* )} */}
            {navbar === "Feedback" ? <Feedback params={feedback.Issues} /> : ""}
            {navbar === "Admin" ? <AdminView /> : ""}

            {(state === undefined || Object.keys(state).length === 0) &&
            feedback.Issues === undefined &&
            !show.isShow &&
            !play.isPlay &&
            assignUser?.action !== "AssignUser" &&
            filedata.data === undefined &&
            cardData?.Generate === undefined ? (
              <>
                <div className="emptyPage">
                  <img alt="Loading..." src={EmptyPage}></img>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {/* Session Expiry */}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open.SessionExpiry}
          onClose={(e) => {
            setOpen({ SessionExpiry: false });
            navigate("/");
            sessionStorage.clear();
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open.SessionExpiry}>
            <Box sx={style}>
              <Typography
                className="expiry-modal-title"
                variant="h6"
                component="h5"
              >
                Session Timeout
              </Typography>
              <Typography
                id="transition-modal-description"
                sx={{ mt: 2 }}
                style={{ marginTop: "10px" }}
              >
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    Your session is expired.
                  </div>
                </div>
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};
export default HomePage;
