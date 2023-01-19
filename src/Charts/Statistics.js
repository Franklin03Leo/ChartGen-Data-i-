import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import * as statis from 'simple-statistics'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
const Statistics = ({ params }) => {
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [datatype, setDataType] = React.useState({ 'type': 'All' });
    const methods = ['Min', 'Max', 'Unique', 'Mean', 'Median', 'Mode', 'Standard Deviation']
    const DataTypes = ['All', 'Integers', 'Strings']
    let cols = []
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    Object.entries(params[0]).forEach(([key, value]) => {
        if (isNaN(value - 10) && new Date(value) != 'Invalid Date') {
            //Do nothing
        }
        else if (datatype.type === 'All') {
            // if (!isNaN(value - 10)) {
            cols.push(key)
            // }
        }
        else if (datatype.type === 'Integers') {
            if (!isNaN(value - 10)) {
                cols.push(key)
            }
        }
        else if (datatype.type === 'Strings') {
            if (isNaN(value - 10)) {
                cols.push(key)
            }
        }
    })
    //console.log('statis', params);
    let value = {};
    var tabledata = []
    cols.forEach(event => {
        let data = params.map((e) => (parseInt(e[event])));
        value.min = statis.min(data);
        value.max = statis.max(data);
        value.uniqueCountSorted = statis.uniqueCountSorted(data);
        value.mean = statis.mean(data);
        value.median = statis.median(data);
        value.mode = statis.mode(data);
        value.standardDeviation = statis.standardDeviation(data);
        tabledata.push(value)
        value = {}
    })
    //console.log('data_', data_)

    return (
        <>
            <div className="row col-sm-4 col-md-4 col-lg-3" style={{ float: 'right' }}>
                <TextField
                    id="XAxis"
                    select
                    name='DataTypes'
                    label="Statistics for"
                    className='input-field '
                    margin='dense'
                    onChange={(e) => { setDataType({ 'type': e.target.value }) }}
                    // onBlur={(e) => { handleValidation(e) }}
                    value={datatype.type}
                    style={{ float: 'right' }}
                >
                    {DataTypes.map((option, index) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650, maxHeight: '80vh' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>column</TableCell>
                            {methods.map((col) => (
                                <TableCell>{col}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabledata
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (

                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell style={{ fontWeight: '900' }}>{cols[index]}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.min}
                                    </TableCell>
                                    <TableCell >{row.max}</TableCell>
                                    <TableCell >{row.uniqueCountSorted}</TableCell>
                                    <TableCell >{row.mean}</TableCell>
                                    <TableCell >{row.median}</TableCell>
                                    <TableCell >{row.mode}</TableCell>
                                    <TableCell>{row.standardDeviation}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={tabledata.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}
export default Statistics