import * as React from "react";
import { useRef } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TabPanel from "@mui/lab/TabPanel";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Alert from "@mui/material/Alert";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Fade } from "@material-ui/core";
import Button from "@mui/material/Button";

import * as statis from "simple-statistics";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import HistogramChart from "../Charts/Histogram";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ZoomIn from "@mui/icons-material/ZoomInMap";
import CountPlot from "../Charts/CountPlot";
// Custom styles
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
const toPascalCase = (word) => {
  return word
    .split('_') // Split the word by underscores
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter of each part
    .join(''); // Join the parts together without spaces
};
const Dictionary = ({ params }) => {    
  //Custom
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
  const handleClose = () => setOpen({ HistogramChart: false });
  const handleOpen = (index) => {
    setOpen({HistogramChart: true});
  setIndex({i: index })
  }
    
  const handleClose_Count = () => setOpen({ CountPlot: false });
  const handleOpen_Count = (index) => {
    setOpen({ CountPlot: true });
    setIndex({ i: index });
  }
  const [open, setOpen] = React.useState({
    HistogramChart: false   
  });
  const [opencount, setOpencount] = React.useState({
    CountPlot: false   
  });
   const [rowsPerPage, setRowsPerPage] = React.useState(10);
   const [page, setPage] = React.useState(0);
  const [datatype, setDataType] = React.useState({ type: "All" });
  const [changeddltype, setChangeddlType] = React.useState({ type: "# Integers" });
  const [state, setState] = React.useState({});
  const [histogramdata, sethistogramdata] = React.useState([]);
  const [countdata, setcountdata] = React.useState([]);
  const [Index, setIndex] = React.useState({});
  const [newtabledata, setnewtabledata] = React.useState([]);
  const [changeDisplay, setDisplay] = React.useState({
    enableDisplay: true,
    displayname: '',
    column:''
  });
  const PreviewDataSet = (fromchart) => {
    var a = cols[Index]
    if (fromchart == 'histo') return (<HistogramChart params={histogramdata} />)
    else if(fromchart == 'count') return( <CountPlot params={histogramdata}  />)
  };
  //preview model for charts
  const PreviewModal = () => {
    return (
      <div>
        <Modal
          open={open.HistogramChart}
          onClose={(e) => {
            setOpen({ HistogramChart: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "98%", minHeight: "90%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{ float: "right", cursor: "pointer" }}
              >
                <ZoomIn
                  onClick={(e) => {
                    handleClose();
                  }}
                />
              </div>
            </Typography>
            <div className="row col-lg-12">{()=>PreviewDataSet('histo')}</div>
          </Box>
        </Modal>
      </div>
    );
  };
  //preview model for charts
  const PreviewModalCount = () => {
    return (
      <div>
        <Modal
          open={opencount.CountPlot}
          onClose={(e) => {
            setOpencount({ CountPlot: false });
          }}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} style={{ minWidth: "98%", minHeight: "90%" }}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
            >
              <div
                className="col-lg-1"
                style={{ float: "right", cursor: "pointer" }}
              >
                <ZoomIn
                  onClick={(e) => {
                    handleClose_Count();
                  }}
                />
              </div>
            </Typography>
            <div className="row col-lg-12">{()=>PreviewDataSet('count')}</div>
          </Box>
        </Modal>
      </div>
    );
  };
  const [changeType, setChangeType] = React.useState({
    enableChange: true,
    Dimensions_: "Select",
    DataTypes: "# Integers",
  });
  const [error, setError] = React.useState({});
  //const TableDataTypes = ["#", "Da", "Aa"];
  const TableDataTypes = ["# Integers", "Da Date", "Aa Strings"];
   const methods = [
    "Data Types",
    "Display Name",
    "Change Types",
     "Chart"
   ];
   const DataTypes = ["All", "Integers", "Strings"];
  let cols = [];
  //Every fields onChange for store the inputs
  const handleChange = (event) => {

    setChangeType.DataTypes = event.target.value
    changeType.DataTypes =event.target.value
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = () => {
    setDisplay({ enableDisplay: false, displayname: '', column: '' });
  };
  const handleInputChange = (e, colindex) => {
    setDisplay({ enableDisplay: false, displayname: e.target.value, column: colindex });
  };
  //Changing data type for the columns
 
  //  //Changing data type for the columns //Old
  //  const handleChangeDatatype = (event, flag, dim) => {  
  //    if (flag !== 1) { 
  //     setChangeType({ ...changeType, [event.target.name]: event.target.value });
  //   }
  //    else {
  //      debugger;
  //      //let SelectedDimension = changeType.Dimensions_;
  //      let SelectedDimension = dim;
  //     let TypeChanged =
  //       changeType.DataTypes +
  //       " " +
  //       SelectedDimension.split(" ").splice(1).join(" ");
  //     let DimensionsCopy = changeType.Dimensions;

  //     let value = SelectedDimension.split(" ").slice(1, 30).join(" ");
  //     let datatype = SelectedDimension.split(" ").splice(0, 1)[0];
  //     value = changeType.file[0][value];
  //     if (changeType.DataTypes === "# Integers") {
  //       if (isNaN(value - 10)) {
  //         setError({
  //           mandatoryFields:
  //             "The selected column will not be change as Integer",
  //         });
  //         return;
  //       } else {
  //         setError({ mandatoryFields: undefined });
  //       }
  //     } else if (changeType.DataTypes === "Da Date") {
  //       if (
  //         !isNaN(value - 10) ||
  //         (new Date(value) == "Invalid Date" &&
  //           new Date(value).getFullYear().toString().length >= 4)
  //       ) {
  //         setError({
  //           mandatoryFields: "The selected column will not be change as Date",
  //         });
  //         return;
  //       } else {
  //         setError({ mandatoryFields: undefined });
  //       }
  //     } else if (changeType.DataTypes === "Bo Boolean") {
  //       if (
  //         value.toLowerCase().toString() !== "true" ||
  //         value.toLowerCase().toString !== "false"
  //       ) {
  //         setError({
  //           mandatoryFields:
  //             "The selected column will not be change as Boolean",
  //         });
  //         return;
  //       } else {
  //         setError({ mandatoryFields: undefined });
  //       }
  //     } else if (changeType.DataTypes === "Aa Strings") {
  //       if (datatype !== "#") {
  //         setError({
  //           mandatoryFields: "The selected column will not be change as String",
  //         });
  //         return;
  //       } else {
  //         setError({ mandatoryFields: undefined });
  //       }
  //     }

  //     DimensionsCopy.forEach((element, index) => {
  //       if (element === changeType.Dimensions_) {
  //         DimensionsCopy[index] = TypeChanged;
  //         setChangeType({
  //           ...changeType,
  //           Dimensions_: DimensionsCopy[index],
  //           Dimensions: DimensionsCopy,
  //         });
  //         return;
  //       }
  //     });

  //     toast.success("Data type has been changed.", {
  //       position: toast.POSITION.BOTTOM_RIGHT,
  //       hideProgressBar: true,
  //       autoClose: 2000,
  //     });
  //     setState({
  //       ...state,
  //       XAxis_: changeType.Dimensions,
  //       YAxis_: changeType.Dimensions,
  //     });
  //     setChangeType({ ...changeType, enableChange: true });
  //     //  event.preven
  //   }
  // };
  
    Object.entries(params[0]).forEach(([key, value]) => {
      if (isNaN(value - 10) && new Date(value) != "Invalid Date") {
        //Do nothing
      } else if (datatype.type === "All") {
        // if (!isNaN(value - 10)) {
        cols.push(key);
        // }
      } else if (datatype.type === "Integers") {
        if (!isNaN(value - 10)) {
          cols.push(key);
        }
      } else if (datatype.type === "Strings") {
        if (isNaN(value - 10)) {
          cols.push(key);
        }
      }
    });
    let value = {};
    var tabledata = [];
    cols.forEach((event, index) => {

      let data = params.map((e) => parseInt(e[event]));
      if (isNaN(data[0])) {
        let data1 = params.map((e) => e[event]);
        let dataval = toPascalCase(typeof data1[0])
        value.graphicon = 'Category'
        value.rowdata = data1;
        value.columns = cols[index];
        value.displaynames = cols[index];
        setDisplay.displayname = cols[index];
        if (dataval == 'String') {
          value.min = 'Aa Strings'; value.rowdata = data1; value.columns = cols[index];
          value.displaynames = cols[index];
          setDisplay.displayname = cols[index];
        }
        if (dataval == 'Date') {
          value.min = 'Da Date'; value.rowdata = data1; value.columns = cols[index];
          value.displaynames = cols[index];
          setDisplay.displayname = cols[index];
        }
      }
      else {
        let dataval = toPascalCase(typeof data[0])
        if (dataval == 'Number') {
          value.graphicon = 'histogram'; value.rowdata = data; value.min = '# Integers'; value.columns = cols[index];
          value.displaynames = cols[index];
          setDisplay.displayname = cols[index];
        }
      }
      tabledata.push(value);
      value = {};      
    });
    
 
  const handleChangeDatatype = (event, flag, dim, datatype, displayname, changetype) => {
      tabledata.forEach((eventtab, indextab) => { 
      if (tabledata[indextab].columns == dim) {
        if (changetype[0] == '# Integers' || changetype[0] == 'Da Date') {
          tabledata[indextab].graphicon = 'histogram'
        }
        if (changetype[0] == 'Aa Strings') {
          tabledata[indextab].graphicon = 'Category';
        }
        tabledata[indextab].min = changetype[0];
        tabledata[indextab].displaynames = displayname;
        
        toast.success("Data type has been changed.", {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          autoClose: 2000,
        });   
        setnewtabledata(tabledata);
      }
    }) 
  };  
    return (
     <>
       <div
         className="row col-sm-4 col-md-4 col-lg-3"
         style={{ float: "right" }}
       >
         <TextField
           id="XAxis"
           select
           name="DataTypes"
           label="Statistics for"
           className="input-field "
           margin="dense"
           onChange={(e) => {
             setDataType({ type: e.target.value });
           }}
            value={datatype.type}
           style={{ float: "right" }}
         >
           {DataTypes.map((option, index) => (
             <MenuItem key={option} value={option}>
               {option}
             </MenuItem>
           ))}
         </TextField>
       </div>
       <TableContainer component={Paper}>
         <Table
           stickyHeader
           aria-label="sticky table"
           sx={{ minWidth: 650, maxHeight: "80vh" }}
         >
           <TableHead>
             <TableRow>
               <TableCell style={{ width: 150 }}>Column</TableCell>
               {methods.map((col) => (
                 <TableCell>{col}</TableCell>
               ))}               
             </TableRow>
            </TableHead>
            {newtabledata.length > 0 ? (
                <TableBody>   
              
                {newtabledata
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                       {/* Column... */}
                      <TableCell style={{ fontWeight: "900" }}>{cols[index]}</TableCell> 
                      {/* Data Types... */}
                      <TableCell component="th" scope="row" style={{ width: 150  }}>
                      {row.min}
                        {/* <TextField id="XAxis" select name="DataTypes" label="DataTypes"
                          className="input-field " value={row.min} style={{ width: 120 }}>
                            {TableDataTypes.map((option, index) => (
                               <MenuItem key={option} value={option}>{option}</MenuItem>))}
                        </TextField> */}
                      </TableCell> 
                      {/* Display Name... */}
                      <TableCell onClick={handleClick}   >
                      <div>
                          {changeDisplay.enableDisplay === false ? (
                            <div> <input type="text" style={{ width: 100 }}  id="myInput"  value={setDisplay.displayname}
                            onChange={(e) => {
                              handleInputChange(e, cols[index]);
                           }}/>
                       </div> ) : (<div>{cols[index]}</div>)}
                     </div>
                      </TableCell> 
                     {/* Change Types... */} 
                      <TableCell style={{ width: 800 }}><TabPanel value="3">
                         <div className="row  borderdivstyle"
                           style={{ margin: "25px 0px 0px 0px" }}
                         >                        
                          
                           {changeType.enableChange === false ? (
                             <div className="row col-sm-4 col-md-4 col-lg-6">
                               <Button
                                 variant="contained"
                                 className="input-field button"
                                 style={{
                                   backgroundColor: "#6282b3",
                                   float: "right",
                                 }}
                                 onClick={(e) => {
                                   setChangeType({
                                     ...changeType,
                                     enableChange: true,
                                   });
                                 }}
                               >
                                 Change Type
                               </Button>
                             </div>
                          ) :
                            (
                             <>
                               <div className="row col-sm-4 col-md-4 col-lg-6"
                                  style={{ float: "right" }}>
                                  <TextField id="XAxis" select name="TableDataTypes" label="Change Types"
                                  className="input-field " margin="dense" onChange={(e) => {
                                   setChangeddlType({ type: e.target.value });}}
                                   value={changeddltype.type} style={{ float: "right" }}>
                                   {TableDataTypes.map((option, index) => (
                                     <MenuItem key={option} value={option}>              {option}            </MenuItem>))}        </TextField>
                               </div>
                               <div className="row col-sm-3 col-md-3 col-lg-3">
                                 <BootstrapTooltip
                                   title="Change"
                                   TransitionComponent={Fade}
                                   TransitionProps={{ timeout: 600 }}
                                   placement="bottom"
                                 >
                                   <Check
                                     className="Datatypeicon"
                                     style={{ color: "green" }}
                                     fontSize="small"
                                     onClick={(e) => {
                                       handleChangeDatatype(e, 1,cols[index],[row.min],'inputRef',[changeddltype.type]);
                                     }}
                                   />
                                 </BootstrapTooltip>
                               </div>
                               <div className="row col-sm-3 col-md-3 col-lg-3">
                                 <BootstrapTooltip
                                   title="Cancel"
                                   TransitionComponent={Fade}
                                   TransitionProps={{ timeout: 600 }}
                                   placement="bottom"
                                 >
                                   <Clear
                                     className="Datatypeicon"
                                     style={{ color: "red" }}
                                     fontSize="small"
                                     onClick={(e) => {
                                       setChangeType({
                                         ...changeType,
                                         enableChange: true,
                                       });
                                       setError({ mandatoryFields: undefined });
                                     }}
                                   />
                                 </BootstrapTooltip>
                               </div>
                             </>
                          )}
                           {error.mandatoryFields !== undefined ? (
                             <div
                               className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
                               style={{
                                 margin: "15px 0px 15px  0px",
                                 padding: 0,
                               }}
                             >
                               <Alert severity="error">
                                 {error.mandatoryFields}
                               </Alert>
                             </div>
                           ) : (
                             ""
                           )}
                         </div>
                      </TabPanel></TableCell>
                      {/* Charts */}
                     
                      <TableCell >
                        {row.graphicon =='histogram' ? (
                          <div>
                            <ZoomIn    onClick={(e) => { handleOpen(index);}}/>
                           <HistogramChart params={row.rowdata}  />
                          </div>) : (                         
                            <div>                          
                         <ZoomIn    onClick={(e) => { handleOpen_Count(index);}}/>
                        <CountPlot data={row.rowdata}  />
                       </div>)}
   </TableCell>
                     
                      
                    </TableRow>
                  ))}
              </TableBody>
          
        ) : (
          <TableBody>  
             {tabledata
               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
               .map((row, index) => (
                 <TableRow
                   key={row.name}
                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                 >
                    {/* Column... */}
                   <TableCell style={{ fontWeight: "900" }}>{cols[index]}</TableCell> 
                   {/* Data Types... */}
                   <TableCell component="th" scope="row" style={{ width: 150  }}>
                   {row.min}
                     {/* <TextField id="XAxis" select name="DataTypes" label="DataTypes"
                       className="input-field " value={row.min} style={{ width: 120 }}>
                         {TableDataTypes.map((option, index) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>))}
                     </TextField> */}
                   </TableCell> 
                   {/* Display Name... */}
                   <TableCell onClick={handleClick}   >
                   <div>
                       {changeDisplay.enableDisplay === false ? (
                         <div> <input type="text" style={{ width: 100 }} id="myInput"  value={cols[index]}
                         onChange={(e) => {
                           handleInputChange(e, cols[index]);
                        }}/>
                    </div> ) : (<div>{cols[index]}</div>)}
                  </div>
                   </TableCell> 
                  {/* Change Types... */} 
                   <TableCell style={{ width: 800 }}><TabPanel value="3">
                      <div className="row  borderdivstyle"
                        style={{ margin: "25px 0px 0px 0px" }}
                      >                        
                       
                        {changeType.enableChange === false ? (
                          <div className="row col-sm-4 col-md-4 col-lg-6">
                            <Button
                              variant="contained"
                              className="input-field button"
                              style={{
                                backgroundColor: "#6282b3",
                                float: "right",
                              }}
                              onClick={(e) => {
                                setChangeType({
                                  ...changeType,
                                  enableChange: true,
                                });
                              }}
                            >
                              Change Type
                            </Button>
                          </div>
                       ) :
                         (
                          <>
                            <div className="row col-sm-4 col-md-4 col-lg-6"
                               style={{ float: "right" }}>
                               <TextField id="XAxis" select name="TableDataTypes" label="Change Types"
                               className="input-field " margin="dense" onChange={(e) => {
                                setChangeddlType({ type: e.target.value });}}
                                value={changeddltype.type} style={{ float: "right" }}>
                                {TableDataTypes.map((option, index) => (
                                  <MenuItem key={option} value={option}>              {option}            </MenuItem>))}        </TextField>
                            </div>
                            <div className="row col-sm-3 col-md-3 col-lg-3">
                              <BootstrapTooltip
                                title="Change"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <Check
                                  className="Datatypeicon"
                                  style={{ color: "green" }}
                                  fontSize="small"
                                  onClick={(e) => {
                                    handleChangeDatatype(e, 1,cols[index],[row.min],'inputRef',[changeddltype.type]);
                                  }}
                                />
                              </BootstrapTooltip>
                            </div>
                            <div className="row col-sm-3 col-md-3 col-lg-3">
                              <BootstrapTooltip
                                title="Cancel"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                placement="bottom"
                              >
                                <Clear
                                  className="Datatypeicon"
                                  style={{ color: "red" }}
                                  fontSize="small"
                                  onClick={(e) => {
                                    setChangeType({
                                      ...changeType,
                                      enableChange: true,
                                    });
                                    setError({ mandatoryFields: undefined });
                                  }}
                                />
                              </BootstrapTooltip>
                            </div>
                          </>
                       )}
                        {error.mandatoryFields !== undefined ? (
                          <div
                            className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
                            style={{
                              margin: "15px 0px 15px  0px",
                              padding: 0,
                            }}
                          >
                            <Alert severity="error">
                              {error.mandatoryFields}
                            </Alert>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                   </TabPanel></TableCell>
                   {/* Charts */}
                  
                   <TableCell >
                     {row.graphicon =='histogram' ? (
                       <div>
                         <ZoomIn    onClick={(e) => { handleOpen(index);}}/>
                        <HistogramChart params={row.rowdata}  />
                       </div>) : (                         
                         <div>                          
                      <ZoomIn    onClick={(e) => { handleOpen_Count(index);}}/>
                     <CountPlot data={row.rowdata}  />
                    </div>)}
</TableCell>
                  
                   
                 </TableRow>
               ))}
           </TableBody>
        )}
            
         </Table>
       </TableContainer>
       {open.HistogramChart && <PreviewModal />}
        {open.CountPlot && <PreviewModalCount />}
        {newtabledata.length > 0 ? (<TablePagination
         rowsPerPageOptions={[10, 25, 100]}
         component="div"
         count={newtabledata.length}
         rowsPerPage={rowsPerPage}
         page={page}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
       />): (<TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tabledata.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />)}
        
     </>
   );
};
export default Dictionary;