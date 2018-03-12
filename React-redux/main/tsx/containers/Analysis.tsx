import * as Highcharts from 'highcharts/highstock';
import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import UpdownBeta from '../containers/UpDownBeta';
import UpdownCapture from '../containers/UpDownCapture';
import Correlations from '../containers/Correlations';


class Analysis extends React.Component<any, any> {
    regressionDataUpdated;
    sampleData;
    randmoizedData;
    unitInfo;

    componentWillMount() {
        console.log("componentDid Mount ");

    }

    formChartData(DATA, changeIt = false) {
        var newArray: any = [];
        for (var i = 0; i < DATA.length; i++) {
            var value = DATA[i];
            var arrEle: any = [];
            var tempVal = changeIt ? value[1] * Math.random() - 100 : value[1];
            arrEle[0] = Date.UTC(value[0].toString().substring(0, 4), value[0].toString().substring(6, 4));
            arrEle[1] = tempVal * 100000;
            newArray.push(arrEle);
        }
        return newArray;
    }


    loadRollingFitData() {
        this.unitInfo = [
            [
                'week', // unit name
                [1] // allowed multiples
            ],
            [
                'month', [1, 2, 3, 4, 6]
            ]
        ];

        this.sampleData = [
            [201012, 27.91],
            [201101, 27.72],
            [201102, 26.58],
            [201103, 25.39],
            [201104, 25.92],
            [201105, 25.01],
            [201106, 26.0],
            [201107, 27.4],
            [201108, 26.6],
            [201109, 24.89],
            [201110, 26.63],
            [201111, 25.58],
            [201112, 25.96],
            [201201, 29.53],
            [201202, 31.74],
            [201203, 32.26],
            [201204, 32.02],
            [201205, 29.19],
            [201206, 30.59],
            [201207, 29.47],
            [201208, 30.82],
            [201209, 29.76],
            [201210, 28.54],
            [201211, 26.62],
            [201212, 26.71],
            [201301, 27.45],
            [201302, 27.8],
            [201303, 28.6],
            [201304, 33.1],
            [201305, 34.9],
            [201306, 34.54],
            [201307, 31.84],
            [201308, 33.4],
            [201309, 33.28],
            [201310, 35.4],
            [201311, 38.13],
            [201312, 37.41],
            [201401, 37.84],
            [201402, 38.31],
            [201403, 40.99],
            [201404, 40.4],
            [201405, 40.94],
            [201406, 43.16],
            [201407, 45.43],
            [201408, 46.36],
            [201409, 46.95],
            [201410, 47.81],
            [201411, 46.45],
            [201412, 40.4],
            [201501, 43.85],
            [201502, 40.66],
            [201503, 48.64],
            [201504, 46.86],
            [201505, 44.15],
            [201506, 46.7],
            [201507, 43.52],
            [201508, 44.26],
            [201509, 52.64],
            [201510, 54.35],
            [201511, 55.48],
            [201512, 55.09],
            [201601, 50.88],
            [201602, 55.23],
            [201603, 49.87],
            [201604, 53.0],
            [201605, 51.17],
            [201606, 56.68],
            [201607, 57.46],
            [201608, 57.6],
            [201609, 59.92],
            [201610, 60.26],
            [201611, 62.14],
            [201612, 64.65],
            [201701, 63.98],
            [201702, 65.86],
            [201703, 68.46],
            [201704, 69.84],
            [201705, 68.93],
            [201706, 72.7],
            [201707, 74.77],
            [201708, 74.49],
            [201709, 83.18],
            [201710, 84.17],
            [201711, 85.23],
            [201712, 85.23]
        ];

        this.formChartData(this.sampleData);

    }

