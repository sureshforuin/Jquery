import * as Highcharts from 'highcharts/highstock';
import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as groupBy from 'lodash/groupBy';
import { isObjEmpty, getHistoricalReturnsModifiedSeries, highLightDataTableBands, generateKey, getHiddenHistoricSeries, getVisibleHistoricSeries, updateHistoricalReturnsNumber, disableDataTableRDBands, enableDataTableRDBands } from "../../../utills/common";
import GraphDataTable from "./GraphDataTable";
import AddBenchMarkFund from './AddBenchMarkFund';
import { GRAPH_COLOR_SERIES } from "../../constants/constant";
import { bindActionCreators } from "redux";
import { setSeriesData, fetchHistoricData, removeGraphSeriesFromStore, setHistoricTimeFrame, toogleBandAction } from "../../actions/historicReturn.action";

interface HiddenSeriesObject {
    hide: () => void,
    setData: (data: any[][], redraw?: boolean, animation?: boolean, updatePoints?: boolean) => any,
    show: () => void,
    visible: boolean,
    xData: number[],
    yData: number[]
}

class HistoricalReturns extends React.Component<any, any>{
    selectedTimeFrame: number;
    chartColor = GRAPH_COLOR_SERIES;
    chartObj: any;
    hiddenSeries: HiddenSeriesObject[];
    hiddenSeriesStore = [];

    constructor(props) {
        super(props);
        this.getSeries = this.getSeries.bind(this);
        this.getDefaultTickerValues = this.getDefaultTickerValues.bind(this);
        this.getTableYear = this.getTableYear.bind(this);
        this.collapseRows =this.collapseRows.bind(this);
    }

    componentDidMount() {
        this.props.actions.setSeriesData(this.props.childContentData.plotData || []);
        if (!isObjEmpty(this.props.storeSeries))
            this.renderHighChart();

        (window as any).Highcharts = Highcharts;
        let activeTimeFrame = (this.props.childContentData.plotMetaData.timeFrame || {}).active || 0;
        this.props.actions.setHistoricTimeFrame(this.props.selectedFrequency, activeTimeFrame, {});
    }

    componentDidUpdate() {
        if (!isObjEmpty(this.props.storeSeries)) {
            this.renderHighChart();
            updateHistoricalReturnsNumber();
        }
    }

