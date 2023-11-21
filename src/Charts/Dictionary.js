import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Fade } from "@material-ui/core";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/CheckCircleRounded";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import "../Styles/Custom.css";
import axios from "axios";
import Swal from "sweetalert2";
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
const Dictionary = ({ params, renderSetData, Uploaded_fileID }) => {
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

  //for filecheck
  const [fileUsed, setFileUsed] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [datatype, setDataType] = React.useState({ type: "All" });
  const [changeddltype, setChangeddlType] = React.useState({ type: "Select" });
  const [histogramdata, sethistogramdata] = React.useState([]);
  //const [Index, setIndex] = React.useState({});//Moved to Insights
  const [changeDisplay, setDisplay] = React.useState({
    enableDisplay: true,
    displayname: "",
    column: "",
  });
  //const [countplotdata, setcountplotdata] = React.useState([]);//Moved to Insights
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
    document.querySelector(".loader").style.display = "block";
    //to checkfileExist
    checkTemplateExist();
  }, [params]);

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
    // "Bo Boolean",
  ];
  const methods = ["Data Types", "Display Name", "Change Types"];
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
        if (response.data.length != 0) {
          Object.entries(response.data[0].dataDictionary).forEach(
            ([key, value]) => {
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
            }
          );

          let value = {};
          var temparray = [];
          cols.forEach((event, index) => {
            let params = response.data[0].dataDictionary;

            // value.graphicon = params[index].graphicon;//Moved to Insights
            value.changetype = params[index].changetype;
            value.datatype = params[index].datatype;
            //value.rowdata =  params[index].rowdata;//Moved to Insights
            value.columns = params[index].columns;
            value.displaynames = params[index].displaynames;
            temparray.push(value);
            value = {};
          });

          setTableData(temparray);
        }
      });
  };

  const SaveChangeData = (tabledata, disnames, indexset) => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetIDDataSet`, {
        userID: user.userID,
        id: sessionStorage.getItem("uploadfilename"),
      })
      .then((response) => {
        const newid = response.data[0]._id;
        // Use map to rename
        response.data[0].data = response.data[0].data.map((item) => {
          let keysnew = Object.keys(item)[indexset];
          if ([keysnew] in item) {
            let updatedA = {};
            let keys = Object.keys(item);
            const alterIndex = keys.indexOf(keysnew);
            for (let i = 0; i < keys.length; i++) {
              if (i === alterIndex) {
                updatedA[disnames] = item[keysnew];
              } else {
                updatedA[keys[i]] = item[keys[i]];
              }
            }
            item = updatedA;
            return item;
          }
        });
        axios
          .post(`http://${path.Location}:${path.Port}/UpdateDataSet`, {
            userID: user.userID,
            datasetID: newid,
            filename: sessionStorage.getItem("uploadfilename"),
            data: response.data[0],
          })
          .then((response3) => {
            axios
              .post(`http://${path.Location}:${path.Port}/InsertDataDict`, {
                userID: user.userID,
                datasetID: newid,
                filename: sessionStorage.getItem("uploadfilename"),
                data: tabledata,
              })
              .then((response2) => {
                if (response2.status === 200) {
                  Swal.fire({
                    icon: 'success',
                    title: "Saved Sucessfully"
                  });
                  init();
                  renderSetData(response.data[0]);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
      });
  };

  const handleChangeDatatype = (event, index) => {
    // Do nothing and return if 'columns' equals 'displaynames' and 'changetype' equals 'datatype'.;
    tabledata.forEach((eventtab, indextab) => {
      if (indextab == index) {
        if (
          eventtab.columns === eventtab.displaynames &&
          eventtab.changetype === eventtab.datatype
        ) {
          return;
        }
        //To Check Display name is Empty or not...
        if (eventtab.displaynames == "" || eventtab.displaynames == null) {
          Swal.fire({
            icon: "warning",
            text: "Display Name Should not be Empty",
          });
          return;
        }
        //To on change type changing the charts type
        if (
          eventtab.changetype == "# Integers" ||
          eventtab.changetype == "Da Date" ||
          eventtab.changetype == "Bo Boolean"
        ) {
          //eventtab.graphicon = "histogram";//Moved to Insights
          eventtab.datatype = eventtab.changetype;
        }
        if (eventtab.changetype == "Aa Strings") {
          //eventtab.graphicon = "Category";//Moved to Insights
          eventtab.datatype = eventtab.changetype;
        }
        if (eventtab.displaynames != "" || eventtab.displaynames != null) {
          eventtab.columns = eventtab.displaynames;
        }
        SaveChangeData(tabledata, eventtab.displaynames, index);
      }
    });
  };
  setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
  }, 300);

  //checking whether file is being used in template and returns true or false to displayname and changeDatatypes column
  const checkTemplateExist = async () => {
    // check wheather the dataset used in template or not
    try {
      let result_fileExist = await axios.post(
        `http://${path.Location}:${path.Port}/CheckTemplateExist`,
        {
          userID: user.userID,
          id: Uploaded_fileID,
        }
      );
      if (result_fileExist.data.length !== 0) {
        setFileUsed(true);
      } else {
        setFileUsed(false);
      }
    } catch (err) {
      console.error("Error while checking the file Existing:", err);
    }
  };
  return (
    <>
      <div className="container">
        <div
          className="row col-sm-4 col-md-4 col-lg-3"
          style={{ float: "right" }}
        ></div>
        <div className="custom-title">
          <b style={{ color: "#2E89FF" }}>Source: </b>
          {sessionStorage.getItem("uploadfilename")}
        </div>
        <TableContainer
          component={Paper}
          style={{ marginTop: "10px" }}
          className="TableContainer"
        >
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

                {/* <TableCell style={{ width: 200 }}>Column</TableCell>
                {methods.map((col) => (             
         
                  <TableCell>
                    {col === 'Change Types' ? (
                col
              ) : (
                <TableSortLabel active={sortBy === col} direction={sortDirection} onClick={() => handleSort(col)}>{col}
                </TableSortLabel>
              )}
                </TableCell> ))} */}
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
                    {/* Display Name...   */}
                    {fileUsed === true ? (
                      <>
                        <TableCell>{row.displaynames}</TableCell>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}

                    {/* Change Types... */}
                    {fileUsed === true ? (
                      <>
                        <TableCell>
                          <div
                            className="div-icon"
                            style={{ marginRight: "5px" }}
                          >
                            <select
                              className="select-dpd"
                              style={{ marginRight: "5px" }}
                              value={row.changetype}
                              disabled
                            >
                              {TableDataTypes.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <div
                            className="div-icon"
                            style={{ marginRight: "5px" }}
                          >
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
                                <option
                                  key={option}
                                  value={option}
                                  disabled={option === "Select"} // Disable the "Select" option
                                >
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
                      </>
                    )}
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
                    {/* Moved to Insights */}

                    {/* <TableCell>
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
                    </TableCell> */}
                    {/* End Moved to Insights */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Moved to Insights */}
        {/* {open.HistogramChart && <PreviewModal />}
        {opencount.CountPlot && <PreviewModalCount />} */}
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
