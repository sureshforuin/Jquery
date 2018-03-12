import * as Highcharts from 'highcharts/highcharts';
import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


class Overview extends React.Component<any, any> {

    componentWillMount() {
        console.log("componentDid Mount ");

    }

    componentDidMount() {
        console.log("componentDid Update");
        this.renderOverviewChart();
    }

    renderOverviewChart() {
        console.log("renderLineChart");

        Highcharts.chart('overviewChart', {
            chart: {
                type: "column",
                backgroundColor: null,
                style: {
                    fontFamily: "pf_dintext_proregular",
                    fontSize: "15px"
                }
            },
            title: {
                text: ""
            },
            credits: {
                enabled: false
            },
            rangeselector: {
                enabled: false
            },
            navigator: {
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
            xAxis: {
                categories: ["", "", "", "1 YR", "2 YRS", "3 YRS", "5 YRS", "SINCE INCEPTION"],
                crosshair: true
            },
            yAxis: {
                min: 0,
                tickInterval: 5,
                labels: {
                    format: '{value} %'
                },
                title: {
                    text: ""
                }
            },
            // tooltip: {
            //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            //   pointFormat:
            //     '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            //   footerFormat: "</table>",
            //   shared: true,
            //   useHTML: true
            // },
            plotOptions: {
                series: {
                    pointPadding: 0
                },
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            series: [
                {
                    data: [0, 0, 0, 14.9, 12.71, 11.01, 1.3, 2.8],
                    color: "#2A7ABB"
                },
                {
                    data: [0, 0, 0, 17, 9.71, 9.1, 2.3, 3.8],
                    color: "#A89246"
                },
                {
                    data: [0, 0, 0, 10.1, 8.71, 5.2, 12.3, 17.8],
                    color: "#17477B"
                }
            ]

        });

    }


    render() {
        return (
            <div className="container chartArea">
                <div className="col-lg-12 content-area mainDetails">
                    <div className="col-lg-5">
                        <div className="fund_title">Fund Overview</div>
                        <div className="col-col-12">
                            <div className="fund_overview">
                                <span>Managed by Citadel Advisors LLC(AUM $26.8B)</span>
                                <br />
                                <span>Formed 01/01/1995</span>
                            </div><br />
                            <div className="fund_content">Advisory Solutions that offer recommendations, advice, and account administration oversight
                                    for clients who wish to retain ownership of hedge fund positions. Provide customized
                                    investment recommendations designed to address clients specific requirements, such as
                                    risk exposures, retain targets, strategy constraints, liquidity preferences, and integration
                                    with existing investments </div><br />
                            <a className="fund_link" href="">Fund description ></a>
                        </div>
                    </div>
                    <div className="col-lg-2">
                    </div>
                    <div className="col-lg-5">
                        <div className="fund_title">Fund Highlights</div>
                        <div className="row fund_inner_content">
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">STRATEGY/SUBSTRATEGY</div>
                                </div>
                                <div className="row fund_subhead_content">Growth / Multi-Strategy</div>
                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">AUM</div>
                                </div>
                                <div className="row fund_subhead_content">$18.1B(as of jan 2017)</div>
                            </div>
                        </div>
                        <br />
                        <div className="row fund_inner_content">
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">STRUCTURE</div>
                                </div>
                                <div className="row fund_subhead_content">LLC</div>

                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">DOMICILE</div>
                                </div>
                                <div className="row fund_subhead_content">Bermuda Corp</div>
                            </div>
                        </div>
                        <br />
                        <div className="row fund_inner_content">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="fund_subhead">GEOGRAPHIC FOCUS</div>
                                </div>
                                <div className="row fund_subhead_content">United States, Europe</div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 content-area">
                    <div className="col-lg-5">
                        <div className="fund_title">Key Personnel</div>

                        <div className="row fund_inner_content">
                            <div className="col-lg-5">
                                <div className="row key_name">Lloyd Pratt</div>
                                <div className="row fund_subhead_content">Fund Manager since 2004</div>

                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                                <div className="row key_name">
                                    Sally Carter
                                </div>
                                <div className="row fund_subhead_content">Fund Manager since 2009</div>
                            </div>
                        </div>
                        <br />
                        <div className="row fund_inner_content">
                            <div className="col-lg-12">
                                <div className="row key_name">
                                    Sean Cunningham
                                </div>
                                <div className="row fund_subhead_content">Fund Manager since 2012</div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2">
                    </div>
                    <div className="col-lg-5">
                        <div className="fund_title">Service Providers</div>
                        <div className="row fund_inner_content">
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">ADMINISTRATOR</div>
                                </div>
                                <div className="row fund_subhead_content">
                                    <span>Northern trust Hedge</span>
                                    <br />
                                    <span>Fund Service</span>
                                </div>

                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">AUDITOR</div>
                                </div>
                                <div className="row fund_subhead_content">Pricewater Coopers</div>
                            </div>
                        </div>
                        <br />
                        <div className="row fund_inner_content">
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">PRIME BROKERS</div>
                                </div>
                                <div className="row fund_subhead_content">Bermuda Corp</div>


                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                                <div className="row">
                                    <div className="fund_subhead">LEGAL COUNSEL</div>
                                </div>
                                <div className="row fund_subhead_content">Legal Firm Name</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 content-area">
                    <div className="col-lg-12">
                        <div className="fund_title">Share Class</div>
                        <table className="table table-striped-overview table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">SHARE CLASS</th>
                                    <th scope="col">LIQUIDITY</th>
                                    <th scope="col" className="text-center">MANAGEMENT FEES</th>
                                    <th scope="col" className="text-center">INCENTIVE FEES</th>
                                    <th scope="col" className="text-center">MINIMUM INITIAL INVESTMENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="cloneUnit hide">
                                    <td scope="row"></td>
                                    <td className="text-center"></td>
                                    <td className="text-center"></td>
                                </tr>
                                <tr>
                                    <td scope="row text-center">
                                        A<br /><a className="fund_link" href="">Details</a></td>
                                    <td> <span>1) Quarterly class - 45 day notice with 5% fund level, 10% investor level gates with 4-7% penalty if gates exceeded.
                                        </span><br />
                                        <span> 2) Committed class - 90 day notice with 18 months locking-up. No gate.</span></td>
                                    <td className="text-center">0.24%</td>
                                    <td className="text-center">0.02%</td>
                                    <td className="text-center">$1,000,000</td>
                                </tr>
                                <tr>
                                    <td scope="row text-center">
                                        B<br /><a className="fund_link" href="">Details</a></td>
                                    <td>1) Quarterly class - 45 day notice with 5% fund level, 10% investor level gates with font font
                                                    4-7% penalty if gates exceeded...</td>
                                    <td className="text-center">0.24%</td>
                                    <td className="text-center">0.02%</td>
                                    <td className="text-center">$1,000,000</td>
                                </tr>
                                <tr>
                                    <td scope="row text-center">
                                        C<br /><a className="fund_link" href="">Details</a></td>
                                    <td>1) Quarterly class - 45 day notice with 5% fund level, 10% investor level gates with
                                                        4-7% penalty if gates exceeded...</td>
                                    <td className="text-center">0.24%</td>
                                    <td className="text-center">0.02%</td>
                                    <td className="text-center">$1,000,000</td>
                                </tr>
                                <tr>
                                    <td className="text-center last_row" colSpan={5}>
                                        <a className="fund_link" href="">Show Full Table</a>
                                    </td>

                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-12 content-area">
                    <div className="col-lg-12" id="overview-performance-wrap">
                        <div className="fund_title">Performance Overview(as of Jan 2017)
                    <a className="fund_link_right" href="">Performance Details >
                    </a>
                        </div>
                        <div className="row fund_subtitle">
                            Key Statistics Since Inception
                        </div>
                        <div className="">
                            <table className="table table-striped-overview table-bordered" >
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-center" style={{ width: 12 }} >ANNUALIZED RETURN</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }} >ANNUALIZED STANDARD DEVIATION</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }} >ANNUALIZED SHARP RATIO</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }} >ANNUALIZED SORTINO RATIO</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }}>ANNUALIZED DOWNSIDE DEVIATION</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }}>PERCENT POSITIVE MONTHS</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }}>MAX DRAWDOWN</th>
                                        <th scope="col" className="text-center" style={{ width: 12 }}>BETA VS. SPTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">15.38%</td>
                                        <td className="text-center">10.74%</td>
                                        <td className="text-center">1.25%</td>
                                        <td className="text-center">1.65%</td>
                                        <td className="text-center">8.10%</td>
                                        <td className="text-center">82.83%</td>
                                        <td className="text-center">-54.94%</td>
                                        <td className="text-center">0.22%</td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                        <div className="row fund_subtitle">
                            Performance
                    </div>

