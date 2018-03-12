import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DataTable from './DataTable';
import { generateKey, widthBasedBootstrapClass } from "../../../utills/common";

class DataTables extends React.Component<any, any>{

    renderTable() {
        let AllTableData = this.props.TableData || [];
        return AllTableData.map(val => <DataTable key={generateKey("data")} data={val} width={this.props.width} id={this.props.id} />);
    }
    render() {

        if (this.props.TableData.loading) {
            return (
                <h2 data-component-id={this.props.dataToRetrieve}>No Data Found</h2>
            )
        }

        let bootStrapClass = widthBasedBootstrapClass(this.props.width);
        if (this.props.width == undefined) bootStrapClass = "no-padding";
        return (
            <div className={bootStrapClass} data-component-id={this.props.dataToRetrieve}>
                <div className="blank-space-10"></div>
                {this.renderTable()}
            </div>
        );

    }
}

let mapStateToProps = (state, props) => {
    let dataToRender = props.data;
    return {
        TableData: dataToRender
    }
}
export default connect(mapStateToProps)(DataTables);