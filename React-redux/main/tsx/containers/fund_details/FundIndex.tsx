import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'datatables.net';

import { fetchFundIndex } from "../../actions/fundIndex.action";
import { isObjEmpty } from "../../../utills/common";
import { NavLink } from "react-router-dom";
import { URL_CONFIG } from "../../constants/constant";
import { Settings } from 'http2';

class FundIndex extends React.Component<any, any>{

    componentDidMount() {
        this.props.actions.fetchFundIndex();
    }

    componentDidUpdate() {
        if (!isObjEmpty((this.props.fundIndexData) ? this.props.fundIndexData.fundIndexData : []))
            this.createDataTable();
    }

    createDataTable() {
        const $dataTables = $('#fundIndexTable');
        const dataTableSettings  ={
            searching: true,
            responsive: true,
            paging: false,
            sorting: false,
            ordering: false,
            info: false,
            // initComplete: function () {
            //     let _self =this;
            //     _self.api().columns([1, 3]).every(function () {
            //         let column: any = this;
            //         console.log("columns");
                    
            //         let select = $('<select><option value=""></option></select>')
            //             .appendTo($(column.footer()).empty())
            //             .on('change', function () {
            //                 let val =$(this).val();

            //                 column
            //                     .search(val ? '^' + val + '$' : '', true, false)
            //                     .draw();
            //             });

            //         column.data().unique().sort().each(function (d, j) {
            //             select.append('<option value="' + d + '">' + d + '</option>')
            //         });
            //     });
            // }
            // "order": [[ 0, "desc" ]]
            // rowGroup: {
            //     dataSrc: 'Year'
            // }
        };

        // $dataTables.DataTable(dataTableSettings);
    }
    generateTableContent() {
        let data = this.props.fundIndexData.fundIndexData.FundList || [];
        return data.map((val, index) => {
            return (
                <tr>
                    <td>
                        <span><i className="fa fa-star"></i></span>
                        <NavLink className="col-xs-12" exact to={"/funds/fundId/" + URL_CONFIG.FUND_DETAILS.OVERVIEW}>
                            {val.fundName}</NavLink>
                        {/* <a href="">{val.fundName}</a> */}
                    </td>
                    <td>{val.style}</td>
                    <td>{val.fundAUM}</td>
                    <td>{val.inceptionDate}</td>
                    <td>{val.geographicFocus}</td>
                    <td>{val.performance}</td>
                    <td>{val.volatility}</td>
                    <td><i className="fa fa-plus-circle"></i></td>
                </tr>
            )
        });
    }


    render() {

        if (this.props.fundIndexData.loading)
            return (
                <h1>Loading data</h1>
            );
        let allFundsLength = (this.props.fundIndexData.fundIndexData.FundList || []).length;
        return (

            <div id="fundIndexTableWrap" className="container fundIndexTableWrap">
                <div className="blank-space-50"></div>
                <ul className="nav nav-tabs">
                    <li className="active"><a data-toggle="tab" href="#allFunds">All Funds({allFundsLength}) </a></li>
                    <li><a data-toggle="tab" href="#holding">Holdings</a></li>
                    <li><a data-toggle="tab" href="#favourites">Favorites</a></li>
                </ul>
                <div className="tab-content">
                    <div id="allFunds" className="tab-pane fade in active">
                        <table id="fundIndexTable" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Fund</th>
                                    <th>STRATEGY</th>
                                    <th>FUND AUM</th>
                                    <th>INCEPTION DATE</th>
                                    <th>GEOGRAPHIC FOCUS</th>
                                    <th>PERFORMANCE since Inception</th>
                                    <th>VOLITILITY since Inception</th>
                                    <th>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.generateTableContent()}
                            </tbody>
                        </table>
                    </div>
                    <div id="holding" className="tab-pane fade">
                        <table id="" className="table table-bordered ">
                            <thead>
                                <tr>
                                    <th>Fund</th>
                                    <th>STRATEGY</th>
                                    <th>FUND AUM</th>
                                    <th>INCEPTION DATE</th>
                                    <th>GEOGRAPHIC FOCUS</th>
                                    <th>PERFORMANCE since Inception</th>
                                    <th>VOLITILITY since Inception</th>
                                    <th>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {this.generateTableContent()} */}
                            </tbody>
                        </table>
                    </div>
                    <div id="favourites" className="tab-pane fade">
                        <table id="" className="table table-bordered ">
                            <thead>
                                <tr>
                                    <th>Fund</th>
                                    <th>STRATEGY</th>
                                    <th>FUND AUM</th>
                                    <th>INCEPTION DATE</th>
                                    <th>GEOGRAPHIC FOCUS</th>
                                    <th>PERFORMANCE since Inception</th>
                                    <th>VOLITILITY since Inception</th>
                                    <th>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {this.generateTableContent()} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }


}
const mapStateToProps = (state, props) => {
    return {
        fundIndexData: state.fundIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ fetchFundIndex: fetchFundIndex }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundIndex);