import React, { useCallback, useEffect } from "react";

//Charts
import BarChart from "../Charts/BarChart";
import PieChart from "../Charts/PieChart";
import Scatter from "../Charts/ScatterPlot";
import LineChart from "../Charts/LineChart";
import Compose from "../Charts/CompositeChart";
import SeriesChart from "../Charts/SeriesChart";
import BarLineChart from "../Charts/BarLineChart";
import SunBurstChart from "../Charts/SunBurstChart";

import DownloadIcon from "@mui/icons-material/Download";
import { Fade, Switch } from "@material-ui/core";

import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Button } from "@mui/material";

// imported mui icins
import DashboardIcon from "@mui/icons-material/InsertChart";
import DatasetIcon from "@mui/icons-material/Dataset";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// imported datasetTable js for datatable
import DatasetTable from "../Components/DatasetTable";

const ChartBlock = ({ enable, state }) => {
  console.log("chart block is rendering", state);
  if (!state) state = [{}];
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

  const [Tab, setTab] = React.useState({ Chart: true });

  const saveChart = () => {
    // domtoimage.toPng(
    //     document.getElementById('Charts'),
    //     { width: 0, height: 0, quality: 1, margin: [50, 200, 50, 50], style: { backgroundColor: 'white' } }
    // )
    domtoimage
      .toSvg(document.getElementById("Charts"), {
        width: "100%",
        height: "100vh",
        quality: 1,
        margin: [50, 200, 50, 50],
        style: { backgroundColor: "white" },
      })
      .then(function (dataUrl) {
        // saveAs(dataUrl, state.Chart + ".svg");
        saveAs(dataUrl, state.fileName || state.Chart + ".svg");
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const exportInputs = () => {
    var copystate = {};
    var PieChart = ["Innerradius", "SlicesCap", "ExternalRadiusPadding"];
    var BarChart = ["YAxisPadding"];
    var ScatterPlot = ["SymbolSize"];
    var LineChart = [];
    var CompositeChart = ["GroupBy", "GroupByValues"];
    var Common = [
      "Uploaded_file",
      "Chart",
      "Heigth_",
      "Width_",
      "Title",
      "XAxis",
      "YAxis",
      "XAxis_",
      "YAxis_",
      "Color",
      "XAxisLabel",
      "YAxisLabel",
      "BGColor",
      "LegendColor",
      "LegendFont",
      "LegendSize",
      "LengendPosition",
      "TitleColor",
      "TitleFont",
      "TitleSize",
      "TooltipBGColor",
      "TooltipColor",
      "TooltipFont",
      "TooltipSize",
      "TooltipThickness",
      "TooltipTickColor",
      "xFont",
      "xSize",
      "xColor",
      "xlColor",
      "xlFont",
      "xlSize",
      "yFont",
      "yColor",
      "ySize",
      "ylColor",
      "ylFont",
      "ylSize",
      "Axesswatch",
      "Axesswatch_",
      "Titleswatch",
      "Titleswatch_",
      "Tooltipswatch",
      "Tooltipswatch_",
      "Legendswatch",
      "Legendswatch_",
      "InputType",
      "XAxisCopy",
      "YAxisCopy",
      "TempDescription",
      "TempName",
      "GroupByCol",
      "GroupByCopy_",
    ];
    for (let i = 0; i < Object.keys(state).length; i++) {
      if (state.Chart === "Pie Chart") {
        if (PieChart.indexOf(Object.keys(state)[i]) !== -1) {
          copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]];
        }
      } else if (state.Chart === "Bar Chart") {
        if (BarChart.indexOf(Object.keys(state)[i]) !== -1) {
          copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]];
        }
      } else if (state.Chart === "ScatterPlot") {
        if (ScatterPlot.indexOf(Object.keys(state)[i]) !== -1) {
          copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]];
        }
      } else if (state.Chart === "Line Chart") {
        if (LineChart.indexOf(Object.keys(state)[i]) !== -1) {
          copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]];
        }
      } else if (
        state.Chart === "Composite Chart" ||
        state.Chart === "Series Chart"
      ) {
        if (CompositeChart.indexOf(Object.keys(state)[i]) !== -1) {
          copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]];
        }
      }

      if (Common.indexOf(Object.keys(state)[i]) !== -1) {
        if (Object.keys(state)[i] === "InputType") {
          copystate["InputType"] = "Import Inputs";
        } else {
          copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]];
        }
      }
    }

    const json = JSON.stringify(copystate, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const fileName =
      state.Chart.replaceAll(" ", "") +
      "-" +
      new Date().toLocaleDateString("en-GB").replaceAll("/", "");
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  useEffect(() => {
    handleTapChange("Chart");
  }, [enable]);

  const handleTapChange = (action) => {
    if (action === "Chart") {
      setTab({ Chart: true, DataSet: false });
    } else {
      document.querySelector(".loader").style.display = "block";
      setTab({ DataSet: true, Chart: false });
    }
  };

  const Chart = useCallback(
    ({ enable, state }) => {
      //console.log('Rendered')
      return (
        <>
          <div
            className="chart-container"
            style={{ backgroundColor: "#e9ecef" }}
          >
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
    },
    [state, enable]
  );

  return (
    <>
      <div className="">
        <div className=""></div>
        {state.Chart !== undefined ? (
          <div
            className="row col-xs-12 col-sm-4 col-md-4 col-lg-4"
            style={{
              padding: "5px",
              height: "5vh",
              display: "flex",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <div
              className="custom-title"
              style={{
                width: "70%",
                display: "flex",
                alignContent: "space-around",
                flexWrap: "wrap",
                paddingLeft: "16px",
              }}
            >
              {state.TempName && <b>Template Name : {state.TempName} </b>}
            </div>

            <div
              style={{
                width: "30%",
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <div
                className="Dash-icon"
                onClick={() => handleTapChange("DataSet")}
                style={{
                  cursor: "pointer",
                  background: `${Tab.DataSet ? "#6282b3" : "#e2e2e2"}`,
                }}
              >
                <BootstrapTooltip
                  title="DataSet"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="bottom"
                >
                  <DatasetIcon fontSize="large" />
                </BootstrapTooltip>
              </div>
              <div
                className="Dash-icon"
                onClick={() => handleTapChange("Chart")}
                style={{
                  cursor: "pointer",
                  background: `${Tab.Chart ? "#6282b3" : "#e2e2e2"}`,
                }}
              >
                <BootstrapTooltip
                  title="Chart"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="bottom"
                >
                  <DashboardIcon fontSize="large" />
                </BootstrapTooltip>
              </div>

              <div className="Dash-icon" style={{ cursor: "pointer" }}>
                <BootstrapTooltip
                  title="Download"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="bottom"
                >
                  <DownloadIcon
                    // style={{ float: "right", cursor: "pointer" }}
                    onClick={saveChart}
                    className="Icon_"
                  />
                </BootstrapTooltip>
              </div>
              {/* <div
              className="Dash-icon"
              style={{ width: "10%", cursor: "pointer" }}
              onClick={exportInputs}
            >
              <BootstrapTooltip
                title="Export Inputs"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="bottom"
              >
                
                <ExitToAppIcon fontSize="large" />
              </BootstrapTooltip>
            </div> */}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {Tab.Chart && <Chart enable={enable} state={state} />}
      {state.Chart !== undefined && Tab.DataSet && (
        <div>
          <DatasetTable
            params={state.Uploaded_file}
            filter={false}
            fileName={state.fileName}
          />
        </div>
      )}
    </>
  );
};
export default React.memo(ChartBlock);
