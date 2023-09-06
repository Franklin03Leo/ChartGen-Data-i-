import * as React from "react";
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

import * as statis from "simple-statistics";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import histogram from "../../src/Images/histogram.png";
import categorical from "../../src/Images/categorical.png";
// import Histogram from "../Charts/Histogram";
import BarChart from "../Charts/BarChart";
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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [datatype, setDataType] = React.useState({ type: "All" });
  const [state, setState] = React.useState({});
  const [changeType, setChangeType] = React.useState({
    enableChange: true,
    Dimensions_: "Select",
    DataTypes: "#",
  });
  const [error, setError] = React.useState({});
  //const TableDataTypes = ["#", "Da", "Aa"];
  const TableDataTypes = ["#", "Da", "Aa"];
  const methods = ["Data Type", "Change Type", "Chart"];
  const DataTypes = ["All", "Integers", "Strings"];
  let cols = [];
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick_histo = () => {
    <BarChart params={state} />;
  };
  const handleClick_cat = () => {
    // // Call your JavaScript function here
    // <Histogram params={state} />
  };
  //Changing data type for the columns
  const handleChangeDatatype = (event, flag, dim) => {
    if (flag !== 1) {
      setChangeType({ ...changeType, [event.target.name]: event.target.value });
    } else {
      //let SelectedDimension = changeType.Dimensions_;
      let SelectedDimension = dim;
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

      toast.success("Data type has been changed.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 2000,
      });
      setState({
        ...state,
        XAxis_: changeType.Dimensions,
        YAxis_: changeType.Dimensions,
      });
      setChangeType({ ...changeType, enableChange: true });
      //  event.preven
    }
  };
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
  //console.log('statis', params);
  let value = {};
  var tabledata = [];
  cols.forEach((event, index) => {
    let data = params.map((e) => parseInt(e[event]));
    if (isNaN(data[0])) {
      let data1 = params.map((e) => e[event]);
      value.min = toPascalCase(typeof data1[0]);
      value.graphicon = "Category";
    }
    // if (!isNaN(data[0] - 10) || (new Date(data[0]) == "Invalid Date" && new Date(data).getFullYear().toString().length >= 4)
    // ) {
    //   let data2 = params.map((e) => e[event]);
    //   value.min = toPascalCase(typeof data2[0])
    //   value.graphicon = 'Category'}
    else {
      value.min = toPascalCase(typeof data[0]);
      if (value.min == "Number") {
        value.graphicon = "histogram";
      }
    }

    //   name="DataTypes"
    //   label="DataTypes"
    //   className="input-field "
    //   onChange={(e) => {
    //     handleChangeDatatype(e);
    //   }}
    //   // onBlur={(e) => { handleValidation(e) }}
    //   value={changeType.DataTypes}
    // >
    //   {DataTypes.map((option, index) => (
    //     <MenuItem key={option} value={option}>
    //       {option}
    //     </MenuItem>
    //   ))}

    //   value.max = statis.max(data);
    //   value.uniqueCountSorted = statis.uniqueCountSorted(data);
    //   value.mean = statis.mean(data);
    //   value.median = statis.median(data);
    //   value.mode = statis.mode(data);
    //   value.standardDeviation = statis.standardDeviation(data);
    tabledata.push(value);
    value = {};
  });
  //console.log('data_', data_)

  return (
    <>
      <div
        className="row col-sm-4 col-md-4 col-lg-3"
        style={{ float: "right" }}
      >
        <TextField
          id="XAxis"
          select
          name="DataTypes"
          label="Statistics for"
          className="input-field "
          margin="dense"
          onChange={(e) => {
            setDataType({ type: e.target.value });
          }}
          // onBlur={(e) => { handleValidation(e) }}
          value={datatype.type}
          style={{ float: "right" }}
        >
          {DataTypes.map((option, index) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ minWidth: 650, maxHeight: "80vh" }}
        >
          <TableHead>
            <TableRow>
              <TableCell>column</TableCell>
              {methods.map((col) => (
                <TableCell>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tabledata
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell style={{ fontWeight: "900" }}>
                    {cols[index]}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.min}
                  </TableCell>
                  <TableCell>
                    <TabPanel value="3">
                      <div
                        className="row col-lg-6 borderdivstyle"
                        style={{ margin: "25px 0px 0px 0px" }}
                      >
                        {changeType.enableChange === false ? (
                          <div className="row col-sm-4 col-md-4 col-lg-6">
                            <Button
                              variant="contained"
                              className="input-field button"
                              style={{
                                backgroundColor: "#6282b3",
                                float: "right",
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
                            <div className="row col-sm-4 col-md-4 col-lg-3">
                              <TextField
                                id="XAxis"
                                select
                                name="DataTypes"
                                label="DataTypes"
                                className="input-field "
                                onChange={(e) => {
                                  handleChangeDatatype(e);
                                }}
                                // onBlur={(e) => { handleValidation(e) }}
                                value={changeType.DataTypes}
                              >
                                {TableDataTypes.map((option, index) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
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
                                  style={{ color: "green" }}
                                  fontSize="small"
                                  onClick={(e) => {
                                    handleChangeDatatype(e, 1, cols[index]);
                                  }}
                                />
                              </BootstrapTooltip>
                            </div>
                            <div className="row col-sm-3 col-md-3 col-lg-3">
                              <BootstrapTooltip
                                title="Cancel"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <Clear
                                  className="Datatypeicon"
                                  style={{ color: "red" }}
                                  fontSize="small"
                                  onClick={(e) => {
                                    setChangeType({
                                      ...changeType,
                                      enableChange: true,
                                    });
                                    setError({ mandatoryFields: undefined });
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
                    </TabPanel>
                  </TableCell>
                  <TableCell>
                    {row.graphicon == "histogram" ? (
                      <img
                        src={histogram}
                        alt="Logo"
                        onClick={handleClick_histo}
                      ></img>
                    ) : (
                      <img
                        src={categorical}
                        alt="Logo"
                        onClick={handleClick_cat}
                      ></img>
                    )}
                  </TableCell>

                  {/* <TableCell>{row.median}</TableCell>s
                   <TableCell>{row.mode}</TableCell>
                   <TableCell>{row.standardDeviation}</TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tabledata.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default Dictionary;
