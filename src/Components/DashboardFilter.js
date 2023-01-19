import React from "react";
import { useEffect } from "react";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
const DashboardFilter = ({ params, paramfn }) => {
    const [filter, setFilter] = React.useState({});
    const [filteredValue, setfilteredValue] = React.useState({});
    const [filterProps, setfilterProps] = React.useState([]);
    const [isFiltered, setisFiltered] = React.useState({});
    const [customFilterProps, setcustomFilterProps] = React.useState();

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }

    useEffect(() => {
        if (params.filter !== undefined)
            setFilter(params.filter)
        if (params.filteredProp !== undefined)
            setcustomFilterProps(params.filteredProp)
    }, [params])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setfilteredValue({ ...filteredValue, [event.target.name]: typeof value === 'string' ? value.split(',') : value, });
        let temp = filterProps;
        let remove;
        if (filteredValue[event.target.name] !== undefined)
            remove = filteredValue[event.target.name].filter(x => !event.target.value.includes(x));
        temp = temp.concat(value === 'string' ? value.split(',') : value)
        temp = temp.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        })
        if (remove !== undefined)
            temp = temp.filter(e => e !== remove[0])
        setfilterProps(temp)
        //console.log('probs', filterProps);
    };
    const handleFilter = (event, action) => {
        let data = filter.data
        if (action !== "Cancel Filter") {
            for (let i = 0; i < event.length; i++) {
                let a = filteredValue[event[i]]
                if (a.length)
                    data = data.filter((e) => { return a.indexOf(e[customFilterProps[event[i]].Dimensions]) !== -1 })

            }
        }

        paramfn({ 'data': data, 'isFiltered': action })
        console.log('filterValue', data);
    }
    return (
        <>
            {filter.filterSwatch &&
                <div className="col-lg-12 filterDiv" >
                    <>
                        <div className="row col-xs-12 col-sm-12 col-md-4 col-lg-12 inputfield row1-container borderdivstyle" style={{ margin: "10px 2px 10px -3px" }}>
                            <div className="col-lg-12 borderstyle">
                                <div className="col-lg-8" style={{ display: 'contents' }}>Filter</div>
                            </div>
                            <div className="Prt-filteredProp">
                                {filterProps.map((e) => (
                                    <div className="filteredProp">{e}</div>
                                ))}
                            </div>
                            {(() => {
                                let Item = [];
                                for (let a in customFilterProps) {
                                    if (customFilterProps[a] !== undefined) {
                                        Item.push(
                                            <>
                                                <FormControl sx={{ m: 1, paddingRight: 2, width: 300 }}>
                                                    <InputLabel id="filter">{customFilterProps[a].Dimensions}</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        multiple
                                                        //value={[1,2,3]}
                                                        value={filteredValue[a] === undefined ? [] : filteredValue[a]}
                                                        name={a}
                                                        onChange={handleChange}
                                                        input={<OutlinedInput label="Tag" />}
                                                        renderValue={(selected) => {
                                                            return selected.join(', ')
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {customFilterProps[a][customFilterProps[a].Dimensions].map((name) => (
                                                            <MenuItem key={name} value={name}>
                                                                <Checkbox checked={filteredValue[a] === undefined ? false : filteredValue[a].indexOf(name) > -1} />
                                                                <ListItemText primary={name} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </>
                                        )
                                    }
                                }
                                if (Item.length === 0) {
                                    Item.push(
                                        <div className="col-lg-12 ">
                                            Please select any columns from the Dimensions
                                        </div>
                                    )
                                }
                                return Item

                            })()}

                        </div>
                        <div className="row col-sm-12 col-md-12 col-lg-12" style={{ margin: '10px 0px 10px 0px' }}>
                            <div className="row col-sm-12 col-md-6 col-lg-6">
                                <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { handleFilter(Object.keys(filteredValue), 'Apply Filter') }}>
                                    Apply Filter
                                </Button>
                            </div>
                            <div className="row col-sm-12 col-md-6 col-lg-6">
                                <Button id="saveTemp" variant="contained" className='input-field button' style={{ backgroundColor: '#6282b3', lineHeight: '1rem' }} onClick={(e) => { handleFilter(Object.keys(filteredValue), 'Cancel Filter') }}>
                                    cancel
                                </Button>
                            </div>
                        </div>
                    </>
                </div>
            }
        </>
    )
}
export default DashboardFilter