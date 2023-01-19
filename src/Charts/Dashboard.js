import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

//Icons
import ZoomOut from '@mui/icons-material/ZoomOutMap';
import ZoomIn from '@mui/icons-material/ZoomInMap';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/InsertChart';
import DatasetIcon from '@mui/icons-material/Dataset';

//Components
import BarChart from "../Charts/BarChart";
import PieChart from "../Charts/PieChart"
import Scatter from "../Charts/ScatterPlot";
import LineChart from "../Charts/LineChart";
import Compose from "../Charts/CompositeChart";
import SeriesChart from "../Charts/SeriesChart";
import BarLineChart from "../Charts/BarLineChart";
import DashboardFilter from "../Components/DashboardFilter";
import DatasetTable from "../Charts/DatasetTable";

//NPM's
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = ({ params }) => {
    //    console.log('Dashboard rendering');
    const [count, Setcount] = React.useState({ 'no': 0, 'Rendered': false });
    const [index, Setindex] = React.useState({});
    const [template, SetTemplate] = React.useState({});
    const [filteredtemplate, Setfilteredtemplate] = React.useState({});
    const [chartsID, SetChartsID] = React.useState({});
    const [open, SetOpen] = React.useState(false);
    const [filter, setFilter] = React.useState({});
    const [Tab, setTab] = React.useState({ 'Dashboard': true });
    const [filteringProps, setfilteringProps] = React.useState({});
    const [isBublished, setisBublished] = React.useState(false);
    const [layouts, setLayouts] = React.useState([]);



    useEffect(() => {
        if (params.dashboard !== undefined) {
            SetTemplate(params.dashboard)
            Setfilteredtemplate(params.dashboard)
        }
        if (params.Filter !== undefined) {
            setFilter(params.Filter)
        }
        if (params.FilteringProps !== undefined) {
            setfilteringProps(params.FilteringProps)
        }
        if (params.isBublished !== undefined) {
            setisBublished(params.isBublished)
        }
        if (params.StaticLayouts !== undefined) {
            if (params.StaticLayouts) {
                var layout
                if (params.selectedLayout !== undefined) {
                    layout = params.selectedLayout.split('X')
                    setLayouts(layout)
                }
            }
            else {
                // layout = Object.keys(params.Custom.Cols).map((e) => { return params.Custom.Cols[e] })
                let a = params.Custom.Rows
                let custom = []
                layout = Object.keys(params.Custom.Cols).map((e, i) => {
                    if (i < parseInt(a)) {
                        custom.push(params.Custom.Cols[e])
                    }
                })
                setLayouts(custom)
            }
        }
    }, [params])

    //Custom
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #6282b3',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    };

    //Components
    const Chart = ({ state }) => {
        return (
            <>
                <div>
                    {state.Chart === 'Bar Chart' &&
                        <BarChart params={state} />}
                    {state.Chart === 'Pie Chart' &&
                        <PieChart params={state} />}
                    {state.Chart === 'ScatterPlot' &&
                        <Scatter params={state} />}
                    {state.Chart === 'Line Chart' &&
                        <LineChart params={state} />}
                    {state.Chart === 'Composite Chart' &&
                        <Compose params={state} />}
                    {state.Chart === 'Series Chart' &&
                        <SeriesChart params={state} />}
                    {state.Chart === 'Bar Line Chart' &&
                        <BarLineChart params={state} />}
                </div>
            </>
        )
    }
    const CreatingUploadArea = React.memo(() => {
        return (
            <>

                {(() => {
                    let Item = [];
                    for (let i = 0; i < parseInt(layouts[0]); i++) {
                        Item.push(
                            // <div className={filter.filterSwatch ? " col-lg-6" : " col-lg-4"} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                            <div className={parseInt(layouts[0]) === 1 ? "col-lg-12" : parseInt(layouts[0]) === 2 ? 'col-lg-6' : 'col-lg-4'} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                                {chartsID["chart" + i] !== undefined ?
                                    <div style={{ marginTop: '10px' }}>
                                        {template[chartsID["chart" + i]] !== undefined ?
                                            <>
                                                <ZoomOut style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { handleOpen(i) }} />
                                                {!isBublished &&
                                                    <DeleteIcon style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { RemoveChart(i) }} />
                                                }
                                                {filter.filterSwatch ?
                                                    <Chart state={filteredtemplate[chartsID["chart" + i]]} />

                                                    :
                                                    <Chart state={template[chartsID["chart" + i]]} />
                                                }
                                            </>
                                            :
                                            <div className="divdashboard" >
                                                <div style={{ color: 'red', position: 'relative', top: '40%' }}>
                                                    <div className="col-lg-12">Please Refresh</div>
                                                    <div className="col-lg-12">the</div>
                                                    <div className="col-lg-12">Templates</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="divdashboard" >
                                        <div style={{ color: '#9d9d9b', position: 'relative', top: '40%' }}>
                                            <div className="col-lg-12">Drag the template</div>
                                            <div className="col-lg-12">and</div>
                                            <div className="col-lg-12">Drop here</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }
                    for (let i = parseInt(layouts[0]); i < parseInt(layouts[0]) + parseInt(layouts[1]); i++) {
                        Item.push(
                            // <div className={filter.filterSwatch ? " col-lg-6" : " col-lg-4"} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                            <div className={parseInt(layouts[1]) === 1 ? "col-lg-12" : parseInt(layouts[1]) === 2 ? 'col-lg-6' : 'col-lg-4'} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                                {chartsID["chart" + i] !== undefined ?
                                    <div style={{ marginTop: '10px' }}>
                                        {template[chartsID["chart" + i]] !== undefined ?
                                            <>
                                                <ZoomOut style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { handleOpen(i) }} />
                                                {!isBublished &&
                                                    <DeleteIcon style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { RemoveChart(i) }} />
                                                }
                                                {filter.filterSwatch ?
                                                    <Chart state={filteredtemplate[chartsID["chart" + i]]} />

                                                    :
                                                    <Chart state={template[chartsID["chart" + i]]} />
                                                }
                                            </>
                                            :
                                            <div className="divdashboard" >
                                                <div style={{ color: 'red', position: 'relative', top: '40%' }}>
                                                    <div className="col-lg-12">Please Refresh</div>
                                                    <div className="col-lg-12">the</div>
                                                    <div className="col-lg-12">Templates</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="divdashboard" >
                                        <div style={{ color: '#9d9d9b', position: 'relative', top: '40%' }}>
                                            <div className="col-lg-12">Drag the template</div>
                                            <div className="col-lg-12">and</div>
                                            <div className="col-lg-12">Drop here</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }
                    for (let i = parseInt(layouts[0]) + parseInt(layouts[1]); i < `${layouts[2] !== undefined && (parseInt(layouts[0]) + parseInt(layouts[1])) + parseInt(layouts[2])}`; i++) {
                        Item.push(
                            <div className={parseInt(layouts[2]) === 1 ? "col-lg-12" : parseInt(layouts[2]) === 2 ? 'col-lg-6' : 'col-lg-4'} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                                {chartsID["chart" + i] !== undefined ?
                                    <div style={{ marginTop: '10px' }}>
                                        {template[chartsID["chart" + i]] !== undefined ?
                                            <>
                                                <ZoomOut style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { handleOpen(i) }} />
                                                {!isBublished &&
                                                    <DeleteIcon style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { RemoveChart(i) }} />
                                                }
                                                {filter.filterSwatch ?
                                                    <Chart state={filteredtemplate[chartsID["chart" + i]]} />

                                                    :
                                                    <Chart state={template[chartsID["chart" + i]]} />
                                                }
                                            </>
                                            :
                                            <div className="divdashboard" >
                                                <div style={{ color: 'red', position: 'relative', top: '40%' }}>
                                                    <div className="col-lg-12">Please Refresh</div>
                                                    <div className="col-lg-12">the</div>
                                                    <div className="col-lg-12">Templates</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="divdashboard" >
                                        <div style={{ color: '#9d9d9b', position: 'relative', top: '40%' }}>
                                            <div className="col-lg-12">Drag the template</div>
                                            <div className="col-lg-12">and</div>
                                            <div className="col-lg-12">Drop here</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }
                    for (let i = parseInt(layouts[0]) + parseInt(layouts[1]) + parseInt(layouts[2]); i < `${layouts[3] !== undefined && (parseInt(layouts[0]) + parseInt(layouts[1])) + parseInt(layouts[2]) + parseInt(layouts[3])}`; i++) {
                        Item.push(
                            <div className={parseInt(layouts[3]) === 1 ? "col-lg-12" : parseInt(layouts[3]) === 2 ? 'col-lg-6' : 'col-lg-4'} id={"chart" + i} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                                {chartsID["chart" + i] !== undefined ?
                                    <div style={{ marginTop: '10px' }}>
                                        {template[chartsID["chart" + i]] !== undefined ?
                                            <>
                                                <ZoomOut style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { handleOpen(i) }} />
                                                {!isBublished &&
                                                    <DeleteIcon style={{ float: 'right', cursor: 'pointer', paddingTop: '6px' }} onClick={e => { RemoveChart(i) }} />
                                                }
                                                {filter.filterSwatch ?
                                                    <Chart state={filteredtemplate[chartsID["chart" + i]]} />

                                                    :
                                                    <Chart state={template[chartsID["chart" + i]]} />
                                                }
                                            </>
                                            :
                                            <div className="divdashboard" >
                                                <div style={{ color: 'red', position: 'relative', top: '40%' }}>
                                                    <div className="col-lg-12">Please Refresh</div>
                                                    <div className="col-lg-12">the</div>
                                                    <div className="col-lg-12">Templates</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="divdashboard" >
                                        <div style={{ color: '#9d9d9b', position: 'relative', top: '40%' }}>
                                            <div className="col-lg-12">Drag the template</div>
                                            <div className="col-lg-12">and</div>
                                            <div className="col-lg-12">Drop here</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }
                    return Item
                })()}
            </>
        )
    })
    const PreviewModal = React.memo(() => {
        return (
            <>
                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            <div className="row col-lg-12">
                                <div className="col-lg-11">
                                    Preview
                                </div>
                                <div className="col-lg-1" style={{ float: 'right', cursor: 'pointer' }}>
                                    <ZoomIn onClick={e => { handleClose() }} />
                                </div>
                            </div>
                        </Typography>
                        <div className="row col-lg-12" >
                            {chartsID["chart" + index.i] !== undefined ?
                                <Chart state={template[chartsID["chart" + index.i]]} />
                                : ''
                            }
                        </div>
                    </Box>
                </Modal>
            </>
        )
    })
    const Tabs = React.memo(() => {
        return (
            <>
                <div className="row Dashboardtab">
                    {/* <div className="col-lg-6"><h3>Dashboard</h3></div> */}
                    <div className="col-lg-1 Dash-icon" id="data" onClick={handleTabChange} style={{ background: `${!Tab.Dashboard ? '#6282b3' : '#e2e2e2'}` }}>
                        <DatasetIcon fontSize="large" />
                    </div>
                    <div className=" col-lg-1 Dash-icon" id="dashboard" onClick={handleTabChange} style={{ background: `${Tab.Dashboard ? '#6282b3' : '#e2e2e2'}` }}>
                        <DashboardIcon fontSize="large" />
                    </div>
                    {/* <div className="col-lg-1" style={{marginTop:'10px'}}>
                        <label style={{margin:'0px 5px'}}>
                            Filter
                        </label>
                        <label className="switch">
                            <input type="checkbox" name="Filterswatch" checked={filter.filterSwatch} onChange={(e) => { }}></input>
                            <span className="slider round"></span>
                        </label>
                    </div> */}
                </div>
            </>
        )
    })


    //Functions
    const drop = (event) => {
        // SetTemplate(params.template)
        SetChartsID({ ...chartsID, [event.currentTarget.id]: event.dataTransfer.getData('text') })
        if (Tab.data === undefined)
            setTab({ ...Tab, 'data': template[event.dataTransfer.getData('text')].Uploaded_file })

    }
    const allowDrop = (event) => {
        event.preventDefault();
    }
    const handleOpen = (index) => {
        SetOpen(true)
        Setindex({ 'i': index })

    };
    const handleClose = () => SetOpen(false);
    const handleFilter = (params) => {
        for (let i = 0; i < Object.keys(filteredtemplate).length; i++) {
            filteredtemplate[Object.keys(filteredtemplate)[i]].Uploaded_file = params.data
        }
        // if (params.isFiltered === 'Cancel Filter')
        //     setTab({ ...Tab, 'data': undefined })
        // else
        setTab({ ...Tab, 'data': params.data })
        Setcount({ ...count, 'Rendered': !count.Rendered })
    }
    const RemoveChart = (e) => {
        toast.success('Chart has been removed from the dashboard.', {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 2000
        })
        SetChartsID({ ...chartsID, ['chart' + e]: undefined })
        //Object.keys(chartsID).every((e)=> chartsID[e] === undefined)
    }
    const handleTabChange = (e) => {
        if (e.currentTarget.id === 'dashboard') setTab({ ...Tab, 'Dashboard': true })
        else setTab({ ...Tab, 'Dashboard': false })
    }
    const resetDimension = () => {
        // SetIsrendered(params.isRendered)
        // if (Object.keys(chartsID).length > 0) {
        //     for (let i = 0; i < Object.keys(chartsID).length; i++) {
        //         SetTemplate({
        //             ...template, [chartsID[Object.keys(chartsID)[i]]]: {
        //                 ...template[chartsID[Object.keys(chartsID)[i]]],
        //                 Width_: null, Heigth_: '230'
        //             }
        //         })

        //     }
        // }
    }

    return (
        <>

            <div className="row col-lg-12">
                <Tabs />
                {Tab.Dashboard ?
                    <>
                        {filter.filterSwatch &&
                            <div className="row col-lg-3" style={{ marginTop: '10px', height: 'calc(100vh - 165px)' }}>
                                <DashboardFilter params={{ 'filter': filter, 'filteredProp': filteringProps }} paramfn={handleFilter} />
                            </div>
                        }
                        <div className={filter.filterSwatch ? "row col-lg-9" : "row col-lg-12"} style={{ display: 'inline-flex' }}>
                            <CreatingUploadArea />
                        </div>
                    </>
                    :
                    <div className="row col-lg-12">
                        {Tab.data !== undefined ?
                            <DatasetTable params={Tab.data} filter={false} />
                            :
                            <div className="col-lg-12" style={{ paddingTop: '20%', fontWeight: 'bold' }}>
                                There is no any filter applied.
                            </div>
                        }

                    </div>
                }
                <PreviewModal />
            </div>
        </>
    )
}
export default Dashboard