                        <div id="overviewChart" className="highchart-section"></div>
                        <table className="table table-striped table-bordered benchmark-table" id="bench_table">
                            <thead>
                                <tr>
                                    <th scope="col" >BENCHMARK/FUND</th>
                                    <th scope="col" className="text-center" style={{ width: 75 }} >1 YR</th>
                                    <th scope="col" className="text-center" style={{ width: 75 }}>2 YRS</th>
                                    <th scope="col" className="text-center" style={{ width: 75 }}>3 YRS</th>
                                    <th scope="col" className="text-center" style={{ width: 75 }}>5 YRS</th>
                                    <th scope="col" className="text-center" style={{ width: 150 }}>SINCE INCEPTION BENCHMARK/FUND (01/01/1998)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> Citadel Kensington Global StrategiesFund LTD.</td>
                                    <td className="text-center">14.90%</td>
                                    <td className="text-center">7.71%</td>
                                    <td className="text-center">11.73%</td>
                                    <td className="text-center">15.03%</td>
                                    <td className="text-center">15.38%</td>
                                </tr>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> S&P 500 TR USD</td>
                                    <td className="text-center">14.90%</td>
                                    <td className="text-center">7.71%</td>
                                    <td className="text-center">11.73%</td>
                                    <td className="text-center">15.03%</td>
                                    <td className="text-center">15.38%</td>
                                </tr>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> MSCI World Gross (LCL)</td>
                                    <td className="text-center">14.90%</td>
                                    <td className="text-center">7.71%</td>
                                    <td className="text-center">11.73%</td>
                                    <td className="text-center">15.03%</td>
                                    <td className="text-center">15.38%</td>
                                </tr>
                                <tr className="addnewBenchmark">
                                    <td scope="row">


