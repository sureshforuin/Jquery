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
import HighChart  from './HighChart'
import UpDownChart  from './UpDownChart'

class GroupBarChart extends React.Component<any, any> {
  chartObj: any;
  
  constructor(props) {
    super(props);
    this.state = { chartdata : [] };
    let chartData  =  ["Up Down Beta","Up Down Capture"];
    this.state = { chartdata :  chartData};
  }

  componentDidMount() {
  }

  render() {
    return (
        this.state.chartdata.map((k,i) => {
          return <UpDownChart data={this.props.childContentData} chartType={k} />
        })
    );
  }
}
export default GroupBarChart;