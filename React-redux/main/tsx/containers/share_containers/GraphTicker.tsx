import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

// import { addSeries, removeSeries } from '../../actions/lineChart.action';
import { GRAPH_COLOR_SERIES } from "../../constants/constant";
import { generateKey } from "../../../utills/common";
class GraphTicker extends React.Component<any, any> {

    renderTicker() {
        let data = this.props.chart || [];
        let graphContainerId = this.props.id;
        let chartColor = GRAPH_COLOR_SERIES;
        return data.map((val, key) => {
            return (
                <div key={generateKey("GraphvalueIndicator_" + val.title)} className="unit d-none cloneUnit pull-left" data-series={val.title} style={{ margin: '10px' }}>
                    <div className="blue box" style={{ backgroundColor: chartColor[key] }}></div>
                    <h4 className="no-margin">{val.title}</h4>
                    <div className="number d-flex align-items-end legend1" id={'series-' + graphContainerId + key + '-point'}>0</div>
                    <div className="close-icon"></div>
                </div>
            );
        })
    }
    renderAddBenchMark() {
        return (
            <div className="buttonHolder">
                <span className="addButton" data-toggle="modal" data-target=".rap_modal">Add Benchmark/Fund</span>
                <div className="modal fade rap_modal" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <header>

                                <h3 className="title">Select benchmarks & funds</h3>
                                <h3 className="rowSelected"></h3>
                                <button type="button" className="btn btn-link seeall">See all</button>

                                <span className="modal-buttonUnit">
                                    <button type="button" className="btn btn-light applyButton" data-dismiss="modal" aria-label="Close">Apply</button>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">
                                            <img src="images/thin-close.svg" width="22" height="22" />
                                        </span>
                                    </button>
                                </span>
                            </header>
                            <div className="sandbox">
                                <div className="content-area1">
                                    <div className="d-flex p-2 flex-row-reverse border-bottom-1">
                                        <a href="" className="">Clear all</a>
                                    </div>
                                    <div className="d-flex sandbox-list cloneUnit">
                                        <div className="p-1 ">
                                            <img src="images/favorite.svg" />
                                        </div>
                                        <div className="p-2 seriesName"></div>
                                        <div className="ml-auto p-1 ">
                                            <img src="images/clear-dark.svg" className="remove-icon" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="secondarynav">
                                <ul className="d-flex flex-row align-items-center">
                                    <li className="wp active"><a>Benchmarks</a>
                                    </li>
                                    <li className="wp">
                                        <a href="">Funds</a>
                                    </li>
                                    <li className="wp">
                                        <a href="#">Portfolio</a>
                                    </li>
                                </ul>
                            </div>
                            <div>

                            </div>
                            <div className="row1">
                                <div className="col1">
                                    <div className="w-90 filter-container" style={{ backgroundColor: '#eee' }}>
                                        <div className="float-left">
                                            <div className="dropdown trans-dropdown">
                                                <button className="btn  dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Choose a filter set
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a className="dropdown-item" href="#">Action</a>
                                                    <a className="dropdown-item" href="#">Another action</a>
                                                    <a className="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="float-right ">
                                            <button type="button" className="btn btn-outline-primary blue filter-benchmark float-right mr-2">Filter</button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="content-area1">
                                <ul className="tabs">
                                    <li className="tab-link current" data-tab="tab-1">All Benchmarks</li>
                                    <li className="tab-link" data-tab="tab-2">Holdings</li>
                                    <li className="tab-link" data-tab="tab-3">Favorites</li>

                                </ul>

                                <div id="tab-1" className="tab-content current">
                                    <div className="row">
                                        <div className="col">

                                            <table id="benchmarkTable" className="table table-striped table-bordered popuptable">
                                                <thead>
                                                    <tr>

                                                        <th scope="col"> Benchmarks</th>
                                                        <th scope="col" style={{ width: '140px' }}>Inception date</th>
                                                        <th scope="col">Geographic focus</th>
                                                        <th scope="col" className="text-center">Performance</th>
                                                        <th scope="col" className="text-center">Volatility</th>
                                                        <th scope="col">
                                                            <span className="addButton"></span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                                <div id="tab-2" className="tab-content">
                                    <div className="row">
                                        <div className="col">

                                            <table id="holdingBenchmarks" className="table table-striped table-bordered popuptable">
                                                <thead>
                                                    <tr>

                                                        <th scope="col">
                                                            <span>

                                                            </span>Benchmarks</th>
                                                        <th scope="col" style={{ width: '140px' }}>Inception date</th>
                                                        <th scope="col">Geographic focus</th>
                                                        <th scope="col">Performance</th>
                                                        <th scope="col">Volatility</th>

                                                        <th scope="col">
                                                            <span className="addButton"></span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                                <div id="tab-3" className="tab-content">
                                    <div className="row">
                                        <div className="col">

                                            <table id="favouriteBenchmarks" className="table table-striped table-bordered popuptable">
                                                <thead>
                                                    <tr>

                                                        <th scope="col"> Benchmarks</th>
                                                        <th scope="col" style={{ width: '140px' }}>Inception date</th>
                                                        <th scope="col">Geographic focus</th>
                                                        <th scope="col" className="text-center">Performance</th>
                                                        <th scope="col" className="text-center">Volatility</th>
                                                        <th scope="col">
                                                            <span className="addButton"></span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="d-flex flex-row flex-wrap addUnit no-padding no-margin">
                {this.renderTicker()}
                {(this.props.benchmark) ? this.renderAddBenchMark() : false}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        chart: props.graphData || []
    }
}
export default connect(mapStateToProps)(GraphTicker)

