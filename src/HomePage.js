import React, { useCallback } from "react";

//MUI
import './Styles/Custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//NPM's
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatasetTable from "./Charts/DatasetTable";

//Components
import InputBlock from "./Components/InputBlock";
import ChartBlock from "./Components/ChartBlock";

//Icons
import logo from '../src/Analytic_Brains_Logo.png';

const HomePage = () => {
    const [state, setState] = React.useState({});
    const [enable, setEnable] = React.useState({})
    const [filedata, setData] = React.useState({})
    const [navbar, setNavbar] = React.useState({ 'bar': 'Data' });

    const [navwidth, setNavWidth] = React.useState({ 'navArea': '7%', 'inuptArea': '30%', 'ChartArea': '63%' });



    const data = (state, enable, navbar) => {
        setState(state)
        setEnable(enable)
        setNavbar(navbar)

    }
    const expand = useCallback((navwidth) => {
        setNavWidth(navwidth);
    }, [navwidth])
    const DataTable = (data) => {
        setData({ 'data': data.data })
    }
    return (
        <div>
            <div className="col-lg-12" style={{ width: '100%' }}>
                <ToastContainer />
                <div className="fixed-header">
                    <div className="site-identity">
                        <a href="#">
                            <img src={logo} alt='Logo'></img>
                        </a>
                    </div>
                    <div className="container">
                        Data(i)
                    </div>
                </div>

                <div className="row" style={{ marginRight: '0px', width: '100%' }}>

                    <InputBlock ChildtoParentHandshake={data} ExpandData={expand} dataTable={DataTable} />

                    <div className="" style={{ backgroundColor: '#e9ecef', height: '87vh', width: navwidth.ChartArea }}>
                        {/* {filedata.data !== undefined &&
                            <DatasetTable params={filedata.data} />
                        } */}
                        {filedata.data === undefined ?
                            <ChartBlock enable={enable} state={state} />
                            :
                            <DatasetTable params={filedata.data} />
                        }

                    </div>

                </div>
            </div>
        </div >

    )
}
export default HomePage;