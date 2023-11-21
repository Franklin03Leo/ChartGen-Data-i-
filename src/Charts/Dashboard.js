import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

//filter model
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ApplyFilterIcon from "../Images/Apply-Filter.png";

//Icons
import ZoomOut from "@mui/icons-material/ZoomOutMap";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/InsertChart";
import DatasetIcon from "@mui/icons-material/Dataset";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import FilteredIcon from "../Images/Filtered-Icon.svg";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { FaSortAlphaUp, FaSortAlphaDownAlt } from "react-icons/fa";

//Components
import BarChart from "../Charts/BarChart";
import PieChart from "../Charts/PieChart";
import Scatter from "../Charts/ScatterPlot";
import LineChart from "../Charts/LineChart";
import Compose from "../Charts/CompositeChart";
import SeriesChart from "../Charts/SeriesChart";
import BarLineChart from "../Charts/BarLineChart";
import SunBurstChart from "../Charts/SunBurstChart";
import DashboardFilter from "../Components/DashboardFilter";
import DatasetTable from "../Components/DatasetTable";
//NPM's
import Swal from "sweetalert2";

//tool tip
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import { Fade } from "@material-ui/core";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { useMyContext } from "../MyContext";

const Dashboard = ({ params }) => {
  console.log("Dashboard Rendering.... => ", params);
  const { updateMessage, manageFilter, updateManageFilter } = useMyContext();
  const globalFilterCheck = () => {
    setFilter({ ...filter, filterSwatch: false });
    updateMessage("checkGlobalFilter");
  };

  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });

  //Add a Bootstrap Tooltip style
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

  const [details, SetDetails] = React.useState({
    ProjectName: "Dashboard",
    ProjectDescription: "Group of charts",
  });
  const [index, Setindex] = React.useState({});
  const [projectTemplate, setProjectTemplate] = React.useState({});
  const [filteredtemplate, Setfilteredtemplate] = React.useState({
    Render: true,
  });
  const [chartsID, SetChartsID] = React.useState({});
  const [filter, setFilter] = React.useState({
    showFilter: false,
    Render: false,
  });
  const [Tab, setTab] = React.useState({ Dashboard: true });
  const [filteringProps, setfilteringProps] = React.useState({});
  const [isBublished, setisBublished] = React.useState(false);
  const [layouts, setLayouts] = React.useState([]);
  const [open, setOpen] = React.useState({
    Chart: false,
    Dashboard: false,
    Loader: true,
    DataSet: false, // to open dataset model
    filterMenu: false, // to open Filter Menu Model
  });
  const [chartOpen, setchartOpen] = useState({
    Chart: false,
  });
  const [other, setOther] = useState({});
  const [dashFilterData, setDashFilterData] = useState([]);
  const [filterHeaderData, setFilterHeaderData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [menuName, setMenuName] = useState({}); // manage the filter data display in model
  const [individualFilter, setIndividualFilter] = useState([]);
  const [storeFilterData, setstoreFilterData] = useState([]);
  const [managePreview, setmanagePreview] = useState({});
  //for global refresh operation:
  const [globalRefreshbutton, setGlobalRefreshbutton] = useState(false);
  const [cardsData, setcardsData] = useState([]); // added for manage the card details by franklin
  const [limits, setLimits] = useState([]);
  const [sortOpen, setSortOpen] = useState({});
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    // Check if the 'cards' property exists in the 'params' object - by franklin
    if (params.cards !== undefined) {
      // map the array and create a new array of objects
      let temp = params.cards.map((val, i) => ({ [`card${i}`]: val._id }));
      //store the temp value to the session
      sessionStorage.setItem("Cards", JSON.stringify(temp));
      // Set the 'cardsData' state to the 'params.cards'
      setcardsData(params.cards);
    }

    let count =
      params.Custom === undefined ? 0 : Number(params.Custom.cardLayout);
    if (!params?.isBublished && params?.Build) {
      // Create a new array 'tempCard' filled with 'count' number of elements
      let tempCard = count ? new Array(count).fill(count) : [];
      // Set the 'cardsData' state to the 'tempCard'
      setcardsData(tempCard);
    }

    // set the invidual filter details
    if (
      params.IndividualFilter !== undefined &&
      params.IndividualFilter?.length !== 0
    ) {
      // setstoreFilterData(params.IndividualFilter);
      const orderedArray = params.IndividualFilter.sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];
        return keyA.localeCompare(keyB);
      });

      // to get an individual filter dropdown values
      setIndividualFilter(orderedArray);
      params.IndividualFilter.map((val, i) => {
        val[Object.keys(val)] === null
          ? sessionStorage.removeItem([Object.keys(val)])
          : sessionStorage.setItem([Object.keys(val)], val[Object.keys(val)]);
      });
    }

    if (params.dashboard !== undefined) {
      if (params.isBublished === undefined)
        SetDetails({ ProjectName: params.DashboardName });
      setTab({ Dashboard: true });
    }

    if (params.Projectfilter !== undefined) {
      setProjectTemplate(params.Projectfilter);
    }

    if (params.Filter !== undefined) {
      setFilter(params.Filter);
      setOther({ showFilter: params.Filter.filterSwatch });
    }

    // set the Globel filter is false - when dashboard is build
    if (params.isBublished === false) {
      setFilter({ ...filter, filterSwatch: false });
    }

    // rerender the component when user colaps the panel,
    //(why i have render this, if the filter action is apply in preview, need to reset again)
    if (params.isBublished !== undefined) {
      try {
        setisBublished(params.isBublished);
        if (!params.isBublished) {
          Object.keys(chartsID || {}).map((val) => {
            projectTemplate[val].filteApply = undefined;
          });
        }
      } catch (err) {
        console.log("Dashboard error ", err);
      }
    }

    if (params.StaticLayouts !== undefined) {
      if (params.StaticLayouts) {
        var layout;
        if (params.selectedLayout !== undefined) {
          layout = params.selectedLayout.split("X");
          if (layouts.join(",") != layout.join(",")) setLayouts(layout);
        }
      } else {
        let a = params.Custom.Rows;
        let custom = [];
        layout = Object.keys(params.Custom.Cols).map((e, i) => {
          if (i < parseInt(a)) {
            custom.push(params.Custom.Cols[e]);
          }
        });
        setLayouts(custom);
      }
    }
    if (params.Build !== undefined && params.Build) {
      SetChartsID({});
      setFilter({ showFilter: false });
    }
    //Preview project
    if (params.userID !== undefined) {
      if (params.charts !== undefined) {
        SetChartsID(params.charts);
      }
      if (params.Filter !== undefined) {
        setFilter(params.Filter);
      }

      if (params.layoutOption === "Static") {
        layout = params.layouts.split("X");
        setLayouts(layout);
      } else {
        if (params?.layouts !== undefined) setLayouts(params?.layouts[1] || []);
      }
    }

    if (params.FilterProps !== undefined) {
      setfilteringProps(params.FilterProps);
    }

    if (params.action === "Edit") {
      setFilter({ ...filter, filterSwatch: false });
    }

    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });
  }, [params]);
  useEffect(() => {
    sessionStorage.setItem("IDs", JSON.stringify(chartsID));
  }, [chartsID]);

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

  //Components
  const Chart = ({ state }) => {
    //const chart = React.useMemo(() => {
    // to set an chart height when click the preview model
    if (state?.Uploaded_file !== undefined) {
      if (chartOpen.Chart === true) {
        state.Height_ = window.innerHeight - 250;
      } else {
        state.Height_ = 250;
      }

      return (
        <>
          <div>
            {state.Chart === "Bar Chart" && <BarChart params={state} />}
            {state.Chart === "Pie Chart" && <PieChart params={state} />}
            {state.Chart === "ScatterPlot" && <Scatter params={state} />}
            {state.Chart === "Line Chart" && <LineChart params={state} />}
            {state.Chart === "Composite Chart" && <Compose params={state} />}
            {state.Chart === "Series Chart" && <SeriesChart params={state} />}
            {state.Chart === "Bar Line Chart" && (
              <BarLineChart params={state} />
            )}
            {state.Chart === "Sunburst Chart" && (
              <SunBurstChart params={state} />
            )}
          </div>
        </>
      );
    }
    //   }, [state])
    // return chart
  };

  const handleSort = (i) => {
    setSortOpen((prevSortOpen) => ({
      ...prevSortOpen,
      open: true,
    }));
    setSelectedChart(i);
    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });
  };

  const SortFunction = ({ id }) => {
    if (!projectTemplate || !projectTemplate[`chart${id}`]) {
      return null;
    }
    const xAxis = projectTemplate[`chart${id}`].XAxis;
    const yAxis = projectTemplate[`chart${id}`].YAxis;
    let tempDataSort = [...projectTemplate[`chart${id}`].Uploaded_file];

    const handleSortAscending = () => {
      // Sort tempDataSort in ascending order by xAxis
      projectTemplate[`chart${id}`]["Ascending"] = true;
      projectTemplate[`chart${id}`]["Descending"] = false;
      projectTemplate[`chart${id}`]["SortbyY"] = undefined;
      projectTemplate[`chart${id}`]["AscendingY"] = undefined;
      projectTemplate[`chart${id}`]["DescendingY"] = undefined;
      setProjectTemplate({ ...{}, ...projectTemplate });
      updateTemplateAndRender(tempDataSort, "X");
    };

    const handleSortDescending = () => {
      // Sort tempDataSort in descending order by xAxis
      projectTemplate[`chart${id}`]["Ascending"] = false;
      projectTemplate[`chart${id}`]["Descending"] = true;
      projectTemplate[`chart${id}`]["SortbyY"] = undefined;
      projectTemplate[`chart${id}`]["AscendingY"] = undefined;
      projectTemplate[`chart${id}`]["DescendingY"] = undefined;
      setProjectTemplate({ ...{}, ...projectTemplate });
      updateTemplateAndRender(tempDataSort, "X");
    };

    // Sort tempDataSort in ascending order by yAxis
    const handleSortYAxisAscending = () => {
      projectTemplate[`chart${id}`]["AscendingY"] = true;
      projectTemplate[`chart${id}`]["DescendingY"] = false;
      projectTemplate[`chart${id}`]["Ascending"] = false;
      projectTemplate[`chart${id}`]["Descending"] = false;
      setProjectTemplate({ ...{}, ...projectTemplate });
      updateTemplateAndRender(tempDataSort, "YA");
    };

    // Sort tempDataSort in descending order by yAxis
    const handleSortYAxisDescending = () => {
      projectTemplate[`chart${id}`]["AscendingY"] = false;
      projectTemplate[`chart${id}`]["DescendingY"] = true;
      projectTemplate[`chart${id}`]["Ascending"] = false;
      projectTemplate[`chart${id}`]["Descending"] = false;
      setProjectTemplate({ ...{}, ...projectTemplate });
      updateTemplateAndRender(tempDataSort, "YD");
    };

    const updateTemplateAndRender = (sortedData) => {
      const unique = [...new Set(sortedData.map((item) => item[xAxis]))];

      // Update projectTemplate with the sorted data and unique values
      projectTemplate[`chart${id}`].Uploaded_file = sortedData;
      projectTemplate[`chart${id}`].Sortby = unique;

      // Call setSelectedChart and update filteredtemplate.Render
      setSelectedChart();
      setProjectTemplate({ ...{}, ...projectTemplate });
      Setfilteredtemplate({
        ...filteredtemplate,
        Render: !filteredtemplate.Render,
      });
    };

    return (
      <Modal
        open={selectedChart === id}
        aria-labelledby="sort-modal"
        aria-describedby="sort-options"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <CloseIcon
            style={{
              position: "relative",
              top: "0px",
              left: "300px",
              button: "80px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              setSelectedChart();
              Setfilteredtemplate({
                ...filteredtemplate,
                Render: !filteredtemplate.Render,
              });
            }}
          />
          <List>
            <ListItem button onClick={handleSortAscending}>
              <ListItemText primary={` ${xAxis}: Sort Ascending`} />
              <FaSortAlphaUp style={{ margin: "0 5px", cursor: "pointer" }} />
            </ListItem>
            <ListItem button onClick={handleSortDescending}>
              <ListItemText primary={` ${xAxis}: Sort Descending`} />
              <FaSortAlphaDownAlt
                style={{ margin: "0 5px", cursor: "pointer" }}
              />
            </ListItem>
            <ListItem button onClick={handleSortYAxisAscending}>
              <ListItemText primary={`${yAxis}: Sort Ascending`} />
              <FaSortAlphaUp style={{ margin: "0 5px", cursor: "pointer" }} />
            </ListItem>
            <ListItem button onClick={handleSortYAxisDescending}>
              <ListItemText primary={` ${yAxis}: Sort Descending`} />
              <FaSortAlphaDownAlt
                style={{ margin: "0 5px", cursor: "pointer" }}
              />
            </ListItem>
          </List>
        </Box>
      </Modal>
    );
  };

  const handleLimit = (event, i) => {
    const newLimit = event.target.value;
    const updatedLimits = [...limits];
    updatedLimits[i] = newLimit;
    setLimits(updatedLimits);
    // projectTemplate[`chart${i}`].Uploaded_file.slice(0, newLimit);
    projectTemplate[`chart${i}`]["limit"] = newLimit;
    setProjectTemplate({ ...{}, ...projectTemplate });
    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });
  };

  // to open a Dataset
  const handleDataSet = (index) => {
    setOpen({ DataSet: true });
    Setindex({ i: index });
  };

  // To open the filter Model and funcnalities of filter model
  const filterModelOpen = (index, pageName, preview) => {
    setMenuName(pageName);
    setOpen({ filterMenu: true });
    Setindex({ i: index });
    preview
      ? setmanagePreview({ preview: true })
      : setmanagePreview({ preview: false });
    let tempfilterArray = [];
    // check wheather the dashboard is bublished
    if (pageName === "Dashboard Menu" || isBublished) {
      let temp = projectTemplate["chart" + index]["Uploaded_file"];
      // to get the table header values for select a filter fields
      setFilterHeaderData(Object.keys(temp[0]));
      if (
        sessionStorage.getItem("chart" + index) !== undefined &&
        sessionStorage.getItem("chart" + index) !== null
      ) {
        setDashFilterData(sessionStorage.getItem("chart" + index).split(","));
        tempfilterArray = sessionStorage.getItem("chart" + index).split(",");
      }
    } else {
      individualFilter.map((value, i) => {
        if (i === index && value["chart" + index] !== null) {
          tempfilterArray = value["chart" + index].split(",");
          setDashFilterData(tempfilterArray);
        }
      });
    }
    // do the Mapping for get an individual filter fields
    let data = tempfilterArray.map((propertyName) => {
      return projectTemplate["chart" + index]["Uploaded_file"].map((item) => ({
        [propertyName]: item[propertyName],
      }));
    });

    const groupedData = {};
    data.forEach((sublist) => {
      sublist.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        if (!groupedData[key]) {
          // Set to store unique values
          groupedData[key] = new Set();
        }
        groupedData[key].add(value);
      });
    });

    // Convert Sets to arrays in the newGroupedData object
    const newGroupedData = {};
    for (const key in groupedData) {
      newGroupedData[key] = Array.from(groupedData[key]);
    }

    setIndividualFilter({
      ...individualFilter,
      [`chart${index}`]: newGroupedData,
    });
  };

  // close the filter model
  const handleFilterClose = () => {
    setOpen({ filterMenu: false });
    setDashFilterData([]);
    managePreview?.preview && setchartOpen({ Chart: true });
    document.querySelector(".loader").style.display = "none";
  };

  // get the selected dropdown fields in a array
  const handleChange = (event, index) => {
    const {
      target: { value },
    } = event;
    value !== "" &&
      setDashFilterData(typeof value === "string" ? value.split(",") : value);
  };

  // handle the filter submit and reset action in preview model
  const ApplyFilterDropdown = (action) => {
    if (dashFilterData.length === 0) {
      handleFilterClose();
      return;
    } else {
      if (action !== "reset") {
        console.log("Data!!!", dashFilterData);
        setstoreFilterData({
          ...storeFilterData,
          [`chart${index["i"]}`]: dashFilterData,
        });
        sessionStorage.setItem("chart" + index["i"], dashFilterData);
        handleFilterClose();
      } else {
        setDashFilterData([]);
        sessionStorage.removeItem("chart" + index["i"], dashFilterData);
      }
    }
  };

  const handleFilteredData = (event, selectedName, i) => {
    const selectedValues = event.target.value;
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[`chart${index["i"]}`] = {
        ...newFilters[`chart${index["i"]}`],
        [selectedName]: selectedValues,
      };
      return newFilters;
    });
    setchartOpen({ Chart: false });
  };

  const ApplyFilter = () => {
    let temp = {};
    temp = projectTemplate["chart" + index["i"]];
    // projectTemplate['chart' + index["i"]].filter = selectedFilters;
    let filteredData = [];
    filteredData = projectTemplate["chart" + index["i"]]["Uploaded_file"];

    for (const filterKey in selectedFilters["chart" + index["i"]]) {
      if (selectedFilters["chart" + index["i"]].hasOwnProperty(filterKey)) {
        const filterValues = selectedFilters["chart" + index["i"]][filterKey];

        filteredData = filteredData.filter((item) =>
          filterValues.includes(item[filterKey])
        );
      }
    }
    temp.data = filteredData;
    if (projectTemplate["chart" + index["i"]]) {
      projectTemplate["chart" + index["i"]].filteApply = "FilterApply";
    }

    handleFilter(temp);
    handleFilterClose();
    managePreview?.preview && setchartOpen({ Chart: true });
  };

  // reset the chart and refresh action
  const ResetFilter = (i) => {
    if (i === undefined) {
      setchartOpen({ Chart: false });
      i = index["i"];
    }
    if (projectTemplate["chart" + i] !== undefined) {
      projectTemplate["chart" + i]["Uploaded_fileTemp"] =
        projectTemplate["chart" + i]["Uploaded_file"];
      projectTemplate["chart" + i]["Height_"] = null;
      projectTemplate["chart" + i].filteApply = undefined;
    }

    setSelectedFilters({ ...selectedFilters, ["chart" + i]: null });
    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });

    return "Executed";
  };
  // Filter preview Model
  const FilterModel = () => {
    return (
      <>
        <Modal
          open={open.filterMenu}
          onClose={(e) => {
            setOpen({ filterMenu: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box
            sx={style}
            style={{
              minHeight: "90%",
              height: "110px",
              overflow: "scroll",
              paddingTop: "0px",
              paddingRight: "0px",
            }}
          >
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div className="row col-lg-12" style={{ marginBottom: "10px" }}>
                <div className="col-lg-11">
                  <h5 style={{ marginTop: "15px" }}>Filter</h5>
                </div>
                <div
                  className="col-lg-1"
                  style={{
                    float: "right",
                    cursor: "pointer",
                  }}
                >
                  <CloseIcon
                    style={{ marginRight: "10px", marginTop: "10px" }}
                    onClick={(e) => {
                      handleFilterClose();
                    }}
                  />
                </div>
              </div>
            </Typography>
            {menuName === "Dashboard Menu" &&
              !isBublished && ( // || params.action === "Edit"
                <div>
                  <div style={{ width: "80%" }}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Select Filter Data
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={dashFilterData}
                        onChange={(event, index) => handleChange(event, index)}
                        input={<OutlinedInput label="Select Filter Data" />}
                        renderValue={(selected) => selected.join(", ")}
                        style={{
                          maxHeight: 48 * 4.5 + 0,
                          width: 250,
                        }}
                      >
                        {filterHeaderData.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={dashFilterData.indexOf(name) > -1}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      width: "80%",
                    }}
                  >
                    <div style={{ margin: "8px" }}>
                      <Button
                        id="saveTemp"
                        variant="contained"
                        className="input-field button"
                        style={{ backgroundColor: "#6282b3" }}
                        onClick={() => ApplyFilterDropdown("submit")}
                      >
                        Submit
                      </Button>
                    </div>
                    <div style={{ margin: "8px" }}>
                      <Button
                        id="saveTemp"
                        variant="contained"
                        className="input-field button"
                        style={{ backgroundColor: "#6282b3" }}
                        onClick={() => ApplyFilterDropdown("reset")}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            {(menuName === "Project Menu" || isBublished) &&
              Object.keys(individualFilter[`chart${index["i"]}`])?.map(
                (selectedName) => (
                  <div key={selectedName}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel
                        id={`demo-multiple-checkbox-label-${selectedName}`}
                      >
                        {selectedName}
                      </InputLabel>
                      <Select
                        labelId={`demo-multiple-checkbox-label-${selectedName}`}
                        id={`demo-multiple-checkbox-${selectedName}`}
                        multiple
                        value={
                          selectedFilters[`chart${index["i"]}`]?.[
                            selectedName
                          ] || []
                        }
                        onChange={(event) =>
                          handleFilteredData(event, selectedName)
                        }
                        input={<OutlinedInput label={selectedName} />}
                        renderValue={(selected) => selected.join(", ")}
                        style={{
                          maxHeight: 48 * 4.5 + 0,
                          width: 250,
                        }}
                      >
                        {individualFilter?.[`chart${index["i"]}`]?.[
                          selectedName
                        ]?.map((item) => (
                          <MenuItem key={item} value={item}>
                            <Checkbox
                              checked={
                                selectedFilters?.[`chart${index["i"]}`]?.[
                                  selectedName
                                ]?.includes(item) || false
                              }
                            />
                            <ListItemText primary={item} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )
              )}

            {(menuName === "Project Menu" || isBublished) &&
            Object.keys(individualFilter)?.length !== 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  marginTop: "10px",
                  width: "90%",
                }}
              >
                <Button
                  id="saveTemp"
                  variant="contained"
                  className="input-field button"
                  style={{ backgroundColor: "#6282b3", float: "right" }}
                  onClick={() => {
                    ApplyFilter();
                    handleGlobalRefreshButton();
                  }}
                >
                  Apply Filter
                </Button>

                <Button
                  id="saveTemp"
                  variant="contained"
                  className="input-field button"
                  style={{ backgroundColor: "#6282b3", marginRight: "60px" }}
                  onClick={() => ResetFilter()}
                >
                  Reset
                </Button>
              </div>
            ) : (
              ""
            )}
          </Box>
        </Modal>
      </>
    );
  };

  // added the card section in dashboard
  const Cards = () => {
    return (
      <>
        {cardsData?.map((card, index) => (
          <div
            key={index}
            className={"dashboard-layouts"}
            id={"card" + index}
            onDrop={(event) => {
              drop(event, "card", index);
            }}
            onDragOver={(event) => {
              allowDrop(event, "card");
            }}
            style={{
              width: "25%",
            }}
          >
            <div className="carddashboard">
              <div
                style={{
                  color: "#9d9d9b",
                  position: "relative",
                  height: "100px",
                  border: card?.CardTitle ? "none" : "2px dashed #b0b4bf",
                }}
              >
                {card?.CardTitle ? (
                  <div
                  // onMouseEnter={() => {
                  //   // Show the delete icon on hover
                  //   const deleteIcon = document.querySelector(
                  //     ".card-DeleteIcon" + index
                  //   );
                  //   deleteIcon.style.visibility = "visible";
                  // }}
                  // onMouseLeave={() => {
                  //   // Hide the delete icon when the mouse leaves
                  //   const deleteIcon = document.querySelector(
                  //     ".card-DeleteIcon" + index
                  //   );
                  //   deleteIcon.style.visibility = "hidden";
                  // }}
                  >
                    {/* <DeleteIcon
                      style={{
                        float: "right",
                        cursor: "pointer",
                        paddingTop: "6px",
                        visibility: "hidden",
                      }}
                      className={"card-DeleteIcon" + index}
                    /> */}
                    <div
                      className="div-card"
                      style={{
                        height: "100px",
                        padding: "10px",
                        borderRadius: "8px",
                        opacity: "1",
                        // display: "flex",
                        // flexDirection: "column",
                        // alignItems: "flex-start",
                        backgroundColor: card.cardBGColor,
                        boxShadow: `0px 6px 20px ${card.cardBGColor}`,
                        border: `${card.cardThickness || 0}px solid ${
                          card.borderTickColor || ""
                        }`,
                      }}
                    >
                      <div
                        style={{
                          // display: "flex",
                          padding: card["CardFontSize"] === 12 ? "8%" : "1%",
                          wordWrap: "break-word",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: card["CardFont"],
                            fontSize: card["CardFontSize"] + "px",
                            color: card["cardColor"],
                            lineHeight: 1,
                          }}
                        >
                          {card?.CardTitle || ""}
                        </span>
                      </div>
                      <div
                        style={{
                          padding:
                            card.CardTitle.length >= 10
                              ? " -1px 30px 30px 30px"
                              : "30px",
                          wordWrap: "break-word",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: card["CardValueFont"],
                            fontSize: card["CardValueSize"] + "px",
                            color: card["CardValueColor"],
                            lineHeight: 1,
                          }}
                        >
                          {card?.CardValue || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="col-lg-12"
                      style={{
                        marginTop: "15%",
                      }}
                    >
                      Drag the Card
                    </div>
                    <div className="col-lg-12">and</div>
                    <div className="col-lg-12">Drop here</div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </>

      // <>
      //   {(() => {
      //     let count = params.Custom === undefined ? 0 : params.Custom.CardRows;
      //     let Item = [];
      //     for (let i = 0; i < count; i++) {
      //       Item.push(
      //         <div className="div-card">
      //           <h6>{params.Custom.Card["Card" + parseInt(i + 1)]}</h6>
      //           <h2>
      //             {params.Custom.Card["Card" + parseInt(i + 1) + "-Count"]}
      //           </h2>
      //         </div>
      //       );
      //     }
      //     return Item;
      //   })()}
      // </>
    );
  };

  const PreviewDataSet = () => {
    document.querySelector(".loader").style.display = "block";
    let fileName = projectTemplate["chart" + index["i"]]["fileName"];
    let tempDataSet = {};
    if (
      projectTemplate["chart" + index["i"]]?.["filteApply"] === "FilterApply"
    ) {
      tempDataSet = projectTemplate["chart" + index["i"]]["Uploaded_fileTemp"];
    } else {
      tempDataSet = projectTemplate["chart" + index["i"]]["Uploaded_file"];
    }
    // }

    return projectTemplate["chart" + index["i"]]["Uploaded_file"] !==
      undefined ? (
      <DatasetTable params={tempDataSet} filter={false} fileName={fileName} />
    ) : (
      "franklin"
    );
  };

  //preview model for charts
  const PreviewModal = () => {
    return (
      <div>
        <Modal
          open={chartOpen.Chart}
          onClose={(e) => {
            setchartOpen({ Chart: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box
            sx={style}
            style={{
              minWidth: "98%",
              minHeight: "90%",
              paddingTop: "0px",
              paddingRight: "0",
            }}
          >
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="row "
                style={{
                  margin: "20px",
                  margin: "20px",
                  width: "100%",
                  display: "flex",
                  justifyContent:
                    projectTemplate["chart" + index.i]["Chart"] === "Bar Chart"
                      ? ""
                      : "space-between",
                }}
              >
                <div className="" style={{ width: "85%" }}>
                  Preview
                </div>
                <div
                  className="col-lg-1"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    right:
                      projectTemplate["chart" + index.i]["Chart"] ===
                      "Bar Chart"
                        ? "10px"
                        : "20px",
                    bottom: "10px",
                    textAlign: "center",
                    display: "flex",
                    marginRight:
                      projectTemplate["chart" + index.i]?.["filteApply"] ===
                      undefined
                        ? "0px"
                        : "35px",
                  }}
                >
                  {((params.action !== "Edit" && params?.action != undefined) ||
                    isBublished) && (
                    <>
                      {!manageFilter &&
                        projectTemplate["chart" + index.i]?.["filteApply"] !==
                          undefined && (
                          <BootstrapTooltip
                            title="Reset"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="bottom"
                          >
                            <RefreshIcon
                              style={{
                                float: "right",
                                cursor: "pointer",
                                marginRight: "15%",
                              }}
                              onClick={(e) => {
                                ResetFilter(index.i);
                                handleGlobalRefreshButton();
                              }}
                            />
                          </BootstrapTooltip>
                        )}

                      {!manageFilter &&
                        ((isBublished &&
                          Object.values(
                            storeFilterData["chart" + index.i] || {}
                          ).length !== 0) ||
                          individualFilter[index.i]?.["chart" + index.i]) && (
                          <BootstrapTooltip
                            title="Filter"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="bottom"
                          >
                            {projectTemplate["chart" + index.i]?.[
                              "filteApply"
                            ] !== undefined ? (
                              <img
                                src={ApplyFilterIcon}
                                name="Filter"
                                color="black"
                                alt="Logo"
                                height="20px"
                                style={{
                                  float: "right",
                                  cursor: "pointer",
                                  // padding: " 4px 5px 0 0",
                                  marginRight: "10%",
                                }}
                                onClick={(e) => {
                                  filterModelOpen(
                                    index.i,
                                    "Project Menu",
                                    true
                                  );
                                }}
                              ></img>
                            ) : (
                              <FilterAltOutlinedIcon
                                style={{
                                  float: "right",
                                  cursor: "pointer",
                                  marginRight: "15%",
                                }}
                                onClick={(e) => {
                                  filterModelOpen(
                                    index.i,
                                    "Project Menu",
                                    true
                                  );
                                }}
                              />
                            )}
                          </BootstrapTooltip>
                        )}

                      <BootstrapTooltip
                        title="Dataset"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                      >
                        <DatasetIcon
                          style={{
                            float: "right",
                            cursor: "pointer",
                            // paddingTop: "6px",
                            marginRight: "10px",
                          }}
                          onClick={(e) => {
                            handleDataSet(index.i);
                          }}
                        />
                      </BootstrapTooltip>
                    </>
                  )}

                  {projectTemplate["chart" + index.i].Chart === "Bar Chart" && (
                    <>
                      <BootstrapTooltip
                        title="Sort by"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                      >
                        <SwapVertIcon
                          style={{
                            float: "right",
                            cursor: "pointer",
                            border: "none",
                            outline: "none",
                            marginTop: "3px",
                          }}
                          onClick={(e) => {
                            handleSort(index.i);
                          }}
                        />
                      </BootstrapTooltip>
                      {sortOpen.open && <SortFunction id={index.i} />}

                      <BootstrapTooltip
                        title="Limit"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="bottom"
                      >
                        <select
                          style={{
                            float: "right",
                            cursor: "pointer",
                            border: "none",
                            outline: "none",
                            marginTop: "3px",
                          }}
                          value={limits[index.i]}
                          onChange={(e) => {
                            handleLimit(e, index.i);
                          }}
                        >
                          <option value={"select"}>All</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </BootstrapTooltip>
                    </>
                  )}

                  <BootstrapTooltip
                    title="Close"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="bottom"
                  >
                    <CloseIcon
                      onClick={(e) => {
                        setchartOpen({ Chart: false });
                        // to rerender chart for come back again same size
                        Setfilteredtemplate({
                          ...filteredtemplate,
                          Render: !filteredtemplate.Render,
                        });
                      }}
                    />
                  </BootstrapTooltip>
                </div>
              </div>
            </Typography>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div className="row col-lg-12" style={{ minHeight: "100%" }}>
                {chartsID["chart" + index.i] !== undefined ? (
                  <Chart
                    state={projectTemplate["chart" + index.i]}
                    style={{ minHeight: "100%" }}
                  />
                ) : (
                  ""
                )}
              </div>
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  };

  const PreviewDataSetModal = () => {
    return (
      <div>
        <Modal
          open={open.DataSet}
          onClose={(e) => {
            setchartOpen({ chart: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box
            sx={style}
            style={{
              minWidth: "98%",
              minHeight: "90%",
              paddingTop: "0px",
              paddingRight: "0px",
            }}
          >
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{
                  float: "right",
                  cursor: "pointer",
                  marginBottom: "20px",
                  width: "50px",
                  textAlign: "center",
                }}
              >
                <CloseIcon
                  style={{
                    position: "relative",
                    top: "10px",
                    right: "0px",
                    left: "8px",
                  }}
                  onClick={(e) => {
                    handleClose();
                  }}
                />
              </div>
            </Typography>
            <div
              className="row col-lg-12"
              style={{
                position: "relative",
                bottom: "30px",
                left: "-20px",
              }}
            >
              {PreviewDataSet()}
            </div>
          </Box>
        </Modal>
      </div>
    );
  };

  const handleGlobelReset = () => {
    Object.keys(chartsID || {}).map((val) => {
      projectTemplate[val].filteApply = undefined;
    });
    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });
  };

  const CheckDatasets = () => {
    const chartDataSetsUploadFileId = Object.keys(projectTemplate).map(
      (val, i) => projectTemplate[val].Uploaded_fileID
    );
    const dataSetResult = chartDataSetsUploadFileId.every((element) => {
      if (element === chartDataSetsUploadFileId[0]) {
        return true;
      }
    });
    return dataSetResult;
  };

  const handleGlobalRefreshButton = () => {
    const projectChartfilterArray = Object.keys(projectTemplate).some(
      (val) => projectTemplate[val]?.filteApply !== undefined
    );
    setGlobalRefreshbutton(projectChartfilterArray);
    setFilter({ ...filter, Render: !filter["Render"] });
  };

  // Layout tabs
  const Tabs = () => {
    return (
      <>
        <div className="Dashboardtab">
          {params.isBublished ||
          //!other.Build ||
          (params.action === "Preview" && !params.Build) ? (
            <>
              {CheckDatasets() && (
                <div
                  className=" Dash-icon"
                  id="data"
                  onClick={(e) => {
                    handleTabChange("Data");
                  }}
                  style={{
                    background: `${!Tab.Dashboard ? "#6282b3" : "#e2e2e2"}`,
                  }}
                >
                  <BootstrapTooltip
                    title="Dataset"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="bottom"
                  >
                    <DatasetIcon Drag the template="large" />
                  </BootstrapTooltip>
                </div>
              )}
              <div
                className=" Dash-icon"
                id="dashboard"
                onClick={(e) => {
                  handleTabChange("Dashboard");
                }}
                style={{
                  background: `${Tab.Dashboard ? "#6282b3" : "#e2e2e2"}`,
                }}
              >
                <BootstrapTooltip
                  title="Charts"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="bottom"
                >
                  <DashboardIcon fontSize="large" />
                </BootstrapTooltip>
              </div>

              {globalRefreshbutton && (
                <BootstrapTooltip
                  title="Global Reset"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="bottom"
                >
                  <div
                    className=" Dash-icon"
                    id="dashboard"
                    onClick={(e) => {
                      handleGlobelReset();
                      handleGlobalRefreshButton();
                    }}
                    style={{
                      background: "#e2e2e2",
                    }}
                  >
                    <RefreshIcon fontSize="large" />
                  </div>
                </BootstrapTooltip>
              )}

              {filteringProps?.length !== 0 &&
              (params?.filterSwatch ||
                (params?.Filter?.filterSwatch &&
                  (params?.filterSwatch !== undefined ||
                    params.action === "Preview") &&
                  typeof filter.filterSwatch !== "object") ||
                (other.showFilter &&
                  params.action !== "Edit" &&
                  !filter.filterSwatch)) ? (
                <div style={{ marginTop: "15px" }}>
                  <label style={{ margin: "0px 5px" }}>Filter</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="Filterswatch"
                      value={filter.filterSwatch}
                      checked={
                        !filter.filterSwatch ||
                        filter.filterSwatch === undefined
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        setFilter({
                          ...filter,
                          filterSwatch: e.target.checked,
                        });
                        Setfilteredtemplate({
                          ...filteredtemplate,
                          Render: !filteredtemplate.Render,
                        });
                      }}
                    ></input>
                    <span className="slider round"></span>
                  </label>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
          <div
            className={
              params.action !== "Preview" && !isBublished && other.Build
                ? "col-lg-10 mt-2"
                : "col-lg-11 mt-2"
            }
          >
            {" "}
            {/* <h3 className="Dashboard-title">
              {details.ProjectName === undefined
                ? "Dashboard"
                : details.ProjectName}
            </h3> DashboardName */}
            <h3 className="Dashboard-title">
              {params.DashboardName === undefined
                ? "Dashboard"
                : params.DashboardName}
            </h3>
          </div>
        </div>
      </>
    );
  };

  //Functions
  const drop = async (event, collection, index) => {
    // check wheather collection is card or not
    if (collection === "card") {
      try {
        if (event.dataTransfer.types[0] === "card") {
          // geting the card id
          let tempId = event.dataTransfer.getData("card");
          let obj = {
            id: tempId,
            flag: "specfig",
            collection: "Cards",
          };
          // get the card details based on the id from carf collection by franklin
          let result = await axios.post(
            `http://${path.Location}:${path.Port}/GetCards`,
            obj
          );
          if (result) {
            let cardsID = {};
            // map the cardsData and update the specfic index based on id
            let temp = cardsData.map((val, i) => {
              cardsID[`card${i}`] = i === index ? result.data[0]._id : val._id;
              return i === index ? result.data[0] : val;
            });
            // set the card id details for saving by franklin
            sessionStorage.setItem("Cards", JSON.stringify(cardsID));
            setcardsData(temp);
          }
        }
      } catch (err) {
        console.log("Error while dragging card", err);
      }
    } else {
      // check wheather droped value is from templates section
      if (event.dataTransfer.types[1] === "id") {
        let temp = event.currentTarget.id;
        try {
          SetChartsID({
            ...chartsID,
            [event.currentTarget.id]: event.dataTransfer.getData("text"),
          });

          // get the Template data when drop in chart
          axios
            .post(`http://${path.Location}:${path.Port}/GetTemplate`, {
              userID: sessionStorage.UserName.split(",")[1],
              //TempName: [event.dataTransfer.getData("text")],
              id: Number(event.dataTransfer.getData("id")),
              Flag: { action: "singleTemplate" },
            })
            .then((response) => {
              response.data[0].Width_ = null;
              response.data[0].Heigth_ = 250;
              projectTemplate[temp] = response.data[0];

              Setfilteredtemplate({
                ...filteredtemplate,
                Render: !filteredtemplate.Render,
              });

              globalFilterCheck();
            });
        } catch (error) {
          console.log("Error while dragging on template");
        }
      }
    }
  };

  const allowDrop = (event, collection) => {
    if (collection === "card") {
      console.log("value droped..");
    } else {
      sessionStorage.removeItem(event.currentTarget.id);
    }
    event.preventDefault();
  };

  const handleOpen = (index) => {
    setchartOpen({ Chart: true });
    setmanagePreview({ preview: true });
    Setindex({ i: index });
  };

  const handleClose = () => {
    // setchartOpen({ Chart: false });
    setOpen({ DataSet: false });
  };

  const handleFilter = async (Obj) => {
    document.querySelector(".loader").style.display = "block";
    if (
      Obj.isFiltered === "Apply Filter" ||
      Obj.isFiltered === "Cancel Filter"
    ) {
      for (
        let i = 0;
        i < Object.keys(JSON.parse(sessionStorage.IDs)).length;
        i++
      ) {
        projectTemplate["chart" + i]["Uploaded_fileTemp"] = Obj.data;
        projectTemplate["chart" + i]["filteApply"] = "FilterApply";
      }
    } else {
      if (projectTemplate["chart" + index["i"]]) {
        projectTemplate["chart" + index["i"]]["Uploaded_fileTemp"] = Obj.data;
      }
    }

    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });

    return "Executed";
  };

  const RemoveChart = (e) => {
    Swal.fire({
      title: `Are you sure want to delete Template? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        SetChartsID({ ...chartsID, ["chart" + e]: undefined });
      }
    });
  };

  const handleTabChange = (action) => {
    debugger;
    // document.querySelector('.loader').style.display = 'block'
    if (action === "Dashboard") {
      setTab({ ...Tab, Dashboard: true, Dataset: false });
    } else if (action === "Data") {
      setTab({
        ...Tab,
        Dashboard: false,
        Dataset: true,
        data: projectTemplate["chart0"]["Uploaded_fileTemp"],
      });
    }
    setFilter({ ...filter, Render: !filter["Render"] });
  };

  //chart drop layout
  const CreatingUploadArea = () => {
    try {
      console.log("charts re-rendered");
      return (
        <>
          {(() => {
            let Item = [];
            for (let i = 0; i < parseInt(layouts[0]); i++) {
              Item.push(
                <div
                  className={
                    parseInt(layouts[0]) === 1
                      ? "col-lg-12 dashboard-layouts"
                      : parseInt(layouts[0]) === 2
                      ? "col-lg-6 dashboard-layouts"
                      : "col-lg-4 dashboard-layouts"
                  }
                  id={"chart" + i}
                  onDrop={(event) => {
                    drop(event);
                  }}
                  onDragOver={(event) => {
                    allowDrop(event);
                  }}
                >
                  {chartsID["chart" + i] !== undefined ? (
                    <div style={{ marginTop: "10px" }}>
                      {projectTemplate["chart" + i] !== undefined ? (
                        <>
                          {/*                        
                        <FormControl size="small">
                                  <Select 
                                  value={limit}  
                                  onChange = {handleLimit} 
                                  displayEmpty
                                   >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                  </Select>
                          </FormControl> */}
                          {/* <BootstrapTooltip  
                            title="DropDown"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="bottom"
                            >
                            <ArrowDropDownIcon style={{
                                float: "right",
                                cursor: "pointer",
                                paddingTop: "6px",
                              }}
                              onClick={(e) => {
                                handleOpen(i);
                              }}/>
                          </BootstrapTooltip> */}

                          <BootstrapTooltip
                            title="Zoom In"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="bottom"
                          >
                            <ZoomOut
                              style={{
                                float: "right",
                                cursor: "pointer",
                                paddingTop: "6px",
                              }}
                              onClick={(e) => {
                                handleOpen(i);
                              }}
                            />
                          </BootstrapTooltip>
                          {projectTemplate[`chart${i}`].Chart ===
                            "Bar Chart" && (
                            <>
                              <BootstrapTooltip
                                title="Limit"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <select
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  value={limits[i]}
                                  onChange={(e) => {
                                    handleLimit(e, i);
                                  }}
                                >
                                  <option value={"select"}>All</option>
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                </select>
                              </BootstrapTooltip>

                              <BootstrapTooltip
                                title="Sort by"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <SwapVertIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  onClick={(e) => {
                                    handleSort(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {sortOpen.open && <SortFunction id={i} />}
                            </>
                          )}
                          {(!isBublished && params.userID === undefined) ||
                          (params.action !== undefined &&
                            params.action === "Edit") ||
                          (params.action !== undefined &&
                            params.action === "Update") ? (
                            <>
                              {/* publish details cards */}
                              {!isBublished && (
                                <BootstrapTooltip
                                  title="Delete"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <DeleteIcon
                                    style={{
                                      float: "right",
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                    onClick={(e) => {
                                      RemoveChart(i);
                                    }}
                                  />
                                </BootstrapTooltip>
                              )}

                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>

                              {/* dashboard cards */}
                              {!manageFilter && !isBublished && (
                                <BootstrapTooltip
                                  title="Filter"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <FilterAltOutlinedIcon
                                    style={{
                                      float: "right",
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                    onClick={(e) => {
                                      filterModelOpen(i, "Dashboard Menu");
                                    }}
                                  />
                                </BootstrapTooltip>
                              )}

                              {/* <BootstrapTooltip
                                title="Refresh"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <RefreshIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    ResetFilter();
                                  }}
                                />
                              </BootstrapTooltip> */}
                            </>
                          ) : (
                            // publish dashboard and project menu cards start here by franklin
                            <div>
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>

                              {!manageFilter &&
                                ((isBublished &&
                                  Object.values(
                                    storeFilterData[`chart${i}`] || {}
                                  ).length !== 0) ||
                                  individualFilter[i]?.[`chart${i}`] ||
                                  (params?.action === "Preview" &&
                                    individualFilter[i]?.[`chart${i}`])) && (
                                  <>
                                    <BootstrapTooltip
                                      title="Filter"
                                      TransitionComponent={Fade}
                                      TransitionProps={{ timeout: 600 }}
                                      placement="bottom"
                                    >
                                      {projectTemplate["chart" + i]?.[
                                        "filteApply"
                                      ] !== undefined ? (
                                        <img
                                          // src={FilteredIcon}
                                          src={ApplyFilterIcon}
                                          name="Filter"
                                          color="black"
                                          alt="Logo"
                                          height="23px"
                                          style={{
                                            width: "23px",
                                            float: "right",
                                            cursor: "pointer",
                                            padding: "3px 0px 0px 0px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        ></img>
                                      ) : (
                                        <FilterAltOutlinedIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        />
                                      )}
                                    </BootstrapTooltip>

                                    {projectTemplate["chart" + i]?.[
                                      "filteApply"
                                    ] !== undefined && (
                                      <BootstrapTooltip
                                        title="Reset"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <RefreshIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            ResetFilter(i);
                                            handleGlobalRefreshButton();
                                          }}
                                        />
                                      </BootstrapTooltip>
                                    )}
                                  </>
                                )}
                            </div>
                            // publish dashboard and project menu cards End here by franklin
                          )}

                          <Chart state={projectTemplate["chart" + i]} />
                        </>
                      ) : (
                        <div className="divdashboard">
                          <div
                            style={{
                              color: "red",
                              position: "relative",
                              top: "40%",
                            }}
                          >
                            {/* <div className="col-lg-12">
                              You might have deleted
                            </div>
                            <div className="col-lg-12">the</div>
                            <div className="col-lg-12">Template</div> */}
                            <Box className="col-lg-12">
                              <CircularProgress />
                            </Box>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    //
                    <div className="divdashboard">
                      <div
                        style={{
                          color: "#9d9d9b",
                          position: "relative",
                          top: "40%",
                        }}
                      >
                        <div className="col-lg-12">Drag the template</div>
                        <div className="col-lg-12">and</div>
                        <div className="col-lg-12">Drop here</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            for (
              let i = parseInt(layouts[0]);
              i < parseInt(layouts[0]) + parseInt(layouts[1]);
              i++
            ) {
              Item.push(
                <div
                  className={
                    parseInt(layouts[1]) === 1
                      ? "col-lg-12 dashboard-layouts"
                      : parseInt(layouts[1]) === 2
                      ? "col-lg-6 dashboard-layouts"
                      : "col-lg-4 dashboard-layouts"
                  }
                  id={"chart" + i}
                  onDrop={drop}
                  onDragOver={allowDrop}
                >
                  {chartsID["chart" + i] !== undefined ? (
                    <div style={{ marginTop: "10px" }}>
                      {projectTemplate["chart" + i] !== undefined ? (
                        <>
                          <BootstrapTooltip
                            title="Zoom In"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="bottom"
                          >
                            <ZoomOut
                              style={{
                                float: "right",
                                cursor: "pointer",
                                paddingTop: "6px",
                              }}
                              onClick={(e) => {
                                handleOpen(i);
                              }}
                            />
                          </BootstrapTooltip>

                          {projectTemplate[`chart${i}`].Chart ===
                            "Bar Chart" && (
                            <>
                              <BootstrapTooltip
                                title="Limit"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <select
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  value={limits[i]}
                                  onChange={(e) => {
                                    handleLimit(e, i);
                                  }}
                                >
                                  <option value={"select"}>All</option>
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                </select>
                              </BootstrapTooltip>

                              <BootstrapTooltip
                                title="Sort by"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <SwapVertIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  onClick={(e) => {
                                    handleSort(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {sortOpen.open && <SortFunction id={i} />}
                            </>
                          )}

                          {(!isBublished && params.userID === undefined) ||
                          (params.action !== undefined &&
                            params.action === "Edit") ||
                          (params.action !== undefined &&
                            params.action === "Update") ? (
                            <>
                              {!isBublished && (
                                <BootstrapTooltip
                                  title="Delete"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <DeleteIcon
                                    style={{
                                      float: "right",
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                    onClick={(e) => {
                                      RemoveChart(i);
                                    }}
                                  />
                                </BootstrapTooltip>
                              )}
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {!manageFilter && (
                                <BootstrapTooltip
                                  title="Filter"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <FilterAltOutlinedIcon
                                    style={{
                                      float: "right",
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                    onClick={(e) => {
                                      filterModelOpen(i, "Dashboard Menu");
                                    }}
                                  />
                                </BootstrapTooltip>
                              )}
                              {/* <BootstrapTooltip
                                title="Refresh"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <RefreshIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    ResetFilter();
                                  }}
                                />
                              </BootstrapTooltip> */}
                            </>
                          ) : (
                            // project menu
                            <div>
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>

                              {!manageFilter &&
                                ((isBublished &&
                                  Object.values(
                                    storeFilterData[`chart${i}`] || {}
                                  ).length !== 0) ||
                                  individualFilter[i]?.[`chart${i}`] ||
                                  (params?.action === "Preview" &&
                                    individualFilter[i]?.[`chart${i}`])) && (
                                  <>
                                    <BootstrapTooltip
                                      title="Filter"
                                      TransitionComponent={Fade}
                                      TransitionProps={{ timeout: 600 }}
                                      placement="bottom"
                                    >
                                      {projectTemplate["chart" + i]?.[
                                        "filteApply"
                                      ] !== undefined ? (
                                        <img
                                          // src={FilteredIcon}
                                          src={ApplyFilterIcon}
                                          name="Filter"
                                          color="black"
                                          alt="Logo"
                                          height="23px"
                                          style={{
                                            width: "23px",
                                            float: "right",
                                            cursor: "pointer",
                                            padding: "3px 0px 0px 0px",
                                          }}
                                          onClick={(e) => {
                                            // filterModelOpen(i, "Project Menu");
                                          }}
                                        ></img>
                                      ) : (
                                        <FilterAltOutlinedIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        />
                                      )}
                                    </BootstrapTooltip>

                                    {projectTemplate["chart" + i]?.[
                                      "filteApply"
                                    ] !== undefined && (
                                      <BootstrapTooltip
                                        title="Reset"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <RefreshIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            ResetFilter(i);
                                          }}
                                        />
                                      </BootstrapTooltip>
                                    )}
                                  </>
                                )}
                            </div>
                          )}
                          <Chart state={projectTemplate["chart" + i]} />
                        </>
                      ) : (
                        <div className="divdashboard">
                          <div
                            style={{
                              color: "red",
                              position: "relative",
                              top: "40%",
                            }}
                          >
                            <Box className="col-lg-12">
                              <CircularProgress />
                            </Box>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // 2 row
                    <div className="divdashboard">
                      <div
                        style={{
                          color: "#9d9d9b",
                          position: "relative",
                          top: "40%",
                        }}
                      >
                        <div className="col-lg-12">Drag the template</div>
                        <div className="col-lg-12">and</div>
                        <div className="col-lg-12">Drop here</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            for (
              let i = parseInt(layouts[0]) + parseInt(layouts[1]);
              i <
              `${
                layouts[2] !== undefined &&
                parseInt(layouts[0]) +
                  parseInt(layouts[1]) +
                  parseInt(layouts[2])
              }`;
              i++
            ) {
              Item.push(
                <div
                  className={
                    parseInt(layouts[2]) === 1
                      ? "col-lg-12 dashboard-layouts"
                      : parseInt(layouts[2]) === 2
                      ? "col-lg-6 dashboard-layouts"
                      : "col-lg-4 dashboard-layouts"
                  }
                  id={"chart" + i}
                  onDrop={(event) => {
                    drop(event);
                  }}
                  onDragOver={(event) => {
                    allowDrop(event);
                  }}
                >
                  {/* Dashboard menu in custom layout */}
                  {chartsID["chart" + i] !== undefined ? (
                    <div style={{ marginTop: "10px" }}>
                      {projectTemplate["chart" + i] !== undefined ? (
                        <>
                          {projectTemplate["chart" + i].Chart ===
                            "Bar Chart" && (
                            <>
                              <BootstrapTooltip
                                title="Sort by"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <SwapVertIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  onClick={(e) => {
                                    handleSort(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {sortOpen.open && <SortFunction id={i} />}

                              <BootstrapTooltip
                                title="Limit"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <select
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  value={limits[index.i]}
                                  onChange={(e) => {
                                    handleLimit(e, i);
                                  }}
                                >
                                  <option value={"select"}>All</option>
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                </select>
                              </BootstrapTooltip>
                            </>
                          )}
                          <ZoomOut
                            style={{
                              float: "right",
                              cursor: "pointer",
                              paddingTop: "6px",
                            }}
                            onClick={(e) => {
                              handleOpen(i);
                            }}
                          />
                          {(!isBublished && params.userID === undefined) ||
                          (params.action !== undefined &&
                            params.action === "Edit") ||
                          (params.action !== undefined &&
                            params.action === "Update") ? (
                            <div>
                              <DeleteIcon
                                style={{
                                  float: "right",
                                  cursor: "pointer",
                                  paddingTop: "6px",
                                }}
                                onClick={(e) => {
                                  RemoveChart(i);
                                }}
                              />
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {!manageFilter && (
                                <BootstrapTooltip
                                  title="Filter"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <FilterAltOutlinedIcon
                                    style={{
                                      float: "right",
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                    onClick={(e) => {
                                      filterModelOpen(i, "Dashboard Menu");
                                    }}
                                  />
                                </BootstrapTooltip>
                              )}
                            </div>
                          ) : (
                            <div>
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>

                              {!manageFilter &&
                                ((isBublished &&
                                  Object.values(
                                    storeFilterData[`chart${i}`] || {}
                                  ).length !== 0) ||
                                  individualFilter[i]?.[`chart${i}`] ||
                                  (params?.action === "Preview" &&
                                    individualFilter[i]?.[`chart${i}`])) && (
                                  <>
                                    <BootstrapTooltip
                                      title="Filter"
                                      TransitionComponent={Fade}
                                      TransitionProps={{ timeout: 600 }}
                                      placement="bottom"
                                    >
                                      {projectTemplate["chart" + i]?.[
                                        "filteApply"
                                      ] !== undefined ? (
                                        <img
                                          // src={FilteredIcon}
                                          src={ApplyFilterIcon}
                                          name="Filter"
                                          color="black"
                                          alt="Logo"
                                          height="23px"
                                          style={{
                                            width: "23px",
                                            float: "right",
                                            cursor: "pointer",
                                            padding: "3px 0px 0px 0px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        ></img>
                                      ) : (
                                        <FilterAltOutlinedIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        />
                                      )}
                                    </BootstrapTooltip>

                                    {projectTemplate["chart" + i]?.[
                                      "filteApply"
                                    ] !== undefined && (
                                      <BootstrapTooltip
                                        title="Reset"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <RefreshIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            ResetFilter(i);
                                          }}
                                        />
                                      </BootstrapTooltip>
                                    )}
                                  </>
                                )}
                            </div>
                          )}
                          <Chart state={projectTemplate["chart" + i]} />
                        </>
                      ) : (
                        <div className="divdashboard">
                          <div
                            style={{
                              color: "red",
                              position: "relative",
                              top: "40%",
                            }}
                          >
                            <Box className="col-lg-12">
                              <CircularProgress />
                            </Box>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // 3 row
                    <div className="divdashboard">
                      <div
                        style={{
                          color: "#9d9d9b",
                          position: "relative",
                          top: "40%",
                        }}
                      >
                        <div className="col-lg-12">Drag the template</div>
                        <div className="col-lg-12">and</div>
                        <div className="col-lg-12">Drop here</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            for (
              let i =
                parseInt(layouts[0]) +
                parseInt(layouts[1]) +
                parseInt(layouts[2]);
              i <
              `${
                layouts[3] !== undefined &&
                parseInt(layouts[0]) +
                  parseInt(layouts[1]) +
                  parseInt(layouts[2]) +
                  parseInt(layouts[3])
              }`;
              i++
            ) {
              Item.push(
                <div
                  className={
                    parseInt(layouts[3]) === 1
                      ? "col-lg-12 dashboard-layouts"
                      : parseInt(layouts[3]) === 2
                      ? "col-lg-6 dashboard-layouts"
                      : "col-lg-4 dashboard-layouts"
                  }
                  id={"chart" + i}
                  onDrop={(event) => {
                    drop(event);
                  }}
                  onDragOver={(event) => {
                    allowDrop(event);
                  }}
                >
                  {/*  Dashboard Menu in customlayout*/}
                  {chartsID["chart" + i] !== undefined ? (
                    <div style={{ marginTop: "10px" }}>
                      {projectTemplate["chart" + i] !== undefined ? (
                        <>
                          {projectTemplate["chart" + i].Chart ===
                            "Bar Chart" && (
                            <>
                              <BootstrapTooltip
                                title="Sort by"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <SwapVertIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  onClick={(e) => {
                                    handleSort(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {sortOpen.open && <SortFunction id={i} />}

                              <BootstrapTooltip
                                title="Limit"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <select
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    marginTop: "3px",
                                  }}
                                  value={limits[index.i]}
                                  onChange={(e) => {
                                    handleLimit(e, i);
                                  }}
                                >
                                  <option value={"select"}>All</option>
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                </select>
                              </BootstrapTooltip>
                            </>
                          )}
                          <ZoomOut
                            style={{
                              float: "right",
                              cursor: "pointer",
                              paddingTop: "6px",
                            }}
                            onClick={(e) => {
                              handleOpen(i);
                            }}
                          />
                          {(!isBublished && params.userID === undefined) ||
                          (params.action !== undefined &&
                            params.action === "Edit") ||
                          (params.action !== undefined &&
                            params.action === "Update") ? (
                            <div>
                              <DeleteIcon
                                style={{
                                  float: "right",
                                  cursor: "pointer",
                                  paddingTop: "6px",
                                }}
                                onClick={(e) => {
                                  RemoveChart(i);
                                }}
                              />
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>
                              {!manageFilter && (
                                <BootstrapTooltip
                                  title="Filter"
                                  TransitionComponent={Fade}
                                  TransitionProps={{ timeout: 600 }}
                                  placement="bottom"
                                >
                                  <FilterAltOutlinedIcon
                                    style={{
                                      float: "right",
                                      cursor: "pointer",
                                      paddingTop: "6px",
                                    }}
                                    onClick={(e) => {
                                      filterModelOpen(i, "Dashboard Menu");
                                    }}
                                  />
                                </BootstrapTooltip>
                              )}
                            </div>
                          ) : (
                            <div>
                              <BootstrapTooltip
                                title="Dataset"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <DatasetIcon
                                  style={{
                                    float: "right",
                                    cursor: "pointer",
                                    paddingTop: "6px",
                                  }}
                                  onClick={(e) => {
                                    handleDataSet(i);
                                  }}
                                />
                              </BootstrapTooltip>

                              {!manageFilter &&
                                ((isBublished &&
                                  Object.values(
                                    storeFilterData[`chart${i}`] || {}
                                  ).length !== 0) ||
                                  individualFilter[i]?.[`chart${i}`] ||
                                  (params?.action === "Preview" &&
                                    individualFilter[i]?.[`chart${i}`])) && (
                                  <>
                                    <BootstrapTooltip
                                      title="Filter"
                                      TransitionComponent={Fade}
                                      TransitionProps={{ timeout: 600 }}
                                      placement="bottom"
                                    >
                                      {projectTemplate["chart" + i]?.[
                                        "filteApply"
                                      ] !== undefined ? (
                                        <img
                                          // src={FilteredIcon}
                                          src={ApplyFilterIcon}
                                          name="Filter"
                                          color="black"
                                          alt="Logo"
                                          height="23px"
                                          style={{
                                            width: "23px",
                                            float: "right",
                                            cursor: "pointer",
                                            padding: "3px 0px 0px 0px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        ></img>
                                      ) : (
                                        <FilterAltOutlinedIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            filterModelOpen(i, "Project Menu");
                                          }}
                                        />
                                      )}
                                    </BootstrapTooltip>

                                    {projectTemplate["chart" + i]?.[
                                      "filteApply"
                                    ] !== undefined && (
                                      <BootstrapTooltip
                                        title="Reset"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        placement="bottom"
                                      >
                                        <RefreshIcon
                                          style={{
                                            float: "right",
                                            cursor: "pointer",
                                            paddingTop: "6px",
                                          }}
                                          onClick={(e) => {
                                            ResetFilter(i);
                                          }}
                                        />
                                      </BootstrapTooltip>
                                    )}
                                  </>
                                )}
                            </div>
                          )}

                          <Chart state={projectTemplate["chart" + i]} />
                        </>
                      ) : (
                        <div className="divdashboard">
                          <div
                            style={{
                              color: "red",
                              position: "relative",
                              top: "40%",
                            }}
                          >
                            <Box className="col-lg-12">
                              <CircularProgress />
                            </Box>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    //4 row
                    <div className="divdashboard">
                      <div
                        style={{
                          color: "#9d9d9b",
                          position: "relative",
                          top: "40%",
                        }}
                      >
                        <div className="col-lg-12">Drag the template</div>
                        <div className="col-lg-12">and</div>
                        <div className="col-lg-12">Drop here</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return Item;
          })()}
        </>
      );
    } catch (error) {
      console.log("Error while creating dragging area");
    }
  };

  const DashboardArea = React.useMemo(() => {
    const dashboard = CreatingUploadArea();
    return dashboard;
  }, [filteredtemplate, chartsID, layouts, isBublished, manageFilter]);

  const NavTabs = React.useMemo(() => Tabs(), [filter]);

  const getTable = () => {
    return (
      <DatasetTable
        params={
          projectTemplate["chart0"]?.["filteApply"] === "FilterApply"
            ? projectTemplate["chart0"]?.["Uploaded_fileTemp"]
            : projectTemplate["chart0"]?.["Uploaded_file"]
        }
        filter={false}
        fileName={projectTemplate["chart0"]?.["fileName"]} // set the source name to the table
      />
    );
  };

  return (
    <>
      <div className="row col-lg-12">
        {NavTabs}
        {
          <>
            {filteringProps?.length !== 0 &&
              filter.filterSwatch &&
              (params?.filterSwatch !== undefined ||
                params.action === "Preview") &&
              typeof filter.filterSwatch !== "object" && (
                <>
                  <div
                    className="row col-lg-3"
                    style={{
                      marginTop: "10px",
                      height: "calc(100vh - 128px)",
                      display: Tab.Dashboard ? "inline-flex" : "none",
                    }}
                  >
                    <DashboardFilter
                      params={{ filter: filter, filteredProp: filteringProps }}
                      paramfn={handleFilter}
                    />
                  </div>
                </>
              )}
            <div
              className={
                filteringProps?.length !== 0 &&
                filter.filterSwatch !== undefined &&
                filter.filterSwatch &&
                (params?.filterSwatch !== undefined ||
                  params.action === "Preview") &&
                typeof filter.filterSwatch !== "object"
                  ? "row col-lg-9"
                  : "row col-lg-12"
              }
              style={{
                display: Tab.Dashboard ? "inline-flex" : "none",
                maxHeight: "calc(100vh - 14vh)",
                minHeight: "calc(100vh - 16vh)",
                overflow: "auto",
                paddingBottom: "2%",
              }}
            >
              <div
                className="card-container"
                style={{
                  width: "100%",
                  padding: "9px",
                }}
              >
                <Cards />
              </div>
              {DashboardArea}
            </div>
          </>
        }
        <div
          className="row col-lg-12"
          style={{ display: !Tab.Dashboard ? "block" : "none" }}
        >
          {Tab.Dataset === true ? (
            // <DatasetTable params={Tab.data} filter={false} />
            getTable()
          ) : (
            <div
              className="col-lg-12"
              style={{ paddingTop: "20%", fontWeight: "bold" }}
            >
              No rows found.
            </div>
          )}
        </div>
        {chartOpen.Chart && <PreviewModal />}
        {open.DataSet && <PreviewDataSetModal />}
        {open.filterMenu === true ? FilterModel() : ""}
      </div>
    </>
  );
};
export default React.memo(Dashboard);
