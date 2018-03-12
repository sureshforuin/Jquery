import * as Highcharts from 'highcharts/highstock';
import * as React from 'react';
import * as moment from 'moment';
import GraphTicker from './GraphTicker';
import GraphDataTable from './GraphDataTable';
import OverviewPerformanceTable from './OverviewPtable';
import AddBenchMarkFund from './AddBenchMarkFund';
import { getHistoricalReturnsModifiedSeries, getOverviewTableModifiedSeries } from '../../../utills/common';
import { getYValue, generateKey, isObjEmpty, highLightDataTableBands, highchartDataManipulation } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, GRAPH_DATE_FORMAT_ON_HOVER } from "../../constants/constant";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setHighChart, updateHighchartReducers, removeHighChartSeries } from "../../actions/highchart.action";
import { getFunds } from '../../selectors/funds.selector';


class HighChart extends React.Component<any, any>{
    chartObj: any;

    modifiedHistoricData: any;
    componentWillMount() {
        // this.props.actions.setHighChart(this.props.childContentData.plotData, this.props.id);
    }

    componentDidMount() {
        console.log(this.props.highChartData);
        this.props.actions.setHighChart(this.props.childContentData.plotData, this.props.id);
        if (!isObjEmpty(this.props.highChartData))
            this.renderHighChart();
    }

    // componentWillUnmount() {
    //     logging("UNMOUNT " + this.props.id, "purple")
    //     this.props.actions.updateHighchartReducers(this.props.id);
    // }

