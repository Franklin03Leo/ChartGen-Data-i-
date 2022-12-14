//Charts
import BarChart from "../Charts/BarChart";
import PieChart from "../Charts/PieChart"
import Scatter from "../Charts/ScatterPlot";
import LineChart from "../Charts/LineChart";
import Compose from "../Charts/CompositeChart";
import SeriesChart from "../Charts/SeriesChart";
import BarLineChart from "../Charts/BarLineChart";


import DownloadIcon from '@mui/icons-material/Download';
import { Fade, Switch } from "@material-ui/core";

import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useCallback } from "react";
import { Button } from "@mui/material";


const ChartBlock = ({ enable, state }) => {
    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: 'black',
            top: 10
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'black',
        },
    }));


    const saveChart = () => {
        // domtoimage.toPng(
        //     document.getElementById('Charts'),
        //     { width: 0, height: 0, quality: 1, margin: [50, 200, 50, 50], style: { backgroundColor: 'white' } }
        // )
        domtoimage.toSvg(
            document.getElementById('Charts'),
            { width: 0, height: 0, quality: 1, margin: [50, 200, 50, 50], style: { backgroundColor: 'white' } }
        )
            .then(function (dataUrl) {
                saveAs(dataUrl, state.Chart + ".svg")
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }
    const exportInputs = () => {

        var copystate = {}
        var PieChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Innerradius', 'SlicesCap', 'ExternalRadiusPadding', 'XAxis', 'YAxis', 'XAxis_', 'YAxis_']
        var BarChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'YAxisPadding', 'XAxis_', 'YAxis_']
        var ScatterPlot = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'SymbolSize', 'XAxis_', 'YAxis_']
        var LineChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'XAxis_', 'YAxis_']
        var CompositeChart = ['Uploaded_file', 'Chart', 'Heigth_', 'Width_', 'Title', 'Color', 'XAxisLabel', 'YAxisLabel', 'XAxis', 'YAxis', 'GroupBy', 'XAxis_', 'YAxis_', 'GroupByValues']
        var Common = ['BGColor', 'LegendColor', 'LegendFont', 'LegendSize', 'LengendPosition', 'TitleColor', 'TitleFont', 'TitleSize', 'TooltipBGColor', 'TooltipColor',
            'TooltipFont', 'TooltipSize', 'TooltipThickness', 'TooltipTickColor', 'xFont', 'xSize', 'xColor', 'xlColor', 'xlFont', 'xlSize', 'yFont', 'yColor', 'ySize',
            'ylColor', 'ylFont', 'ylSize', 'Axesswatch', 'Axesswatch_', 'Titleswatch', 'Titleswatch_', 'Tooltipswatch', 'Tooltipswatch_', 'Legendswatch', 'Legendswatch_', 'InputType']
        for (let i = 0; i < Object.keys(state).length; i++) {
            if (state.Chart === 'Pie Chart') {
                if (PieChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'Bar Chart') {
                if (BarChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'ScatterPlot') {
                if (ScatterPlot.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'Line Chart') {
                if (LineChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }
            else if (state.Chart === 'Composite Chart' || state.Chart === 'Series Chart') {
                if (CompositeChart.indexOf(Object.keys(state)[i]) !== -1) {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }

            if (Common.indexOf(Object.keys(state)[i]) !== -1) {
                if (Object.keys(state)[i] === 'InputType') {

                    copystate['InputType'] = 'Import Inputs'
                }
                else {
                    copystate[Object.keys(state)[i]] = state[Object.keys(state)[i]]
                }
            }

        }
        const json = JSON.stringify(copystate, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = state.Chart + "-Inputs.json";
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }

    const Chart = useCallback(({ enable, state }) => {
        console.log('Rendered')
        return (
            <>
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-12 container-Inputs">
                    <div className="row col-xs-1 col-sm-8 col-md-8 col-lg-8" >
                    </div>
                    {state.Chart !== undefined ?
                        <div className="row col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: '5px' }}>
                            <div className="col-xs-5 col-sm-8 col-md-8 col-lg-8">
                                <BootstrapTooltip title="Download" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                    <DownloadIcon style={{ float: 'right', cursor: 'pointer' }} onClick={saveChart} className="Icon_" />
                                </BootstrapTooltip>
                            </div>
                            <div className="col-xs-1 col-sm-4 col-md-4 col-lg-4">
                                <BootstrapTooltip title="Export Inputs" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="bottom">
                                    <Button variant="contained" className='exptbutton' style={{ backgroundColor: '#6282b3' }} onClick={exportInputs}>
                                        Export
                                    </Button>
                                </BootstrapTooltip>
                            </div>
                        </div>
                        : ''
                    }
                </div>
                <div style={{ backgroundColor: '#e9ecef' }}>
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
    }, [state, enable])

    return (
        <>
            <Chart enable={enable} state={state} />
        </>
    )
}
export default ChartBlock;