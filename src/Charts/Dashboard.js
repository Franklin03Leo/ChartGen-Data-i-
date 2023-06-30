import React, { Fragment } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

//Icons
import ZoomOut from "@mui/icons-material/ZoomOutMap";
import ZoomIn from "@mui/icons-material/ZoomInMap";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/InsertChart";
import DatasetIcon from "@mui/icons-material/Dataset";

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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = ({ params }) => {
  console.log("Dashboard Rendering.... => ", params);
  const [details, SetDetails] = React.useState({
    ProjectName: "Dashboard",
    ProjectDescription: "Group of charts",
  });
  const [index, Setindex] = React.useState({});
  const [template, SetTemplate] = React.useState({});
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
  });
  const [other, setOther] = React.useState({});
  const [cardValue, setCardValue] = React.useState({});

  useEffect(() => {
    if (params.dashboard !== undefined) {
      SetTemplate(params.dashboard);
      if (params.dashboard != template) Setfilteredtemplate(params.dashboard);
      //if (params.action === 'Edit')
      SetDetails({ ProjectName: params.DashboardName });
    }
    if (params.Filter !== undefined) {
      setFilter(params.Filter);
      setOther({ showFilter: params.Filter.filterSwatch });
    }
    if (params.FilteringProps !== undefined) {
      setfilteringProps(params.FilteringProps);
    }
    if (params.isBublished !== undefined) {
      setisBublished(params.isBublished);
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
        setLayouts(params.layouts[1]);
      }
    }
  }, [params]);
  useEffect(() => {
    sessionStorage.setItem("IDs", JSON.stringify(chartsID));
  }, [chartsID]);

  //Custom
  const style = {
    position: "absolute",
    top: "50%",
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
    return (
      <>
        <div>
          {state.Chart === "Bar Chart" && <BarChart params={state} />}
          {state.Chart === "Pie Chart" && <PieChart params={state} />}
          {state.Chart === "ScatterPlot" && <Scatter params={state} />}
          {state.Chart === "Line Chart" && <LineChart params={state} />}
          {state.Chart === "Composite Chart" && <Compose params={state} />}
          {state.Chart === "Series Chart" && <SeriesChart params={state} />}
          {state.Chart === "Bar Line Chart" && <BarLineChart params={state} />}
          {state.Chart === "Sunburst Chart" && <SunBurstChart params={state} />}
        </div>
      </>
    );
    //   }, [state])
    // return chart
  };
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
                      {template[chartsID["chart" + i]] !== undefined ? (
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
                  onDrop={(event) => {
                    drop(event);
                  }}
                  onDragOver={(event) => {
                    allowDrop(event);
                  }}
                >
                  {chartsID["chart" + i] !== undefined ? (
                    <div style={{ marginTop: "10px" }}>
                      {template[chartsID["chart" + i]] !== undefined ? (
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
                      {template[chartsID["chart" + i]] !== undefined ? (
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
                      {template[chartsID["chart" + i]] !== undefined ? (
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
  const Cards = () => {
    return (
      <>
        {(() => {
          let count = params.Custom === undefined ? 0 : params.Custom.CardRows;
          let Item = [];
          for (let i = 0; i < count; i++) {
            Item.push(
              <div
                className="div-card"
                onClick={(e) => {
                  fnGettingUniqueCount(params.Custom.Card["Card" + i + 1]);
                }}
              ></div>
            );
          }
          return Item;
        })()}
      </>
    );
  };
  const PreviewModal = () => {
    return (
      <div>
        <Modal
          open={open.Chart}
          onClose={(e) => {
            setOpen({ Chart: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "90%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div className="row col-lg-12">
                <div className="col-lg-11">Preview</div>
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
              </div>
            </Typography>

            <div className="row col-lg-12">
              {chartsID["chart" + index.i] !== undefined ? (
                <Chart state={template[chartsID["chart" + index.i]]} />
              ) : (
                ""
              )}
            </div>
          </Box>
        </Modal>
      </div>
    );
  };
  const Tabs = () => {
    return (
      <>
        <div className="Dashboardtab">
          {params.isBublished || !other.Build || params.action === "Preview" ? (
            <>
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
              </div>
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
      if (Tab.data === undefined)
        setTab({
          ...Tab,
          data: template[event.dataTransfer.getData("text")].Uploaded_file,
        });
    } catch (error) {
      console.log("Error while dragging on");
    }
  };
  const allowDrop = (event) => {
    try {
      event.preventDefault();
    } catch (error) {
      console.log("Error while allowingDrop");
    }
  };
  const handleOpen = (index) => {
    setOpen({ Chart: true });
    Setindex({ i: index });
  };
  const handleClose = () => setOpen({ Chart: false });
  const handleFilter = async (params) => {
    document.querySelector(".loader").style.display = "block";
    for (let i = 0; i < Object.keys(filteredtemplate).length; i++) {
      if (Object.keys(filteredtemplate)[i] !== "Render")
        filteredtemplate[Object.keys(filteredtemplate)[i]].Uploaded_file =
          params.data;
    }
    Setfilteredtemplate({
      ...filteredtemplate,
      Render: !filteredtemplate.Render,
    });
    return "Executed";
  };
  const RemoveChart = (e) => {
    document.querySelector(".loader").style.display = "block";
    toast.success("Chart has been removed from the dashboard.", {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
      autoClose: 2000,
    });
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
  const fnGettingUniqueCount = (key) => {
    const countMap = new Map();

    params.dashboard[Object.keys(params.dashboard)[0]].Uploaded_file.forEach(
      (obj) => {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          countMap.set(value, (countMap.get(value) || 0) + 1);
        }
      }
    );
    return countMap.size;
  };
  const DashboardArea = React.useMemo(() => {
    const dashboard = CreatingUploadArea();
    return dashboard;
  }, [template, filteredtemplate, chartsID, layouts]);
  const NavTabs = React.useMemo(() => Tabs(), [Tab, filter]);
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
          {Tab.data !== undefined ? (
            <DatasetTable params={Tab.data} filter={false} />
          ) : (
            <div
              className="col-lg-12"
              style={{ paddingTop: "20%", fontWeight: "bold" }}
            >
              No rows found.
            </div>
          )}
        </div>
        {/* } */}
        {/* <PreviewModal /> */}
        <div>
          <Modal
            open={open.Chart}
            onClose={(e) => {
              setOpen({ Chart: false });
            }}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={style} style={{ minWidth: "90%" }}>
              <Typography
                id="keep-mounted-modal-title"
                variant="h6"
                component="h2"
              >
                <div className="row col-lg-12">
                  <div className="col-lg-11">Preview</div>
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
                </div>
              </Typography>

              <div className="row col-lg-12">
                <Chart state={template[chartsID["chart" + index.i]]} />

                {/* {chartsID["chart" + index.i] !== undefined ? (
                  <Chart state={template[chartsID["chart" + index.i]]} />
                ) : (
                  ""
                )} */}
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default React.memo(Dashboard);
