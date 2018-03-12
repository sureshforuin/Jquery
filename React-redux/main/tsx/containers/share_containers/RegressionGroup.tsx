import * as Highcharts from "highcharts/highstock";
import * as React from "react";
import * as moment from "moment";
import { fetchWrapper } from "../../../utills/api_wrapper";
import { getYValue, generateKey, isObjEmpty, highchartDataManipulation } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, CHART_ROOT } from "../../constants/constant";
import RegressionChart from './RegressionChart'

class RegressionGroup extends React.Component<any, any> {
  chartObj: any;

  constructor(props) {
    super(props);
    this.state = { chartdata: [] };
    this.state = { timeframe: 10 };
    this.state = { regTimeframe: 4 };
    let parentData = this.props.parentData[0] || [] ? this.props.parentData[0].data : [];
    this.state = { parentData: parentData };
  }

  componentDidMount() {
        // this.state.parentData.map((key,index) => {
        //   let activeChartData = this.props.childContentData[key.id];
        // })
        this.activeDatapicker();
  }

  activeDatapicker(){
    let $from = $("#from" + this.props.id) as any,
                $to = $("#to" + this.props.id) as any;
            let _self: any = this;
            $from.datepicker({
                defaultDate: "+1w",
                changeMonth: true,
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
                numberOfMonths: 1,
                onSelect: function (date) {
                    _self.changeGraphTimeFrame(event, { from: date });
                }
            }).on("change", function () {
                $from.datepicker("option", "maxDate", $to.val());
            });
  }

  renderTicker(activeChartData) {
        let data = activeChartData.plotData || [];
        let graphContainerId = activeChartData.plotTitle.replace(/\s/g, '');
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

   renderGraphTimeFrame() {
        let activeTimeFrame = 20;
        return (
            <div className="container no-padding">
                <div className="blank-space-25"></div>
                <div className="content-area">
                    <div className="timeframe graph-timeframe">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav highchart-timeframe-container">
                            <div className={activeTimeFrame == 1 ? 'active' : ''}>
                                <a href="#" data-year="1" data-reg="0" onClick={(e) => this.changeGraphTimeFrame(e)}>1 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 3 ? 'active' : ''}>
                                <a href="#" data-year="3" data-reg="1" onClick={(e) => this.changeGraphTimeFrame(e)}>3 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 5 ? 'active' : ''}>
                                <a href="#" data-year="5" data-reg="2" onClick={(e) => this.changeGraphTimeFrame(e)}>5 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 10 ? 'active' : ''}>
                                <a href="#" data-year="10" data-reg="3" onClick={(e) => this.changeGraphTimeFrame(e)}>10 Yr</a>
                            </div>
                             <div className={activeTimeFrame == 20 ? 'active' : ''}>
                                <a href="#" data-year="20" data-reg="4"  onClick={(e) => this.changeGraphTimeFrame(e)}>Since Inception</a>
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

    changeGraphTimeFrame(event) {
        event.preventDefault();
        let allChartSeries = this.props.highChartData;
        let $el = $(event.target);
        $el.parent().addClass("active");
        $el.parent().siblings().removeClass("active");
        let selectedYear = parseInt(($el.attr('data-year') || "0"));
        let regYear = parseInt(($el.attr('data-reg') || "0"));
        let chartObj = Highcharts.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')];
        /*change toime frame event :- manually setting chart time frame */
        // / this.setChartRange(chartObj, selectedYear, false);
        this.setState( (state) => ({timeframe: selectedYear }));
        this.setState( (state) => ({regTimeframe: regYear }));
    }

  renderRegGroupChart() {
    return(
        this.state.parentData.map((key,index) => {
          let activeChartData = this.props.childContentData[key.id];
          let id = key.id.replace(/\s/g, '');
          return (
            <div className="col-lg-6">
               <RegressionChart chartData={activeChartData} id={id} timeframe={this.state.timeframe} regTimeframe={this.state.regTimeframe?this.state.regTimeframe:4} />
            </div>
          );
        })
    )
  }

  render() {
    return (
      <div>
        <div className="col-md-12 high-chart-container no-padding" id={this.props.id.replace(/\s/g, '') + "_container"} >
          <div className="blank-space-25" ></div>
          {this.renderGraphTimeFrame()}
           <div className="row">
            {this.renderRegGroupChart()}
          </div>
          <div className="blank-space-54"></div>
        </div>
      </div>
    )
  }
}
export default RegressionGroup;