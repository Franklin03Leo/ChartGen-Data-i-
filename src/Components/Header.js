import React, { useCallback, useEffect } from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useNavigate } from "react-router-dom";
//Logo
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import logo from '../../src/Analytic_Brains_Logo.png';
const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <div className="fixed-header">
                <div className="site-identity">
                    <a href="#">
                        <img src={logo} alt='Logo'></img>
                    </a>
                </div>
                <div className="container">
                    Data(I)
                </div>
                <div>
                    <div className="header-username"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >Hello, {sessionStorage.getItem('UserName') === null || sessionStorage.getItem('UserName').length === 1 ? navigate('/') : sessionStorage.getItem('UserName').split(',')[0]}
                        {!open ?
                            <ArrowDropDownIcon />
                            :
                            <ArrowDropUpIcon />
                        }
                    </div>
                    <Menu
                        id="menu-logout"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}

                    >
                        <MenuItem onClick={(e) => { navigate('/'); sessionStorage.clear() }}>Sign out</MenuItem>
                    </Menu>
                </div>
            </div>
        </>
    )
}
export default Header