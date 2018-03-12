import * as Highcharts from "highcharts/highstock";
import * as React from "react";
import * as moment from "moment";
import { fetchWrapper } from "../../../utills/api_wrapper";
import {
  getYValue,
  generateKey,
  isObjEmpty
} from "../../../utills/common";
import { GRAPH_COLOR_SERIES, CHART_ROOT } from "../../constants/constant";

class UpDownChart extends React.Component<any, any> {
  chartObj: any;
  selectedItem = 4;
  frequency = 0;
  chartType;
  captureData:any = {};
  upDownBetaNode =  "Up Down Beta";
  upDownCaptureNode =  "Up Down Capture";
  selectedIndex = 0;

  constructor(props) {
    super(props);
     this.selectedItem =  this.props.data.plotData.length - 1;
     this.frequency = 0;
    this.selectedIndex = 0;
    this.captureData = this.props.data.plotData[this.selectedItem]["Up Down Capture"][this.selectedIndex];
  }

  componentDidMount() {
    this.formulateData();
  }

  componentDidUpdate(){
  }

  getSinceInception(){
    return this.props.data.plotData.length - 1;
  }


  formulateData() {
    // this.state.chartdata.map((k,i) => {
      var totalChart = this.props.data.plotData[this.getSinceInception()][this.props.chartType];
      totalChart.map((key,index) => {
          if(this.props.chartType == this.upDownBetaNode){

            let lineObj:any = {
              type: "line",
              color: "#BCBCBC",
              data:  key.line.series,
              marker: {
                enabled: false
              },
              states: {
                hover: {
                  lineWidth: 0
                }
              },
              enableMouseTracking: false
            }

            let scatterObj:any = {
              color: "rgba(15, 142, 199, .75)",
              data:  key.scatterPlot.series,
              marker: {
                symbol: "circle",
                radius: 7
              }
            };
            let seriesData = [];
            seriesData.push(lineObj);
            seriesData.push(scatterObj);

            this.renderHighChart(this.props.chartType, this.props.chartType.replace(/\s/g, '')+index,seriesData);
          }else{
              let required  = ["upCapture","downCapture","upUp","downDown"];
              let seriesData = [];
              required.map((k,i) => {
                  let data = [];
                  data.push(key[k]);
                  let obj:any = {
                          name: k,
                          data:data ,
                          color: GRAPH_COLOR_SERIES[i]
                  }
                      seriesData.push(obj);
              })
                   this.renderHighChart(this.props.chartType, this.props.chartType.replace(/\s/g, '')+index, seriesData);
          }
      })
    // });
  }

