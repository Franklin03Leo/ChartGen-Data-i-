import MUIDataTable from "mui-datatables";
import { useState, useRef } from "react";
import * as React from "react";

const DatasetTable = ({ params, filter, fileName }) => {
  const [cols, setCols] = React.useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagenation, setPagenation] = useState(10);

  React.useEffect(() => {
    setCols(Object.keys(params[0]).map((e) => ({ ["name"]: e })));
  }, [params]);

  // Options for MUIDataTable
  const options = {
    // filter: `${filter === false ? false : true}`, //Commented by Manikandan
    filter: filter !== false, //In the above commented options object, the filter property is being set to a string template that will always result in a string, not a boolean. It should be directly set to the boolean value of filter:
    // filterType: "multiselect",
    // selectableRows: 'multiple',
    responsive: "scroll",
    selectableRows: false,
    useDisplayedRowsOnly: true,
    sort: true,
    print: false, // Disable the print option
    viewColumns: false, // Disable the view columns option
    downloadOptions: {
      filename: fileName || sessionStorage.getItem("uploadfilename"),
      separator: ",",
      onDownload: (action) => {
        downloadCSV();
      },
    },
    serverSide: true,
    count: count,
    page: page,
    onTableChange: (action, tableState) => {
      // Handle change in pagination
      switch (action) {
        case "changePage":
        case "changeRowsPerPage":
          handleChangePage(tableState.page, tableState?.rowsPerPage);
          break;
        case "search": // handle the search in mui table
          handleSearch(tableState);
          break;
        case "filterChange": // handle the filter in mui table
          handleFilter(tableState);
          break;
        case "resetFilters": // handle the reset filter in mui table
          handleFilter(tableState, "reset");
          break;
        case "sort": // handle the sort in mui table
          handleSort(tableState);
          break;
        case "propsUpdate":
          break;
        default:
          break;
      }
    },
  };

  // Downloads data in CSV format based on the content of the 'params' array. by franklin
  const downloadCSV = () => {
    // Create CSV content by joining values of each row with commas and separating rows with newline characters
    const csvContent =
      "data:text/csv;charset=utf-8," +
      params.map((row) => Object.values(row).join(",")).join("\n");
    // Encode the CSV content URI
    const encodedUri = encodeURI(csvContent);
    // Create a link element for downloading the CSV file
    const link = document.createElement("a");
    // Set the 'href' attribute of the link to the encoded CSV content URI
    link.setAttribute("href", encodedUri);
    // const fileName = sessionStorage.getItem("uploadfilename");
    // link.setAttribute("download", `${fileName || "downloaded_data"}.csv`);
    // Append the link to the document body
    document.body.appendChild(link);
    // Simulate a click on the link to trigger the download
    link.click();
  };

  // Handles the sorting functionality for a table based on the specified sort order.
  const handleSort = (tableState) => {
    // Destructure properties from the tableState object
    let { page, rowsPerPage } = tableState;
    let { name, direction } = tableState.sortOrder;
    // Initialize variable to store sorted data
    let data = [];
    // Check the type of the first non-empty value in the specified column
    let checkType = params.map((val) => val[name]).filter(Boolean);
    // Perform sorting based on direction and column type
    if (direction === "asc") {
      if (isNaN(checkType[0])) {
        // Sort alphabetically (case-insensitive) if the column is not numeric
        data = params.sort(function (a, b) {
          let x = !!a[name] ? a[name].toLowerCase() : a[name];
          let y = !!b[name] ? b[name].toLowerCase() : b[name];
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
      } else {
        // Sort numerically if the column is numeric
        data = params.sort(function (a, b) {
          return a[name] - b[name];
        });
      }
    } else if (direction === "desc") {
      if (isNaN(checkType[0])) {
        // Sort alphabetically in descending order (case-insensitive) if the column is not numeric
        data = params.sort(function (a, b) {
          let x = !!a[name] ? a[name].toLowerCase() : a[name];
          let y = !!b[name] ? b[name].toLowerCase() : b[name];
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        });
      } else {
        // Sort numerically in descending order if the column is numeric
        data = params.sort(function (a, b) {
          return b[name] - a[name];
        });
      }
    }
    // Fetch data based on the specified page, rowsPerPage, and sorted data
    fetchData(page, rowsPerPage, data);
  };

  setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
  }, 300);

  // handle the filter in muidata table by Franklin
  const handleFilter = (searchText, action) => {
    // Destructure properties from the searchText object
    let { page, rowsPerPage } = searchText;
    // If action is true, fetch data with the specified page and rowsPerPage
    if (action) {
      fetchData(page, rowsPerPage);
    }
    // Initialize variables for filtered data
    let filteredData;
    let filterData = searchText.filterList;
    // Check if any filters are applied
    if (filterData.filter((val) => val.length)) {
      // Extract column names from searchText.columns
      let columns = searchText.columns.map((val) => val.name);
      // Filter data based on column filters
      filteredData = params.filter((item) => {
        return columns.every((column, i) => {
          if (filterData[i].length === 0) {
            return true; // If no filters for this column, include it.
          }
          return filterData[i].includes(item[column]);
        });
      });
    } else {
      // If no filters applied, use the original data (no filtering)
      filteredData = params;
    }
    // Fetch data based on the specified page, rowsPerPage, and filtered data
    fetchData(page, rowsPerPage, filteredData);
  };

  // handle the search in mui table by Franklin
  const handleSearch = (tableState) => {
    // Destructure properties from the tableState object
    let { searchText, page, rowsPerPage } = tableState;
    // Initialize variable to store filtered data
    let filterData;
    if (searchText) {
      // Use Array.prototype.filter to filter items based on searchText
      filterData = params.filter((item) =>
        Object.values(item).some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(searchText.toString().toLowerCase())
        )
      );
    } else {
      // If searchText is not provided, use the original data
      filterData = params;
    }
    // update the filted data in Mui table
    fetchData(page, rowsPerPage, filterData);
  };

  // Function to fetch data
  const fetchData = (currentPage, rowsPerPage, data) => {
    if (rowsPerPage) {
      setPagenation(rowsPerPage);
    }
    setIsLoading(true);
    // Assuming params is an array of data you want to display
    let start = currentPage * (pagenation || 10); //tableState?.rowsPerPage || 10;
    let end = start + (pagenation || 10);
    if (data) {
      setData(data.slice(start, end)); // Use the data prop to slice the data for the current page
      setCount(data.length); // Use the length of data for total count
    } else {
      setData(params.slice(start, end)); // Use the params prop to slice the data for the current page
      setCount(params.length); // Use the length of params for total count
    }
    setIsLoading(false);
  };

  // Handle page change
  const handleChangePage = (currentPage, rowsPerPage) => {
    setPage(currentPage);
    fetchData(currentPage, rowsPerPage);
  };

  // Fetch data on initial render and when page changes
  React.useEffect(() => {
    fetchData(page);
  }, [page, params, pagenation]);

  React.useEffect(() => {
    setPagenation(10);
  }, [params]);

  return (
    <>
      {/* change height 165 to 140 for preview model  */}
      <div style={{ height: "calc(100vh - 140px)" }}>
        <MUIDataTable
          id="dataset"
          title={
            <div className="custom-title">
              {/* {filter === undefined && ( */}
              <div>
                {" "}
                <b style={{ color: "#2E89FF" }}>Source: </b>
                {fileName || sessionStorage.getItem("uploadfilename")}{" "}
              </div>
              {/* // )} */}
            </div>
          }
          data={data}
          columns={cols}
          options={options}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
export default DatasetTable;
