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

//Icons
import ZoomOut from "@mui/icons-material/ZoomOutMap";
import ZoomIn from "@mui/icons-material/ZoomInMap";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/InsertChart";
import DatasetIcon from "@mui/icons-material/Dataset";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import FilteredIcon from "../Images/Filtered-Icon.svg";

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
import CardLineChart from "./CardLineChart";
//NPM's
import Swal from "sweetalert2";

//tool tip
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import { Fade } from "@material-ui/core";

const Dashboard = ({ params }) => {
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

  console.log("Dashboard Rendering.... => ", params);
  const [details, SetDetails] = React.useState({
    ProjectName: "Dashboard",
    ProjectDescription: "Group of charts",
  });
  const [index, Setindex] = React.useState({});
  const [template, SetTemplate] = React.useState({});
  const [projectTemplate, setProjectTemplate] = React.useState({});
  const [filteredtemplate, Setfilteredtemplate] = React.useState({
    Render: true,
  });
  const [chartsID, SetChartsID] = React.useState({});
  const [filter, setFilter] = React.useState({ showFilter: false });
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
  const [other, setOther] = React.useState({});
  const [dashFilterData, setDashFilterData] = useState([]);
  const [filterHeaderData, setFilterHeaderData] = useState([]);
  const [filterDetailedData, setFilterDetailedData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [menuName, setMenuName] = React.useState({});

  const [individualFilter, setIndividualFilter] = useState([]);
  const [storeFilterData, setstoreFilterData] = useState([]);
  const [managePreview, setmanagePreview] = React.useState({});

  useEffect(() => {
    // set the invidual filter details
    if (
      params.IndividualFilter !== undefined &&
      params.IndividualFilter?.length !== 0
    ) {
      // setstoreFilterData(params.IndividualFilter);
      setFilterDetailedData(params.IndividualFilter);
      params.IndividualFilter.map((val, i) => {
        val["chart" + i] === null
          ? sessionStorage.removeItem(["chart" + i])
          : sessionStorage.setItem(["chart" + i], val["chart" + i]);
      });
    }

    if (params.dashboard !== undefined) {
      SetTemplate(params.dashboard);
      if (params.dashboard !== template) Setfilteredtemplate(params.dashboard);
      //if (params.action === 'Edit')
      SetDetails({ ProjectName: params.DashboardName });
    } //

    if (params.Projectfilter !== undefined) {
      setProjectTemplate(params.Projectfilter);
    }

    if (params.Filter !== undefined) {
      setFilter(params.Filter);
      setOther({ showFilter: params.Filter.filterSwatch });
    }
    // to get an individual filter dropdown values
    if (params.IndividualFilter !== undefined) {
      setIndividualFilter(params.IndividualFilter);
    }
    if (params.FilteringProps !== undefined) {
      setfilteringProps(params.FilteringProps);
    }

    // rerender the component when user colaps the panel,
    //(why i have render this, if the filter action is apply in preview, need to reset again)
    if (params.isBublished !== undefined) {
      setisBublished(params.isBublished);
      if (!params.isBublished) {
        Object.keys(chartsID || {}).map((val) => {
          projectTemplate[val]
            ? (projectTemplate[val].filteApply = undefined)
            : (template[chartsID[val]]["filteApply"] = undefined);
        });
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
      setfilteringProps({});
      setFilter({ showFilter: false });
      // setTab({ 'data': undefined })
    }
    //Preview project
    if (params.userID !== undefined) {
      if (params.charts !== undefined) {
        SetChartsID(params.charts);
      }
      if (params.Filter !== undefined) {
        setFilter(params.Filter);
      }
      if (params.FilterProps !== undefined) {
        setfilteringProps(params.FilterProps);
      }
      if (params.layoutOption === "Static") {
        layout = params.layouts.split("X");
        setLayouts(layout);
      } else {
        if (params?.layouts !== undefined) setLayouts(params?.layouts[1] || []);
      }
    }
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
    if (state !== undefined) {
      if (chartOpen.Chart === true) {
        state.Height_ = window.innerHeight - 200;
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
      let temp = template[chartsID["chart" + index]]?.["Uploaded_file"];
      // to get the table header values for select a filter fields
      setFilterHeaderData(Object.keys(temp[0]));
      if (
        sessionStorage.getItem("chart" + index) !== undefined &&
        sessionStorage.getItem("chart" + index) !== null
      ) {
        setDashFilterData(sessionStorage.getItem("chart" + index).split(","));
        // if(storeFilterData.length !== 0)
        // setDashFilterData(storeFilterData["chart" + index])
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
      return template[chartsID["chart" + index]]?.["Uploaded_file"].map(
        (item) => ({
          [propertyName]: item[propertyName],
        })
      );
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

    // setFilterDetailedData(newGroupedData);

    setFilterDetailedData({
      ...filterDetailedData,
      [`chart${index}`]: newGroupedData,
    });

    console.log(" filterDetailedData ==>1 ", filterDetailedData);
  };

  //chart drop layout
  const CreatingUploadArea = () => {
    try {
      console.log("charts re-rendered");
      if (Object.keys(template).length !== 0) {
        setTimeout(() => {
          document.querySelector(".loader").style.display = "none";
        }, 100);
      }
      return (
        <>
          {(() => {
            let Item = [];
            for (let i = 0; i < parseInt(layouts[0]); i++) {
              Item.push(
                // <div className={filter.filterSwatch ? " col-lg-6" : " col-lg-4"} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                <div
                  className={
                    parseInt(layouts[0]) === 1
                      ? "col-lg-12"
                      : parseInt(layouts[0]) === 2
                      ? "col-lg-6"
                      : "col-lg-4"
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
                      {projectTemplate["chart" + i] !== undefined ||
                      template[chartsID["chart" + i]] !== undefined ? (
                        <>
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
                            <>
                              {/* publish details cards */}
                              {!isBublished && (
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
                              {
                                // (isBublished &&
                                //   Object.values(
                                //     filterDetailedData[`chart${i}`] || {}
                                //   ).length !== 0) ||
                                !isBublished && (
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
                                )
                              }

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

                              {((isBublished &&
                                Object.values(
                                  storeFilterData[`chart${i}`] || {}
                                ).length !== 0) ||
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
                                        src={FilteredIcon}
                                        name="Filter"
                                        color="black"
                                        alt="Logo"
                                        height="18px"
                                        style={{
                                          float: "right",
                                          cursor: "pointer",
                                          padding: " 4px 5px 0 0",
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
                                          ResetFilter(i);
                                        }}
                                      />
                                    </BootstrapTooltip>
                                  )}
                                </>
                              )}
                            </div>
                            // publish dashboard and project menu cards End here by franklin
                          )}
                          {filter.filterSwatch ? (
                            <Chart
                              state={filteredtemplate[chartsID["chart" + i]]}
                            />
                          ) : params?.action === "Preview" ? (
                            <Chart state={projectTemplate["chart" + i]} />
                          ) : (
                            <Chart state={template[chartsID["chart" + i]]} />
                          )}
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
                            <div className="col-lg-12">
                              You might have deleted
                            </div>
                            <div className="col-lg-12">the</div>
                            <div className="col-lg-12">Template</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
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
                // <div className={filter.filterSwatch ? " col-lg-6" : " col-lg-4"} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                <div
                  className={
                    parseInt(layouts[1]) === 1
                      ? "col-lg-12"
                      : parseInt(layouts[1]) === 2
                      ? "col-lg-6"
                      : "col-lg-4"
                  }
                  id={"chart" + i}
                  onDrop={drop}
                  onDragOver={allowDrop}
                >
                  {chartsID["chart" + i] !== undefined ? (
                    <div style={{ marginTop: "10px" }}>
                      {projectTemplate["chart" + i] !== undefined ||
                      template[chartsID["chart" + i]] !== undefined ? (
                        <>
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
                            <>
                              {!isBublished && (
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
                                    filterModelOpen(i, "Project Menu");
                                  }}
                                />
                              </BootstrapTooltip>
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
                            </div>
                          )}
                          {filter.filterSwatch ? (
                            <Chart
                              state={filteredtemplate[chartsID["chart" + i]]}
                            />
                          ) : (
                            <Chart state={template[chartsID["chart" + i]]} />
                          )}
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
                            <div className="col-lg-12">Please Refresh</div>
                            <div className="col-lg-12">the</div>
                            <div className="col-lg-12">Templates</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
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
                      ? "col-lg-12"
                      : parseInt(layouts[2]) === 2
                      ? "col-lg-6"
                      : "col-lg-4"
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
                      {projectTemplate["chart" + i] !== undefined ||
                      template[chartsID["chart" + i]] !== undefined ? (
                        <>
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
                          ) : (
                            ""
                          )}
                          {filter.filterSwatch ? (
                            <Chart
                              state={filteredtemplate[chartsID["chart" + i]]}
                            />
                          ) : (
                            <Chart state={template[chartsID["chart" + i]]} />
                          )}
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
                            <div className="col-lg-12">Please Refresh</div>
                            <div className="col-lg-12">the</div>
                            <div className="col-lg-12">Templates</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
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
                      ? "col-lg-12"
                      : parseInt(layouts[3]) === 2
                      ? "col-lg-6"
                      : "col-lg-4"
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
                      {projectTemplate["chart" + i] !== undefined ||
                      template[chartsID["chart" + i]] !== undefined ? (
                        <>
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
                          ) : (
                            ""
                          )}
                          {filter.filterSwatch ? (
                            <Chart
                              state={filteredtemplate[chartsID["chart" + i]]}
                            />
                          ) : (
                            <Chart state={template[chartsID["chart" + i]]} />
                          )}
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
                            <div className="col-lg-12">Please Refresh</div>
                            <div className="col-lg-12">the</div>
                            <div className="col-lg-12">Templates</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
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

  // close the filter model
  const handleFilterClose = () => {
    setOpen({ filterMenu: false });
    // setFilterHeaderData([]);
    setDashFilterData([]);
    managePreview?.preview && setchartOpen({ Chart: true });
  };

  // get the selected dropdown fields in a array
  const handleChange = (event, index) => {
    const {
      target: { value },
    } = event;
    setDashFilterData(typeof value === "string" ? value.split(",") : value);
  };

  // handle the filter submit and reset action in preview model
  const ApplyFilterDropdown = (action) => {
    if (action !== "reset") {
      setstoreFilterData({
        ...storeFilterData,
        [`chart${index["i"]}`]: dashFilterData,
      });
      sessionStorage.setItem("chart" + index["i"], dashFilterData);
      handleFilterClose();
    } else {
      setDashFilterData([]);
      sessionStorage.removeItem("chart" + index["i"]);
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
    temp = template[chartsID["chart" + index["i"]]]; //projectTemplate['chart' + index["i"]]
    // projectTemplate['chart' + index["i"]].filter = selectedFilters;
    let filteredData = [];
    filteredData = projectTemplate["chart" + index["i"]]
      ? projectTemplate["chart" + index["i"]]["Uploaded_file"]
      : template[chartsID["chart" + index["i"]]]["Uploaded_file"];

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
    } else {
      template[chartsID["chart" + index["i"]]].filteApply = "FilterApply";
    }

    handleFilter(temp);
    handleFilterClose();

    // <Chart state={template[chartsID["chart" + i]]} />

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
      projectTemplate["chart" + i].filteApply = undefined;
    } else {
      filteredtemplate[template[chartsID["chart" + index["i"]]].TempName][
        "Uploaded_fileTemp"
      ] = template[chartsID["chart" + index["i"]]]["Uploaded_file"];
      template[chartsID["chart" + index["i"]]]["filteApply"] = undefined;
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

            {
              (menuName === "Project Menu" || isBublished) &&
                // filterDetailedData ?
                Object.keys(filterDetailedData[`chart${index["i"]}`])?.map(
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
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          style={{
                            maxHeight: 48 * 4.5 + 0,
                            width: 250,
                          }}
                        >
                          {filterDetailedData?.[`chart${index["i"]}`]?.[
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
                )
              // : (menuName !== "Dashboard Menu" || isBublished) &&
              // "No data to filter"
            }

            {(menuName === "Project Menu" || isBublished) &&
            Object.keys(filterDetailedData)?.length !== 0 ? (
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
                  onClick={ApplyFilter}
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

  const Cards = () => {
    return (
      <>
        {(() => {
          let count = params.Custom === undefined ? 0 : params.Custom.CardRows;
          let Item = [];
          for (let i = 0; i < count; i++) {
            Item.push(
              <div className="div-card">
                <h6>{params.Custom.Card["Card" + parseInt(i + 1)]}</h6>
                <h2>
                  {params.Custom.Card["Card" + parseInt(i + 1) + "-Count"]}
                </h2>
              </div>
            );
          }
          return Item;
        })()}
      </>
    );
  };

  const PreviewDataSet = () => {
    let tempDataSet = {};
    if (projectTemplate["chart" + index["i"]] === undefined) {
      if (
        template[chartsID["chart" + index["i"]]]?.["filteApply"] ===
        "FilterApply"
      ) {
        tempDataSet =
          filteredtemplate[template[chartsID["chart" + index["i"]]].TempName][
            "Uploaded_fileTemp"
          ];
      } else {
        tempDataSet = template[chartsID["chart" + index["i"]]]["Uploaded_file"];
      }
    } else {
      if (
        projectTemplate["chart" + index["i"]]?.["filteApply"] === "FilterApply"
      ) {
        tempDataSet =
          projectTemplate["chart" + index["i"]]["Uploaded_fileTemp"];
      } else {
        tempDataSet = projectTemplate["chart" + index["i"]]["Uploaded_file"]; // template[chartsID["chart" + index["i"]]]["Uploaded_file"];
      }
    }

    return template[chartsID["chart" + index["i"]]]["Uploaded_file"] !==
      undefined ? (
      <DatasetTable params={tempDataSet} filter={false} />
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
              paddingTop: "0",
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
                    right: "0px",
                    bottom: "10px",
                    textAlign: "center",
                    display: "flex",
                  }}
                >
                  {((params.action !== "Edit" && params?.action != undefined) ||
                    isBublished) && (
                    <>
                      {projectTemplate["chart" + index.i]?.["filteApply"] !==
                        undefined ||
                        (template[chartsID["chart" + index["i"]]]?.[
                          "filteApply"
                        ] !== undefined && (
                          <BootstrapTooltip
                            title="Refresh"
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
                              }}
                            />
                          </BootstrapTooltip>
                        ))}

                      {((isBublished &&
                        Object.values(storeFilterData["chart" + index.i] || {})
                          .length !== 0) ||
                        individualFilter[index.i]?.["chart" + index.i]) && (
                        <BootstrapTooltip
                          title="Filter"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="bottom"
                        >
                          {projectTemplate["chart" + index.i]?.[
                            "filteApply"
                          ] !== undefined ||
                          template[chartsID["chart" + index["i"]]]?.[
                            "filteApply"
                          ] !== undefined ? (
                            <img
                              src={FilteredIcon}
                              name="Filter"
                              color="black"
                              alt="Logo"
                              height="18px"
                              style={{
                                float: "right",
                                cursor: "pointer",
                                // padding: " 4px 5px 0 0",
                                marginRight: "15%",
                              }}
                              onClick={(e) => {
                                filterModelOpen(index.i, "Project Menu", true);
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
                                filterModelOpen(index.i, "Project Menu");
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
                            marginRight: "50%",
                          }}
                          onClick={(e) => {
                            handleDataSet(index.i);
                          }}
                        />
                      </BootstrapTooltip>
                    </>
                  )}

                  <CloseIcon
                    onClick={(e) => {
                      setchartOpen({ Chart: false });
                      // to rerender chart for come back again same size
                      !isBublished &&
                        Setfilteredtemplate({
                          ...filteredtemplate,
                          Render: !filteredtemplate.Render,
                        });
                    }}
                  />
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
                    state={
                      projectTemplate["chart" + index.i]
                        ? projectTemplate["chart" + index.i]
                        : template[chartsID["chart" + index.i]]
                    }
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

  // Layout tabs
  const Tabs = () => {
    return (
      <>
        <div className="Dashboardtab">
          {params.isBublished || !other.Build || params.action === "Preview" ? (
            <>
              {/* <div
                className=" Dash-icon"
                id="data"
                onClick={(e) => {
                  handleTabChange("Data");
                }}
                style={{
                  background: `${!Tab.Dashboard ? "#6282b3" : "#e2e2e2"}`,
                }}
              >
                <DatasetIcon fontSize="large" />
              </div>
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
                <DashboardIcon fontSize="large" />
              </div> */}

              {other.showFilter ? (
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
                ? "col-lg-12"
                : "col-lg-8"
            }
          >
            {" "}
            <h3>
              {details.ProjectName === undefined
                ? "Dashboard"
                : details.ProjectName}
            </h3>
          </div>
        </div>
      </>
    );
  };

  //Functions
  const drop = (event) => {
    try {
      SetChartsID({
        ...chartsID,
        [event.currentTarget.id]: event.dataTransfer.getData("text"),
      });
      if (Tab.data === undefined) {
        setTab({
          ...Tab,
          data: template[event.dataTransfer.getData("text")].Uploaded_file,
        });
      }
    } catch (error) {
      console.log("Error while dragging on");
    }
  };

  const allowDrop = (event) => {
    sessionStorage.removeItem(event.currentTarget.id);
    event.preventDefault();
  };

  const handleOpen = (index) => {
    setchartOpen({ Chart: true });
    Setindex({ i: index });
  };

  const handleClose = () => {
    // setchartOpen({ Chart: false });
    setOpen({ DataSet: false });
  };

  const handleFilter = async (Obj) => {
    debugger;
    document.querySelector(".loader").style.display = "block";
    if (projectTemplate["chart" + index["i"]]) {
      projectTemplate["chart" + index["i"]]["Uploaded_fileTemp"] = Obj.data;
    } else {
      template[chartsID["chart" + index["i"]]]["Uploaded_fileTemp"] = Obj.data;
    }
    // for (let i = 0; i < Object.keys(filteredtemplate).length; i++) {
    //   if (Object.keys(filteredtemplate)[i] !== "Render")
    // filteredtemplate[Object.keys(filteredtemplate)[i]].Uploaded_file =
    //
    //   // template[Obj.TempName].Uploaded_file = Obj.data;
    // }
    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });

    return "Executed";
  };

  const RemoveChart = (e) => {
    document.querySelector(".loader").style.display = "block";
    Swal.fire("Chart has been removed from the dashboard.");
    SetChartsID({ ...chartsID, ["chart" + e]: undefined });
  };

  const handleTabChange = (action) => {
    // document.querySelector('.loader').style.display = 'block'
    if (action === "Dashboard") setTab({ ...Tab, Dashboard: true });
    else {
      setTab({
        ...Tab,
        Dashboard: false,
        data: template[chartsID[Object.keys(chartsID)[0]]].Uploaded_file,
      });
    }
  };

  const DashboardArea = React.useMemo(() => {
    const dashboard = CreatingUploadArea();
    return dashboard;
  }, [template, filteredtemplate, chartsID, layouts, isBublished]);

  const NavTabs = React.useMemo(() => Tabs(), [filter]);
  const getTable = () => {
    setTimeout(() => {
      return <DatasetTable params={Tab.data} filter={false} />;
    }, 0);
  };
  return (
    <>
      <div className="row col-lg-12">
        {NavTabs}
        <>
          {filter.filterSwatch && (
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
              filter.filterSwatch !== undefined && filter.filterSwatch
                ? "row col-lg-9"
                : "row col-lg-12"
            }
            style={{
              display: Tab.Dashboard ? "inline-flex" : "none",
              maxHeight: "calc(100vh - 14vh)",
              minHeight: "calc(100vh - 16vh)",
              overflow: "auto",
            }}
          >
            <div className="card-container">
              <Cards />
            </div>
            {DashboardArea}
          </div>
        </>
        <div
          className="row col-lg-12"
          style={{ display: !Tab.Dashboard ? "block" : "none" }}
        >
          {/* {Tab.data !== undefined ? (
            <DatasetTable params={Tab.data} filter={false} />
          ) : (
            <div
              className="col-lg-12"
              style={{ paddingTop: "20%", fontWeight: "bold" }}
            >
              No rows found.
            </div>
          )} */}
        </div>
        {chartOpen.Chart && <PreviewModal />}
        {open.DataSet && <PreviewDataSetModal />}
        {open.filterMenu === true ? FilterModel() : ""}
        {/* <Chart state={template[chartsID["chart" + index.i]]} /> */}
      </div>
    </>
  );
};
export default React.memo(Dashboard);
