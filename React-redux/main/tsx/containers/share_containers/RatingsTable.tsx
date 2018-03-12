import * as React from 'react';
import { connect } from "react-redux";
import { generateKey, ratingsTableStyleGuide } from "../../../utills/common";

class RatingsTable extends React.Component<any, any>{
    collection: { totalColumn: number; total: number; };
    constructor(props) {
        super(props);
        this.collection = { totalColumn: 0, total: 0 }
    }

    renderTableHeader() {
        let headerData = this.props.propsData[0].headers || [];
        this.collection["totalColumn"] = headerData.length;
        return headerData.map((val, index) => {
            return (
                <th key={generateKey("ratingsheader" + val)} className={index == 0 ? "col-md-3" : "col-md-2"}>{val}</th>
            );
        })
    }

    renderTableContent() {
        let rowData = this.props.propsData[0].rows || [];
        return rowData.map((val, index) => {
            let plotGraphFor: number, totalToPlotTheGraph: number, plotPercent: number;
            let startPlot = "";
            let allCellData = (val.data || []).map((value, innerIndex) => {
                let columnStyle = ratingsTableStyleGuide(value.metadata ? value.metadata.defaultProp : {} || {});
                let meta = value.metadata || "";
                if (meta) {
                    if (value.metadata.type == "plot") { plotGraphFor = parseFloat(value.data); totalToPlotTheGraph = parseFloat(value.metadata.total); this.collection["total"] = value.metadata.total }
                    if (value.metadata.type == "graph") { plotPercent = (plotGraphFor * 100) / totalToPlotTheGraph; startPlot = value.metadata.startPlot || "" }
                }
                if (plotPercent) {
                    if (startPlot == "") {
                        return (
                            <td key={generateKey(value.data)} className={(value.metadata.type == "graph" ? "no-left-padding no-right-padding" : "hidden-sm hidden-xs")} >
                                <div className="progress no-margin">
                                    <div className="progress-bar theme-blue-bg-color" role="progressbar" aria-valuenow={plotPercent} aria-valuemin={0} aria-valuemax={100} style={{ width: plotPercent + '%' }}>
                                        <span className="sr-only">40% Complete</span>
                                    </div>
                                </div>
                            </td>
                        );
                    } else if (startPlot == "center") {
                        return (
                            <div>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-success" role="progressbar" style={{ width: '50%', 'backgroundColor': 'transparent' }}>Free Space</div>
                                    <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: plotPercent + '%' }}>Danger</div>
                                </div>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-success" role="progressbar" style={{ width: '50%', 'float': 'right', 'backgroundColor': 'transparent' }}>Free Space</div>
                                    <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: (plotPercent / 2) + '%', 'float': 'right' }}>Danger</div>
                                </div>
                            </div>
                        );
                    }
                }

                return (

                    <td style={columnStyle} key={generateKey(value.data)} className={(!isNaN(value.data) ? "text-center" : "text-left")} dangerouslySetInnerHTML={{ __html: value.data }}>

                    </td>
                );
            });
            return (<tr key={generateKey("0")}> {allCellData} </tr>);
        });
    }
    renderTableFooter() {

        let footer: any = [];
        let headerData = this.props.propsData[0].headers || [];
        return headerData.map((val, index) => {
            if (headerData.length - 1 == index) {
                let total = this.collection["total"];
                let outputFooter: any = [];
                for (let i = 1; i <= total; i++) {
                    if (i == 1) {
                        outputFooter.push(
                            <div className="footer-lable">
                                <span className="no-padding text-left" style={{ float: "left" }}>0</span>
                                <span className="no-padding text-right" style={{ float: "right" }}>1</span>
                            </div>
                        )
                    } else {
                        outputFooter.push(<div className="no-padding text-right footer-lable">{i}</div>)
                    }
                }
                return [<td className="hidden-sm hidden-xs col-lg-12 no-padding no-border">{[...outputFooter]}</td>]
            } else {
                return <td className="no-border"></td>;
            }
        })
    }

    render() {
        return (
            <div className="col-lg-12 no-padding">
                <div className="blank-space-50"></div>
                <div className="table-responsive col-lg-12 no-padding">
                    <table className="table table-hover table-rating col-lg-12 col-md-12 col-sm-12 no-padding">
                        <thead>
                            <tr>
                                {this.renderTableHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableContent()}
                        </tbody>
                        <tfoot>
                            {this.renderTableFooter()}
                        </tfoot>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        propsData: props.data
    }
}

export default connect(mapStateToProps)(RatingsTable);