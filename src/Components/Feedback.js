import React, { useCallback, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Modal } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
const Feedback = ({ params }) => {
  const [value, setValue] = React.useState("1");
  if (params[0] === undefined) params = [{}];

  const KnownIssues = [
    { "Reported By": "Venky", Issue: "Perfomance Issue" },
    {
      "Reported By": "Xavier",
      Issue:
        "Few more validations needs to be added in the part dashboard filtering",
    },
    { "Reported By": "Venky", Issue: "UI Design beautifing" },
  ];
  const fnFormat = (param) => {
    if (param !== undefined) {
      const date = new Date(param);
      return date.toLocaleString();
    }
  };
  const cols = [
    { name: "Reported By" },
    { name: "Category" },
    { name: "Section" },
    { name: "Issue" },
    { name: "Date/Time", options: { customBodyRender: fnFormat } },
  ];
  const options = {
    filter: false,
    filterType: "multiselect",
    responsive: "scroll",
    selectableRows: false,
    sort: false,
    useDisplayedRowsOnly: true,
    download: false, // set download option
    print: false, // set print option
    viewColumns: false, // set column option
    NoRowsOverlay: "yes",
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Feedback" value="1" />
              <Tab label="Know Issues" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div style={{ height: "calc(100vh - 305px)" }}>
              <MUIDataTable
                id="dataset"
                title={"Feedback"}
                data={params}
                columns={cols}
                options={options}
              />
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div style={{ height: "calc(100vh - 165px)" }}>
              <MUIDataTable
                id="dataset"
                title={"Know Issues"}
                data={KnownIssues}
                columns={cols}
                options={options}
              />
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};
export default Feedback;
