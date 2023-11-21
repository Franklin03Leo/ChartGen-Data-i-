import React, { useCallback, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

//Logo
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import logo from "../../src/Spectra_logo.png";
import Avatar from "@mui/material/Avatar";
import Logout from "@mui/icons-material/Logout";
import axios from "axios";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const UserName = sessionStorage.getItem("UserName");

  const [path, setPath] = React.useState({
    Location: window.location.hostname,
    Port: process.env.REACT_APP_PORT,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // it will call when user click the logout
  const handleLogout = async () => {
    // get the current Time
    let logoutTime = new Date().getTime();
    let obj = {
      userID: sessionStorage.getItem("UserName").split(",")[1] || "",
      //   loginTime: loginTime,
      logoutTime: logoutTime,
      flag: "specific",
    };
    // update the logoutTime based on useID
    let result = await axios.post(
      `http://${path.Location}:${path.Port}/SaveUsers`,
      obj
    );
    // if response is success, it will clear the session
    if (result.status === 200) {
      navigate("/");
      sessionStorage.clear();
      console.log("logout successfully");
    }
  };

  return (
    <>
      <div className="fixed-header">
        <div className="site-identity">
          <a href="#">
            <img src={logo} alt="Logo"></img>
          </a>
        </div>
        <div className="container">{/* Data(I) */}</div>
        <div style={{ display: "flex", paddingRight: "2%" }}>
          <div
            className="header-username"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Avatar
              style={{ background: "#808080" }}
              sx={{ width: 32, height: 32 }}
            >
              {UserName[0].toUpperCase()}
            </Avatar>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {UserName === null || UserName.length === 1
              ? navigate("/")
              : UserName.split(",")[0]}
            {/* {!open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />} */}
          </div>
          <Menu
            id="menu-logout"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              style={{ backgroundColor: "#fff" }}
              onClick={handleLogout}
            >
              <Logout style={{ marginRight: "6px", width: "16px" }} /> Sign out
            </MenuItem>
          </Menu>
        </div>
      </div>
    </>
  );
};
export default Header;
