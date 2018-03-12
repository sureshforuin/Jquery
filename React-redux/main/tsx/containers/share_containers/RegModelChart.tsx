import * as Highcharts from 'highcharts/highstock';
import * as React from 'react';
import * as moment from 'moment';
import RegmodelTable from './RegmodelTable';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setHighChart, updateHighchartReducers, removeHighChartSeries } from "../../actions/highchart.action";
import { getFunds } from '../../selectors/funds.selector';
import { getYValue, generateKey, isObjEmpty, highchartDataManipulation } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, GRAPH_DATE_FORMAT_ON_HOVER } from "../../constants/constant";


class RegModelChart extends React.Component<any, any>{
    chartObj: any;
    activeChartItem;
    selectedChart;

    constructor(props) {
        super(props);
         this.selectedChart =  this.props.childContentData.plotData.length - 1;
    }
    componentWillMount() {
        this.activeChartItem = this.props.childContentData.plotMetaData.perfType == "regressionModelling" ? 'regression model' : '';
    }

    componentDidMount() {
        console.log(this.props.highChartData);
        this.renderHighChart();
    }

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
                // type: 'scatter',
                // zoomType: 'xy',
                backgroundColor: "#FAFAFA",
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize: '15px'
                }
            },

            title: {
                text: ''
            },

            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                },
                scatter: {
                    color: 'red',
                    marker: {
                        radius: 15,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                }
            },
            series: [{
                type: 'line',
                name: 'R-SQUARED',
                color: '#BCBCBC',
                zIndex: 10,
                data: this.props.childContentData.plotData[this.selectedChart][this.activeChartItem].line.series,
            },
            {
                name: 'ADJUSTED R-SQUARED',
                color: 'rgba(15, 142, 199, .75)',
                type:'scatter',
                data: this.props.childContentData.plotData[this.selectedChart][this.activeChartItem].scatterplot.series,
                marker: {
                    symbol: 'circle',
                    radius: 9
                }
            }
            ]

        };
        this.chartObj = Highcharts.chart(graphContainerId, chartOption);
    }

    getSeries(allChartSeries: any, chartColor: string[], metaData: any) {
        console.log(allChartSeries);
    }

    renderTicker() {
        let chartData = this.props.childContentData.plotData[this.selectedChart][this.activeChartItem];
        let chartColor = GRAPH_COLOR_SERIES;
                return (
                    <div>
                    <div key={generateKey("GraphvalueIndicator_")} className="unit d-none cloneUnit pull-left" style={{ margin: '10px' }}>
                        <div className="blue box" style={{ backgroundColor: chartColor[0] }}></div>
                        <h4 className="no-margin">R-SQUARED</h4>
                        <div className="number d-flex align-items-end legend1">{chartData.rsquared ? chartData.rsquared  : "--" }</div>
                    </div>
                    <div key={generateKey("GraphvalueIndicator_")} className="unit d-none cloneUnit pull-left" style={{ margin: '10px' }}>
                        <div className="blue box" style={{ backgroundColor: chartColor[1] }}></div>
                        <h4 className="no-margin">ADJUSTED R-SQUARED</h4>
                        <div className="number d-flex align-items-end legend1">{chartData.adjRsquared ? chartData.adjRsquared  : "--" }</div>
                    </div>
                    </div>
                );
        // return [...graphIndicator];
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
        let activeTimeFrame:any = "SI";
        return (
            <div className="container no-padding">
                <div className="blank-space-25"></div>
                <div className="content-area">
                    <div className="timeframe graph-timeframe">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav highchart-timeframe-container">
                            <div className={activeTimeFrame == 1 ? 'active' : ''}>
                                <a href="#" data-year="0" onClick={(e) => this.changeGraphTimeFrame(e)}>1 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 3 ? 'active' : ''}>
                                <a href="#" data-year="1" onClick={(e) => this.changeGraphTimeFrame(e)}>3 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 5 ? 'active' : ''}>
                                <a href="#" data-year="2" onClick={(e) => this.changeGraphTimeFrame(e)}>5 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 10 ? 'active' : ''}>
                                <a href="#" data-year="3" onClick={(e) => this.changeGraphTimeFrame(e)}>10 Yr</a>
                            </div>
                            <div className={activeTimeFrame == "SI" ? 'active' : ''}>
                                <a href="#" data-year="4" onClick={(e) => this.changeGraphTimeFrame(e)}>Since Inception</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    changeGraphTimeFrame(event) {
        event.preventDefault();
        let allChartSeries = this.props.highChartData;
        let $el = $(event.target);
        $el.parent().addClass("active");
        $el.parent().siblings().removeClass("active");
        let selectedYear = parseInt(($el.attr('data-year') || "0"));
        this.selectedChart = selectedYear;
        this.forceUpdate();
        this.renderHighChart();
        // let chartObj = Highcharts.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')];
    }


renderRegModelTable(data){
     return <RegmodelTable data={data} />
}
    render() {
        let perfType = this.props.childContentData.plotMetaData.perfType;
        let tableData = this.props.childContentData.plotData[this.selectedChart][this.activeChartItem];
        return (
            <div>
                <div className="col-md-12 high-chart-container no-padding" id={this.props.id + "_container"} data-perftype={perfType}>
                    <div className="blank-space-25"></div>
                    <h3 className="paragraph-title no-margin">{this.props.childContentData.plotTitle}</h3>
                     {this.renderGraphTimeFrame()}
                     {this.renderTicker()}
                     <div className="blank-space-25"></div>
                    <div id={this.props.id} className="highchart-section"></div>
                    <div style={{marginTop:20}}>
                     {this.renderRegModelTable(tableData.coeffs)}
                     </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
  return {
    CurrentStore: state.CurrentStore,
    propData: state.AnalysisDetails,
      highChartData: highchartDataManipulation(state.AnalysisDetails[props.id] ? state.AnalysisDetails[props.id].highchartData : [], getFunds(state)) || [],
      type: state.AnalysisDetails[props.id] ? state.AnalysisDetails[props.id].type : "fund"
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      actions: bindActionCreators({
        setHighChart: setHighChart,
         updateHighchartReducers: updateHighchartReducers,
          removeHighChartSeries: removeHighChartSeries }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegModelChart);
