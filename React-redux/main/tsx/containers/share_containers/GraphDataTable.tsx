import * as React from 'react';
import 'datatables.net';
import * as Highcharts from 'highcharts/highstock';
import * as moment from 'moment';
import { GRAPH_COLOR_SERIES } from '../../constants/constant';
import { highLightDataTableBands, removeHighLightDataTableBands } from '../../../utills/common';

export default class GraphDataTable extends React.Component<any, any>{



    componentDidMount() {
        const refChartId = this.props.refChartId;
        $(".showBox").on("click", function () {
            $(".showBox").removeClass("active");
            $(this).addClass("active");
            var type = $(this).attr("data-area");
            if (type === 'table') {
                $("#historicalTableWrap").css('display', 'block');
                $("#" + refChartId).css('display', 'none');
            } else {
                $("#historicalTableWrap").css('display', 'none');
                $("#" + refChartId).css('display', 'block');
            }
        });
    }

    componentDidUpdate() {

        const highlightBands = this.props.highlightBands;
        if (highlightBands == "enabled") {
            let hiddenSeries = (this.props.hiddenSeries || []);
            let innerSeries = (hiddenSeries || []).map((v, i) => [...v.series]);
            removeHighLightDataTableBands();
            highLightDataTableBands(innerSeries);
        } else {
            removeHighLightDataTableBands();
        }
    }


    rowTooggle(year) {
        event.preventDefault();
        let query = $("#historicalTable tr[data-year='" + year + "']");

        query.each((i, v) => {
            if (i != 0)
                $(v).toggle();
        })

    }

    generateTableContent() {

        let chartColor = GRAPH_COLOR_SERIES;
        let dataSet = this.props.data.filter(filterValue => {
            return !(filterValue.initialHideOnGraph)
        });
        let totalVisibleSeries = dataSet.length || 0;
        let selectedTimeFrame = this.props.selectedTimeFrame;
        let flatDataSet = dataSet.map(fvalue => {
            return [...fvalue.tableSeries]
        }).reduce((a, b) => {
            return a.concat(b);
        });
        let sortedDataSet = flatDataSet.sort((a, b) => {
            if (parseInt(a[0]) === parseInt(b[0])) {
                let _a = parseInt(a[a.length - 1]);
                let _b = parseInt(b[b.length - 1]);
                return _a - _b;
            }
            return parseInt(a[0]) - parseInt(b[0]);
        });
        let min, max;
        if (selectedTimeFrame.other.from) {
            min = moment(selectedTimeFrame.other.from || ($("#from" + this.props.id).val() || "").toString()).year();
            max = moment(selectedTimeFrame.other.to || ($("#to" + this.props.id).val() || "").toString()).year();
            sortedDataSet = sortedDataSet.filter((filterVal) => {
                return (filterVal[0] >= min && filterVal[0] <= max)
            })
        } else if (selectedTimeFrame.other.to) {
            min = moment(selectedTimeFrame.other.from || ($("#from" + this.props.id).val() || "").toString()).year();
            max = moment(selectedTimeFrame.other.to || ($("#to" + this.props.id).val() || "").toString()).year();
            sortedDataSet = sortedDataSet.filter((filterVal) => {
                return (filterVal[0] >= min && filterVal[0] <= max)
            })
        } else if (selectedTimeFrame.year) {
            let maxYear = sortedDataSet[(sortedDataSet.length - 1)][0];
            let conditionYear = maxYear - selectedTimeFrame.year;
            sortedDataSet = sortedDataSet.filter((filterVal) => {
                return filterVal[0] > conditionYear;
            })
        }
        // sortedDataSet.sort((a, b) => { a[0] == b[0] ? a[a.length - 1] - b[b.length - 1] : 1 });
        let contentData = sortedDataSet.map((val, index) => {
            let condition = index % totalVisibleSeries;
            let tdContent = val.map((value, innerIndex) => {
                if (innerIndex != val.length - 1)
                    return <td
                        onClick={() => { (condition == 0) && (innerIndex == 0) ? this.rowTooggle(value) : '' }}
                        className={(condition == 0) && (innerIndex == 0) ? "datatable-down-arrow" : ""}>
                        {value}
                        <div className={(innerIndex == 0) ? "square-ticker-annualized" : ""} style={{ "background-color": chartColor[val[val.length - 1]] }}></div>
                    </td>
            })
            return <tr data-year={val[0]} style={{ 'display': (condition == 0) ? 'table-row' : 'none' }}>{tdContent}</tr>
        });
        return contentData;
    }

    generateHeader() {
        let selectedFrequency = this.props.selectedFrequency || 1;
        let headerArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
        let tempArray = headerArray.map((value, index) => {
            if ((index + 1) % selectedFrequency == 0)
                return <th>{value}</th>
        })
        return (<tr>
            <th>YEAR</th>
            <th>YTD</th>
            {tempArray}
        </tr>)

    }
    render() {
        return (
            <div id="historicalTableWrap" className="container" style={{ display: 'none' }}>
                <table id="historicalTable" className="table table-bordered ">
                    <thead>
                        {this.generateHeader()}
                    </thead>
                    <tbody>
                        {this.generateTableContent()}
                    </tbody>
                </table>
            </div>
        );
    }
}