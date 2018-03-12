import * as Highcharts from "highcharts/highstock";
import * as Highstock from 'highcharts/highstock';
import * as React from "react";
import * as moment from "moment";
import { fetchWrapper } from "../../../utills/api_wrapper";
import { getYValue, generateKey, isObjEmpty, convertToMonthEnd } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, CHART_ROOT } from "../../constants/constant";

class RegressionChart extends React.Component<any, any> {
  chartObj: any;

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { timeframe: '' };
    this.state = {regTimeframe : 4}
    // let parentData = this.props.parentData[0] || [] ? this.props.parentData[0].data : [];
    // this.state = { parentData: parentData };
  }

  handleChange(){
      
  }

  componentDidMount() {
          this.setState({timeframe: this.props.timeframe });
          this.setState({regTimeframe: this.props.regTimeframe });
          this.renderHighChart();
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.regTimeframe != this.props.regTimeframe){
           this.setState({regTimeframe: nextProps.regTimeframe });
            this.setState({timeframe: nextProps.timeframe });
      }
  }

    componentDidUpdate(prevProp, prevState){
      if(prevProp.regTimeframe != this.props.regTimeframe){
           this.setState({regTimeframe:  this.props.regTimeframe });
      }
        if(prevProp.timeframe != this.props.timeframe){
           this.setState({timeframe:  this.props.timeframe });
      }
            this.renderHighChart();
  }
  
  
    renderHighChart() {

        // let allChartSeries = highchartDataManipulation(chartData.plotData) || [];
        let allChartSeries = this.props.chartData.plotMetaData.IstimeFrameBased ? highchartDataManipulation(this.props.chartData.plotData) || [] : this.props.chartData.plotData
        console.log(allChartSeries);

        let metaData = this.props.chartData.plotMetaData;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphContainerId = this.props.id;

        let graphType, stacking;
        let navigator = this.props.chartData.plotMetaData.navigator || false;
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
                        return Highstock.dateFormat("%b \'%y", _self.value); // just month
                    }
                }
                // events: {
                //     setExtremes: function (event) {
                //         _selfOuter.removeAreaSeries();
                //     },
                //     afterSetExtremes: function (event) {
                //         _selfOuter.addManipulatedAreaSeries();
                //     }
                // }
            },
            yAxis: {
                startOnTick: false,
                opposite: false,
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }],
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

                                allChartSeries.forEach(function (val, index) {
                                    currentDate = 0;
                                    let x;
                                    if (val.type == "column" || val.type == "line") { // For column charts y co-ordinate value to be shown in ticker
                                        x = _self.y.toFixed(6);
                                        currentTicker = x;
                                    } else {
                                        console.log(val.series);
                                        x = val.series.filter(function (value) {
                                            return _self.x == value[0];
                                        });
                                        currentTicker = (x.length > 0 ? x[0][1] : "");
                                    }
                                    $('#series-' + graphContainerId + index + '-point').text(currentTicker);
                                    currentDate = (x.length > 0 ? x[0][0] : "");
                                });
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
                    return Highstock.dateFormat("%b \'%y", _self.x); // just month
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
        let isTimeframeBased = this.props.chartData.plotMetaData.IstimeFrameBased;
        // isTimeframeBased = isTimeframeBased === false || isTimeframeBased === undefined ? isTimeframeBased : !isTimeframeBased;


        if (isTimeframeBased) {
            this.chartObj = Highcharts.stockChart(graphContainerId, chartOption);
            console.log(this.chartObj);
            this.setChartRange(this.chartObj, parseInt((this.state.timeframe || 20) || 0));
        } else {
            chartOption.chart.type = "scatter";
            chartOption.chart.zoomType = "xy";
            chartOption.navigator = {"enabled": false}
            chartOption.xAxis = this.props.chartData.plotMetaData.xaxis ? this.props.chartData.plotMetaData.xaxis : null;
            chartOption.yAxis = this.props.chartData.plotMetaData.yaxis ? this.props.chartData.plotMetaData.yaxis : null;
            chartOption.crosshair = true;
            chartOption.tooltip.formatter = false;
            chartOption.tooltip.positioner = false;
            this.chartObj =  Highcharts.chart(graphContainerId, chartOption);
            //  this.setRegChartRange(this.chartObj, parseInt((this.state.regTimeframe || 20) || 0));
        }
        console.log(this.chartObj);
        let $from = $("#from" + graphContainerId) as any,
            $to = $("#to" + graphContainerId) as any;
        let _self: any = this;
        $from.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
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

    getSeries(allChartSeries: any, chartColor: string[], metaData: any) {
        let seriesData = [];
        let scatterData:any = {};
        if (metaData.perfType === "benchmark") {
            seriesData = [{
                    type: 'line',
                    name: 'R-SQUARED',
                    color: '#BCBCBC',
                    data: allChartSeries[Number(this.props.regTimeframe)]["regression model"]['line'].series,
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            lineWidth: 0
                        }
                    },
                    enableMouseTracking: false
                },
                {
                    name: 'ADJUSTED R-SQUARED',
                    color: 'rgba(15, 142, 199, .75)',
                    data: allChartSeries[Number(this.props.regTimeframe)]["regression model"]['scatterplot'].series,
                    marker: {
                        symbol: 'circle',
                        radius: 9
                    }
                }
            ]
            return seriesData;
        } 
        else {
            /* no caculative graph */
            // let VisibleSeries = allChartSeries.filter((filterValue) => { return !filterValue.initialHideOnGraph }) || [];
            console.log(allChartSeries);
            return allChartSeries.map((val, index) => {
                console.log(val);
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


  renderTicker() {
        let data = this.props.chartData.plotData || [];
        let graphContainerId = this.props.id;
        let chartColor = GRAPH_COLOR_SERIES;
        let graphIndicator = data.map((val, key) => {
            if (!(val.initialHideOnGraph || false))
                return (
                    <div key={generateKey("GraphvalueIndicator_" + val.title)} className="unit d-none cloneUnit pull-left" data-series={val.title} data-key={val.key} style={{ margin: '10px' }}>
                        <div className="blue box" style={{ backgroundColor: chartColor[key] }}></div>
                        <h4 className="no-margin">{val.title}</h4>
                        <div className="number d-flex align-items-end legend1" id={'series-' + graphContainerId + key + '-point'}>0</div>
                    </div>
                );
        });
        return [...graphIndicator];
    }


  changeGraphTimeFrame(e){
    console.log(e);
  }

  formularBar(){
      return(
         <div>
            <div className="blank-space-54" /> 
             <div className="blank-space-54" /> 
         </div>
      )
  }

  render() {
    return (
      <div>
        <h3 className="paragraph-title no-margin">{this.props.chartData.plotTitle}</h3> 
               <div className="blank-space-25" />
               {this.props.chartData.plotMetaData.IstimeFrameBased? this.renderTicker():''}
                <div className="blank-space-25" />
                {!this.props.chartData.plotMetaData.IstimeFrameBased? this.formularBar():''}
              <div id={this.props.id.replace(/\s/g, '')} className="highchart-section" />
                <div className="blank-space-54" /> 
      </div>
    )
  }
}
export default RegressionChart;

const highchartDataManipulation = (linkDataItem) => {
    let modifiedPlotData = (linkDataItem || []).map(val => {
        let previousYear = 0;
        let avg = 1;
        /*single graph with multiple series iteration and manipulation */
        let innerSeriesData: any = [];
        let modifiedSeriesData: any = {};

        innerSeriesData = (val["series"] || []).map((value, index) => {
            /*single series manipulation */
            let seriesDate = moment(convertToMonthEnd(value[0]));
            let year = parseInt(seriesDate.format('YYYY'));
            let month = parseInt(seriesDate.format('M'));
            let pointValue = parseFloat(value[1]);
            return [seriesDate.valueOf(), pointValue, month, year];
        });
        innerSeriesData.sort(function (a, b) { return a[3] - b[3] || a[2] - b[2] })
        modifiedSeriesData = { title: val.title, entityType: val.entityType, series: innerSeriesData, type: val.type || "line", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1, fundRunnerId: val.fundRunnerId };

        return modifiedSeriesData;
    });

    return modifiedPlotData;
}