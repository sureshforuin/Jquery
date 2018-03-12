import * as React from 'react';
import 'datatables.net';
import * as Highcharts from 'highcharts/highstock';
import { GRAPH_COLOR_SERIES } from '../../constants/constant';

export default class OverviewPerformanceTable extends React.Component<any, any>{

    componentDidMount() {

    }
    generateTableContent() {
        let chartColor = GRAPH_COLOR_SERIES;
        return (this.props.data || []).map((value, index) => {
            return (
                <tr>
                    <td>
                        <div className="square-ticker-annualized" style={{ 'background-color': chartColor[index] }}></div>
                        {index > 0 ? <a onClick={() => { this.props.action(index) }}><span className="close-icon"></span></a> : null}
                        {value[0]}
                    </td>
                    <td>{value[1]}</td>
                    <td>{value[2]}</td>
                    <td>{value[3]}</td>
                    <td>{value[4]}</td>
                    <td>{value[5] == 0 ? 'N/A' : value[5]}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <table id="overviewPerformanceTable" className="table table-hover data-table-common overviewPerformanceTable">
                <thead>
                    <tr>
                        <th>BENCHMARK/FUND</th>
                        <th>1 Year</th>
                        <th>2 Year</th>
                        <th>3 Year</th>
                        <th>5 Year</th>
                        <th>Since Inception<br />(Jan 1998)</th>
                    </tr>
                </thead>
                <tbody>
                    {this.generateTableContent()}
                </tbody>

            </table>
        );
    }
}
