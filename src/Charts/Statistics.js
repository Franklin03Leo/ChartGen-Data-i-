import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";

// import * as statis from "simple-statistics";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "../Styles/Custom.css";
//Charts
import iconcount from "../../src/Images/iconscount.png";
import histo from "../../src/Images/histogram.png";
import CountPlot from "../Charts/CountPlot";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ZoomIn from "@mui/icons-material/ZoomInMap";
import HistogramChart from "../Charts/Histogram";
import CloseIcon from "@mui/icons-material/Close";
import { std, mean, median, mode, min, max } from "mathjs";
import axios from "axios";

const Statistics = ({ params, Uploaded_fileID }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [tabledata, setTabledata] = React.useState([]);
  const [datatype, setDataType] = React.useState({ type: "All" });
  const [dataForCharts, setDataForCharts] = React.useState([]);
  const [cols, setCols] = React.useState([]);
  const methods = [
    "Min",
    "Max",
    "Unique",
    "Mean",
    "Median",
    "Mode",
    "Standard Deviation",
    "Count",
    "Missing Count",
    "Charts",
  ];

  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });

  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const DataTypes = ["All", "Integers", "Strings"];
  let value = {};

  const getDataDictionary = async () => {
    let result = await axios.post(
      `http://${path.Location}:${path.Port}/GetDataDictionaty`,
      {
        id: Uploaded_fileID,
      }
    );

    let finalResult = [];
    if (result) {
      if (result.data.length !== 0) {
        let tempArray = result.data[0];
        finalResult = tempArray.dataDictionary.map((val) => {
          let tempval = val.datatype.split(" ")[1];
          return { ["datatype"]: tempval, ["columns"]: val.columns };
        });
      }

      let colsarr = [];
      Object.entries(params[0]).forEach(([key, value]) => {
        if (datatype.type === "All") {
          colsarr.push(key);
        } else if (datatype.type === "Integers") {
          if (!isNaN(value - 10)) {
            colsarr.push(key);
          }
        } else if (datatype.type === "Strings") {
          if (isNaN(value) && isNaN(Date.parse(value))) {
            colsarr.push(key);
          } else if (isNaN(value - 10) && new Date(value) !== "Invalid Date") {
            //Do nothing
          }
        }
      });

      let arr = [];
      let arrnew = [];

      colsarr.forEach((event, i) => {
        if (event !== "") {
          value["className"] = event;
          let data = params.map((e) => e[event]);
          let mapData = params
            .map((e) => e[event] !== "" && e[event])
            .filter(Boolean);

          let dataTypeValue = finalResult?.[i]?.datatype || null;
          try {
            switch (dataTypeValue) {
              case "Integers":
                value.min = Math.min(...data);
                break;
              // case "Boolean":
              //   value.min = (
              //     data.length === data.filter((val) => val).length
              //   ).toString();
              //   break;
              case "Date":
                value.min = getMinValue(data);
                break;
              case "Strings":
              case "Boolean":
                value.min = "-";
                break;
              default:
                value.min = data.every(
                  (element) =>
                    !isNaN(parseInt(element.toString().replaceAll(",", "")))
                )
                  ? formatFixedRate(Math.min(...data)) === 0 ||
                    formatFixedRate(Math.min(...data))
                    ? formatFixedRate(Math.min(...data))
                    : getMinValue(data)
                  : "-";
                break;
            }
          } catch (error) {
            console.log(error);
            value.min = "-";
          }

          try {
            switch (dataTypeValue) {
              case "Integers":
                value.max = Math.max(...data);
                break;
              // case "Boolean":
              //   value.max = (
              //     data.length === data.filter((val) => val).length
              //   ).toString();
              //   break;
              case "Date":
                value.max = getMaxValue(data);
                break;
              case "Strings":
              case "Boolean":
                value.max = "-";
                break;
              default:
                value.max = data.every(
                  (element) =>
                    !isNaN(parseInt(element.toString().replaceAll(",", "")))
                )
                  ? formatFixedRate(Math.max(...data)) === 0 ||
                    formatFixedRate(Math.max(...data))
                    ? formatFixedRate(Math.max(...data))
                    : getMaxValue(data)
                  : "-";
                break;
            }
          } catch (error) {
            value.max = "-";
            console.log(error);
          }

          try {
            switch (dataTypeValue) {
              case "Integers":
                value.mean = formatFixedRate(mean(...data));
                break;
              // case "Boolean":
              //   value.mean = (
              //     data.length === data.filter((val) => val).length
              //   ).toString();
              //   break;
              case "Date":
              case "Strings":
              case "Boolean":
                value.mean = "-";
                break;
              default:
                value.mean = data.every(
                  (element) =>
                    !isNaN(parseInt(element.toString().replaceAll(",", ""))) &&
                    /^\d+(\.\d+)?$/.test(data[0].toString().replace(/,/g, ""))
                )
                  ? formatFixedRate(
                      mean(
                        data.map((value) => value.toString().replace(/,/g, ""))
                      )
                    )
                  : "-";
                break;
            }
          } catch (error) {
            value.mean = "-";
            console.log(error);
          }

          try {
            switch (dataTypeValue) {
              case "Integers":
                // value.median = formatFixedRate(
                //   median(...data)
                //   // median(...data.slice(5000, 10000))
                // );
                value.median = isNaN(medianValue(data))
                  ? "-"
                  : formatFixedRate(medianValue(data));
                break;
              case "Date":
              case "Strings":
              case "Boolean":
                value.median = "-";
                break;
              default:
                value.median = data.every(
                  (element) =>
                    !isNaN(parseInt(element.toString().replaceAll(",", ""))) &&
                    /^\d+(\.\d+)?$/.test(data[0].toString().replace(/,/g, ""))
                )
                  ? formatFixedRate(
                      median(
                        data.map((value) => value.toString().replace(/,/g, ""))
                      )
                    )
                  : "-";
                break;
            }
          } catch (error) {
            console.log(error);
            value.median = "-";
          }

          try {
            value.mode =
              mode(mapData).length === mapData.length
                ? "-"
                : mode(mapData).splice(0, 2).join(", ");
          } catch (error) {
            console.log(error);
            value.mode = "-";
          }

          try {
            switch (dataTypeValue) {
              case "Integers":
                value.standardDeviation = formatFixedRate(
                  std(data.map((value) => value.toString().replace(/,/g, "")))
                );
                break;
              // case "Boolean":
              //   value.standardDeviation = (
              //     data.length === data.filter((val) => val).length
              //   ).toString();
              //   break;
              case "Date":
              case "Strings":
              case "Boolean":
                value.standardDeviation = "-";
                break;
              default:
                value.standardDeviation = data.every(
                  (element) =>
                    !isNaN(parseInt(element.toString().replaceAll(",", ""))) &&
                    /^\d+(\.\d+)?$/.test(data[0].toString().replace(/,/g, ""))
                )
                  ? formatFixedRate(
                      std(
                        data.map((value) => value.toString().replace(/,/g, ""))
                      )
                    )
                  : "-";
                break;
            }
          } catch (error) {
            console.log(error);
            value.standardDeviation = "-";
          }

          //UniqueCount //Count //Missing Count
          value.uniqueCountSorted = formatFixedRate(new Set(data).size);
          value.useCount = formatFixedRate(data.length);
          const missCount = data.filter((val) => val);
          const missingCount = data.length - missCount.length;
          value.missingCount = missingCount;

          //Charts Row
          value.graphicon = data.every((element) => typeof element === "number")
            ? "histogram"
            : "Category";
          // dataForCharts.push({ [event]: data });
          arrnew.push({ [event]: data });
          arr.push(value);
          value = {};
        }
      });

      setTabledata([...arr]);
      setDataForCharts([...arrnew]);
      setCols([...colsarr]);
    }
  };

  React.useEffect(() => {
    getDataDictionary();
  }, [datatype, params]);

  // get the meadian value
  const medianValue = (arr) => {
    let mid = Math.floor(arr.length / 2);
    let sortedArr = arr.sort((a, b) => a - b);

    if (arr.length % 2 === 0) {
      return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    } else {
      return sortedArr[mid];
    }
  };

  // get the max value of the given array
  const getMaxValue = (dateStrings) => {
    try {
      var separators1 = dateStrings[0].match(/[-/:]/g);
      const dates = dateStrings.map(
        (dateString) =>
          // new Date(dateString) == "Invalid Date" ?
          new Date(
            dateString
              .split(/-|\/|:/)
              .reverse()
              .join("-")
          )
        //: new Date(dateString)
      );
      var date = new Date(Math.max(...dates));
      // Extract day, month, and year
      var day = date.getDate();
      var month = date.getMonth() + 1; // Month is zero-based, so add 1
      var year = date.getFullYear();
      // Format day, month, and year as "dd-mm-yyyy"
      var formattedDate =
        (day < 10 ? "0" : "") +
        day +
        separators1[0] +
        (month < 10 ? "0" : "") +
        month +
        separators1[0] +
        year;
      return formattedDate === `NaN${separators1[0]}NaN${separators1[0]}NaN`
        ? max(dateStrings)
        : formattedDate;
    } catch (error) {
      console.log(" error in getMaxValue", error);
      // const numbers = dateStrings
      //   .map((temp) => temp.replaceAll(",", ""))
      //   .map(Number)
      //   .flat();
      // // Find the minimum value
      // return Math.max(...numbers);
      return "-";
    }
  };

  // get the min value of the given array
  const getMinValue = (dateStrings) => {
    try {
      var separators1 = dateStrings[0].match(/[-/:]/g);
      const dates = dateStrings.map(
        (dateString) =>
          // new Date(dateString) == "Invalid Date" ?
          new Date(
            dateString
              .split(/-|\/|:/)
              .reverse()
              .join("-")
          )
        //: new Date(dateString)
      );
      var date = new Date(Math.min(...dates));
      // Extract day, month, and year
      var day = date.getDate();
      var month = date.getMonth() + 1; // Month is zero-based, so add 1
      var year = date.getFullYear();
      // Format day, month, and year as "dd-mm-yyyy"
      var formattedDate =
        (day < 10 ? "0" : "") +
        day +
        separators1[0] +
        (month < 10 ? "0" : "") +
        month +
        separators1[0] +
        year;
      return formattedDate === `NaN${separators1[0]}NaN${separators1[0]}NaN`
        ? min(dateStrings)
        : formattedDate;
    } catch (error) {
      console.log("error in getMinValue", error);
      // const numbers = dateStrings
      //   .map((temp) => temp.replaceAll(",", ""))
      //   .map(Number)
      //   .flat();
      // return Math.min(...numbers);
      return "-";
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatFixedRate = (fixeddata) => {
    const stringData = fixeddata.toString();
    if (stringData.includes(".")) {
      return Number(fixeddata).toFixed(2); // Format price to two decimal places
    }
    return fixeddata;
  };

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
  const [Index, setIndex] = React.useState({});
  const [histogramdata, sethistogramdata] = React.useState([]);
  const [countplotdata, setcountplotdata] = React.useState([]);
  const handleClose = () => setOpen({ HistogramChart: false });
  const handleOpen = (index, column) => {
    setOpen({ HistogramChart: true });
    setIndex({ i: index });
    sethistogramdata(dataForCharts[index][column]);
    // //PreviewDataSet("histo", data);
  };

  const [open, setOpen] = React.useState({
    HistogramChart: false,
  });

  const [opencount, setOpencount] = React.useState({
    CountPlot: false,
  });

  const handleClose_Count = () => {
    setOpencount({ CountPlot: false });
  };

  const handleOpen_Count = (index, column) => {
    setOpencount({ CountPlot: true });
    setIndex({ i: index });
    setcountplotdata(dataForCharts[index][column]);
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
          <Box sx={style} style={{ minWidth: "85%", minHeight: "0%" }}>
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
          <Box sx={style} style={{ minWidth: "85%", minHeight: "0%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{ float: "right", cursor: "pointer" }}
              >
                <CloseIcon
                  onClick={(e) => {
                    handleClose_Count();
                  }}
                />
              </div>
            </Typography>
            <div
              className="row col-lg-12 boxcenter"
              style={{
                height: "80vh",
                width: "100%",
                alignItems: "center",
              }}
            >
              <CountPlot data={countplotdata} colName={cols[Index.i]} />
            </div>
          </Box>
        </Modal>
      </div>
    );
  };
  //End of Charts

  const handleSort = (column) => {
    if (sortBy === column) {
      // If already sorted by the same column, toggle the direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting a new column, set it as the sort column and default to ascending
      setSortBy(column);
      setSortDirection("asc");
    }
    setTabledata(
      tabledata.slice().sort((a, b) => {
        if (sortBy) {
          let aValue = "";
          let bValue = "";
          if (sortBy == "Missing Count") {
            aValue = a["missingCount"];
            bValue = b["missingCount"];
          } else if (sortBy == "Unique") {
            aValue = a["uniqueCountSorted"];
            bValue = b["uniqueCountSorted"];
          } else if (sortBy == "Standrad Deviation") {
            aValue = a["standardDeviation"];
            bValue = b["standardDeviation"];
          } else if (sortBy == "Count") {
            aValue = a["useCount"];
            bValue = b["useCount"];
          } else {
            aValue = a[sortBy.toLowerCase()];
            bValue = b[sortBy.toLowerCase()];
          }
          if (aValue == "-") aValue = "0";
          if (bValue == "-") bValue = "0";

          if (sortDirection === "asc") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        }
        return 0;
      })
    );
  };

  document.querySelector(".loader").style.display = "none";
  return (
    <>
      <div className="container">
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

        <div className="custom-title">
          <b style={{ color: "#2E89FF" }}>Source: </b>
          {sessionStorage.getItem("uploadfilename")}
        </div>

        <TableContainer component={Paper} className="TableContainer">
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 650, maxHeight: "80vh" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>column</TableCell>
                {methods.map((col) => (
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === col}
                      direction={sortDirection}
                      onClick={() => {
                        handleSort(col);
                      }}
                    >
                      {col}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tabledata.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>No Records Found</TableCell>
                </TableRow>
              )}

              {tabledata
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell style={{ fontWeight: "900" }}>
                      {/* {cols[index]} */}
                      {row.className}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.min || "-"}
                    </TableCell>
                    <TableCell>{row.max || "-"}</TableCell>
                    <TableCell>{row.uniqueCountSorted}</TableCell>
                    <TableCell>{row.mean}</TableCell>
                    <TableCell>{row.median}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                    <TableCell>{row.standardDeviation}</TableCell>
                    <TableCell>{row.useCount}</TableCell>
                    <TableCell>{row.missingCount}</TableCell>
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
                              handleOpen_Count(index, cols[index])
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
                              handleOpen(index, cols[index]);
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
export default Statistics;