  renderHighChart(chartType, id, series) {
    this.state = {changed:false};
    let metaData = this.props.data.plotMetaData;
    let chartColor = GRAPH_COLOR_SERIES;
    let graphContainerId = id;

    let graphType, stacking;
    let navigator = this.props.data.plotMetaData.navigator || false;
    let navigatorSeries: any = [];

    let chartOption: any;
    let _selfOuter: any = this;
    chartOption = {
      chart: {
        zoomType: "xy",
        backgroundColor: "#FAFAFA",
        style: {
          fontFamily: "pf_dintext_proregular",
          fontSize: "15px"
        }
      },
      title: {
        text: ""
      },
      yAxis: {
        title: ""
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
      tooltip: {
        enabled: false
      },

      plotOptions: {
        scatter: {
          color: "red",
          marker: {
            radius: 15,
            states: {
              hover: {
                enabled: true,
                lineColor: "rgb(100,100,100)"
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          }
          // tooltip: {
          //     headerFormat: '<b>{series.name}</b><br>',
          //     pointFormat: '{point.x} cm, {point.y} kg'
          // }
        }
      },
      series: series
    };

    chartOption.chart.type = "scatter";
    if(chartType != "Up Down Beta"){
        chartOption.chart.type = "column";
        chartOption.series = {};
        chartOption.series = series;
    }
    Highcharts.chart(graphContainerId, chartOption);
  }

  changeGraphTimeFrame(event) {
    event.preventDefault();
    // let allChartSeries = highchartDataManipulation(this.props.data.plotData);
    let $el = $(event.target);
    $el.parent().addClass("active");
    $el.parent().siblings().removeClass("active");
    let selectedYear = parseInt(($el.attr('data-year') || "0"));
    this.selectedItem = selectedYear;
    this.forceUpdate();
    let _self = this;
    this.captureData = this.props.data.plotData[this.selectedItem]["Up Down Capture"][this.selectedIndex];
    setTimeout(function(){ _self.setChartRange() }, 1000);
    // let chartObj = Highcharts.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')];
    // /*change toime frame event :- manually setting chart time frame */
    // this.setChartRange(chartObj, selectedYear, false);
}

setChartRange() {
    var totalChart = this.props.data.plotData[this.selectedItem][this.props.chartType];
    totalChart.map((key,index) => {
        if(this.props.chartType == this.upDownBetaNode){
          let lineObj:any = {
            type: "line",
            color: "#BCBCBC",
            data:  key.line.series,
            marker: {
              enabled: false
            },
            states: {
              hover: {
                lineWidth: 0
              }
            },
            enableMouseTracking: false
          }

          let scatterObj:any = {
            color: "rgba(15, 142, 199, .75)",
            data:  key.scatterPlot.series,
            marker: {
              symbol: "circle",
              radius: 7
            }
          };
          let seriesData = [];
          seriesData.push(lineObj);
          seriesData.push(scatterObj);
            this.renderHighChart(this.props.chartType, this.props.chartType.replace(/\s/g, '')+index, seriesData);
        }else{
            let required  = ["upCapture","downCapture","upUp","downDown"];
            let seriesData = [];
            required.map((k,i) => {
                let data = [];
                data.push(key[k]);
                let obj:any = {
                        name: k,
                        data:data ,
                        color: GRAPH_COLOR_SERIES[i]
                }
                    seriesData.push(obj);
            })
                 this.renderHighChart(this.props.chartType, this.props.chartType.replace(/\s/g, '')+index, seriesData);
        }
    })
}


  renderGraphTimeFrame() {
      let activeTimeFrame = (this.props.data.plotMetaData.timeFrame || {}).active || 11;
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

changeFrequency(index){
  if(this.props.chartType == this.upDownCaptureNode){
    this.captureData = this.props.data.plotData[this.selectedItem]["Up Down Capture"][index]
    // this.setState({selectedIndex:index});
    this.selectedIndex = index;
    this.forceUpdate();
    
  }
}

  renderUpDownChart(){
    let tableData = this.props.chartType == this.upDownBetaNode ? true : false;
    let _self = this;
    return (
      this.props.data.plotData[this.selectedItem][this.props.chartType].map((key, index) => {
        return (
                <div className="col-lg-4 no-margin">
                <h3 className="paragraph-title no-margin ">{key.name}</h3>
                <div className="blank-space-25"></div>
                <div id={this.props.chartType.replace(/\s/g, '')+index} 
                 className={_self.selectedIndex == index ? 'highchart-section selected':'highchart-section disabled'} 
                 onClick={(e) => { this.changeFrequency(index) }}
                />
                {tableData ?
                  <div className="row">
                  <div className="col-lg-6 up-down">
                      <div className="uppercase">Up Beta</div>
                      <div className="big">{key.upBeta}%</div>
                      <div>R2</div>
                      <div>Annualized Alpha</div>
                      <div>Market Timing Skill</div>
                      <div>Significance</div>
                  </div>

                  <div className="col-lg-6 up-down">
                      <div className="uppercase">DOWN BETA</div>
                      <div className="big">{key.downBeta}%</div>
                      <div className="weight-normal">{key.rSquare}%</div>
                      <div className="weight-normal">{key.annualAlpha}%</div>
                      <div className="weight-normal">{key.likelihood}</div>
                      <div className="weight-normal">{key.evidence}%</div>
                  </div>
                  </div>
                : ''}

                </div>
        )
})
    )
  }

  renderTicker() {
       let tableData = this.props.chartType == this.upDownCaptureNode ? true : false;
        let chartData:any = this.captureData;
        let chartColor = GRAPH_COLOR_SERIES;
                return (
                    <div>
                      {tableData ?
                        <div>
                          <div className="row">
                            <div key={generateKey("GraphvalueIndicator_")} className="unit d-none cloneUnit pull-left" style={{ margin: '10px' }}>
                                <div className="blue box" style={{ backgroundColor: chartColor[0] }}></div>
                                <h4 className="no-margin">Up Capture</h4>
                                <div className="number d-flex align-items-end legend1">{chartData.upCapture ? chartData.upCapture  : "--" }</div>
                            </div>
                            <div key={generateKey("GraphvalueIndicator_")} className="unit d-none cloneUnit pull-left" style={{ margin: '10px' }}>
                                <div className="blue box" style={{ backgroundColor: chartColor[1] }}></div>
                                <h4 className="no-margin">Down Capture</h4>
                                <div className="number d-flex align-items-end legend1">{chartData.downCapture ? chartData.downCapture  : "--" }</div>
                            </div>
                             <div key={generateKey("GraphvalueIndicator_")} className="unit d-none cloneUnit pull-left" style={{ margin: '10px' }}>
                                <div className="blue box" style={{ backgroundColor: chartColor[2] }}></div>
                                <h4 className="no-margin">Up Up</h4>
                                <div className="number d-flex align-items-end legend1">{chartData.upUp ? chartData.upUp  : "--" }</div>
                            </div>
                             <div key={generateKey("GraphvalueIndicator_")} className="unit d-none cloneUnit pull-left" style={{ margin: '10px' }}>
                                <div className="blue box" style={{ backgroundColor: chartColor[3] }}></div>
                                <h4 className="no-margin">Up Down</h4>
                                <div className="number d-flex align-items-end legend1">{chartData.downDown ? chartData.downDown  : "--" }</div>
                            </div>
                          </div>
                           <div className="blank-space-54"></div> 
                          </div>
                      :''}
                      </div>
                );
        // return [...graphIndicator];
    }

  render() {
    return (
            <div>
                 <h1 className="bottom-border-gray no-margin main-title">{this.props.chartType}</h1> 
                {/* <h3 className="paragraph-title no-margin">{k}</h3> */}
                <div className="col-md-12 high-chart-container no-padding" id={this.props.chartType.replace(/\s/g, '') + "_container"} >
                <div className="blank-space-25" />
                 {this.renderGraphTimeFrame()}
                   {this.renderTicker()} 
                 <div className="row">
                  {this.renderUpDownChart()}
                </div>
                <div className="blank-space-54"></div>
                <div className="blank-space-54"></div>
                </div>
            </div>
    )
  }
}
export default UpDownChart;