    renderHighChart() {
        let allChartSeries = Object.assign([], this.props.storeSeries);
        console.log(allChartSeries);

        let chartColor = GRAPH_COLOR_SERIES;
        let graphContainerId = this.props.id;
        let navigator = this.props.childContentData.plotMetaData.navigator || false;
        let navigatorSeries: any = [];
        let chartOption: any;
        let _selfOuter: any = this;

        if (navigator) {
            let VisibleSeries = this.props.visibleStoreSeries;
            navigatorSeries = VisibleSeries.map((val, index) => {
                return { data: val.series, type: val.type, threshold: 0 }
            });

            navigatorSeries = this.getCommonRangeSeries(navigatorSeries);
        }

        chartOption = {
            chart: {
                backgroundColor: null,
                style: {
                    fontFamily: "pf_dintext_proregular",
                    fontSize: "15px"
                },
            },
            title: {
                text: '',
            },
            rangeSelector: {
                selected: 6,
                enabled: false
            },
            navigator: {
                series: navigatorSeries,
                height: 65,
                maskFill: 'rgba(255, 255, 255, 0.6)',
                maskInside: false,
                handles: {
                    width: 16,
                    height: 24,
                    borderColor: "#FFFFFF",
                    backgroundColor: "#005C8F"
                },
                enabled: navigator
            },
            scrollbar: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function () {
                        let _self: any = this;
                        var d = new Date(_self.value);
                        return Highcharts.dateFormat("%b \'%y", _self.value); // just month
                    }
                },
                events: {
                    afterSetExtremes: function (event) {
                        if (!_selfOuter.hiddenSeries || !_selfOuter.hiddenSeries.length || !_selfOuter.hiddenSeries[0].visible) {
                            return;
                        }

                        const { max, min } = event;
                        const visibleSeries = _selfOuter.chartObj.series.filter(serie => serie.userOptions.type !== 'area' && serie.userOptions.id !== 'highcharts-navigator-series');
                        const maxYValues = visibleSeries.map(visibleSerie => Math.max.apply(Math, visibleSerie.processedYData));
                        const maxYValueOverall = Math.max.apply(Math, maxYValues);
                        const minYValues = visibleSeries.map(visibleSerie => Math.min.apply(Math, visibleSerie.processedYData));
                        const minYValueOverall = Math.min.apply(Math, minYValues);

                        for (let hiddenSerie of _selfOuter.hiddenSeries) {
                            const { xData, yData } = hiddenSerie;
                            const newData = yData.map((yData, index) => {
                                const xValue = xData[index];
                                if (yData > 0) {
                                    return [xValue, maxYValueOverall];
                                }

                                if (yData < 0) {
                                    return [xValue, minYValueOverall];
                                }

                                return [xValue, yData];
                            });

                            hiddenSerie.setData(newData, true, false, true);
                        }
                    }
                }
            },
            yAxis: {
                startOnTick: false,
                opposite: false,
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            plotOptions: {
                series: {
                    className: "mySeries",
                    cursor: "pointer",
                    dataGrouping: {
                        enabled: false
                    },
                    tooltip: false,
                    point: {
                        events: {
                            // mouseOver:this.onPointMouseOver
                            mouseOver: function () {
                                //let finalTooltip: String[] = [];
                                let currentTicker: any = [];
                                // let currentDate: number = 0;
                                let _self: any = this;
                                let asOfDateTicker: any;
                                allChartSeries.forEach(function (val, index) {
                                    // currentDate = 0;
                                    if (val.type === 'column') {
                                        let x = val.series.filter(function (value, j) {
                                            return _self.x >= value[0] && _self.x <= val.series[j][0];
                                        });
                                        currentTicker = (x.length > 0 ? x[0][1] : "");
                                        $('#series-' + graphContainerId + index + '-point').text(currentTicker);
                                        if (x.length > 0 && x[0][0]) {
                                            asOfDateTicker = x[0][0];
                                        }
                                        // currentDate = (x.length > 0 ? x[0][0] : "");
                                    }
                                });
                                asOfDateTicker = moment(asOfDateTicker).format("MMM 'YY");
                                $('#asOfDate' + graphContainerId).text('As of Date : ' + asOfDateTicker);
                            }
                        }
                    }
                }
            },
            tooltip: {
                enabled: true,
                shared: false,
                useHTML: true,
                shadow: true,
                borderWidth: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
                formatter: function () {
                    let point: any = this;
                    // No tooltip when hovering over runup and drawdown bands (area chart)
                    if (point.points[0].series.userOptions.type === 'area') {
                        return false;
                    }

                    return Highcharts.dateFormat("%b \'%y", point.x); // just month
                }
            },
            turboThreshold: 0, //2000,
            series: this.getCommonRangeSeries(this.getSeries())

        };
        /* Here we can Customize chart Object eg: chartOption.xAxis*/
        // chartOption.tooltip.enabled = true;