    componentDidUpdate() {
        this.renderHighChart();
    }
    renderHighChart() {
        let allChartSeries = this.props.highChartData || [];
        console.log(allChartSeries);

        let metaData = this.props.childContentData.plotMetaData;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphContainerId = this.props.id;

        let graphType, stacking;
        let navigator = this.props.childContentData.plotMetaData.navigator || false;
        let navigatorSeries: any = [];
        if (navigator) {
            navigatorSeries = allChartSeries.map((val, index) => {
                return { data: val.series, type: val.type }
            });
        }

        let chartOption: any;
        let _selfOuter: any = this;
        chartOption = {
            chart: {
                // type: graphType,
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
                    setExtremes: function (event) {
                        _selfOuter.removeAreaSeries();
                    },
                    afterSetExtremes: function (event) {
                        _selfOuter.addManipulatedAreaSeries();
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
                }],
                // events: {
                //     afterSetExtremes: function (event) {
                //         logging("After Y selectoion", "blue");
                //         console.log(event);
                //         // _selfOuter.addManipulatedAreaSeries();
                //         // console.log(event.yAxis[0].min);
                //     }
                // }
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    // step: 'left'
                },
                series: {
                    className: "mySeries",
                    cursor: "pointer",
                    tooltip: false,
                    point: {
                        events: {
                            mouseOver: function () {
                                let finalTooltip: String[] = [];
                                let currentTicker: any = [];
                                let currentDate: number = 0;
                                let _self: any = this;
                                let asOfDateTicker :any;

                                allChartSeries.forEach(function (val, index) {
                                    currentDate = 0;
                                    let x;
                                    if (val.type == "column") { // For column charts y co-ordinate value to be shown in ticker
                                        x = _self.y.toFixed(6);
                                        currentTicker = x;
                                        asOfDateTicker = _self.x;
                                    } else {
                                        x = val.series.filter(function (value) {
                                            return _self.x == value[0];
                                        });
                                        currentTicker = (x.length > 0 ? x[0][1] : "");
                                        if (x.length > 0 && x[0][0]) {
                                            asOfDateTicker = x[0][0];
                                        }
                                    }
                                    $('#series-' + graphContainerId + index + '-point').text(currentTicker);
                                    currentDate = (x.length > 0 ? x[0][0] : "");
                                });
                                asOfDateTicker = moment(asOfDateTicker).format("MMM 'YY");
                                $('#asOfDate'+ graphContainerId).text('As of Date : '+asOfDateTicker);
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
                    let _self: any = this;
                    return Highcharts.dateFormat("%b \'%y", _self.x); // just month
                },
                positioner: function (labelWidth, labelHeight, point) {
                    var tooltipX, tooltipY;
                    console.log(point);
                    return { x: point.plotX, y: 0 };
                }
            },
            turboThreshold: 2000,
            series: this.getSeries(allChartSeries, chartColor, metaData)

        };
        // logging("chart Options", "green");
        // console.log(chartOption);
        /* Here we can Customize chart Object eg: chartOption.xAxis*/
        // chartOption.tooltip.enabled = true;
        let isTimeframeBased = this.props.childContentData.plotMetaData.isTimeframeBased;
        isTimeframeBased = isTimeframeBased === false ? isTimeframeBased : !isTimeframeBased;


        if (isTimeframeBased) {
            this.chartObj = Highcharts.stockChart(graphContainerId, chartOption);
            this.setChartRange(this.chartObj, parseInt((this.props.childContentData.plotMetaData.timeFrame || {}).active || 0));
        } else {
            chartOption.chart.type = this.props.childContentData.plotData[0].type ? this.props.childContentData.plotData[0].type : "column";
            chartOption.xAxis = this.props.childContentData.plotMetaData.xaxis ? this.props.childContentData.plotMetaData.xaxis : null;
            chartOption.yAxis = this.props.childContentData.plotMetaData.yaxis ? this.props.childContentData.plotMetaData.yaxis : null;
            chartOption.crosshair = true;
            chartOption.tooltip.formatter = false;
            chartOption.tooltip.positioner = false;

            if (this.props.childContentData.plotMetaData.perfType === "barInvert") {

                let activeSeries = this.props.childContentData.plotData[0].data[0].correlations[0].series;
                let categoryX = [];
                let xaxisText = "";
                activeSeries.map(function (key, index) {
                    xaxisText =
                        "<div class='xtext'><span class='cat'>" + key.Name + "</span><span class='number'>" + key.Data + "</span></div>";
                    categoryX.push(xaxisText);
                    xaxisText = "";
                });
                chartOption.chart.type = "bar";
                chartOption.xAxis = {}
                // chartOption.xAxis.categories = categoryX;
                chartOption.xAxis = {
                    categories: categoryX,
                    gridLineWidth: 1,
                    labels: {
                        style: {
                            width: "250px",
                            "min-width": "250px",
                            "font-size": "12px"
                        },
                        useHTML: true
                    }
                };
                chartOption.yAxis = {};
                chartOption.yAxis = {
                    max: 1,
                    min: -1,
                    tickInterval: 1,
                    gridLineWidth: 1,
                    labels: {
                        enabled: true
                    },
                    title: {
                        text: ""
                    },
                }
                chartOption.tooltip.enabled = false;
                chartOption.chart.plotBackgroundColor = "#FAFAFA";
            }

            if (this.props.childContentData.plotMetaData.perfType == "OverviewPerformance") {
                // let totseries = allChartSeries[0].series.length
                let categories: any = [];
                let seriesInfo: any;
                chartOption.xAxis = {};
                seriesInfo = allChartSeries.map(a => a.series);
                for (var j = 0; j < seriesInfo[0].length; j++) {
                    categories.push(seriesInfo[0][j][0]);
                }
                categories.unshift("");
                categories.unshift("");
                categories.unshift("");
                chartOption.xAxis.categories = categories;

                chartOption.tooltip.enabled = false;
                chartOption.xAxis.categories = categories;
            }

            this.chartObj = Highcharts.chart(graphContainerId, chartOption);
        }
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
                _self.changeGraphTimeFrame();
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
                _self.changeGraphTimeFrame();
            }
        }).on("change", function () {
            $from.datepicker("option", "maxDate", $to.val());
        });
        // logging("Doc ready", "red");
        // console.log($(".high-chart-container .graph-timeframe a").data('events'));
        // });
    }

    getSeries(allChartSeries: any, chartColor: string[], metaData: any) {
        if (metaData.perfType === "upDownCapture") {
            return allChartSeries[0].series;
        } else if (metaData.perfType === "barInvert") {
            let resultData: any = {}

            let activeSeries = this.props.childContentData.plotData[0].data[0].correlations[0].series;
            let datax = [];
            activeSeries.map((data, index) => {
                datax.push(data.Data);
            })
            resultData.color = chartColor[0];
            resultData.data = datax;
            let seriesData = [];
            seriesData.push(resultData);
            return seriesData;
        }
        else if (metaData.perfType === 'OverviewPerformance') {
            let totseries = allChartSeries[0].series.length;
            let resultData: any = [];
            let seriesInfo: any;
            seriesInfo = allChartSeries.map(a => a.series);
            for (var i = 0; i < seriesInfo.length; i++) {
                resultData.push({ data: [] });
            }
            for (var i = 0; i < (totseries); i++) {
                for (var j = 0; j < seriesInfo.length; j++) {
                    resultData[j].data.push(Number(seriesInfo[j][i][1]));
                }
            }
            resultData = resultData.map((val, i) => {
                return { data: [0, 0, 0, ...val.data], color: chartColor[i] };
            });
            return resultData;
        }
        else {
            /* no caculative graph */
            let VisibleSeries = allChartSeries.filter((filterValue) => { return !filterValue.initialHideOnGraph }) || [];
            return VisibleSeries.map((val, index) => {
                // if(!(val.initialHideOnGraph || false))
                return {
                    id: val.title,
                    data: val.series,
                    type: val.type,
                    color: val.color ? val.color : chartColor[index],
                    showInNavigator: true,
                    visible: !(val.initialHideOnGraph || false),
                    threshold: val.threshold || 0,
                    negativeColor: val.negativeColor || null,
                    fillOpacity: val.opacity || 1,
                    lineWidth: val.lineWidth,
                    marker: val.marker ? val.marker : {}
                };
            });
        }
    }

    setChartRange(charObj, yearCount, caculationSeries?) {
        if (caculationSeries || yearCount == 0) { charObj.xAxis[0].setExtremes(null, null); return false; }
        let one_year = 31536000000;
        let extremes = charObj.xAxis[0].getExtremes();
        let max = extremes.max;
        let min = extremes.min;
        let unixRange = yearCount * one_year;
        min = max - unixRange;
        /* manually setting chart time frame */
        charObj.xAxis[0].setExtremes(min, max);
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
                                <a href="#" data-year="1" onClick={(e) => this.changeGraphTimeFrame(e)}>1 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 3 ? 'active' : ''}>
                                <a href="#" data-year="3" onClick={(e) => this.changeGraphTimeFrame(e)}>3 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 5 ? 'active' : ''}>
                                <a href="#" data-year="5" onClick={(e) => this.changeGraphTimeFrame(e)}>5 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 10 ? 'active' : ''}>
                                <a href="#" data-year="10" onClick={(e) => this.changeGraphTimeFrame(e)}>10 Yr</a>
                            </div>
                            <div className="dateRange">
                                <h3>COMMON DATE RANGE</h3>
                                <input type="text" id={"from" + this.props.id} className="datepicker" name="from" value="12/13/2013" onChange={(e) => this.changeGraphTimeFrame(e)} /> -
                                <input type="text" id={"to" + this.props.id} className="datepicker" name="to" value="12/13/2015" onChange={(e) => this.changeGraphTimeFrame(e)} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    getDefaultAsOfDate(){
        let allChartSeries = this.props.highChartData || [];
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
                    tickerVal = val.processedYData[val.processedYData.length-1];
                }
            });
            return tickerVal;
        } else {
            return null;
        }
    }

    changeGraphTimeFrame(event) {
        event.preventDefault();
        let allChartSeries = this.props.highChartData;
        let $el = $(event.target);
        $el.parent().addClass("active");
        $el.parent().siblings().removeClass("active");
        let selectedYear = parseInt(($el.attr('data-year') || "0"));
        let chartObj = Highcharts.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')];
        /*change toime frame event :- manually setting chart time frame */
        this.setChartRange(chartObj, selectedYear, false);
    }

    removeGraphSeries(event) {
        event.preventDefault();
        let $el = $(event.target);
        let $selectedUnit = $el.parents(".cloneUnit");
        let getChartSeriesTitle = $selectedUnit.attr("data-series") || "-";
        let getChartSeriesID = $selectedUnit.attr("data-key") || "-";
        // this.chartObj.get(getChartSeriesTitle).remove();
        this.removeHighChartSeries(getChartSeriesID);
        // $selectedUnit.remove();
    }
    renderTicker() {
        let data = this.props.childContentData.plotData || [];
        let graphContainerId = this.props.id;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphIndicator = data.map((val, key) => {
            if (!(val.initialHideOnGraph || false))
                return (
                    <div key={generateKey("GraphvalueIndicator_" + val.title)} className="unit d-none cloneUnit pull-left" data-series={val.title} data-key={val.key} style={{ margin: '10px' }}>
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
        return (
            <div className="performance_add_fund">
                <AddBenchMarkFund chartId={this.props.id} />
            </div>
        )
    }


    renderGraphTicker() {
        return (
            <div>
                {this.renderTicker()}
                {(this.props.childContentData.plotMetaData.addBenchmarkFund) ? this.renderAddBenchMark() : false}
            </div>
        );
    }
    removeAreaSeries() {
        if ($("#" + this.props.id + "_container").siblings(".showarea").data("toggle") == "enabled") {
            let allDataSeries = this.props.highChartData || [];
            let hiddenSeries = allDataSeries.filter((filterValue) => { return filterValue.initialHideOnGraph }) || [];
            (hiddenSeries || []).map((v, i) => {
                if (this.chartObj.get(v.title)) { this.chartObj.get(v.title).remove(); }
            });
        }
    }
    addManipulatedAreaSeries() {
        let chartColor = GRAPH_COLOR_SERIES;
        let modifiedValue;
        if ($("#" + this.props.id + "_container").siblings(".showarea").data("toggle") == "enabled") {
            let allDataSeries = this.props.highChartData || [];
            let hiddenSeries = allDataSeries.filter((filterValue) => { return filterValue.initialHideOnGraph }) || [];
            let min, max;
            ({ min, max } = this.chartObj.yAxis[0].getExtremes());
            let innerSeries = (hiddenSeries || []).map((v, i) => [...v.series]);
            /* to change the plot value of run up and drawdown To set inside chart object*/
            hiddenSeries = (hiddenSeries || []).map((v, i) => {

                if (this.chartObj.get(v.title)) { this.chartObj.get(v.title).remove(); }
                let tempSeries = (v.series).map((vi, ii) => {
                    if (vi[1] == null) { modifiedValue = null; } else if ((vi[1] > 0)) { modifiedValue = max; } else { modifiedValue = min; }
                    console.log(vi[1]);
                    console.log(modifiedValue);
                    return [vi[0], modifiedValue, vi[2], vi[3]]
                })
                return { title: v.title, series: tempSeries, type: v.type, color: v.color, threshold: v.threshold, negativeColor: v.negativeColor, opacity: v.opacity }
            });
            hiddenSeries.map((v, i) => {
                this.chartObj.addSeries({
                    id: v.title,
                    data: v.series,
                    type: v.type,
                    color: v.color ? v.color : chartColor[(i + 3)],
                    showInNavigator: true,
                    visible: true,//!(v.initialHideOnGraph || false),
                    threshold: v.threshold || 0,
                    negativeColor: v.negativeColor || null,
                    fillOpacity: v.opacity || 1,
                });
            });
        }
    }

    toggleBand(event) {
        event.preventDefault();
        let modifiedValue;
        let $el = $(event.target);
        let chartObj = Highcharts.charts[$("#" + ($el.parents(".showarea").siblings(".high-chart-container").attr("id") || "").split("_")[0]).data('highchartsChart')];
        let check = $el.parents(".showarea").data("toggle");
        let chartColor = GRAPH_COLOR_SERIES;
        let allDataSeries = this.props.highChartData || [];
        let hiddenSeries = (allDataSeries.filter((filterValue) => { return filterValue.initialHideOnGraph }) || []);
        let innerSeries = (hiddenSeries || []).map((v, i) => [...v.series]);
        if (check == "disabled") {
            /* to change the plot value of run up and drawdown To set inside chart object*/
            $el.parents(".showarea").data("toggle", "enabled");
            let min, max;
            ({ min, max } = chartObj.yAxis[0].getExtremes());
            hiddenSeries = (hiddenSeries || []).map((v, i) => {
                let tempSeries = (v.series).map((vi, ii) => {
                    if (vi[1] == null) { modifiedValue = null; } else if ((vi[1] > 0)) { modifiedValue = max; } else { modifiedValue = min; }
                    return [vi[0], modifiedValue, vi[2], vi[3]]
                })
                return { title: v.title, series: tempSeries, type: v.type, color: v.color, threshold: v.threshold, negativeColor: v.negativeColor, opacity: v.opacity }
            });
            hiddenSeries.map((v, i) => {
                chartObj.addSeries({
                    id: v.title,
                    data: v.series,
                    type: v.type,
                    color: v.color ? v.color : chartColor[(i + 3)],
                    showInNavigator: true,
                    visible: true,//!(v.initialHideOnGraph || false),
                    threshold: v.threshold || 0,
                    negativeColor: v.negativeColor || null,
                    fillOpacity: v.opacity || 1,
                });
            });
            highLightDataTableBands(innerSeries);
        } else if (check == "enabled") {
            (hiddenSeries || []).map((v, i) => {
                this.chartObj.get(v.title).remove();
            });
            $el.parents(".showarea").data("toggle", "disabled");
        }
        console.log($("#" + this.props.id + "_container").siblings(".showarea").data("toggle"));
        /* Highligh rows in graph datatable */

    }

    renderGraphDataTable(data, refChartId, requiredhistoricDataTable) {
        if (requiredhistoricDataTable) {
            return <GraphDataTable data={data} refChartId={refChartId} />;
        }
    }

    renderGraphTableIcons(requiredhistoricDataTable) {
        if (requiredhistoricDataTable) {
            return (
                <div className="chart-unit d-flex justify-content-between">
                    <div>
                        <div className="graph showBox active" data-area="chart"></div>
                        <div className="plotband showBox" data-area="table"></div>
                    </div>
                </div>
            );
        }

        return false;
    }

    showBands() {
        return (
            <div className="showarea" id="runupsData" data-toggle="disabled">
                <div className="clearfix">
                    <small>Show Runups &amp; Drawdowns on Chart</small>
                    {/* <div className="switchholder">
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" />
                                    <label className="onoffswitch-label" >
                                        <span className="onoffswitch-inner"></span>
                                        <span className="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </div> */}
                    {<button onClick={(e) => { this.toggleBand(e) }}>toggle Bands</button>}
                </div>
            </div>
        )
    }

    removeHighChartSeries(seriesIndex) {
        this.props.actions.removeHighChartSeries(seriesIndex, this.props.id);
    }

    renderOverviewTable(data, refChartId) {
        // return <GraphDataTable data={data} refChartId={refChartId} />;
        return <OverviewPerformanceTable data={data} refChartId={refChartId} action={this.removeHighChartSeries.bind(this)} />;
    }

    renderAsOfDate() {
        return  <h4> <div id={"asOfDate"+  this.props.id}> As of Date : {this.getDefaultAsOfDate()} </div></h4>;
    }

    render() {
        // let requiredhistoricDataTable = this.props.childContentData.plotMetaData.requiredhistoricDataTable || false;
        let perfType = this.props.childContentData.plotMetaData.perfType;
        let requiredOvPerformance = perfType === "OverviewPerformance" || false
        return (

            <div>
                <div className="col-md-12 high-chart-container no-padding" id={this.props.id + "_container"} data-perftype={perfType}>
                    <div className="blank-space-25"></div>
                    <h3 className="paragraph-title no-margin">{this.props.childContentData.plotTitle}</h3>

                    <div> {!requiredOvPerformance?this.renderAsOfDate(): false} </div>

                    {(!isObjEmpty(this.props.childContentData.plotMetaData.timeFrame)) ? this.renderGraphTimeFrame() : false}
                    {(this.props.childContentData.plotMetaData.graphPositionIndicator) ? this.renderGraphTicker() : false}
                    <div className="blank-space-30"></div>
                    {requiredOvPerformance ? ((this.props.childContentData.plotMetaData.addBenchmarkFund) ? this.renderAddBenchMark() : false) : false}
                    {/* {this.renderGraphTableIcons(requiredhistoricDataTable)} */}
                    <div id={this.props.id} className="highchart-section"></div>
                </div>
                {/* {requiredhistoricDataTable ? this.renderGraphDataTable(getHistoricalReturnsModifiedSeries(this.props.highChartData), this.props.id, requiredhistoricDataTable) : null}
                {requiredhistoricDataTable ? this.showBands() : ""} */}
                {requiredOvPerformance ? this.renderOverviewTable(getOverviewTableModifiedSeries(this.props.highChartData,this.props.type), this.props.id) : ""}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        highChartData: highchartDataManipulation(state.highChart[props.id] ? state.highChart[props.id].highchartData : [], getFunds(state)) || [],
        type: state.highChart[props.id] ? state.highChart[props.id].type : "fund"
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ setHighChart: setHighChart, updateHighchartReducers: updateHighchartReducers, removeHighChartSeries: removeHighChartSeries }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighChart);
