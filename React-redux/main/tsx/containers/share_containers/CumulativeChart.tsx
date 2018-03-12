import * as Highstock from 'highcharts/highstock';
import * as React from 'react';
import * as moment from 'moment';
import GraphTicker from './GraphTicker';
import GraphDataTable from './GraphDataTable';
import { getYValue, generateKey, isObjEmpty, highchartDataManipulation } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, GRAPH_DATE_FORMAT_ON_HOVER, notifyCumulativeChartDateControlChange } from "../../constants/constant";
import { bindActionCreators } from 'redux';
import { setCumulativeSeriesData, removeGraphSeriesFromCumulativeStore } from '../../actions/cumulativeChart.action';
import { connect } from 'react-redux';
import AddBenchMarkFund from './AddBenchMarkFund';
import { CumulativeChartInterface } from '../../reducers/cumulativeChart.reducer';

class CumulativeChart extends React.Component<any, any>{

    chartObj: any;

    constructor(props) {
        super(props);
        this.onPointMouseOver = this.onPointMouseOver.bind(this);
        this.getDefaultTickerValues = this.getDefaultTickerValues.bind(this);
    }

    componentDidMount() {
        this.props.actions.setCumulativeSeriesData(this.props.childContentData.plotData || []);
        if (!isObjEmpty(this.props.storeData)) {
            this.renderChart();
            // this is a hack/workaround to select 3 years as deafult timeframe. Need to investigate to understand why it is not working correctly in the first place
            let activeTimeFrame = (this.props.childContentData.plotMetaData.timeFrame || {}).active || 0;
            if (activeTimeFrame) {
                $(`#${this.props.id}_container .highchart-timeframe-container [data-year='${activeTimeFrame}']`).parent().removeClass('active').addClass('active');
            }
        }
    }

    componentDidUpdate() {
        if (!isObjEmpty(this.props.storeData))
            this.renderChart();
    }
    renderChart() {
        let allChartSeries = this.props.storeData || [];
        let metaData = this.props.childContentData.plotMetaData;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphContainerId = this.props.id;

        let graphType, stacking;
        // Disable navigator for now
        let navigator = false; //this.props.childContentData.plotMetaData.navigator || false;
        let navigatorSeries: any = [];
        if (navigator) {
            navigatorSeries = allChartSeries.map((val, index) => {
                return { data: val.series, type: val.type }
            });
        }

        let chartOption = {
            chart: {
                // type: graphType,
                backgroundColor: null,
                style: {
                    fontFamily: "pf_dintext_proregular",
                    fontSize: "15px"
                },
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
                        return Highstock.dateFormat("%b \'%y", _self.value); // just month
                    }
                }
            },
            yAxis: {
                startOnTick: false,
                opposite: false,
                // labels: {
                //     formatter: function () {
                //         let _self :any = this;
                //         var max = _self.axis.dataMax,
                //             min = _self.axis.dataMin,
                //             range = max - min;
                //         return ((_self.value - min) / (range) * 100) + ' %';
                //     }
                // },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    step: 'center'
                },
                series: {
                    showInNavigator: false,
                    stacking: stacking,
                    className: "mySeries",
                    cursor: "pointer",
                    tooltip: false,
                    point: {
                        events: {
                            mouseOver: this.onPointMouseOver
                                
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
                    return Highstock.dateFormat("%b \'%y", _self.x); // just month
                }
            },
            series: this.getSeries(allChartSeries, chartColor, metaData)

        };
        this.chartObj = Highstock.stockChart(graphContainerId, chartOption, this.onChartReady);
        this.chartObj.xAxis[0].setExtremes(null, null);
        // this.setChartRange(chartObj, parseInt((this.props.childContentData.plotMetaData.timeFrame || {}).active || 3));

