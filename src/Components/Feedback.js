import React, { useCallback, useEffect } from "react";
import MUIDataTable from "mui-datatables";
const Feedback = ({ params }) => {
    if (params[0] === undefined) params = [{}]
    const KnownIssues = [
        { 'Reported By': 'Venky', 'Issue': 'Perfomance Issue' },
        { 'Reported By': 'Xavier', 'Issue': 'Few more validations needs to be added in the part dashboard filtering' },
        { 'Reported By': 'Venky', 'Issue': 'UI Design beautifing' },
    ]
    const cols = [{ name: 'Reported By' }, { name: 'Issue' }]
    const options = {
        filter: false,
        filterType: "multiselect",
        responsive: "scroll",
        selectableRows: false,
        useDisplayedRowsOnly: true,
        download: false, // set download option
        print: false, // set print option
        viewColumns: false, // set column option
        NoRowsOverlay: 'no'
    };
    return (
        <>
            <div className="row col-lg-12" style={{ marginTop: '10px' }}>
                <div className="col-lg-6 feedback" >
                    <div style={{ height: 'calc(100vh - 305px)' }}>
                        <MUIDataTable
                            id='dataset'
                            title={"Feedback"}
                            data={params}
                            columns={cols}
                            options={options}
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div style={{ height: 'calc(100vh - 165px)' }}>
                        <MUIDataTable
                            id='dataset'
                            title={"Know Issues"}
                            data={KnownIssues}
                            columns={cols}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Feedback