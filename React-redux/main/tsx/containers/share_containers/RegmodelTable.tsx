import * as React from 'react';
import 'datatables.net';
import * as Highcharts from 'highcharts/highstock';
import AddBenchMarkFund from './AddBenchMarkFund';
import { GRAPH_COLOR_SERIES } from '../../constants/constant';

export default class RegmodelTable extends React.Component<any, any>{

    componentDidMount() {
    }
    generateTableContent() {
       let chartColor = GRAPH_COLOR_SERIES;
        return (this.props.data || []).map((value, index) => {
            return (
                <tr>
                    <td>
                        <div className="square-ticker-annualized" style={{ 'background-color': chartColor[index] }}></div>
                        {/* {index > 0 ? <a onClick={() => { this.props.data.action(index) }}><span className="close-icon"></span></a> : null}  */}
                        {value.name}
                    </td>
                    <td>{value.coefficient}</td>
                    <td>{value.coeffInterval}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <table id="overviewPerformanceTable" className="table table-hover data-table-common overviewPerformanceTable">
                <thead>
                    <tr>
                        <th >BENCHMARK/FUND</th>
                        <th style={{width:120}}>COEFFICIENT</th>
                        <th style={{width:120}}>COEFFICIENT INTERVAL</th>
                    </tr>
                </thead>
                <tbody>
                    {this.generateTableContent()}
                    <tr className="addnewBenchmark">
                            <td scope="row" colSpan={3}>
                                <div className="buttonHolder">
                                   <AddBenchMarkFund chartId={this.props.id} />
                                </div>
                             
                            </td>
                        </tr>
                </tbody>
                {/* <tfoot>
                    <tr>
                        <td colSpan={(this.props.data) ? this.props.data.length : 4}>
                            <a > Add Benchmark / FUND</a>
                        </td>
                    </tr>
                </tfoot> */}
            </table>
        );
    }
}