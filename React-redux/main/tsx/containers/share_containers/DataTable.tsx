import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { generateKey } from "../../../utills/common";
// import { fetchTableMockData } from '../../actions/timeframe.action';

import DataTables from './DataTables';
import DataTablesModal from './DataTablesModal';

class DataTable extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state = {
            tablePopup: null,
            tablePopupTitle: null
        };
    }

    createTablePopup(table, title) {
        const tablePopup = <DataTablesModal table={table} title={title} />;
        this.setState({
            tablePopup,
            tablePopupTitle: title
        });
    }

    renderTableHeader() {
        let headerData = this.props.data.headers || [];
        return headerData.map((val, index) => {
            return (
                <th key={index} className="col-lg-2 col-md-2 text-uppercase">{val}</th>
            );
        })
    }

    renderTableContent() {
        let rowData = this.props.data.rows || [];
        let AllRowData = rowData.map((val, index) => {
            const { subTables } = val;
            let allCellData = (val || []).data.map((value, innerIndex) => {
                if (subTables && innerIndex === 0) {
                    // if subtable is present, then we need to create a link in the first column of the current row
                    const oldValue = value;
                    value = (
                        <div>
                            <span>{value}</span><br />
                            <a onClick={e => this.createTablePopup(subTables, oldValue)} style={{ cursor: 'pointer' }}>Details</a>
                        </div>
                    );

                    return (
                        <td key={generateKey(value.data)} className={(!isNaN(value) ? "text-center" : "text-left")}>{value}</td>
                    );
                }

                return (
                    <td key={generateKey(value.data)} className={(!isNaN(value) ? "text-center" : "text-left")} dangerouslySetInnerHTML={{ __html: value }}></td>
                );
            });
            return <tr data-rownumber={index + 1} key={generateKey("")}>{allCellData}</tr>;
        });

        return AllRowData;
    }
    render() {
        const { tablePopup } = this.state;
        return (
            <div className="no-padding">
                <div className="blank-space-54"></div>
                <h3 className="table-title no-margin">{this.props.data.title || ""}</h3>
                <div className="blank-space-25"></div>
                <div className="table-responsive col-lg-12 no-padding">
                    <table className="table table-hover data-table-common col-lg-12 col-md-12 col-sm-12 no-padding no-margin" id={this.props.id + "_dataTable"}>
                        <thead>
                            <tr>{this.renderTableHeader()}</tr>
                        </thead>
                        <tbody>{this.renderTableContent()}</tbody>
                    </table>
                    {tablePopup}
                </div>
            </div>
        );

    }
}
export default DataTable;