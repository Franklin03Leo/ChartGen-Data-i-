import MUIDataTable from "mui-datatables";
const DatasetTable = ({ params }) => {
    const cols = Object.keys(params[0]).map((e) => ({ ['name']: e }))
    const options = {
        filter: true,
        filterType: "multiselect",
        responsive: "scroll",
        selectableRows: false,
        useDisplayedRowsOnly:true
        
        // search: false, // set search option
        // download: false, // set download option
        // print: false, // set print option
        // pagination: true, //set pagination option
        // viewColumns: false, // set column option
        // elevation: 0,
        // selectToolbarPlacement: "none",
        // rowsPerPageOptions: [10, 20, 40, 80, 100],

    };
    return (
        <>
            <MUIDataTable
                id='dataset'
                title={"Dataset"}
                data={params}
                columns={cols}
                options={options}
            />
        </>
    )
}
export default DatasetTable;