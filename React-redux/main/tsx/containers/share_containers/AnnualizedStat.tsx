import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as toastr from 'toastr';
import { processAnnualizedTableData, generateKey } from "../../../utills/common";
import { GRAPH_COLOR_SERIES } from "../../constants/constant";
import { setAnnualizedTimeFrame, setAnnualizedData, fetchAddAnnualizedDataFromLIMA } from "../../actions/annualized.action";
import AddBenchMarkFund from './AddBenchMarkFund';
import { getFunds } from '../../selectors/funds.selector';
import Fund from '../../models/fund';
import Benchmark from '../../models/benchmark';
import { getBenchmarks } from '../../selectors/benchmark.selector';

class AnnualizedStats extends React.Component<any, any>{


    componentDidMount() {
        this.props.actions.setAnnualizedData(this.props.data.plotData || []);
        this.props.actions.setAnnualizedTimeFrame(((this.props.data.plotMetaData.timeFrame || {}).active || 3));
        this.registerDateControlEventHandlers();
    }

    getFundIdsInSeries(): number[] {
        const allFunds: Fund[] = this.props.funds;
        const fundsInSeries = this.props.storeData.filter(chartItem => chartItem.entityType === 'fund');
        const fundIds: number[] = [];
        for (let fundInSeries of fundsInSeries) {
            const { fundRunnerId } = fundInSeries;
            const fundFound = allFunds.find(fund => fund.fundRunnerId === fundRunnerId);
            if (fundFound) {
                fundIds.push(fundFound.fundId);
            }
        }

        return fundIds;
    }

    getBenchmarkIdsInSeries(): number[] {
        const allBenchmarks: Benchmark[] = this.props.benchmarks;
        const benchmarksInSeries = this.props.storeData.filter(chartItem => chartItem.entityType === 'benchmark');
        const benchmarkIds: number[] = [];
        for (let benchmarkInSeries of benchmarksInSeries) {
            const { fundRunnerId } = benchmarkInSeries;
            const benchmarkFound = allBenchmarks.find(benchmark => benchmark.fundRunnerId === fundRunnerId);
            if (benchmarkFound) {
                benchmarkIds.push(benchmarkFound.benchmarkId);
            }
        }

        return benchmarkIds;
    }

    renderTableContent(content) {

        let tableContent = (Object.values(content)).map((value, index) => {
            let tdContent = (value as any[]).map((v, i) => {
                return <td key={index + '_' + i}>{v}</td>
            })
            return <tr key={index}>{tdContent}</tr>
        })

        

        return tableContent;
    }