        let $from = $("#from" + graphContainerId) as any,
            $to = $("#to" + graphContainerId) as any;
        let _self: CumulativeChart = this;
        $from.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onSelect: function (date) {
                _self.changeGraphTimeFrame(event, { from: date });
                notifyCumulativeChartDateControlChange();
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
                notifyCumulativeChartDateControlChange();
            }
        }).on("change", function () {
            $from.datepicker("option", "maxDate", $to.val());
        });
        console.log($(".high-chart-container .graph-timeframe a").data('events'));
        // });
    }

    createChartSeries(truncatedChartSeries): any {
        let chartColor = GRAPH_COLOR_SERIES;
        return truncatedChartSeries.map(function (val, index) {
            return { id: val.title, data: val.series, tooltip: { enabled: false }, color: chartColor[index], showInNavigator: false, fillOpacity: 0.1, lineWidth: 1 };
        });
    }

    addSeries(chartObj, tempChartSeries) {
        let chartColor = GRAPH_COLOR_SERIES;
        tempChartSeries.forEach(function (value, index) {
            chartObj.get(value.id).remove();
            chartObj.addSeries({
                id: value.id,
                data: value.data,
                color: chartColor[index],
                showInNavigator: false,
                fillOpacity: 0.1,
                lineWidth: 1,
            });
        });
    }

    getSeries(allChartSeries: any, chartColor: string[], metaData: any) {

        let tempChartSeries = allChartSeries;
        let timeFrameSelected = metaData.timeFrame.active;
        let truncatedChartSeries: any = [];

        const startDates = tempChartSeries.map(serie => serie.series[0][0]);
        let commonStartDate = Math.max.apply(Math, startDates);
        const commonEndDate = tempChartSeries[0].series[tempChartSeries[0].series.length - 1][0];

        tempChartSeries.forEach(function (val, index) {
            let sortedSeries = val.series;
            let truncatedSeries: any = [];

            if (sortedSeries.length > 0) {
                // Pick the Year from the last index in 
                if (timeFrameSelected) {
                    commonStartDate = moment(commonEndDate).add(-timeFrameSelected, 'years').valueOf();
                }
                // let period = moment(sortedSeries[sortedSeries.length - 1][0]).year() - timeFrameSelected;
                let temp = 0;
                let cumprod = 0;
                let cumret = 0;
                for (let itr = 0; itr < sortedSeries.length; itr++) {
                    const item = sortedSeries[itr];
                    if (item[0] >= commonStartDate && item[0] <= commonEndDate) {
                        let current: any[] = [...item];
                        let temp = 1.0 + current[1];
                        cumprod = temp * (1.0 + cumret);
                        cumprod -= 1.0;
                        cumret = cumprod;
                        current[1] = cumprod;
                        if (truncatedSeries.length == 0) {
                            // first number should be 0
                            current[1] = 0;
                        }
                        truncatedSeries.push(current);
                    }
                }

                truncatedChartSeries.push({ title: val.title, series: truncatedSeries });
            }
        });

        // debugger;
        return truncatedChartSeries.map(function (val, index) {
            return { id: val.title, data: val.series, type: val.type, tooltip: { enabled: false }, color: chartColor[index], showInNavigator: false, fillOpacity: 0.1, lineWidth: 1 };
        });

    }

    setChartRange(charObj, yearCount, caculationSeries?) {
        charObj.xAxis[0].setExtremes(null, null);
    }
    renderGraphTimeFrame() {
        // debugger;
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
                                <input type="text" id={"from" + this.props.id} className="datepicker" name="from" defaultValue={this.getDefaultFromDate()} />-
                                <input type="text" id={"to" + this.props.id} className="datepicker" name="to" defaultValue={this.getDefaultToDate()} />
                            </div>                           
                        </div>
                    </div>
                </div>

                <div>
                    <h4> <div id={"asOfDate"+this.props.id}> As of Date : {this.getDefaultAsOfDate()} </div></h4>    
                </div>
            </div>
        )
    }

    getDefaultAsOfDate(){
        let allChartSeries = this.props.storeData || [];
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
                    tickerVal = val.yData[val.yData.length - 1].toFixed(2);
                }
            });
            return tickerVal;
        } else {
            return null;
        }
    }

    getDefaultFromDate() {
        let allChartSeries = this.props.storeData || [];
        let fromDateLabel: any = [];
        allChartSeries.forEach(function (val, index) {
            fromDateLabel.push(val.series[0][0]);

        });
        return moment(Math.max.apply(Math, fromDateLabel)).format('MM/DD/YYYY');;
    }

    getDefaultToDate() {
        let allChartSeries = this.props.storeData || [];
        let toDateLabel = null;
        allChartSeries.forEach(function (val, index) {
            if (!toDateLabel) {
                toDateLabel = moment(val.series[val.series.length - 1][0]).format('MM/DD/YYYY');
            }
        });
        return toDateLabel;
    }

    changeGraphTimeFrame(event, opts) {
        event.preventDefault();
        let allChartSeries = this.props.storeData || [];
        let $el = $(event.target);
        $el.parent().addClass("active");
        $el.parent().siblings().removeClass("active");
        let selectedYear = opts.timeFrame;
        let { chartObj } = this;
        let tempChartSeries = allChartSeries;
        let perfType = $el.parents('.high-chart-container').data('perftype');

        let $from = opts.from || ($("#from" + this.props.id).val() || "").toString();
        let $to = opts.to || ($("#to" + this.props.id).val() || "").toString();

        let truncatedChartSeries: any = [];
        let fromDate = null;
        let toDate = null;
        if (!selectedYear) {
            fromDate = moment($from, 'MM/DD/YYYY');
            toDate = moment($to, 'MM/DD/YYYY');
        }
        tempChartSeries.forEach(function (val, index) {
            let sortedSeries = val.series;
            let truncatedSeries: any = [];
            // Pick the Year from the last index in 
            let period;
            if (selectedYear) {
                toDate = moment(sortedSeries[sortedSeries.length - 1][0]);
                fromDate = moment(sortedSeries[sortedSeries.length - 1][0]).add(-selectedYear, "years");
            }
            let temp = 0;
            let cumprod = 0;
            let cumret = 0;
            let firstFound = false;
            for (let itr = 0; itr < sortedSeries.length; itr++) {
                const item = sortedSeries[itr];
                if (!moment(item[0]).isBefore(fromDate) && !moment(item[0]).isAfter(toDate)) {
                    let current: any[] = [...item];
                    let temp = 1.0 + current[1];
                    cumprod = temp * (1.0 + cumret);
                    cumprod -= 1.0;
                    cumret = cumprod;
                    current[1] = cumprod;
                    if (truncatedSeries.length == 0) {
                        // first number should be 0
                        current[1] = 0;
                    }
                    truncatedSeries.push(current);
                }
            }
            truncatedChartSeries.push({ title: val.title, series: truncatedSeries });
        });

        // Find  Intersection From and To Date 
        let fromIntersectedDate = fromDate;
        let toIntersectedDate = toDate;
        truncatedChartSeries.forEach(function (val, index) {
            let firstElementYear = moment(val.series[0][0]);
            if (firstElementYear.isSameOrAfter(fromIntersectedDate)) {
                fromIntersectedDate = firstElementYear;
            }

            let lastElementYear = moment(val.series[val.series.length - 1][0]);
            if (lastElementYear.isSameOrBefore(toIntersectedDate)) {
                toIntersectedDate = lastElementYear;
            }
        });

        truncatedChartSeries.map(function (val, index) {

            // Pick the Year from the last index in 
            val.series.map(function (item, itr) {
                if (moment(item[0]).isAfter(fromIntersectedDate) && moment(item[0]).isBefore(toIntersectedDate)) {
                    return item;
                }
            });
            return val;
        });

        // Series is intersected to common from and to date.
        tempChartSeries = this.createChartSeries(truncatedChartSeries);
        this.addSeries(chartObj, tempChartSeries);
        chartObj.xAxis[0].setExtremes(null, null);
    }

    onPointMouseOver(event) {
        let asOfDateTicker:any;
        let finalTooltip: String[] = [];
        let currentTicker: any = [];
        let currentDate: number = 0;
        let point: any = event.target;
        for (let index=0; index < this.chartObj.series.length; index++) {
            currentDate = 0;
            const series = this.chartObj.series[index];
            let x = series.data.filter(function (value) {
                return point.x == value.x;
            });
            currentTicker = (x.length > 0 ? x[0].y.toFixed(2) : "");
             $('#series-' + this.props.id + index + '-point').text(currentTicker);
            
            currentDate = (x.length > 0 ? point.x : "");
        }
        asOfDateTicker = moment(point.x).format("MMM 'YY");
        $('#asOfDate'+this.props.id).text('As of Date : '+asOfDateTicker);
    }

   
    onChartReady(chart) {
//         $(chart.renderTo)
//             .find('svg')
//             .mouseleave(()=>{
//                 console.warn('On Mouse Leave');
//    //             this.onPointMouseLeave();
//             });            
    }

    removeGraphSeries(event) {
        event.preventDefault();
        let $el = $(event.target);
        let $selectedUnit = $el.parents(".cloneUnit");
        let getChartSeriesID = $selectedUnit.attr("data-key") || "-";
        // Highstock.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')]
        //     .get(getChartSeriesID).remove();
        // $selectedUnit.remove();
        this.props.actions.removeGraphSeriesFromCumulativeStore(getChartSeriesID);
    }
    renderTicker() {
        let data = this.props.storeData || [];
        let graphContainerId = this.props.id;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphIndicator = data.map((val, key) => {
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
        return <AddBenchMarkFund chartId={this.props.id} />
    }
    renderGraphTicker() {
        return (
            <div>
                {this.renderTicker()}
                {(this.props.childContentData.plotMetaData.addBenchmarkFund) ? this.renderAddBenchMark() : false}
            </div>
        );
    }

    render() {
        let perfType = this.props.childContentData.plotMetaData.perfType;
        return (
            <div>
                <div className="col-md-12 high-chart-container no-padding" id={this.props.id + "_container"} data-perftype={perfType}>
                    <div className="blank-space-25"></div>
                    <h3 className="paragraph-title no-margin">{this.props.childContentData.plotTitle}</h3>
                    {(!isObjEmpty(this.props.childContentData.plotMetaData.timeFrame)) ? this.renderGraphTimeFrame() : false}
                    {(this.props.childContentData.plotMetaData.graphPositionIndicator) ? this.renderGraphTicker() : false}
                    <div className="blank-space-30"></div>
                    <div id={this.props.id} className="highchart-section"></div>
                </div>


            </div>
        );
    }
}
const mapStateToProps = (state: { CumulativeChart: CumulativeChartInterface }, props) => {
    return {
        storeData: state.CumulativeChart.CumulativeChart || [],
        loading: state.CumulativeChart.loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ setCumulativeSeriesData, removeGraphSeriesFromCumulativeStore }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CumulativeChart);