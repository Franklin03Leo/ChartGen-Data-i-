import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Header from "./Header";
import { Button, Fade, Tooltip, styled } from "@material-ui/core";
// import CheckIcon from "@mui/icons-material/Check";
import CheckIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveIcon from "@mui/icons-material/CancelRounded";
import EditIcon from "@mui/icons-material/ModeRounded";
import { tooltipClasses } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AdminView = () => {
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [data, setData] = React.useState([]);
  useEffect(() => {
    handleGetUsers();
  }, []);
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

  let options = {
    filterType: "multiselect",
    responsive: "scroll",
    selectableRows: false,
    useDisplayedRowsOnly: true,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
  };

  let columns = [
    {
      name: "Users",
      options: {
        filter: true,
        sort: false,
      },
    },
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
      name: "Group",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const { rowIndex, columnIndex } = tableMeta;
          const options = ["Sales", "Finance", "Marketing", "External"];
          return (
            <>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <div>
                  {selectedValues[tableMeta.rowIndex] &&
                  selectedValues[tableMeta.rowIndex]["Group"]
                    ? selectedValues[tableMeta.rowIndex]["Group"]
                    : data["RowData"][rowIndex][columnIndex] || "External"}
                </div>
              ) : (
                <select
                  className="select-dpd"
                  value={
                    selectedValues[tableMeta.rowIndex] !== undefined
                      ? selectedValues[tableMeta.rowIndex]["Group"]
                      : data["RowData"][rowIndex][columnIndex] || "External"
                  }
                  onChange={(e) => handleChange(e, tableMeta)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </>
          );
        },
      },
    },
    {
      name: "Role",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const options = ["Admin", "Creator", "User"];
          const { rowIndex, columnIndex } = tableMeta;
          return (
            <>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <div>
                  {selectedValues[tableMeta.rowIndex] &&
                  selectedValues[tableMeta.rowIndex]["Role"]
                    ? selectedValues[tableMeta.rowIndex]["Role"]
                    : data["RowData"][rowIndex][columnIndex] || "User"}
                </div>
              ) : (
                <select
                  className="select-dpd"
                  value={
                    selectedValues[tableMeta.rowIndex] !== undefined
                      ? selectedValues[tableMeta.rowIndex]["Role"]
                      : data["RowData"][rowIndex][columnIndex] || "User"
                  }
                  onChange={(e) => handleChange(e, tableMeta)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </>

            // <select
            //   className="select-dpd"
            //   value={
            //     selectedValues[tableMeta.rowIndex] !== undefined
            //       ? selectedValues[tableMeta.rowIndex]["Role"]
            //       : data["RowData"][rowIndex][columnIndex] || "User"
            //   }
            //   onChange={(e) => handleChange(e, tableMeta)}
            // >
            //   {options.map((option) => (
            //     <option key={option} value={option}>
            //       {option}
            //     </option>
            //   ))}
            // </select>
          );
        },
      },
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const options = [
            "Registered",
            "Rejected",
            "Suspended",
            "Active",
            "Inactive",
            "Deleted",
          ];
          const { rowIndex, columnIndex } = tableMeta;
          return (
            <>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <div>
                  {selectedValues[tableMeta.rowIndex] &&
                  selectedValues[tableMeta.rowIndex]["Status"]
                    ? selectedValues[tableMeta.rowIndex]["Status"]
                    : data["RowData"][rowIndex][columnIndex] || "Registered"}
                </div>
              ) : (
                <select
                  className="select-dpd"
                  value={
                    selectedValues[tableMeta.rowIndex] !== undefined
                      ? selectedValues[tableMeta.rowIndex]["Status"]
                      : data["RowData"][rowIndex][columnIndex] || "Registered"
                  }
                  onChange={(e) => handleChange(e, tableMeta)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </>

            // <select
            //   className="select-dpd"
            //   value={
            //     selectedValues[tableMeta.rowIndex] !== undefined
            //       ? selectedValues[tableMeta.rowIndex]["Status"]
            //       : data["RowData"][rowIndex][columnIndex] || "Registered"
            //   }
            //   onChange={(e) => handleChange(e, tableMeta)}
            // >
            //   {options.map((option) => (
            //     <option className="select-dpd-opt" key={option} value={option}>
            //       {option}
            //     </option>
            //   ))}
            // </select>
          );
        },
      },
    },
    {
      name: "Create Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Approved By",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Approved Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "",
      options: {
        filter: true,
        // display: false,
        customBodyRender: (value, tableMeta) => {
          const { rowIndex, columnIndex } = tableMeta;
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <>
                  <div className="div-icon" style={{ marginRight: "5px" }}>
                    <BootstrapTooltip
                      title="Save"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      placement="bottom"
                    >
                      <EditIcon
                        size="3em"
                        color="primary"
                        onClick={(e) => {
                          handleEditRow(rowIndex, true);
                        }}
                      />
                    </BootstrapTooltip>
                  </div>
                </>
              ) : (
                <>
                  <div className="div-icon" style={{ marginRight: "5px" }}>
                    <BootstrapTooltip
                      title="Save"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      placement="bottom"
                    >
                      <CheckIcon
                        size="3em"
                        color="success"
                        onClick={(e) => {
                          handleSave(rowIndex);
                        }}
                      />
                    </BootstrapTooltip>
                  </div>
                  <div className="div-icon">
                    <BootstrapTooltip
                      title="Cancel"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      placement="bottom"
                    >
                      <RemoveIcon
                        size="3em"
                        htmlColor="red"
                        onClick={(e) => {
                          handleEditRow(rowIndex, false);
                          setSelectedValues({
                            ...selectedValues,
                            [rowIndex]: undefined,
                          });
                        }}
                      />
                    </BootstrapTooltip>
                  </div>
                </>
              )}
            </div>
          );
        },
      },
    },
  ];
  const handleChange = (event, tableMeta) => {
    const { rowIndex, columnIndex } = tableMeta;
    const { value } = event.target;

    setSelectedValues((prevSelectedValues) => {
      const updatedValues = [...prevSelectedValues];
      updatedValues[rowIndex] = {
        ...updatedValues[rowIndex],
        [columns[columnIndex].name]: value,
        ["_id"]: data["RowData"][rowIndex][0],
      };
      return updatedValues;
    });
  };

  const handleGetUsers = () => {
    axios
      .post(`http://${path.Location}:8000/GetUsers`)
      .then((res) => {
        if (res.status === 200) {
          const keys = [
            "_id",
            "Name",
            "userID",
            "Group",
            "Role",
            "Status",
            "created_date",
            "approved_by",
            "approved_date",
          ];
          const Data = getUsersDataByKeys(res.data, keys);
          setData({ ...data, RowData: Data });
          //   console.log(res.data);
          //   console.log(Data);
        }
      })
      .catch((error) => {});
  };
  const getUsersDataByKeys = (usersData, keysToRetrieve) => {
    return usersData.map((user) => {
      const userData = [];
      keysToRetrieve.forEach((key) => {
        if (user.hasOwnProperty(key)) {
          userData.push(user[key]);
        } else {
          userData.push("");
        }
      });
      return userData;
    });
  };
  const handleSave = (index) => {
    const obj = selectedValues[index];
    axios
      .post(`http://${path.Location}:8000/SaveUsers`, obj)
      .then((res) => {
        if (res.status === 200) {
          toast.success("User detail is updated.", {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 2000,
          });
          handleEditRow(index, false);
        }
      })
      .catch((error) => {});
  };
  const handleEditRow = (index, value) => {
    setData({
      ...data,
      EditedRow: {
        ...data["EditedRow"],
        [index]: value,
      },
    });
  };
  return (
    <div className="col-lg-12" style={{ width: "100%" }}>
      <ToastContainer />
      <Header />
      <div style={{ marginTop: "70px" }}>
        <MUIDataTable
          title=""
          data={data["RowData"]}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
};

export default AdminView;
