import React, { useState, useEffect } from "react";

// form values from MUI
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

// import an HTTP client library
import axios from "axios";

//MUIDataTable
import MUIDataTable from "mui-datatables";
import { tooltipClasses } from "@mui/material";
import { Fade, Tooltip, styled } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";

const AssignProject = (params) => {
  const [props] = useState(params["params"]);

  // Bootstrap Tooltip
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

  const [projectAssigning, setProjectAssigning] = useState({});
  const [path, setPath] = React.useState({
    Location: window.location.hostname,
  });
  const [user, setUser] = React.useState({});
  const [assignedusers, setAssignedusers] = React.useState({});
  const Group = ["Sales", "Finance", "Marketing", "External"];
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // set the table column
  let columns = [
    {
      name: "Users",
      options: {
        sort: false,
      },
    },
    {
      name: "User ID",
      options: {
        sort: false,
      },
    },
    {
      name: "Groups",
      options: {
        sort: false,
      },
    },
  ];

  // get the all the user details in onload
  useEffect(() => {
    handleGetUsers();
  }, [params]);

  // handle Multiselect in user and Group Dropdown
  const handleMultiselect = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "Users" || name === "Groups") {
      setProjectAssigning({
        ...projectAssigning,
        [name]: typeof value === "string" ? value.split(",") : value,
      });
    }
  };

  // get All the users from DB.
  const handleGetUsers = () => {
    // get user details form user collection
    axios
      .post(`http://${path.Location}:3012/GetUsers`)
      .then((res) => {
        if (res.status === 200) {
          let temp = [];
          res.data.map((val) => {
            temp.push(
              [val.Name, val.userID, val.Group || "External"].join(", ")
            );
          });
          setUser({ ...user, Users: temp });
        }
      })
      .catch((error) => {});

    // get Assigned user details form Dashboards collection
    let obj = {};
    obj.userID = params["params"]?.userID;
    obj.DashboardName = params["params"]?.DashboardName;
    axios
      .post(`http://${path.Location}:3012/GetAssignedUsers`, obj)
      .then((res) => {
        if (res.status === 200) {
          let temp = res.data;
          let arr = [];
          temp[0].userID.map((val, index) => {
            arr.push(
              [
                temp[0].UserName[index],
                val,
                temp[0].UserGroup[index] || "External",
              ].join(", ")
            );
          });
          // set it already selected values in dropdown
          setProjectAssigning({
            ...projectAssigning,
            Users: arr,
            Groups: temp[0].AssignedGroups,
          });

          // set the selected values in table
          setAssignedusers({
            ...assignedusers,
            Users: arr,
            Groups: temp[0].AssignedGroups,
          });
        }
      })
      .catch((error) => {});
  };

  // store the details when user click submit button
  const handleSubmit = (action) => {
    if (action === "submit") {
      // Assigning table values
      setAssignedusers({
        ...assignedusers,
        Users: projectAssigning["Users"],
        Groups: projectAssigning["Groups"],
      });
      let obj = {};
      obj.Groups = projectAssigning.Groups || [];
      obj.Users =
        projectAssigning["Users"]?.map((val) => val.split(", ")[1]) || [];
      obj.DashboardName = params["params"].DashboardName;
      obj.userID = params["params"].userID;
      axios
        .post(`http://${path.Location}:3012/AssignUsers`, obj)
        .then((res) => {
          if (res.status === 200) {
            console.log("AssignUsers ==>", res.data);
          }
        });
    } else {
      // reset functionality
      // setAssignedusers({});
      setProjectAssigning({ ...projectAssigning, Groups: [], Users: [] });
    }
  };

  return (
    <>
      <div style={{ margin: "10px" }}>
        <div className="col-lg-12 borderstyle">
          <div className="col-lg-8 semi-bold" style={{ display: "contents" }}>
            <span>
              Project Assigned for {params["params"]?.DashboardName || ""}
            </span>
          </div>
        </div>

        <div
          className="row col-lg-12 borderdivstyle"
          style={{ margin: "0px", width: "70%" }}
        >
          <div className="row col-lg-6" style={{ padding: "0px" }}>
            <FormControl sx={{ m: 1, paddingRight: 2, width: 300 }}>
              <InputLabel id="filter">Assigned by Groups</InputLabel>
              <Select
                labelId="Assigned by Groups"
                id="Users"
                multiple
                value={
                  projectAssigning.Groups === undefined
                    ? []
                    : projectAssigning.Groups
                }
                name="Groups"
                onChange={handleMultiselect}
                input={<OutlinedInput label="Assigned by Groups" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {Group?.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={
                        projectAssigning.Groups === undefined
                          ? false
                          : projectAssigning.Groups.indexOf(name) > -1
                      }
                    />
                    <ListItemText key={name} primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="row col-lg-6" style={{ padding: "0px" }}>
            <FormControl sx={{ m: 1, paddingRight: 2, width: 500 }}>
              <InputLabel id="filter">Assigned by Users</InputLabel>
              <Select
                labelId="Users"
                id="Users"
                multiple
                value={
                  projectAssigning.Users === undefined
                    ? []
                    : projectAssigning.Users
                }
                name="Users"
                onChange={handleMultiselect}
                input={<OutlinedInput label="Assigned by Users" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {user.Users?.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={
                        projectAssigning.Users === undefined
                          ? false
                          : projectAssigning.Users.indexOf(name) > -1
                      }
                    />
                    <ListItemText key={name} primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            // justifyContent: "space-between",
            width: "68%",
          }}
        >
          <div style={{ margin: "8px" }}>
            <Button
              id="saveTemp"
              variant="contained"
              className="input-field button"
              style={{ backgroundColor: "#6282b3", padding: "7px 30px" }}
              onClick={() => handleSubmit("submit")}
            >
              Submit
            </Button>
          </div>
          <div style={{ margin: "8px" }}>
            <Button
              id="saveTemp"
              variant="contained"
              className="input-field button"
              style={{ backgroundColor: "#6282b3", padding: "7px 30px" }}
              onClick={() => handleSubmit("reset")}
            >
              Reset
            </Button>
          </div>
        </div>

        <div style={{ marginTop: "5%" }}>
          <h5>Existing Groups & Users</h5>
        </div>
        <div
          style={{
            margin: "0px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginTop: "10px", width: "20%" }}>
            {
              <table style={{ width: "90%" }}>
                <tr>
                  <td
                    style={{
                      padding: "10px 0",
                      border: "1px solid #b3aaaa",
                      fontSize: "15px",
                      color: "white",
                      background: "#222d4b 0% 0% no-repeat padding-box ",
                    }}
                  >
                    Groups
                  </td>
                </tr>
                {assignedusers?.Groups?.length !== 0 ? (
                  assignedusers?.Groups?.map((val) => (
                    <tr style={{ borderBottom: "1px solid #b3aaaa" }}>
                      <td style={{ padding: "10px 0" }}>{val}</td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: "1px solid #b3aaaa" }}>
                    <td style={{ padding: "10px 0" }}>no records found</td>
                  </tr>
                )}
              </table>
            }
          </div>
          <div style={{ marginTop: "10px", width: "80%" }}>
            <MUIDataTable
              title=""
              data={assignedusers["Users"]?.map((val) => val.split(", "))}
              columns={columns}
              options={{
                search: false, // Disable the search feature
                filter: false, // Disable the filter feature
                download: false, // Disable the download CSV option
                print: false, // Disable the print option
                viewColumns: false, // Disable the view columns option
                selectableRows: false,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignProject;