    rollingFitChart() {
        this.loadRollingFitData();
        Highcharts.stockChart('rollingFit', {
            chart: {
                alignTicks: false,
                backgroundColor: null,
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize: '15px'
                },
                events: {
                    // click: function (evt) {
                    //     var axisVal = new Array();
                    //     $.each(rollFitChart.series, function (i, name) {
                    //         axisVal[0] = getYValue(rollFitChart, i, evt.xAxis[0].value);
                    //         axisVal[0] = axisVal[0] / 100000000;
                    //         $(".legend" + i, "#rollingFitSec").text(axisVal[0].toFixed(2));
                    //     })
                    // },
                }
            },
            // plotOptions: {
            //     series: {
            //         cursor: 'pointer',
            //         point: {
            //             events: {
            //                 click: function (evt) {
            //                     var axisVal = new Array();
            //                     $.each(rollFitChart.series, function (i, name) {
            //                         axisVal[0] = getYValue(rollFitChart, i, evt.xAxis[0].value);
            //                         axisVal[0] = axisVal[0] / 100000000;
            //                         $(".legend" + i, "#rollingFitSec").text(axisVal[0].toFixed(2));
            //                     })
            //                 },
            //                 mouseOut: function () {
            //                     $(".unit.cloneUnit .number", "#rollingFitSec").text("_ _ ");
            //                 },
            //                 mouseOver: function () {
            //                     var sname = this.series.index;
            //                     var legTxt = this.y / 100000000;
            //                     $(".legend" + sname, "#rollingFitSec").text(legTxt.toFixed(2));
            //                 }
            //             }
            //         }
            //     }
            // },
            rangeSelector: {
                selected: 6,
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            yAxis: {
                opposite: false,
                labels: {
                    formatter: function () {
                        // return (this.value / 100000000);
                    }
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function () {
                        // var d = new Date(this.value);
                        // return Highcharts.dateFormat("%Y", this.value); // just month
                    }
                }
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
            series: [{
                name: "R-SQUARED",
                type: 'column',
                data: this.formChartData(this.sampleData),
                fillColor: "#005C8F",
                dataGrouping: {
                    units: this.unitInfo
                }
            }]
        });
    }

    loadRegressionData() {
        this.regressionDataUpdated = [
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
            [4.6, 2.2],
            [4.7, 2.9],
            [2.2, -1.4],
            [0.4, -5.8],
            [5.1, 5.5],
            [-4.7, -5.4],
            [-6.4, 7.1],
            [5, 4.5],
            [-1.5, 2.8],
            [1.2, 4],
            [-0.6, 3.8],
            [3.6, 0],
            [7.1, 0.2],
            [-0.2, -3.3],
            [3.6, 2.9],
            [-7.1, -5.1],
            [-1.5, 0.4],
            [-0.7, 4.5],
            [-5.6, 6.3],
            [5.7, 6.2],
            [-0.2, -2.8],
            [2.6, 2.3],
            [1.1, 2.8],
            [-2.4, 0.9],
            [4, 4.9],
            [2.3, 4.4],
            [-0.9, -2.3],
            [-0.7, -2.9],
            [-6.9, -7.3],
            [4.5, -4.9],
            [-4.3, 7.4],
            [6.6, -7.3],
            [3.6, -4.2],
            [4.2, -3.4],
            [-3.6, 4.2],
            [1.9, 1],
            [-5, -3.9],
            [-6.9, 3.2],
            [7.2, -5.6],
            [6.1, -6.7],
            [-3.9, 0.3],
            [6, 1],
            [6.8, -3.2],
            [6, 5.6],
            [-4.3, -6.9],
            [-7.2, 4.3],
            [5.1, 7.3],
            [-3.4, -7.2],
            [0.1, 3.5],
            [-3.4, 7.4],
            [-6, -5.2],
            [2.1, -6.6],
            [3.1, 0.3],
            [-5.2, -2.1],
            [6.8, 5.9],
            [-4.7, 1.8],
            [-3.2, -1.6],
            [-1.7, -0.7],
            [7, -3.7],
            [6.6, -0.8],
            [1.6, 7.3],
            [-1.4, -3.2],
            [-3.5, -1.3],
            [2, -4.3],
            [-3.1, 2.9],
            [2.4, 5],
            [-2.8, -2],
            [-2, 3.7],
            [-7.4, -4.5],
            [-5.9, 5.6],
            [1.6, -3.5],
            [-3.5, -2],
            [-3.7, 7.1],
            [-2.2, 5.2],
            [6.4, 6],
            [-7.3, -1.6],
            [3.1, -4.6],
            [-5.4, -6.2]
        ];
    }

    componentDidMount() {
        console.log("componentDid Update");
        this.renderAnalysisChart();
    }

    loadRegressionChart() {
        this.loadRegressionData();
        Highcharts.chart('regressionModeling', {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                backgroundColor: "#FAFAFA",
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize: '15px'
                },
                events: {
                    click: function (evt) {
                        // var axisVal = new Array();
                        // $.each(regChart.series, function (i, name) {
                        // axisVal[0] = getYValue(regChart, i, evt.xAxis[0].value);
                        // $(".legend" + i, "#regressionModelingWrap").text(axisVal[0].toFixed(2));
                        // })
                    },
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                title: "",
                tickInterval: 5

            },
            yAxis: {
                title: "",
                tickInterval: 2.5,
                labels: {
                    formatter: function () {
                        // return this.value;
                    }
                }
            },
            credits: {
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
            // plotOptions: {
            //     series: {
            //         point: {
            //             // events: {
            //             //   click: function (evt) {
            //             //     var axisVal = new Array();
            //             //     $.each(regChart.series, function (i, name) {
            //             //       axisVal[0] = getYValue(regChart, i, evt.xAxis[0].value);
            //             //       $(".legend" + i, "#regressionModelingWrap").text(axisVal[0].toFixed(2));
            //             //     })
            //             //   },
            //             //   mouseOut: function () {
            //             //     $(".unit.cloneUnit .number", "#regressionModelingWrap").text("_ _ ");
            //             //    },
            //             //   mouseOver: function() {
            //             //     var sname = this.series.index;
            //             //     $(".legend" + sname, "#regressionModelingWrap").text(this.y.toFixed(2));
            //             //     var series = this.series.chart.series,
            //             //     x = this.x;
            //             //     $(".legend" + sname, "#regressionModelingWrap").text(this.y.toFixed(2));
            //             //     $.each(series, function (i, e) {
            //             //         $.each(series[i].data,function(j,point){
            //             //             if(point.x === x) {
            //             //                 $(".legend" + i, "#regressionModelingWrap").text(point.y.toFixed(2));
            //             //             }
            //             //         });						
            //             //     });
            //             //   }
            //             // }
            //         }
            //     },
            //     scatter: {
            //         color: 'red',
            //         marker: {
            //             radius: 15,
            //             states: {
            //                 hover: {
            //                     enabled: true,
            //                     lineColor: 'rgb(100,100,100)'
            //                 }
            //             }
            //         },
            //         states: {
            //             hover: {
            //                 marker: {
            //                     enabled: false
            //                 }
            //             }
            //         },
            //         // tooltip: {
            //         //     headerFormat: '<b>{series.name}</b><br>',
            //         //     pointFormat: '{point.x} cm, {point.y} kg'
            //         // }
            //     }
            // },
            series: [{
                type: 'line',
                name: 'R-SQUARED',
                color: '#BCBCBC',
                zIndex: 10,
                data: [[-7, -6], [6.7, 7]],
            },
            {
                name: 'ADJUSTED R-SQUARED',
                color: 'rgba(15, 142, 199, .75)',
                data: this.regressionDataUpdated,
                marker: {
                    symbol: 'circle',
                    radius: 9
                }
            }]
        });
    }

    rollingAlphaChart() {
        Highcharts.stockChart('rollingAlpha', {
            chart: {
                alignTicks: false,
                backgroundColor: null,
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize: '15px'
                },
                // events: {
                //     click: function (evt) {
                //         var axisVal = new Array();
                //         $.each(rollAlphaChart.series, function (i, name) {
                //             axisVal[0] = getYValue(rollAlphaChart, i, evt.xAxis[0].value);
                //             axisVal[0] = axisVal[0] / 100000000;
                //             $(".legend" + i, "#rollingAlphaSec").text(axisVal[0].toFixed(2));
                //         })
                //     },
                // },
            },
            // plotOptions: {
            //     series: {
            //         cursor: 'pointer',
            //         point: {
            //             events: {
            //                 click: function (evt) {
            //                     var axisVal = new Array();
            //                     $.each(rollAlphaChart.series, function (i, name) {
            //                         axisVal[0] = getYValue(rollAlphaChart, i, evt.xAxis[0].value);
            //                         axisVal[0] = axisVal[0] / 100000000;
            //                         $(".legend" + i, "#rollingAlphaSec").text(axisVal[0].toFixed(2));
            //                     })
            //                 },
            //                 mouseOut: function () {
            //                     $(".unit.cloneUnit .number", "#rollingAlphaSec").text("_ _ ");
            //                 },
            //                 mouseOver: function () {
            //                     var sname = this.series.index;
            //                     var legTxt = this.y / 100000000;
            //                     $(".legend" + sname, "#rollingAlphaSec").text(legTxt.toFixed(2));
            //                     var series = this.series.chart.series,
            //                         x = this.x;
            //                     tmp = this.y / 100000000
            //                     $(".legend" + sname, "#rollingAlphaSec").text(tmp.toFixed(2));
            //                     $.each(series, function (i, e) {
            //                         $.each(series[i].data, function (j, point) {
            //                             if (point.x === x) {
            //                                 tmp = point.y / 100000000
            //                                 $(".legend" + i, "#rollingAlphaSec").text(tmp.toFixed(2));
            //                             }
            //                         });
            //                     });
            //                 }
            //             }
            //         }
            //     }
            // },
            rangeSelector: {
                selected: 6,
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            yAxis: {
                opposite: false,

                labels: {
                    formatter: function () {
                        // return (this.value);
                    }
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function () {
                        // var d = new Date(this.value);
                        // return Highcharts.dateFormat("%Y", this.value); // just month
                    }
                }
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
            series: [{
                name: "ROLLING ALPHA",
                type: 'column',
                data: this.formChartData(this.sampleData, true),
                fillColor: "#0F8EC7",
                dataGrouping: {
                    units: [
                        [
                            'week', // unit name
                            [1] // allowed multiples
                        ],
                        [
                            'month', [1, 2, 3, 4, 6]
                        ]
                    ]
                }
            }
                , {
                name: "CONFIDENCE INTERVAL",
                data: this.formChartData(this.sampleData, true),
                type: 'spline',
                color: '#C9B160',
            }]
        });
    }

    rollingAlphaWaveChart() {
        Highcharts.stockChart('rollingAlphaWave', {
            chart: {
                alignTicks: false,
                backgroundColor: null,
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize: '15px'
                },
                // events: {
                //     click: function (evt) {
                //         var axisVal = new Array();
                //         $.each(rollAlphaWaveChart.series, function (i, name) {
                //             axisVal[0] = getYValue(rollAlphaWaveChart, i, evt.xAxis[0].value);
                //             axisVal[0] = axisVal[0] / 100000000;
                //             $(".legend" + i, "#rollingAlphaWaveSec").text(axisVal[0].toFixed(2));
                //         })
                //     },
                // },
            },
            tooltip: {
                enabled: false
            },
            // plotOptions: {
            //     series: {
            //         cursor: 'pointer',
            //         point: {
            //             events: {
            //                 click: function (evt) {
            //                     var axisVal = new Array();
            //                     $.each(rollAlphaWaveChart.series, function (i, name) {
            //                         axisVal[0] = getYValue(rollAlphaWaveChart, i, evt.xAxis[0].value);
            //                         axisVal[0] = axisVal[0] / 100000000;
            //                         $(".legend" + i, "#rollingAlphaWaveSec").text(axisVal[0].toFixed(2));
            //                     })
            //                 },
            //                 mouseOut: function () {
            //                     $(".unit.cloneUnit .number", "#rollingAlphaWaveSec").text("_ _ ");
            //                 },
            //                 mouseOver: function () {
            //                     var sname = this.series.index;
            //                     var legTxt = this.y / 100000000;
            //                     $(".legend" + sname, "#rollingAlphaWaveSec").text(legTxt.toFixed(2));
            //                     //   var series = this.series.chart.series,
            //                     //   x = this.x;
            //                     //   var tmp =  point.y/100000000
            //                     //   $(".legend" + sname, "#rollingAlphaWaveSec").text(tmp.toFixed(2));
            //                     //   $.each(series, function (i, e) {
            //                     //       $.each(series[i].data,function(j,point){
            //                     //           if(point.x === x) {
            //                     //             tmp =  point.y/100000000
            //                     //               $(".legend" + i, "#rollingAlphaWaveSec").text(tmp.toFixed(2));
            //                     //           }
            //                     //       });						
            //                     //   });

            //                 }
            //             }
            //         }
            //     }
            // },
            rangeSelector: {
                selected: 6,
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            yAxis: {
                opposite: false,
                // labels: {
                //     formatter: function() {
                //         return (this.value / 100000000);
                //     }
                // }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function () {
                        // var d = new Date(this.value);
                        // return Highcharts.dateFormat("%Y", this.value); // just month
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                type: 'column',
                name: "ROLLING ALPHA",
                data: this.formChartData(this.sampleData, true),
                fillColor: "#0F8EC7",
                dataGrouping: {
                    units: [
                        [
                            'week', // unit name
                            [1] // allowed multiples
                        ],
                        [
                            'month', [1, 2, 3, 4, 6]
                        ]
                    ]
                }
            }, {

                name: "CONFIDENCE INTERVAL",
                data: this.formChartData(this.sampleData, true),
                type: 'spline',
                color: '#C9B160',
                tooltip: {
                    valueDecimals: 2
                }
            }, {
                name: "ROLLING CORRELATION",
                data: this.formChartData(this.sampleData, true),
                type: 'spline',
                color: '#005C8F',
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    }

    regressionScatterChart(){
        Highcharts.chart('regressionScatter', {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                backgroundColor: "#FAFAFA",
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize:'15px'
                },
                // events: {
                //     click: function (evt) {
                //     var axisVal = new Array();
                //     $.each(regscat.series, function (i, name) {
                //         axisVal[0] = getYValue(regscat, i, evt.xAxis[0].value);
                //         $(".legend" + i, "#regScatterWrap").text(axisVal[0].toFixed(2));
                //     })
                //     },
                // }
            },
        
            title: {
                text: ''
            },
            xAxis: {
                // title: "",
                // tickInterval: 5
                
            },
            yAxis: {
                title: "",
                tickInterval: 2.5
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            tooltip:{
                enabled: false
            },
            plotOptions: {
                series:{
                    point: {
                        events: {
                        click: function (evt) {
                            var axisVal = new Array();
                            // $.each(regscat.series, function (i, name) {
                            // axisVal[0] = getYValue(regscat, i, evt.xAxis[0].value);
                            // $(".legend" + i, "#regScatterWrap").text(axisVal[0].toFixed(2));
                            // })
                        },
                        mouseOver: function() {
                            // var sname = this.series.index;
                            // $(".legend" + sname, "#regScatterWrap").text(this.y.toFixed(2));
                        }
                        }
                    }
                },
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
                    name: 'R-SQUARED',
                    color: '#BCBCBC',
                    data: [[-7, -6],[6.7, 6]],
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
                    name: 'ADJUSTED R-SQUARED',
                    color: 'rgba(15, 142, 199, .75)',
        
                    data: this.formChartData(this.sampleData,true),
                    marker: {
                        symbol: 'circle',
                        radius: 9
                    }
                }
            ]
        });
    }

    renderAnalysisChart() {
        console.log("renderLineChart");
        this.loadRegressionChart();
        this.rollingFitChart();
        this.rollingAlphaChart();
        this.rollingAlphaWaveChart();
        this.regressionScatterChart();


    }


    render() {
        return (
            <div className="container chartArea">
            <Correlations></Correlations>
                
                <div className="content-area col-lg-12" id="regressionModelingWrap">
                    <h2>Regression Modeling</h2>
                    <h3 className="subheading">Actual vs. Predicted</h3>
                    <div className="timeframe">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav">
                            <div>
                                <a href="#" data-year="1">1 Yr</a>
                            </div>
                            <div className="active">
                                <a href="#" data-year="3">3 Yr</a>
                            </div>
                            <div>
                                <a href="#" data-year="5">5 Yr</a>
                            </div>
                            <div>
                                <a href="#" data-year="2">Other</a>
                            </div>
                            <div className="dateRange">
                                <h3>COMMON DATE RANGE</h3>
                                {/* <input type="text" id="fromRM" className="datepicker" name="from" value="12/13/2013" /> -
                            <input type="text" id="toRM" className="datepicker" name="to" value="12/13/2016" /> */}
                            </div>
                        </div>
                    </div>
                    <div id="regressionModeling" className="highchart-section"></div>
                </div>
                <div className="content-area col-lg-12">
                    <div className="tab-content current" id="bench_table">
                        <table className="table table-striped table-bordered benchmark-table" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: 60 }} >BENCHMARK/FUND</th>
                                    <th scope="col" className="text-center" style={{ width: 20 }} >COEFFICIENT</th>
                                    <th scope="col" className="text-center" style={{ width: 20 }} >COEFFICIENT INTERVAL</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}

                                            </a>
                                        </span> Alpha</td>
                                    <td className="text-center">0.967</td>
                                    <td className="text-center">99.99%</td>
                                </tr>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span> S&P 500 TR USD</td>
                                    <td className="text-center">-0.459</td>
                                    <td className="text-center">199.856%</td>
                                </tr>
                                <tr>
                                    <td scope="row">
                                        <span>
                                            <a href="#">
                                                {/* <img className="table_close" src="images/close-button.svg" /> */}
                                            </a>
                                        </span>MSCI World Gross (LCL)</td>
                                    <td className="text-center">0.854</td>
                                    <td className="text-center">89.914%</td>
                                </tr>
                                <tr className="addnewBenchmark">
                                    <td scope="row" colSpan={5}>
                                        <div className="buttonHolder">
                                            <span className="addButton-1" data-toggle="modal" data-target=".reg_model">
                                                Add Benchmark/Fund
                                    </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="content-area col-lg-12">
                    <h3 className="subheading">Regressions</h3>
                    <div className="timeframe" id="regressionTimeFrame">
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
                                <a href="#" data-year="20">Other</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6" id="rollingFitSec">
                            <h3 className="subheading">Rolling Fit</h3>
                            <div className="d-flex flex-row addUnit">
                                <div className="unit d-none cloneUnit pull-left">
                                    <div className="blue box"></div>
                                    <h4></h4>
                                    <div className="number d-flex align-items-end"></div>
                                </div>
                            </div>
                            <div id="rollingFit" className="highchart-section small"></div>
                        </div>
                        <div className="col-lg-6" id="rollingAlphaSec">
                            <h3 className="subheading">Rolling Alpha</h3>
                            <div className="d-flex flex-row addUnit">
                                <div className="unit d-none cloneUnit pull-left">
                                    <div className="blue box"></div>
                                    <h4></h4>
                                    <div className="number d-flex align-items-end"></div>
                                </div>
                            </div>
                            <div id="rollingAlpha" className="highchart-section small"></div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-lg-6" id="regScatterWrap">
                            <div className="addUnit">
                                <h5 className="d-block">S & P 500 TR USD</h5>
                                <h6>y=0.90+-0.03x, R^2=0.00</h6>
                            </div>
                            <div id="regressionScatter" className="highchart-section small"></div>
                        </div>
                        <div className="col-lg-6" id="rollingAlphaWaveSec">

                            <div className="d-flex flex-row addUnit">
                                <div className="unit d-none cloneUnit pull-left">
                                    <div className="blue box"></div>
                                    <h4></h4>
                                    <div className="number d-flex align-items-end"></div>
                                </div>
                            </div>
                            <div id="rollingAlphaWave" className="highchart-section small"></div>
                        </div>
                    </div>
                </div>

                 <UpdownBeta></UpdownBeta> 
                   <UpdownCapture></UpdownCapture>   
                
            </div>
        );
    }
}



export default Analysis;