                                        <div className="buttonHolder">
                                            <span className="addButton-1" data-toggle="modal" data-target=".overview_model">
                                                Add Benchmark/Fund
                                        </span>

                                        </div>
                                    </td>
                                    <td className="text-center" colSpan={5}></td>
                                </tr>

                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="col-lg-12 content-area">
                    <div className="fund_title">Correlated Funds</div>
                    <div className="row fund_subtitle">
                        Most Positively Similar
                </div>
                    <table className="table table-striped-funds table-bordered" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th scope="col">FUND</th>
                                <th scope="col" className="text-center">STRATEGY</th>
                                <th scope="col" className="text-center">FUND AUM</th>
                                <th scope="col" className="text-center">INCEPTION DATE</th>
                                <th scope="col" className="text-center">GEOGRAPHIC FOCUS</th>
                                <th scope="col" className="text-center">PERFORMANCE</th>
                                <th scope="col" className="text-center">VOLATILITY</th>
                                <th scope="col" className="text-center">CORRELATION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row">
                                    <span>
                                        <a href="#">
                                            {/* <img className="table_close" src="images/close-button.svg" /> */}

                                        </a>
                                    </span> Citadel Kensington Global StrategiesFund LTD.</td>
                                <td className="text-center">Multi-Strategy</td>
                                <td className="text-center">$540M</td>
                                <td className="text-center">01/04/1998</td>
                                <td className="text-center">US</td>
                                <td className="text-center">9.88%</td>
                                <td className="text-center">10.74%</td>
                                <td className="text-center">0.99%</td>
                            </tr>
                            <tr>
                                <td scope="row">
                                    <span>
                                        <a href="#">
                                            {/* <img className="table_close" src="images/close-button.svg" /> */}

                                        </a>
                                    </span> S&P 500 TR USD</td>
                                <td className="text-center">Multi-Strategy</td>
                                <td className="text-center">$290M</td>
                                <td className="text-center">01/04/1998</td>
                                <td className="text-center">US</td>
                                <td className="text-center">5.17%</td>
                                <td className="text-center">7.34%</td>
                                <td className="text-center">0.98%</td>
                            </tr>
                            <tr>
                                <td scope="row">
                                    <span>
                                        <a href="#">
                                            {/* <img className="table_close" src="images/close-button.svg" /> */}

                                        </a>
                                    </span> Sachem Head Offshore Ltd.</td>
                                <td className="text-center">Event Driven equity</td>
                                <td className="text-center">$425M</td>
                                <td className="text-center">01/04/1998</td>
                                <td className="text-center">US, Europe</td>
                                <td className="text-center">10.74%</td>
                                <td className="text-center">12.64%</td>
                                <td className="text-center">0.97%</td>

                            </tr>


                        </tbody>
                    </table>
                    <div className="row fund_subtitle">
                        Most Dissimilar
                    </div>
                    <div>
                        <table className="table table-striped-funds table-bordered" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th scope="col">FUND</th>
                                    <th scope="col" className="text-center">STRATEGY</th>
                                    <th scope="col" className="text-center">FUND AUM</th>
                                    <th scope="col" className="text-center">INCEPTION DATE</th>
                                    <th scope="col" className="text-center">GEOGRAPHIC FOCUS</th>
                                    <th scope="col" className="text-center">PERFORMANCE</th>
                                    <th scope="col" className="text-center">VOLATILITY</th>
                                    <th scope="col" className="text-center">CORRELATION</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> Citadel Kensington Global StrategiesFund LTD.</td>
                                    <td className="text-center">Multi-Strategy</td>
                                    <td className="text-center">$540M</td>
                                    <td className="text-center">01/04/1998</td>
                                    <td className="text-center">US</td>
                                    <td className="text-center">9.88%</td>
                                    <td className="text-center">10.74%</td>
                                    <td className="text-center">0.01%</td>
                                </tr>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> S&P 500 TR USD</td>
                                    <td className="text-center">Multi-Strategy</td>
                                    <td className="text-center">$290M</td>
                                    <td className="text-center">01/04/1998</td>
                                    <td className="text-center">US</td>
                                    <td className="text-center">5.17%</td>
                                    <td className="text-center">7.34%</td>
                                    <td className="text-center">0.02%</td>
                                </tr>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> Sachem Head Offshore Ltd.</td>
                                    <td className="text-center">Event Driven equity</td>
                                    <td className="text-center">$425M</td>
                                    <td className="text-center">01/04/1998</td>
                                    <td className="text-center">US, Europe</td>
                                    <td className="text-center">10.74%</td>
                                    <td className="text-center">12.64%</td>
                                    <td className="text-center">0.03%</td>

                                </tr>


                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        );
    }
}


export default Overview;