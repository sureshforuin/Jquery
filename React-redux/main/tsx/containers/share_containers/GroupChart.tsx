import * as Highcharts from 'highcharts/highstock';
import * as React from 'react';
import * as moment from 'moment';
import GraphTicker from './GraphTicker';
import GraphDataTable from './GraphDataTable';
import OverviewPerformanceTable from './OverviewPtable';
import AddBenchMarkFund from './AddBenchMarkFund';
import { fetchWrapper } from '../../../utills/api_wrapper';
import { getHistoricalReturnsModifiedSeries, getOverviewTableModifiedSeries } from '../../../utills/common';
import { getYValue, generateKey, isObjEmpty, highLightDataTableBands, highchartDataManipulation } from "../../../utills/common";
import { GRAPH_COLOR_SERIES,CHART_ROOT } from "../../constants/constant";


class GroupChart extends React.Component<any, any>{
    chartObj: any;
    selectedItem = 4;
    selectedChart;

    constructor(props) {
      super(props);
      this.state = { addClass: false };
      this.state = {
        chartData: []
      };
      this.selectedChart = "correlation fund";
    }


    componentDidMount() {
      if(this.props.childContentData.plotData.length > 0){
           this.formulateData();
      }else{
      }
    }

    // formulateData(){
    //   let correlationFund = this.props.childContentData.plotData[this.selectedItem]["correlation fund"][0].correlations;
    //   correlationFund.map((key,index) => {
    //         // key
    //   })
    // }
    formulateData() {
      if(this.props.childContentData.plotData.length > 0){
           var totalChart = this.props.childContentData.plotData[this.selectedItem][this.selectedChart][0]["correlations"];
        let seriesData = [];
        let categoriesData = [];
        let categories  = [];
        let categoryX = [];
        totalChart.map((key,index) => {
            let uniqID = this.props.id+""+key.title;
            key.series.map((k,i) => {
                categories.push(k.Data);
                var xaxisText = "<div class='xtext'><span class='cat'>" + k.Name + "</span><span class='number'>" +k.Data +"</span></div>";
                categoryX.push(xaxisText);
              })
            let obj:any = {};
            obj.name = "Correlations";
            obj.data = categories;
            obj.color = GRAPH_COLOR_SERIES[0];
            seriesData.push(obj);
              this.renderHighChart(uniqID.replace(/\s/g, '')+index,categoryX, seriesData);
            categories = [];
            categoryX = [];
            seriesData = [];
        })
      }else{
       
      }
    }


    renderHighChart(id, categories, seriesData) {
      let metaData = this.props.childContentData.plotMetaData;
      let chartColor = GRAPH_COLOR_SERIES;
      let graphContainerId = id;

      let graphType, stacking;
      let navigator = this.props.childContentData.plotMetaData.navigator || false;
      let navigatorSeries: any = [];

      let chartOption: any;
      let _selfOuter: any = this;
      chartOption = {
        chart: {
          type: "bar",
          plotBackgroundColor: "#FAFAFA",
          style: {
              fontFamily: 'pf_dintext_proregular',
              fontSize:'15px'
            },
      },
      title: {
          text: ""
      },
      subtitle: {
          text: ""
      },
      legend: {
          enabled: false
      },
      tooltip:{
          enabled: false
      },
      xAxis: [{
              categories : categories,
              gridLineWidth: 1,
              labels: {
                  style: {
                      width: "250px",
                      "min-width": "250px",
                      "font-size": "12px"
                  },
                  useHTML: true
              }
          }
      ],
      yAxis: {
          max: 1,
          min: -1,
          tickInterval: 1,
          gridLineWidth: 1,
          labels: {
              enabled: true
          },
          title: {
              text: ""
          }
      },

      plotOptions: {},
      credits: {
          enabled: false
      },
      exporting: {
          enabled: false
      },

      series: seriesData
  }
      Highcharts.chart(graphContainerId, chartOption);
    }

    changeGraphTimeFrame(event) {
      event.preventDefault();
      // let allChartSeries = highchartDataManipulation(this.props.childContentData.plotData);
      let $el = $(event.target);
      $el.parent().addClass("active");
      $el.parent().siblings().removeClass("active");
      let selectedYear = parseInt(($el.attr('data-year') || "0"));
      this.selectedItem = selectedYear;
      this.formulateData();
      // let chartObj = Highcharts.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')];
      // /*change toime frame event :- manually setting chart time frame */
      // this.setChartRange(chartObj, selectedYear, false);
  }


    renderGraphTimeFrame() {
      let activeTimeFrame = 11;
      return (
          <div className="container">
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
                          <div className={activeTimeFrame == 11 ? 'active' : ''}>
                              <a href="#" data-year="4" onClick={(e) => this.changeGraphTimeFrame(e)}>Since Inception
</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  }



    render() {
      // let requiredhistoricDataTable = this.props.childContentData.plotMetaData.requiredhistoricDataTable || false;
      // let perfType = this.props.childContentData.plotMetaData.perfType;
      let contentData:any;
        contentData = this.props.childContentData.plotData.length > 0 ? this.props.childContentData.plotData[this.selectedItem][this.selectedChart][0]["correlations"] : false;

        if(!contentData){
            return(
            <div>NOCHART</div>
            )
        }
      return (
        <div>
          <div className="col-md-12 high-chart-container no-padding barTable" id={this.props.id + "_container"} >
            <div className="blank-space-25" />
            {/* <h3 className="paragraph-title no-margin">{this.props.childContentData.plotTitle}</h3> */}
            {this.renderGraphTimeFrame()}
            {
                  contentData.map((key, index) => {
                      let uniqID = this.props.id+""+key.title;
                      return (
                              <div className="col-lg-6 no-margin" key={index}>
                              <h3 className="paragraph-title no-margin ">{key.title}</h3>
                              <div className="blank-space-25"></div>
                              <div id={uniqID.replace(/\s/g, '')+index} className="highchart-section" />
                              <div className="blank-space-25"></div>
                              </div>
                      )
            })}
          </div>
        </div>
      );
    }
  }
export default GroupChart;