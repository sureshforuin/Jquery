import * as Highcharts from 'highcharts/highstock';
import * as React from 'react';
import * as moment from 'moment';
import GraphTicker from './GraphTicker';
import GraphDataTable from './GraphDataTable';
import { getYValue, generateKey, isObjEmpty } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, GRAPH_DATE_FORMAT_ON_HOVER } from "../../constants/constant";


class FilterChart extends React.Component<any, any>{


  componentDidMount() {
    this.renderHighChart();
  }

  changetoNumber(stringArray){
    let returnArray = [];
    for (var index in stringArray) {    // don't actually do this
          returnArray.push(Number(stringArray[index]));
      }
      return returnArray;
  }

  renderHighChart() {
    // let allChartSeries = this.props.childContentData.plotData || [];
    // console.log(allChartSeries);
    // let metaData = this.props.childContentData.plotMetaData;
    let chartColor = GRAPH_COLOR_SERIES;
    let graphContainerId = this.props.id;
    let sliderID = this.props.rangeId;
    let rangeData = this.changetoNumber(this.props.data.data);
    // // if (rangeData) {
    // //   let maxRangeData = Math.max.apply(Math,rangeData.map(function(o){return o.fundAUM;}))
    // //   let minRangeData = Math.min.apply(Math,rangeData.map(function(o){return o.fundAUM;}))
    // }
    // let graphType, stacking;
    // let navigator = this.props.childContentData.plotMetaData.navigator || false;
    // let navigatorSeries: any = [];
    // if (navigator) {
    //     navigatorSeries = allChartSeries.map((val, index) => {
    //         return { data: val.series, type: val.type }
    //     });
    // }
    let chartOption: any;
    chartOption = {
      chart: {
        renderTo:graphContainerId,
        type: "areaspline",
        margin: [0, 0, 40, 0],
        height: 120
      },
      colors: [
        '#C3E3F1',

      ],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      title: {
        style: {
          fontSize: "0px"
        }
      },
      subtitle: {
        style: {
          fontSize: "0px"
        }
      },
      xAxis: {
        categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        tickInterval: 9,
        lineColor: '#C3E3F1',
        lineWidth: 1
      },
      yAxis: {
        visible: false
      },
      tooltip: {
        shared: false,
        useHTML: true
      },
      plotOptions: {
        series: {
          enableMouseTracking: false
        },
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          areaspline: {
            marker: {
              enabled: false
            }
          }
        }
      },
      series: [
        {
          showInLegend: false,
          lineWidth: 0,
          data: rangeData,
          marker: {
            enabled: false
          }
        }
      ],
    };
    console.log(chartOption);
    let chartObj;
    chartObj = Highcharts.chart(chartOption);

    console.log(chartObj);



    let $rangeSlider = $("#" + this.props.rangeId) as any;
    let _self: any = this;
    $rangeSlider.slider({
      range: true,
      values: [1, 10],
      min: chartObj.xAxis[0].getExtremes().min + 1,
      max: chartObj.xAxis[0].getExtremes().max + 1,
      slide: function (event, ui) {
        _self.removePlotBand(chartObj);
        chartObj.xAxis[0].addPlotBand({
          color: "#FFFFFF",
          from: 0,
          to: ui.values[0] - 1,
          id: "plotband1",
          className: "overlay",
          zIndex: 10,
          borderWidth: 0
        });

        chartObj.xAxis[0].addPlotBand({
          color: "#FFFFFF",
          from: ui.values[1] - 1,
          to: 10,
          id: "plotband2",
          className: "overlay",
          zIndex: 10,
          borderWidth: 0
        });
      }
    });

    console.log($(".high-chart-container .graph-timeframe a").data('events'));
    // });
  }

  removePlotBand(chart) {
    chart.xAxis[0].removePlotBand("plotband1");
    chart.xAxis[0].removePlotBand("plotband2");
  }


  getSeries(allChartSeries: any, chartColor: string[], metaData: any) {
    let tempChartSeries = allChartSeries;
    return tempChartSeries[0].series;
  }




  render() {
    // let requiredhistoricDataTable = this.props.childContentData.plotMetaData.requiredhistoricDataTable || false;
    // let perfType = this.props.childContentData.plotMetaData.perfType;
    return (
      <div className="filter-unit">
         {/* <h5>{this.props.childContentData[0].selectTitle}</h5> */}
                    <div className="input-group custom">
                        <select className="custom-select">
                            <option>Select...</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                    </div>
        {/* <h5>{this.props.childContentData[0].title}</h5> */}
        <div className="filterchart-section">
          <div id={this.props.id}></div>
          <div id={this.props.rangeId} className="rangeSlider"></div>

        </div>
      </div>
    );
  }
}
export default FilterChart;