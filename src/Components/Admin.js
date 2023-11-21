import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { Fade, Tooltip, styled } from "@material-ui/core";
import CheckIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveIcon from "@mui/icons-material/CancelRounded";
import EditIcon from "@mui/icons-material/ModeRounded";
import { tooltipClasses } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../App.css";
import AdminNewUser from "./AdminNewUser";
import AdminBulkUser from "./AdminBulkUser";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
const AdminView = () => {
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
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });
  const [user, setUser] = React.useState({
    userID: sessionStorage.getItem("UserName").split(",")[0],
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [data, setData] = React.useState([]);

  //Bulk User..
  const [openBulkModal, setOpenBulkModal] = React.useState({
    BulkUser: false,
  });
  // const [fileName, setfileName] = React.useState(true);
  const [tableSort, settableSort] = React.useState(true);

  const handleCloseBulk = () => setOpenBulkModal({ BulkUser: false });
  const handleOpenBulk = () => {
    setOpenBulkModal({ BulkUser: true });
  };

  //  //   //preview model for Bulk User
  const UserAdminBulkModal = () => {
    return (
      <div>
        <Modal
          open={openBulkModal.BulkUser}
          style={{ zIndex: 1000 }}
          onClose={(e) => {
            setOpenBulkModal({ BulkUser: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "50%", minHeight: "30%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{ float: "right", cursor: "pointer" }}
              >
                <button
                  type="button"
                  class="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    handleCloseBulk();
                  }}
                ></button>
                {/* <ZoomIn
                  onClick={(e) => {
                    handleClose();
                  }}
                /> */}
              </div>
            </Typography>
            <div className="row col-lg-12">
              <AdminBulkUser />
              {/* <Login/> */}
            </div>
          </Box>
        </Modal>
      </div>
    );
  };
  //New User..
  const [openModal, setOpenModal] = React.useState({
    NewUser: false,
  });
  // const handleClose = () => setOpenModal({ NewUser: false });
  // const handleOpen = () => {
  //   setOpenModal({ NewUser: true });
  // };

  const handleClose = () => {
    setOpenModal({ NewUser: false });
    handleGetUsers();
  };
  const handleOpen = () => {
    setOpenModal({ NewUser: true });
    // handleGetUsers();
  };

  //   //preview model for New User
  const UserAdminNewModal = () => {
    return (
      <div>
        <Modal
          open={openModal.NewUser}
          style={{ zIndex: 1000 }}
          onClose={(e) => {
            setOpenModal({ NewUser: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "50%", minHeight: "90%" }}>
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
                  type="button"
                  class="close"
                  aria-label="Close"
                  style={{ width: "25px", cursor: 'pointer'}}
                  onClick={(e) => {
                    handleClose();
                  }}
                />
                {/* <ZoomIn
                  onClick={(e) => {
                    handleClose();
                  }}
                /> */}
              </div>
            </Typography>
            <div className="row col-lg-12">
              <AdminNewUser onResponse={handleResponse} />
              {/* <Login/> */}
            </div>
          </Box>
        </Modal>
      </div>
    );
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const DownloadFileName = () => {
    let today = new Date();
    let dd = today.getDate().toString().padStart(2, 0);
    let mm = (today.getMonth() + 1).toString().padStart(2, 0);
    let yyyy = today.getFullYear();
    let time_ = new Date().toLocaleTimeString();
    let time = time_.replace(/\:/g, ".");
    today = dd + "-" + mm + "-" + yyyy;
    return "User Details" + "_" + today + "_" + time + ".csv";
  };

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
    customToolbar: () => {
      return (
        <>
          <button
            id="newUser"
            variant="contained"
            className="btn text-white"
            onClick={(e) => handleOpen()}
            style={{ backgroundColor: "#2e89ff", cursor: "pointer" }}
          >
            New User
          </button>

          {/* <button
            id="bulkUser"
            variant="contained"
            className="input-field button btn-transparant"
            onClick={(e) => handleOpenBulk()}
            style={{ backgroundColor: "#6282b3", marginLeft: "8px" }}
          >
            Bulk User
          </button> */}
        </>
      );
    },
    // filterType: "multiselect",
    responsive: "scroll",
    selectableRows: false,
    useDisplayedRowsOnly: true,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    print: false, // Disable the print option
    viewColumns: false, // Disable the view columns option
    downloadOptions: { filename: DownloadFileName(), separator: "," },
  };

  //converting backend format date to frontend format
  const convertBackendDateToFrontendFormat = (backendDate) => {
    try {
      if (backendDate === "NA") {
        return "NA";
      } else {
        const dateObj = new Date(backendDate);
        const formattedDate = dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const formattedTime = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        return `${formattedDate}, ${formattedTime}`;
      }
    } catch (err) {
      console.log("Error in Convert date in frontend :", err);
    }
  };

  let columns = [
    {
      name: "Users",
      options: {
        filter: true,
        sort: tableSort,
      },
    },
    {
      name: "Name",
      options: {
        filter: true,
        sort: tableSort,
        setCellProps: () => ({
          style: { maxWidth: "200px", wordWrap: "break-word" },
        }),
      },
    },
    {
      name: "Email",
      options: {
        filter: true,
        sort: tableSort,
        setCellProps: () => ({
          style: { maxWidth: "250px", wordWrap: "break-word" },
        }),
      },
    },
    {
      name: "Group",
      options: {
        filter: true,
        sort: tableSort,
        customBodyRender: (value, tableMeta) => {
          const { rowIndex, columnIndex } = tableMeta;
          const options = ["Sales", "Finance", "Marketing", "External"];

          const statusValue =
            selectedValues[tableMeta.rowIndex] &&
            selectedValues[tableMeta.rowIndex]["Group"]
              ? selectedValues[tableMeta.rowIndex]["Group"]
              : data["RowData"][rowIndex][columnIndex];

          return (
            <>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <div>{value || statusValue}</div>
              ) : (
                <select
                  className="select-dpd"
                  value={
                    selectedValues[tableMeta.rowIndex] !== undefined
                      ? selectedValues[tableMeta.rowIndex]["Group"]
                      : value || "External"
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
        sort: tableSort, // Enable sorting for this column
        customBodyRender: (value, tableMeta) => {
          const options = ["Admin", "Creator", "User"];
          const { rowIndex, columnIndex } = tableMeta;

          const statusValue =
            selectedValues[tableMeta.rowIndex] &&
            selectedValues[tableMeta.rowIndex]["Role"]
              ? selectedValues[tableMeta.rowIndex]["Role"]
              : data["RowData"][rowIndex][columnIndex]; //|| "Registered";

          return (
            <>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <div>{value || statusValue}</div>
              ) : (
                <select
                  className="select-dpd"
                  value={
                    selectedValues[tableMeta.rowIndex] !== undefined
                      ? selectedValues[tableMeta.rowIndex]["Role"]
                      : value || "User" // Use 'value' for sorting
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
      name: "Status",
      options: {
        filter: true,
        sort: tableSort, // Enable sorting for this column
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
          const statusValue =
            selectedValues[tableMeta.rowIndex] &&
            selectedValues[tableMeta.rowIndex]["Status"]
              ? selectedValues[tableMeta.rowIndex]["Status"]
              : value || "Registered";

          const getStatusColor = (status) => {
            switch (status) {
              case "Active":
                return "green";
              case "Inactive":
                return "red";
              case "Registered":
                return "#fda162";
              default:
                return "";
            }
          };

          return (
            <>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <div style={{ color: getStatusColor(value) }}>
                  {value || statusValue}
                </div>
              ) : (
                <select
                  className="select-dpd"
                  value={
                    selectedValues[tableMeta.rowIndex] !== undefined
                      ? selectedValues[tableMeta.rowIndex]["Status"]
                      : value || statusValue
                  }
                  onChange={(e) => handleChange(e, tableMeta)}
                >
                  {options.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Registered"}
                    >
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
      name: "Create Date",
      options: {
        filter: true,
        sort: tableSort,
        customBodyRender: (value, tableMeta) => {
          let tempDate,
            tempTime = "";
          try {
            tempDate = value.split(",")[0].split("/").reverse().join("/");
            tempTime = value.split(",")[1];
          } catch (err) {
            console.log("error in create date ", err);
          }
          let date = new Date(tempDate).toLocaleDateString("en-GB");
          let time = new Date(
            `${tempTime !== undefined ? tempDate + " " + tempTime : value}`
          ).toLocaleTimeString("en-US", {
            timeStyle: "medium",
          });
          if (date === "Invalid Date") return "";
          else return `${date} ${time}`;
        },
      },
    },
    {
      name: "Approved By",
      options: {
        filter: true,
        sort: tableSort,
        customBodyRender: (value) => {
          if (!value) return "NA";
          else return value;
        },
      },
    },
    {
      name: "Approved Date",
      options: {
        filter: true,
        sort: tableSort,
        setCellProps: () => ({
          style: { maxWidth: "100px", wordWrap: "break-word" },
        }),
        customBodyRender: (value, tableMeta) => {
          if (!value) return "NA";
          const frontendDate = convertBackendDateToFrontendFormat(value);
          return frontendDate;
        },
      },
    },
    {
      name: "Updated By",
      options: {
        filter: true,
        sort: tableSort,
        customBodyRender: (value) => {
          if (!value) return "NA";
          else return value;
        },
      },
    },
    {
      name: "Updated Date",
      options: {
        filter: true,
        sort: tableSort,
        customBodyRender: (value, tableMeta) => {
          if (!value) return "NA";
          const frontendDate = convertBackendDateToFrontendFormat(value);
          return frontendDate;
        },
      },
    },
    {
      name: "",
      options: {
        filter: false,
        viewColumns: false,
        sort: false,
        // display: true,
        customBodyRender: (value, tableMeta) => {
          const { rowIndex, columnIndex } = tableMeta;
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {data["EditedRow"] === undefined ||
              !data["EditedRow"][rowIndex] ? (
                <>
                  <div className="div-icon" style={{ marginRight: "5px" }}>
                    <BootstrapTooltip
                      title="Edit"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      placement="bottom"
                    >
                      <EditIcon
                        size="3em"
                        color="primary"
                        onClick={(e) => {
                          handleEditRow(rowIndex, true, tableMeta);
                          settableSort(false);
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
                          handleSave(rowIndex, tableMeta);
                          settableSort(true);
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
                          // setSelectedValues({
                          //   ...selectedValues,
                          //   [rowIndex]: undefined,
                          // });
                          const previousSelectedValues = { ...selectedValues };
                          selectedValues[rowIndex] = undefined;
                          setSelectedValues(selectedValues);
                          handleEditRow(rowIndex, false, tableMeta);
                          settableSort(true);
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
      const updatedValues = prevSelectedValues.filter((val) => val);
      updatedValues[rowIndex] = {
        ...updatedValues[rowIndex],
        [columns[columnIndex].name]: value,
        ["_id"]: data["RowData"][rowIndex][0],
        ["_userEmail"]: data["RowData"][rowIndex][2],
        ["_userName"]: data["RowData"][rowIndex][1],
      };
      return updatedValues;
    });
  };

  const handleGetUsers = () => {
    axios
      .post(`http://${path.Location}:${path.Port}/GetUsers`)
      .then((res) => {
        if (res.status === 200) {
          const keys = [
            "_id",
            "Name",
            "userID",
            "Group",
            "Role",
            "Status",
            "createdDate",
            "approvedBy",
            "approvedDate",
            "updatedBy",
            "updatedDate",
          ];
          res.data.sort((a, b) => b._id - a._id);
          const Data = getUsersDataByKeys(res.data, keys);
          // Data.sort((a, b) => customSortFunctionGroup.Group(data, "asc"));
          setData({ ...data, RowData: Data });
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

  const handleSave = (index, tableMeta) => {
    const { rowIndex, columnIndex } = tableMeta;
    let temp = tableMeta.currentTableData[rowIndex].data[0];
    let originalArrIndex = data["RowData"].findIndex(
      (item) => item[0] === temp
    );

    const obj = selectedValues[selectedValues.length - 1];

    if (obj) {
      obj["_id"] = temp;
      obj["updatedBy"] = user["userID"];
      obj["updatedDate"] = new Date().toISOString();

      if (
        obj.Status === "Active" &&
        data["RowData"][originalArrIndex][5] !== "Active"
      ) {
        if (
          data["RowData"][originalArrIndex][7] === "NA" &&
          data["RowData"][originalArrIndex][8] === "NA"
        ) {
          obj["approvedDate"] = new Date().toISOString();
          obj["approvedBy"] = user["userID"];
        }
        obj["updatedBy"] = user["userID"];
        obj["updatedDate"] = new Date().toISOString();
      } else {
        // Preserve the existing "approvedBy" and "approvedDate" values
        obj["approvedBy"] = data["RowData"][originalArrIndex][7];
        obj["approvedDate"] = data["RowData"][originalArrIndex][8];
      }

      axios
        .post(`http://${path.Location}:${path.Port}/SaveUsers`, obj)
        .then((res) => {
          if (res.status === 200) {
            let emailObj = {
              username: obj._userName,
              userstatus: obj.Status,
              useremail: obj._userEmail,
              flag:
                obj.Status !== data["RowData"][originalArrIndex][5] &&
                obj.Status !== undefined,
            };

            if (obj.Status !== "Registered") {
              // check the status is true of false, if true we set the status value
              !!obj.Status &&
                (data["RowData"][originalArrIndex][5] = obj.Status);
              if (obj["approvedBy"])
                data["RowData"][originalArrIndex][7] = obj["approvedBy"];
              if (obj["approvedDate"])
                data["RowData"][originalArrIndex][8] = obj["approvedDate"];
            }

            data["RowData"][originalArrIndex][9] = obj["updatedBy"];
            data["RowData"][originalArrIndex][10] = obj["updatedDate"];
            if (obj["Group"])
              data["RowData"][originalArrIndex][3] = obj["Group"];
            if (obj["Role"]) data["RowData"][originalArrIndex][4] = obj["Role"];

            axios
              .post(
                `http://${path.Location}:${path.Port}/userDetailsEmail`,
                emailObj
              )
              .then((res1) => {
                Swal.fire({
                  icon: "success",
                  title: "User detail is updated.",
                });
                handleEditRow(index, false);
              })
              .catch((error) => {
                // Handle error if the email post request fails
              });
          }
        })
        .catch((error) => {
          // Handle error if the main post request fails
        });
    }
  };

  const handleEditRow = (index, value, tableMeta) => {
    let originalArrIndex = 0;
    try {
      let temp = tableMeta.currentTableData[index].data[0];
      originalArrIndex = data["RowData"].findIndex((item) => item[0] === temp);
    } catch (error) {
      console.log("err handleEditRow ===> ", error);
    }

    if (value) {
      // If starting to edit, setting the selected values for the row
      setSelectedValues((prevSelectedValues) => {
        const updatedValues = [...prevSelectedValues];
        updatedValues[index] = {
          _id: data["RowData"][originalArrIndex][0],
          Group: data["RowData"][originalArrIndex][3],
          Role: data["RowData"][originalArrIndex][4],
          Status: data["RowData"][originalArrIndex][5],
          _userName: data["RowData"][originalArrIndex][1],
          _userEmail: data["RowData"][originalArrIndex][2],
          updatedBy: user.userID,
        };
        return updatedValues;
      });
    } else {
      // If ending the edit, clearing the selected values for the row
      setSelectedValues((prevSelectedValues) => {
        const updatedValues = [...prevSelectedValues];
        updatedValues[index] = undefined;
        return updatedValues;
      });
    }

    // Update the EditedRow state
    setData({
      ...data,
      EditedRow: {
        ...data["EditedRow"],
        [index]: value,
      },
    });
  };

  const handleResponse = () => {
    handleGetUsers();
  };

  return (
    <div className="col-lg-12" style={{ width: "100%" }}>
      <ToastContainer />
      <div style={{ marginTop: "50px" }}>
        <MUIDataTable
          title=""
          data={data["RowData"]}
          columns={columns}
          options={options}
        />
        {openModal.NewUser && <UserAdminNewModal />}
        {openBulkModal.BulkUser && <UserAdminBulkModal />}
      </div>
    </div>
  );
};

export default AdminView;
