import * as Highcharts from 'highcharts/highcharts';
import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


class UpdownBeta extends React.Component<any, any> {

    componentWillMount() {
        console.log("componentDid Mount ");

    }

    componentDidMount() {
        console.log("componentDid Update");
        this.renderupDownbetaChart();
    }

    renderMonthlyChart(placeHolde){

        var seriesData = [
      {
        name: "Up Capture",
        data: [0.5],
        color: "#0F8EC7"
      },
      {
        name: "Down Capture",
        data: [-.45],
        color: "#005C8F"
      },
      {
        name: "Up Up",
        data: [0.4],
        color: "#E3D7AB"
      },
      {
        name: "Down Down",
        data: [0.6],
        color: "#C9B160"
      }
    ];

        Highcharts.chart(placeHolde, {
    chart: {
        type: 'scatter',
        zoomType: 'xy',
        backgroundColor: "#FAFAFA",
        style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
        
    },
    xAxis: {
        // categories: [''],
        // enabled: false,
        // title: "dsds"
    },
    title: {
        text: ''
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
    tooltip:{
        enabled: false
    },
    plotOptions: {
        scatter: {
            color: 'red',
            marker: {
                radius: 15,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            // tooltip: {
            //     headerFormat: '<b>{series.name}</b><br>',
            //     pointFormat: '{point.x} cm, {point.y} kg'
            // }
        }
    },
    series: [{
            type: 'line',
            name: 'Regression Line',
            color: '#BCBCBC',
            data: [
    [-7, -6],
    [6.7, 7]
],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        },
        {
            name: '',
            color: 'rgba(15, 142, 199, .75)',

            data: [
    [2.8, 1.1],
    [0.3, -2.3],
    [4.1, -6.8],
    [4.3, 1.9],
    [-1.4, 5.3],
    [7.2, 1],
    [5.7, 4.3],
    [0.9, -3.5],
    [-3.6, 3.9],
    [6.4, -4.4],
    [1.7, 2.4],
    [-2.2, 0],
    [2.7, 1],
    [-4.8, 3.8],
    [-5.1, 5.4],
    [0.4, -5.2],
    [-2.5, -4.1],
    [-6.9, 5.9],
    [-3.6, 0.5],
    [7, -4.2],
    [1.8, 3.9],
    [-6.4, -0.8],
    [4.6, 2.2]
],
            marker: {
                symbol: 'circle',
                radius: 7
            }
        }
    ]
});
    }

    renderupDownbetaChart() {
        console.log("renderLineChart");
        this.renderMonthlyChart("updownBeta-Monthly");
        this.renderMonthlyChart("updownBeta-Quarterly");
        this.renderMonthlyChart("updownBeta-Semi");

    }


    render() {
        return (
            <div className="content-area col-lg-12">
                    <h3 className="subheading">Up/Down Beta - Regression-Based Analysis </h3>
                    <div className="timeframe" id="upDownBetaRegression">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav">
                            <div>
                                <a href="#" data-year="1">1 Yr</a>
                            </div>
                            <div>
                                <a href="#" data-year="3">3 Yr</a>
                            </div>
                            <div>
                                <a href="#" data-year="5">5 Yr</a>
                            </div>
                            <div>
                                <a href="#" data-year="10">10 Yr</a>
                            </div>
                            <div className="active">
                                <a href="#" data-year="15">Since Inception</a>
                            </div>
                            <div>
                                <a href="#" data-year="18">Other</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <h3 className="subheading18 ">Monthly Returns</h3>
                            <div className="d-flex flex-row addUnit">
                            </div>
                            <div id="updownBeta-Monthly" className="highchart-section small"></div>
                            <div className="row">
                                <div className="col-lg-6 up-down">
                                    <div className="uppercase">Up Beta</div>
                                    <div className="big">0.03%</div>
                                    <div>R2</div>
                                    <div>Annualized Alpha</div>
                                    <div>Market Timing Skill</div>
                                    <div>Significance</div>
                                </div>

                                <div className="col-lg-6 up-down">
                                    <div className="uppercase">Up Down</div>
                                    <div className="big">0.03%</div>
                                    <div className="weight-normal">12.56%</div>
                                    <div className="weight-normal">22.86%</div>
                                    <div className="weight-normal">No</div>
                                    <div className="weight-normal">0.42%</div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <h3 className="subheading18 ">Quarterly Returns</h3>
                            <div className="d-flex flex-row addUnit">
                            </div>

                            <div id="updownBeta-Quarterly" className="highchart-section small"></div>
                            <div className="row">
                                <div className="col-lg-6 up-down">
                                    <div className="uppercase">Up Beta</div>
                                    <div className="big">0.03%</div>
                                    <div>R2</div>
                                    <div>Annualized Alpha</div>
                                    <div>Market Timing Skill</div>
                                    <div>Significance</div>
                                </div>

                                <div className="col-lg-6 up-down">
                                    <div className="uppercase">Up Down</div>
                                    <div className="big">0.03%</div>
                                    <div className="weight-normal">12.56%</div>
                                    <div className="weight-normal">22.86%</div>
                                    <div className="weight-normal">No</div>
                                    <div className="weight-normal">0.42%</div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <h3 className="subheading18 ">Semi-Annual Returns</h3>
                            <div className="d-flex flex-row addUnit">
                            </div>
                            <div id="updownBeta-Semi" className="highchart-section small"></div>
                            <div className="row">
                                <div className="col-lg-6 up-down">
                                    <div className="uppercase">Up Beta</div>
                                    <div className="big">0.03%</div>
                                    <div>R2</div>
                                    <div>Annualized Alpha</div>
                                    <div>Market Timing Skill</div>
                                    <div>Significance</div>
                                </div>

                                <div className="col-lg-6 up-down">
                                    <div className="uppercase">Up Down</div>
                                    <div className="big">0.03%</div>
                                    <div className="weight-normal">12.56%</div>
                                    <div className="weight-normal">22.86%</div>
                                    <div className="weight-normal">No</div>
                                    <div className="weight-normal">0.42%</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
        );
    }
}


export default UpdownBeta;