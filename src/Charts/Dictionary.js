import React, { Fragment, useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TabPanel from "@mui/lab/TabPanel";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Alert from "@mui/material/Alert";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Fade } from "@material-ui/core";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/CheckCircleRounded";

import * as statis from "simple-statistics";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import HistogramChart from "../Charts/Histogram";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ZoomIn from "@mui/icons-material/ZoomInMap";
import CountPlot from "../Charts/CountPlot";
import "../Styles/Custom.css";
import axios from "axios";
import iconcount from "../../src/Images/iconscount.png";
import histo from "../../src/Images/histogram.png";
import Swal from 'sweetalert2';
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
const toPascalCase = (word) => {
  return word
    .split("_") // Split the word by underscores
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter of each part
    .join(""); // Join the parts together without spaces
};
const Dictionary = ({ params }) => {
  document.querySelector(".loader").style.display = "block";
  //Custom
  const style = {
    position: "absolute",
    top: "53%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #6282b3",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };
  const handleClose = () => setOpen({ HistogramChart: false });
  const handleOpen = (index, data) => {
    setOpen({ HistogramChart: true });
    setIndex({ i: index });
    sethistogramdata(data);
    // PreviewDataSet("histo", data);
  };

  const [open, setOpen] = React.useState({
    HistogramChart: false,
  });
  const [opencount, setOpencount] = React.useState({
    CountPlot: false,
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [datatype, setDataType] = React.useState({ type: "All" });
  const [changeddltype, setChangeddlType] = React.useState({ type: "Select" });
  const [state, setState] = React.useState({});
  const [histogramdata, sethistogramdata] = React.useState([]);
  const [countdata, setcountdata] = React.useState([]);
  const [Index, setIndex] = React.useState({});
  const [changeDisplay, setDisplay] = React.useState({
    enableDisplay: true,
    displayname: "",
    column: "",
  });
  const [countplotdata, setcountplotdata] = React.useState([]);
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  }); //49.204.124.69/
  const [user, setUser] = React.useState({
    userName: sessionStorage.getItem("UserName").split(",")[0],
    userID: sessionStorage.getItem("UserName").split(",")[1],
    Role: sessionStorage.getItem("Role"),
  });
  const [tabledata, setTableData] = React.useState([]);
  useEffect(() => {
    init();
  }, []);

  const PreviewDataSet = (fromchart, finaldata) => {
    if (fromchart == "histo") return <HistogramChart params={finaldata} />;
    else if (fromchart == "count") return <CountPlot params={histogramdata} />;
  };

  const handleClose_Count = () => {
    setOpencount({ CountPlot: false });
  };

  const handleOpen_Count = (index, data) => {
    setOpencount({ CountPlot: true });
    setIndex({ i: index });
    setcountplotdata(data);
    // PreviewDataSet("count", data);
  };

  //   //preview model for charts
  const PreviewModal = () => {
    return (
      <div>
        <Modal
          open={open.HistogramChart}
          onClose={(e) => {
            setOpen({ HistogramChart: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "98%", minHeight: "90%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{ float: "right", cursor: "pointer" }}
              >
                <ZoomIn
                  onClick={(e) => {
                    handleClose();
                  }}
                />
              </div>
            </Typography>
            <div className="row col-lg-12">
              <HistogramChart params={histogramdata} />
            </div>
          </Box>
        </Modal>
      </div>
    );
  };
  //preview model for charts
  const PreviewModalCount = () => {
    return (
      <div>
        <Modal
          open={opencount.CountPlot}
          onClose={(e) => {
            setOpencount({ CountPlot: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "98%", minHeight: "90%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{ float: "right", cursor: "pointer" }}
              >
                <ZoomIn
                  onClick={(e) => {
                    handleClose_Count();
                  }}
                />
              </div>
            </Typography>
            <div className="row col-lg-12"
            style={{
              height: "80vh",
              width: "100%",
              alignItems: "center"
            }}>
              <CountPlot data={countplotdata} />
            </div>
          </Box>
        </Modal>
      </div>
    );
  };
  const [changeType, setChangeType] = React.useState({
    enableChange: true,
    Dimensions_: "Select",
    DataTypes: "# Integers",
  });
  const [error, setError] = React.useState({});
  //const TableDataTypes = ["#", "Da", "Aa"];
  const TableDataTypes = [
    "Select",
    "# Integers",
    "Da Date",
    "Aa Strings",
    "Bo Boolean",
  ];
  const methods = ["Data Types", "Display Name", "Change Types", "Chart"];
  const DataTypes = ["All", "Integers", "Strings"];
  let cols = [];
  //Every fields onChange for store the inputs
  const handleChange = (event) => {
    setChangeType.DataTypes = event.target.value;
    changeType.DataTypes = event.target.value;
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = () => {
    setDisplay({ enableDisplay: false, displayname: "", column: "" });
  };
  const updateArrayOfObjects = (temparray) => {
    setTableData(temparray);
  };
  const handleInputChange = (e, colindex) => {
    // Create a copy of the rowData array to update the specific row
    const updatedRowData = [...tabledata];
    updatedRowData[colindex]["displaynames"] = e.target.value;
    // Update state with the new rowData
    setTableData(updatedRowData);
  };
  // Event handler to handle changes in the dropdown for a specific row
  const handleDropdownChange = (event, index) => {
    // Create a copy of the rowData array to update the specific row
    const updatedRowData = [...tabledata];
    updatedRowData[index]["changetype"] = event.target.value;
    // Update state with the new rowData
    setTableData(updatedRowData);
  };
  const init = () => {
    //Assinging the data to Table Data...
    axios
      .post(`http://${path.Location}:${path.Port}/GetDict`, {
        SrcName: sessionStorage.getItem("uploadfilename"),
        userID: user.userID,
      })
      .then((response) => {
        let keyExists = false;
        if (response.data.length != 0) {
          // Key to check
          const keyToCheck = "DictionaryDataSet";
          keyExists = response.data.some((obj) =>
            obj.hasOwnProperty(keyToCheck)
          );
        }
        if (response.data.length != 0 && keyExists) {
          setTableData(response.data[0].DictionaryDataSet);
        } else {
          Object.entries(params[0]).forEach(([key, value]) => {
            if (isNaN(value - 10) && new Date(value) != "Invalid Date") {
              //Do nothing
            } else if (datatype.type === "All") {
              // if (!isNaN(value - 10)) {
              cols.push(key);
              // }
            } else if (datatype.type === "Integers") {
              if (!isNaN(value - 10)) {
                cols.push(key);
              }
            } else if (datatype.type === "Strings") {
              if (isNaN(value - 10)) {
                cols.push(key);
              }
            }
          });
          ///////////////////****************************** */
          let value = {};
          var temparray = [];

          cols.forEach((event, index) => {
            let data = params.map((e) => parseInt(e[event]));
            if (isNaN(data[0])) {
              let data1 = params.map((e) => e[event]);
              let dataval = toPascalCase(typeof data1[0]);
              value.graphicon = "Category";
              value.rowdata = data1;
              value.columns = cols[index];
              value.displaynames = cols[index];
              setDisplay.displayname = cols[index];
              if (
                dataval == "String" ||
                dataval == "Date" ||
                dataval == "Boolean"
              ) {
                if (dataval == "String") {
                  value.changetype = "Aa Strings";
                  value.datatype = "Aa Strings";
                }
                if (dataval == "Date") {
                  value.changetype = "Da Date";
                  value.datatype = "Da Date";
                }
                if (dataval == "Boolean") {
                  value.changetype = "Bo Boolean";
                  value.datatype = "Bo Boolean";
                }
                value.rowdata = data1;
                value.columns = cols[index];
                value.displaynames = cols[index];
                setDisplay.displayname = cols[index];
              }
            } else {
              let dataval = toPascalCase(typeof data[0]);
              if (dataval == "Number") {
                value.graphicon = "histogram";
                value.rowdata = data;
                value.changetype = "# Integers";
                value.datatype = "# Integers";
                value.columns = cols[index];
                value.displaynames = cols[index];
                setDisplay.displayname = cols[index];
              }
            }
            temparray.push(value);
            value = {};
          });
          setTableData(temparray);
        }

        //setTableData(temparray);
      });
    //End of Assinging the data to Table Data...
  };
  const ShowChart = (type, data) => {
    if (type == "histo") {
      alert("fj");
    } else if (type == "count") {
      alert("fjf");
    }
  };
  const SaveChangeData = (tabledata) => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetDict`, {
        SrcName: sessionStorage.getItem("uploadfilename"),
        userID: user.userID,
      })
      .then((response) => {
        if (response.data.length == 0) {
          Swal.fire({
            icon: 'error',
            text: 'Uploaded File is not Saved.Before Changing Save the File',           
          });          
          return;
        } else if (response.data.length != 0) {
          var finaltabledata = [];
          finaltabledata.push({
            SrcName: sessionStorage.getItem("uploadfilename"),
            userID: user.userID,
          });
          finaltabledata.push(tabledata);
          axios
            .post(`http://${path.Location}:${path.Port}/InsertDataDict`, finaltabledata)
            .then((response) => {
              if (response.status === 200) {
                Swal.fire('Saved Sucessfully');                
                init();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  };

  const handleChangeDatatype = (event, index) => {
    tabledata.forEach((eventtab, indextab) => {
      if (indextab == index) {
        //To Check Display name is Empty or not...
        if (eventtab.displaynames == "" || eventtab.displaynames == null) {
          Swal.fire({
            icon: 'error',           
            text: 'Display Name Should not be Empty',           
          });
          return;
        }
        //To on change type changing the charts type
        if (
          eventtab.changetype == "# Integers" ||
          eventtab.changetype == "Da Date" ||
          eventtab.changetype == "Bo Boolean"
        ) {
          eventtab.graphicon = "histogram";
          eventtab.datatype = eventtab.changetype;
        }
        if (eventtab.changetype == "Aa Strings") {
          eventtab.graphicon = "Category";
          eventtab.datatype = eventtab.changetype;
        }
        SaveChangeData(tabledata);
      }
    });
  };
  document.querySelector(".loader").style.display = "none";
  return (
    <>
      <div className="container">
        <div
          className="row col-sm-4 col-md-4 col-lg-3"
          style={{ float: "right" }}
        >
          {/* <TextField
            id="XAxis"
            select
            name="DataTypes"
            label="Statistics for"
            className="input-field "
            margin="dense"
            onChange={(e) => {
              setDataType({ type: e.target.value });
            }}
            value={datatype.type}
            style={{ float: "right" }}
          >
            {DataTypes.map((option, index) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField> */}
        </div>
        <div className="custom-title">
          <b style={{ color: "#2E89FF" }}>Source: </b>
          {sessionStorage.getItem("uploadfilename")}
        </div>
        <TableContainer component={Paper} style={{ marginTop:"10px" }}  className="TableContainer">
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 650, maxHeight: "80vh" }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 200 }}>Column</TableCell>
                {methods.map((col) => (
                  <TableCell>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {tabledata.map(item => (
        <div key={item.id}>{item.id}</div>
      ))}
              </TableBody>  */}
            <TableBody>
              {Object.values(tabledata)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* Column... */}
                    {/* <TableCell style={{ fontWeight: "900" }}>{cols[index]}</TableCell>  */}
                    <TableCell style={{ fontWeight: "900" }}>
                      {row.columns}
                    </TableCell>

                    {/* Data Types... */}
                    <TableCell component="th" scope="row">
                      {row.datatype}
                    </TableCell>
                    {/* Display Name... */}
                    <TableCell onClick={handleClick}>
                      <div>
                        {/* {changeDisplay.enableDisplay === false ? ( */}
                        <div>
                          {" "}
                          <input
                            type="text"
                            style={{ width: 120 }}
                            id={`displayname-${index}`}
                            value={row.displaynames}
                            onChange={(e) => {
                              handleInputChange(e, index);
                            }}
                          />
                        </div>
                        {/* ) : ( */}
                        {/* <div id={cols[index]} style={{ width: 100 }}>{row.displaynames}</div> */}
                        {/* )} */}
                      </div>
                    </TableCell>
                    {/* Change Types... */}
                    <TableCell>
                      <div className="div-icon" style={{ marginRight: "5px" }}>
                        <select
                          className="select-dpd"
                          style={{ marginRight: "5px" }}
                          value={row.changetype}
                          onChange={(e) => {
                            setChangeddlType({ type: e.target.value });
                            handleDropdownChange(e, index);
                          }}
                        >
                          {TableDataTypes.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <BootstrapTooltip
                          title="Change"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="right"
                        >
                          <CheckIcon
                            size="3em"
                            color="success"
                            onClick={(e) => {
                              handleChangeDatatype(e, index);
                            }}
                          />
                        </BootstrapTooltip>
                      </div>
                    </TableCell>
                    {/* <TableCell style={{ width: 2500 }}>
                      <TabPanel value="3">
                        <div
                          className="row  borderdivstyle"
                          // style={{ margin: "25px 0px 0px 0px" }}
                        >
                          {changeType.enableChange === false ? (
                            <div className="row col-sm-4 col-md-4 col-lg-6">
                              <Button
                                variant="contained"
                                className="input-field button"
                                style={{
                                  backgroundColor: '#6282b3',
                                  float: 'right',
                                }}
                                onClick={(e) => {
                                  setChangeType({
                                    ...changeType,
                                    enableChange: true,
                                  });
                                }}
                              >
                                Change Type
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div
                                className="row col-sm-4 col-md-4 col-lg-6"
                                style={{ float: 'right' }}
                              >
                                <TextField
                                  id="XAxis"
                                  select
                                  name="TableDataTypes"
                                  label="Change Types"
                                  className="input-field "
                                  margin="dense"
                                  onChange={(e) => {
                                    setChangeddlType({ type: e.target.value });
                                    handleDropdownChange(e, index);
                                  }}
                                  value={row.changetype}
                                  style={{ float: 'right' }}
                                >
                                  {TableDataTypes.map((option, index) => (
                                    <MenuItem key={option} value={option}>
                                      {' '}
                                      {option}{' '}
                                    </MenuItem>
                                  ))}{' '}
                                </TextField>
                              </div>
                              <div className="row col-sm-3 col-md-3 col-lg-3">
                                <BootstrapTooltip
                                  title="Change"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <Check
                                    className="Datatypeicon"
                                    style={{ color: 'green' }}
                                    fontSize="small"
                                    onClick={(e) => {
                                      handleChangeDatatype(
                                        e,
                                        index                                       
                                      );
                                    }}
                                  />
                                </BootstrapTooltip>
                              </div>
                            </>
                          )}
                          {error.mandatoryFields !== undefined ? (
                            <div
                              className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
                              style={{
                                margin: '15px 0px 15px  0px',
                                padding: 0,
                              }}
                            >
                              <Alert severity="error">
                                {error.mandatoryFields}
                              </Alert>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </TabPanel>
                    </TableCell> */}
                    {/* Charts */}

                    <TableCell>
                      {row.graphicon == "Category" ? (
                        <div>
                          <img
                            src={iconcount}
                            name="category"
                            color="white"
                            alt="Logo"
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              handleOpen_Count(index, row.rowdata)
                            }
                          ></img>
                        </div>
                      ) : (
                        ""
                      )}
                      {row.graphicon == "histogram" ? (
                        <div>
                          {/* <ZoomIn    onClick={(e) => { handleOpen(index);}}/> */}
                          {/* <HistogramChart params={row.rowdata} /> */}
                          <img
                            src={histo}
                            name="histo"
                            color="white"
                            alt="Logo"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              handleOpen(index, row.rowdata);
                            }}
                          ></img>
                        </div>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {open.HistogramChart && <PreviewModal />}
        {opencount.CountPlot && <PreviewModalCount />}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tabledata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};
export default Dictionary;
