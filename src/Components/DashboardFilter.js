import React from "react";
import { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";

const DashboardFilter = ({ params, paramfn }) => {
  const [filter, setFilter] = React.useState({});
  const [filteredValue, setfilteredValue] = React.useState({});
  const [filterProps, setfilterProps] = React.useState([]);
  const [customFilterProps, setcustomFilterProps] = React.useState({});
  const [progressiveFilteredData, setProgressiveFilteredData] = React.useState(
    {}
  );
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    console.log("filter component is refreshed");
    if (params.filter !== undefined) setFilter(params.filter);
    if (
      params.filteredProp !== undefined &&
      (customFilterProps.length === undefined ||
        params.filteredProp.length !== customFilterProps.length)
    )
      setcustomFilterProps(params.filteredProp);
  }, [params]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setfilteredValue({
      ...filteredValue,
      [event.target.name]: typeof value === "string" ? value.split(",") : value,
    });
    let temp = filterProps;
    let remove;
    if (filteredValue[event.target.name] !== undefined)
      remove = filteredValue[event.target.name].filter(
        (x) => !event.target.value.includes(x)
      );
    temp = temp.concat(value === "string" ? value.split(",") : value);
    temp = temp.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });
    if (remove !== undefined) temp = temp.filter((e) => e !== remove[0]);
    setfilterProps(temp);
    if (parseInt(event.target.name) < customFilterProps.length - 1)
      handleProgressiveFilter(temp, event.target.name);
  };
  const handleFilter = (event, action) => {
    document.querySelector(".loader").style.display = "block";
    let data = filter.data;
    if (action === "Apply Filter") {
      for (let i = 0; i < event.length; i++) {
        let a = filteredValue[event[i]];
        if (a.length)
          data = data.filter((e) => {
            return a.indexOf(e[customFilterProps[event[i]].Dimensions]) !== -1;
          });
      }
    } else {
      setfilteredValue({});
      setfilterProps([]);
      setcustomFilterProps({});
    }
    setTimeout(() => {
      paramfn({ data: data, isFiltered: action });
    }, 0);
  };
  const handleProgressiveFilter = (Data, Index) => {
    let result = [];
    if (!progressiveFilteredData.Rows) {
      result = filter.data.filter((e) => {
        return (
          e[params.filteredProp[Index].Dimensions] === Data[Data.length - 1]
        );
      });
    } else {
      result = progressiveFilteredData.Rows.filter((e) => {
        return (
          e[params.filteredProp[Index].Dimensions] === Data[Data.length - 1]
        );
      });
    }
    setProgressiveFilteredData({ Rows: result });
    console.log("progressiveFilteredData ====>", result);
    const progressiveData = fnGetValueForKey(
      result,
      params.filteredProp[parseInt(Index) + 1].Dimensions
    );

    setcustomFilterProps((prevState) => {
      const newRowData = [...prevState];
      const updatedItem = {
        ...newRowData[parseInt(Index) + 1],
        [params.filteredProp[parseInt(Index) + 1].Dimensions]: progressiveData,
      };
      newRowData[parseInt(Index) + 1] = updatedItem;
      return newRowData;
    });
  };
  const fnGetValueForKey = (Data, key) => {
    const uniqueValues = new Set();
    for (const obj of Data) {
      if (key in obj) {
        uniqueValues.add(obj[key]);
      }
    }
    return Array.from(uniqueValues);
  };

  return (
    <>
      {/* {open.Loader &&
                <LoadingSpinner />} */}
      {filter.filterSwatch && (
        <div className="col-lg-12 filterDiv">
          <>
            <div
              className="row col-xs-12 col-sm-12 col-md-4 col-lg-12 inputfield row1-container borderdivstyle"
              style={{ margin: "10px 2px 10px -3px" }}
            >
              <div className="col-lg-12 borderstyle">
                <div className="col-lg-8" style={{ display: "contents" }}>
                  Filter
                </div>
              </div>
              <div className="Prt-filteredProp">
                {filterProps.map((e) => (
                  <div key={e} className="filteredProp">
                    {e}
                  </div>
                ))}
              </div>
              {(() => {
                let Item = [];
                for (let a in customFilterProps) {
                  if (customFilterProps[a] !== undefined) {
                    Item.push(
                      <>
                        <FormControl sx={{ m: 1, paddingRight: 2, width: 300 }}>
                          <InputLabel id="filter">
                            {customFilterProps[a].Dimensions}
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            //value={[1,2,3]}
                            value={
                              filteredValue[a] === undefined
                                ? []
                                : filteredValue[a]
                            }
                            name={a}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => {
                              return selected.join(", ");
                            }}
                            MenuProps={MenuProps}
                          >
                            {customFilterProps[a][
                              customFilterProps[a].Dimensions
                            ].map((name) => (
                              <MenuItem key={name} value={name}>
                                <Checkbox
                                  checked={
                                    filteredValue[a] === undefined
                                      ? false
                                      : filteredValue[a].indexOf(name) > -1
                                  }
                                />
                                <ListItemText key={name} primary={name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </>
                    );
                  }
                }
                if (Item.length === 0) {
                  Item.push(
                    <div className="col-lg-12 ">
                      Please enable filter option.
                    </div>
                  );
                }
                return Item;
              })()}
            </div>
            {customFilterProps.length !== 0 && (
              <div
                className="row col-sm-12 col-md-12 col-lg-12"
                style={{ margin: "10px 0px 10px 0px" }}
              >
                <div className="row col-sm-12 col-md-6 col-lg-6">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3", lineHeight: "1rem" }}
                    onClick={(e) => {
                      handleFilter(Object.keys(filteredValue), "Apply Filter");
                    }}
                  >
                    Apply
                  </Button>
                </div>
                <div className="row col-sm-12 col-md-6 col-lg-6">
                  <Button
                    id="saveTemp"
                    variant="contained"
                    className="input-field button"
                    style={{ backgroundColor: "#6282b3", lineHeight: "1rem" }}
                    onClick={(e) => {
                      handleFilter(Object.keys(filteredValue), "Cancel Filter");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </>
        </div>
      )}
    </>
  );
};
export default React.memo(DashboardFilter);