    registerDateControlEventHandlers() {
        let $from = $("#from" + this.props.id) as any,
        $to = $("#to" + this.props.id) as any;
        let _self: AnnualizedStats = this;
    
        $from.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onSelect: function (date) {
                _self.getAnnualStatFromLima(event, { from: date });                
            }
        }).on("change", function () {
            $to.datepicker("option", "minDate", $from.val());
        });
        $to.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onSelect: function (date) {
                _self.getAnnualStatFromLima(event, { to: date });                
            }
        }).on("change", function () {
            $from.datepicker("option", "maxDate", $to.val());
        });
    }

    renderTableHeader(data) {
        let chartColor = GRAPH_COLOR_SERIES;
        let header = data.map((value, index) => {
            return <th key={index}><div className="square-ticker-annualized" style={{ backgroundColor: chartColor[index] }}></div>{value["title"]}</th>
        })
        return [<th key={-1}></th>, header]
    }

    renderTableTimeFrame() {
        let activeTimeFrame = this.props.selectedTimeFrame;
        return (
            <div className="container no-padding">
                <div className="blank-space-25"></div>
                <div className="content-area">
                    <div className="timeframe graph-timeframe">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav highchart-timeframe-container">
                            <div className={activeTimeFrame == 1 ? 'active' : ''}>
                                <a href="#" data-year="1" onClick={(e) => this.changeTableTimeFrame(e)}>1 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 3 ? 'active' : ''}>
                                <a href="#" data-year="3" onClick={(e) => this.changeTableTimeFrame(e)}>3 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 5 ? 'active' : ''}>
                                <a href="#" data-year="5" onClick={(e) => this.changeTableTimeFrame(e)}>5 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 10 ? 'active' : ''}>
                                <a href="#" data-year="10" onClick={(e) => this.changeTableTimeFrame(e)}>10 yr</a>
                            </div>
                            <div className="dateRange">
                                <h3>COMMON DATE RANGE</h3>
                                <input type="text" id={"from" + this.props.id} className="datepicker" name="from" defaultValue="12/13/2013" /> -
                                <input type="text" id={"to" + this.props.id} className="datepicker" name="to" defaultValue="12/13/2015"  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // onClick={(e) => this.getAnnualStatFromLima(e)} 
    // onClick={(e) => this.getAnnualStatFromLima(e)
    getAnnualStatFromLima(event, opts) {
        event.preventDefault();
        let $el = $(event.target);
        let $from = opts.from || ($("#from" + this.props.id).val() || "").toString();
        let $to = opts.to || ($("#to" + this.props.id).val() || "").toString();
        let params = {
            fundIds: this.getFundIdsInSeries(),
            benchmarkIds: this.getBenchmarkIdsInSeries(),
            fromDate: $from,
            toDate: $to
        }
        this.props.actions.fetchAddAnnualizedDataFromLIMA(params);
        // this.props.storeData//
       // this.props.actions.setAnnualizedData(limaData);
       // $el.parents("#" + this.props.id);
    }

    getDefaultFromDate() {
        let allChartSeries = this.props.storeData || [];
        let fromDateLabel: any = [];
        allChartSeries.forEach(function (val, index) {
            fromDateLabel.push(val.series[0][0]);
        });
        // return moment(Math.max.apply(Math, fromDateLabel)).format('MM/DD/YYYY');;
    }

    getDefaultToDate() {
        let allChartSeries = this.props.storeData || [];
        let toDateLabel = null;
        allChartSeries.forEach(function (val, index) {
            if (!toDateLabel) {
                // toDateLabel = moment(val.series[val.series.length - 1][0]).format('MM/DD/YYYY');
            }
        });
        return toDateLabel;
    }


    changeTableTimeFrame(event) {
        event.preventDefault();
        let $el = $(event.target);
        let selectedYear = parseInt(($el.attr('data-year') || "0"));
        this.props.actions.setAnnualizedTimeFrame(selectedYear);
        $el.parents("#" + this.props.id)
    }

    removeTableSeries(event) {
        event.preventDefault();
        let $el = $(event.target);
        let $selectedUnit = $el.parents(".cloneUnit");
        let getTableSeriesID = $selectedUnit.attr("data-series") || "-";
        let revisedData = (this.props.storeData).filter((filterValue) => {
            return (filterValue.title != getTableSeriesID)
        });
        this.props.actions.setAnnualizedData(revisedData);
    }

    renderTicker() {
        let data = this.props.storeData;
        let graphContainerId = this.props.id;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphIndicator = data.map((val, key) => {
            if (!(val.initialHideOnGraph || false))
                return (
                    <div key={generateKey("GraphvalueIndicator_" + val.title)} className="unit d-none cloneUnit pull-left" data-series={val.title} style={{ margin: '10px' }}>
                        <div className="blue box" style={{ backgroundColor: chartColor[key] }}></div>
                        <h4 className="no-margin">{val.title}</h4>
                        {key > 0 ? <div className="close-icon" onClick={(e) => this.removeTableSeries(e)}></div> : null}
                    </div>
                );
        });
        return [...graphIndicator, (this.props.data.plotMetaData.addBenchmarkFund) ? this.renderAddBenchMark() : false];
    }

    renderAddBenchMark() {
        return <AddBenchMarkFund key={this.props.id} chartId={this.props.id} />
    }

    render() {

        if (this.props.loading) {
            return (
                <h2>Data To be render</h2>
            );
        }
        let data = this.props.storeData;
        let selectedTimeFrame = this.props.selectedTimeFrame; // reducer approched since data is club in one file 
        let tableData = data.map((value, index) => {
            if(selectedTimeFrame) {
                return (value[selectedTimeFrame] ? value[selectedTimeFrame]['series'] : []); // change 1 to selected timeFrame logic
            } else {
                return (value.custom ? value.custom['series'] : []); 
            }
            
        })
        tableData = processAnnualizedTableData(tableData, selectedTimeFrame) || {};
        return (
            <div className="no-padding" id={this.props.id}>
                {this.renderTableTimeFrame()}
                {this.renderTicker()}
                <div className="blank-space-54"></div>
                <h3 className="table-title no-margin">{this.props.data.title || ""}</h3>
                <div className="blank-space-25"></div>
                <div className="table-responsive col-lg-12 no-padding">
                    <table className="table table-hover data-table-common col-lg-12 col-md-12 col-sm-12 no-padding no-margin">
                        <thead>
                            <tr>
                                {this.renderTableHeader(data)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableContent(tableData)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        benchmarks: getBenchmarks(state),
        funds: getFunds(state),
        selectedTimeFrame: state.annualizedStats.selectedTimeFrame,
        storeData: state.annualizedStats.annualizedData || [],
        loading: state.annualizedStats.loading
    }
}

const mapStateToDispatch = (dispatch) => {
    return {
        actions: bindActionCreators({ setAnnualizedTimeFrame: setAnnualizedTimeFrame, setAnnualizedData: setAnnualizedData, fetchAddAnnualizedDataFromLIMA: fetchAddAnnualizedDataFromLIMA }, dispatch)
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(AnnualizedStats);