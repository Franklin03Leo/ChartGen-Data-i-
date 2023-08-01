import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

const ApprovalDetails = () => {
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
  });
  const [data, setData] = React.useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  //enable and disable the approved & reject btn
  const [selectedRowsIndexes, setSelectedRowsIndexes] = useState([]);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  //for user role Dropdown
  const [userRoleMap, setUserRoleMap] = useState({});
  const [tempData, settempData] = React.useState([]);

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    // Update the state to check if any checkbox is checked
    setIsAnyCheckboxChecked(selectedRowsIndexes.length > 0);
  }, [selectedRowsIndexes]);

  let options = {
    filterType: "checkbox",
    responsive: "scroll",
    rowsPerPage: [5],
    rowsPerPageOptions: [5, 10, 20],
    jumpToPage: true,
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "Total items Per Page",
        displayRows: "OF",
      },
    },
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      let curSelectedRowsData = allRowsSelected.map(
        (rowIndex) => tempData[rowIndex.index]  
      );
      console.log("Selected Rows Data:", curSelectedRowsData);
      setSelectedRowData( curSelectedRowsData); //...selectedRowData,

      // Update selected rows indexes
      setSelectedRowsIndexes(allRowsSelected.map((rowIndex) => rowIndex.index));
    },
  };

  let columns = [
    {
      name: "Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "User Role",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const options = ["Admin", "Creator", "User", "Guest", "External"];
          const rowIndex = tableMeta.rowIndex;

          return (
            <>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <Select
                  value={userRoleMap[rowIndex] || value}
                  onChange={(event) => handleDropdownChange(event, rowIndex)}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          );
        },
      },
    },
  ];

  const handleDropdownChange = (event, rowIndex) => {
    tempData[rowIndex]['Role'] = event.target.value;
    console.log('tempData', tempData)
    // let updatedData = selectedRowData.map((row, index) => {
    //   return {
    //     ...row,
    //     "User Role": event.target.value,
    //   }
    // });
    // console.log('updatedData', updatedData)
    // setSelectedRowData(updatedData);
  };

  const handleApprove = () => {
    const emailIdsTemp1 = selectedRowData.map(entry => entry.userID);
    const commonDataTemp2 = tempData.filter(entry => emailIdsTemp1.includes(entry.userID));
    console.log("Approved Rows Details:", commonDataTemp2);
  };

  const handleGetUsers = () => {
    axios
      .post(`http://${path.Location}:8000/GetUsers`)
      .then((res) => {
        if (res.status === 200) {
          const Data = res?.data?.map(({ Name, userID }) => [Name, userID]);
          settempData(res?.data)
          setData({ ...data, RowData: Data });
        }
      })
      .catch((error) => {});
  };

  return data["RowData"] ? (
    <div className="col-lg-12" style={{ width: "100%" }}>
      <ToastContainer />
      <div style={{ marginTop: "70px" }}>
        <h4>Approval Details</h4>
        <MUIDataTable
          title={"User List"}
          data={data["RowData"]}
          columns={columns}
          options={options}
        />
        <Button
          variant="contained"
          margin="normal"
          className="input-field button"
          style={{
            backgroundColor: "#6282b3",
            float: "left",
            margin: "10px",
          }}
          disabled={!isAnyCheckboxChecked} // Disable if no row is selected
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          margin="normal"
          className="input-field button"
          style={{
            backgroundColor: "#6282b3",
            float: "left",
            margin: "10px",
          }}
          disabled={!isAnyCheckboxChecked} // Disable if no row is selected
        >
          Reject
        </Button>
      </div>
    </div>
  ) : null;
};

export default ApprovalDetails;