        this.chartObj = Highcharts.stockChart(graphContainerId, chartOption);
        this.hiddenSeries = this.chartObj.series.filter(serie => serie.userOptions.type === 'area');
        this.setChartRange(this.chartObj, this.props.selectedTimeFrame);
        console.log(this.chartObj);
        let $from = $("#from" + graphContainerId) as any,
            $to = $("#to" + graphContainerId) as any;
        let _self: any = this;
        $from.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onSelect: function (date) {
                _self.changeGraphTimeFrame(event, { from: date });
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
                _self.changeGraphTimeFrame(event, { to: date });
            }
        }).on("change", function () {
            $from.datepicker("option", "maxDate", $to.val());
        });

    }
    setChartRange(charObj, selectedTimeFrameObj, caculationSeries?) {

        let yearCount = selectedTimeFrameObj.year;
        let opts = selectedTimeFrameObj.other;
        let max;
        let min;
        if ((opts.from) || (opts.to)) {
            min = moment(opts.from || ($("#from" + this.props.id).val() || "").toString()).valueOf();
            max = moment(opts.to || ($("#to" + this.props.id).val() || "").toString()).valueOf();
        } else if (yearCount) {
            max = charObj.xAxis[0].max;
            min = moment(max).add(-yearCount, 'years').valueOf();
        } else {
            min = null;
            max = null;
        }

        /* manually setting chart time frame */
        // if (min && max) {
        charObj.xAxis[0].setExtremes(min, max);
        // }
    }

    changeGraphTimeFrame(event, opts) {
        const { from, to } = opts;
        event.preventDefault();
        let $el = $(event.target);
        $el.parent().addClass("active");
        $el.parent().siblings().removeClass("active");
        let selectedYear = parseInt(($el.attr('data-year') || "0"));
        /*change toime frame event :- manually setting chart time frame */
        this.props.actions.setHistoricTimeFrame(this.props.selectedFrequency, selectedYear, { from, to });
    }

    getSeries() {
        /* no caculative graph */
        let allSeries = [...this.props.visibleStoreSeries, ...this.props.hiddenStoreSeries].map((val, index) => {
            const hcSeries = {
                id: val.title,
                data: val.series,
                type: val.type,
                color: val.color ? val.color : this.chartColor[index],
                showInNavigator: false,
                // visible: !(val.initialHideOnGraph || false),
                visible: (!val.initialHideOnGraph || this.props.toggleStatus == "enabled" ? true : false),
                threshold: val.threshold || 0,
                negativeColor: val.negativeColor || null,
                fillOpacity: val.opacity || 1,
                lineWidth: val.lineWidth,
                marker: val.marker ? val.marker : {},
                zIndex: val.type === 'area' ? 0 : 1,
                // Disbale mouse tracking (mouse events like tooltip, click etc) on the runup and drawdown bands (area chart)
                enableMouseTracking: val.type !== 'area'
            };
            if (val.initialHideOnGraph) {
                hcSeries["dataLabels"] = {
                    enabled: true,
                    align: 'right',
                    overflow: 'none',
                    formatter: function () {
                        // console.log(this.point);
                        // return this.point.category;
                        return 1;
                    },
                    y: 10,
                    borderRadius: 0,
                    borderWidth: 0,
                    color: "#FFFFFF",
                    backgroundColor: (val.series[0][1] >= 0 ? "#2C8E77" : "#B3415C"),
                }
            }


            if (this.hiddenSeriesStore.length < 2 && val.type === 'area') {
                this.hiddenSeriesStore.push(hcSeries);
            }

            return hcSeries;
        });
        if (!this.props.hiddenStoreSeries.length && this.hiddenSeriesStore && !allSeries.some(serie => serie.type === 'area')) {
            allSeries = [...this.hiddenSeriesStore, ...allSeries];
        }

        return allSeries;
    }

    getCommonRangeSeries(series: any[]) {
        const visibleSeries = series.filter(serie => serie.type !== 'area');
        const startDates = visibleSeries.map(serie => serie.data[0][0]);
        const commonStartDate = Math.max.apply(Math, startDates);
        for (let serie of series) {
            serie.data = serie.data.filter(data => commonStartDate <= data[0]);
        }

        return series;
    }


    renderGraphTimeFrame() {
        let activeTimeFrame = (this.props.childContentData.plotMetaData.timeFrame || {}).active || 0;
        return (
            <div className="container no-padding">
                <div className="blank-space-25"></div>
                <div className="content-area">
                    <div className="timeframe graph-timeframe">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav highchart-timeframe-container">
                            <div className={activeTimeFrame == 1 ? 'active' : ''}>
                                <a href="#" data-year="1" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 1 })}>1 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 3 ? 'active' : ''}>
                                <a href="#" data-year="3" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 3 })}>3 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 5 ? 'active' : ''}>
                                <a href="#" data-year="5" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 5 })}>5 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 10 ? 'active' : ''}>
                                <a href="#" data-year="10" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 10 })}>10 Yr</a>
                            </div>
                            <div className="dateRange">
                                <h3>COMMON DATE RANGE</h3>
                                <input type="text" id={"from" + this.props.id} className="datepicker" name="from" defaultValue={this.getDefaultFromDate()} /> -
                                <input type="text" id={"to" + this.props.id} className="datepicker" name="to" defaultValue={this.getDefaultToDate()} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4> <div id={"asOfDate" + this.props.id}> As of Date : {this.getDefaultAsOfDate()} </div></h4>
                </div>
            </div>
        )
    }

    getDefaultAsOfDate() {
        let allChartSeries = this.props.storeSeries || [];
        let toDateLabel = null;
        allChartSeries.forEach(function (val, index) {
            if (!toDateLabel) {
                toDateLabel = moment(val.series[val.series.length - 1][0]).format("MMM 'YY");
            }
        });
        return toDateLabel;
    }

    getDefaultTickerValues(chartObj, seriesNum) {
        if (chartObj) {
            let allChartSeries = chartObj.series || [];
            let tickerVal: any;
            allChartSeries.forEach(function (val, index) {
                if (index === seriesNum) {
                    tickerVal = val.yData[val.yData.length - 1].toFixed(4);
                }
            });
            return tickerVal;
        } else {
            return null;
        }
    }

    getDefaultFromDate() {
        let allChartSeries = this.props.visibleStoreSeries || [];
        let fromDateLabel: any = [];
        allChartSeries.filter(series => series.type === 'column').forEach(function (val, index) {
            fromDateLabel.push(val.series[0][0]);

        });
        return moment(Math.max.apply(Math, fromDateLabel)).format('MM/DD/YYYY');;
    }

    getDefaultToDate() {
        let allChartSeries = this.props.storeSeries || [];
        let toDateLabel = null;
        allChartSeries.filter(series => series.type === 'column').forEach(function (val, index) {
            if (!toDateLabel) {
                toDateLabel = moment(val.series[val.series.length - 1][0]).format('MM/DD/YYYY');
            }
        });
        return toDateLabel;
    }



    removeGraphSeries(event) {
        event.preventDefault();
        let $el = $(event.target);
        let $selectedUnit = $el.parents(".cloneUnit");
        let getChartSeriesID = $selectedUnit.attr("data-series") || "-";
        this.props.actions.removeGraphSeriesFromStore(getChartSeriesID, this.props.selectedFrequency, this.props.selectedTimeFrame);
    }

    renderTicker() {
        let data = this.props.visibleStoreSeries || [];
        let graphContainerId = this.props.id;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphIndicator = data.map((val, key) => {
            if (!(val.initialHideOnGraph || false))
                return (
                    <div key={generateKey("GraphvalueIndicator_" + val.title)} className="unit d-none cloneUnit pull-left" data-series={val.title} data-key={key} style={{ margin: '10px' }}>
                        <div className="blue box" style={{ backgroundColor: chartColor[key] }}></div>
                        <h4 className="no-margin">{val.title}</h4>
                        <div className="number d-flex align-items-end legend1" id={'series-' + graphContainerId + key + '-point'}>{this.getDefaultTickerValues(this.chartObj, key)}</div>
                        {key > 0 ? <div className="close-icon" onClick={(e) => this.removeGraphSeries(e)}></div> : null}
                    </div>
                );
        });
        return [...graphIndicator];
    }
    renderAddBenchMark() {
        return <AddBenchMarkFund chartId={this.props.id} childContentData={this.props.childContentData} selectedChartFrequency={this.props.selectedFrequency} selectedTimeFrame={this.props.selectedTimeFrame} callback={this.collapseRows} />
    }
    renderGraphTableIcons(requiredhistoricDataTable) {
        if (requiredhistoricDataTable) {
            return (
                <div className="chart-unit d-flex justify-content-between">
                    <div className="select-style">
                        <select id="chartFrequency" onChange={(event) => { this.changeSeriesBasedOnTime(event) }}>
                            <option value="1">Monthly</option>
                            <option value="3">Quarterly </option>
                            <option value="6">Semi Annually</option>
                        </select>
                    </div>
                    <div>
                        <div className="graph showBox active" data-area="chart"></div>
                        <div className="plotband showBox" data-area="table"></div>
                    </div>
                </div>
            );
        }

        return false;
    }

    renderGraphTicker() {
        return (
            <div>
                {this.renderTicker()}
                {(this.props.childContentData.plotMetaData.addBenchmarkFund) ? this.renderAddBenchMark() : false}
            </div>
        );
    }


    renderGraphDataTable(data) {
        return <GraphDataTable data={data} hiddenSeries={this.props.hiddenStoreSeries} refChartId={this.props.id} selectedFrequency={this.props.selectedFrequency} selectedTimeFrame={this.props.selectedTimeFrame} highlightBands={this.props.toggleStatus} id={this.props.id} />;
    }

    collapseRows() {
        const tableRows = $('#historicalTable tbody').find('tr');
        const tableRowsByYear: any[] = groupBy(tableRows, this.getTableYear);
        for (let yearItem of Object.values(tableRowsByYear)) {
            for (let index = 1; index < yearItem.length; index++) {
                $(yearItem[index]).css({
                    display: 'none'
                });
            }
        }
    }

    getTableYear(jqObj) {
        return $(jqObj).attr('data-year');
    }

    changeSeriesBasedOnTime(event) {
        let selectedSeriesType = $(event.target).val();
        this.hiddenSeries.forEach(hiddenSerie => hiddenSerie.hide());
        $('#hist-returns-toggle-button').parents(".showarea").data("toggle", "disabled");
        if (selectedSeriesType != "1") {
            $("#runupsData").hide();
        } else {
            disableDataTableRDBands();
            $("#runupsData").show();
        }
        this.props.actions.toogleBandAction("disabled");

        let fundRunnerIds = [];
        fundRunnerIds = (this.props.visibleStoreSeries || []).map((val) => {
            return val.fundRunnerId;
        });
        this.collapseRows();
        this.props.actions.fetchHistoricData("replace", fundRunnerIds.join(','), selectedSeriesType, this.props.selectedTimeFrame);
    }

    toggleBand(event) {
        event.preventDefault();
        let modifiedValue;
        let $el = $(event.target);
        let check = this.props.toggleStatus;
        let chartColor = GRAPH_COLOR_SERIES;
        let allDataSeries = Object.assign([], this.props.storeSeries);
        let hiddenSeries = (allDataSeries.filter((filterValue) => { return filterValue.initialHideOnGraph }) || []);
        let innerSeries = (hiddenSeries || []).map((v, i) => [...v.series]);
        if (check == "disabled") {


            /* to change the plot value of run up and drawdown To set inside chart object*/
            // $el.parents(".showarea").data("toggle", "enabled");

            // const visibleSeries = this.chartObj.series.filter(serie => serie.userOptions.type !== 'area' && serie.userOptions.id !== 'highcharts-navigator-series');
            // const maxYValues = visibleSeries.map(visibleSerie => Math.max.apply(Math, visibleSerie.processedYData));
            // const maxYValueOverall = Math.max.apply(Math, maxYValues);
            // const minYValues = visibleSeries.map(visibleSerie => Math.min.apply(Math, visibleSerie.processedYData));
            // const minYValueOverall = Math.min.apply(Math, minYValues);

            // for (let hiddenSerie of this.hiddenSeries) {
            //     const { xData, yData } = hiddenSerie;
            //     const newData = yData.map((yData, index) => {
            //         const xValue = xData[index];
            //         if (yData > 0) {
            //             return [xValue, maxYValueOverall];
            //         }
            //         if (yData < 0) {
            //             return [xValue, minYValueOverall];
            //         }
            //         return [xValue, yData];
            //     });

            //     hiddenSerie.setData(newData, true, false, true);
            //     hiddenSerie.show();
            // }

            // highLightDataTableBands(innerSeries);
            this.props.actions.toogleBandAction("enabled");
            disableDataTableRDBands();
            enableDataTableRDBands();
        } else if (check == "enabled") {
            // this.hiddenSeries.forEach(hiddenSerie => hiddenSerie.hide());
            disableDataTableRDBands();
            this.props.actions.toogleBandAction("disabled");
        }
    }

    showBands() {
        return (
            <div className="showarea" id="runupsData">
                {/*<div className="showarea" id="runupsData" style={{ 'display': (this.props.toggleStatus == 'enabled' ? 'block' : 'none') }}>  */}
                <div className="clearfix">
                    <small>Show Runups &amp; Drawdowns on Chart</small>
                    {<button id="hist-returns-toggle-button" onClick={(e) => { this.toggleBand(e) }} >toggle Bands</button>}
                </div>
            </div>
        )
    }

    render() {
        let requiredhistoricDataTable = this.props.childContentData.plotMetaData.requiredhistoricDataTable || false;
        if (this.props.loading) {
            return <h1>Rendering data</h1>;
        }
        return (
            <div>
                <div className="col-md-12 high-chart-container no-padding" id={this.props.id + "_container"}>
                    <div className="blank-space-25"></div>
                    <h3 className="paragraph-title no-margin">{this.props.childContentData.plotTitle}</h3>
                    {(!isObjEmpty(this.props.childContentData.plotMetaData.timeFrame)) ? this.renderGraphTimeFrame() : false}
                    {(this.props.childContentData.plotMetaData.graphPositionIndicator) ? this.renderGraphTicker() : false}
                    <div className="blank-space-30"></div>
                    {this.renderGraphTableIcons(requiredhistoricDataTable)}
                    <div id={this.props.id} className="highchart-section"></div>
                </div>
                {requiredhistoricDataTable ? this.renderGraphDataTable(getHistoricalReturnsModifiedSeries(this.props.visibleStoreSeries)) : null}
                {requiredhistoricDataTable ? this.showBands() : ""}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        storeSeries: state.historicReturns.historicData || [],
        loading: state.historicReturns.loading,
        selectedFrequency: state.historicReturns.selectedFrequency,
        selectedTimeFrame: state.historicReturns.selectedTimeFrame,
        visibleStoreSeries: getVisibleHistoricSeries(state.historicReturns.historicData || []),
        hiddenStoreSeries: state.historicReturns.hiddenSeries || [],
        toggleStatus: state.historicReturns.toggleStatus
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            setSeriesData: setSeriesData, fetchHistoricData: fetchHistoricData,
            removeGraphSeriesFromStore: removeGraphSeriesFromStore,
            setHistoricTimeFrame: setHistoricTimeFrame,
            toogleBandAction: toogleBandAction
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalReturns);