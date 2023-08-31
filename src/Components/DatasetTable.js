import MUIDataTable from "mui-datatables";
const DatasetTable = ({ params, filter }) => {
  setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
  }, 100);
  const cols = Object.keys(params[0]).map((e) => ({ ["name"]: e }));
  const options = {
    filter: `${filter === false ? false : true}`,
    filterType: "multiselect",
    responsive: "scroll",
    selectableRows: false,
    useDisplayedRowsOnly: true,
    sort: false,

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
      {/* change height 165 to 140 for preview model  */}
      <div style={{ height: "calc(100vh - 140px)" }}>
        <MUIDataTable
          id="dataset"
          title={"Dataset"}
          data={params}
          columns={cols}
          options={options}
        />
      </div>
    </>
  );
};
export default DatasetTable;
