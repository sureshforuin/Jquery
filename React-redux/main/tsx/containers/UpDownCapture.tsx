import * as Highcharts from 'highcharts/highcharts';
import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


class UpdownCapture extends React.Component<any, any> {
    // seriesData;

    componentWillMount() {
        console.log("componentDid Mount ");

    }

    componentDidMount() {
        console.log("componentDid Update");
        this.renderupDownCapture();
    }

    renderupDownChart(placeHolde) {

     Highcharts.chart(
      placeHolde,
      {
        chart: {
          type: "column",
          backgroundColor: "#FAFAFA",
          style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
        //   events: {
        //     click: function (evt) {
        //     var axisVal = new Array();
        //     // $.each(upDownMonthlyChart.series, function (i, name) {
        //     //     axisVal[0] = getYValue(upDownMonthlyChart, i, evt.xAxis[0].value);
        //     //     $(".legend" + i, "#upDownCapture").text(axisVal[0]);
        //     // })
        //     },
        // },
        },
        title: {
          text: ""
        },
        xAxis: {
        //   categories: [""],
          enabled: false,
          title: ""
        },
        // plotOptions: {
        //   series: {
        //     cursor: "pointer",
        //     point: {
        //       events: {
        //         mouseOver: function (evt) {
        //         //   var sname = this.series.index;
        //         //     $(".legend" + sname, "#upDownCapture").text(
        //         //      this.y.toFixed(2)
        //         //     );
        //         },
        //       }
        //     }
        //   }
        // },
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
        yAxis: {
          title: "",
          tickInterval: .5
        },
        series: this.formatData(),
      }
    );
    }

    formatData(){

         let sampleData = [
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

        for (var i = 0; i < sampleData.length; i++) {
        sampleData[i].data[0] = (sampleData[i].data[0]);
      }
        console.log(sampleData);
        return  sampleData;
    }

    renderupDownCapture() {
        console.log("renderLineChart");
        this.renderupDownChart("upDown-monthly");
        this.renderupDownChart("upDown-quarterly");
        this.renderupDownChart("upDown-semi");

    }


    render() {
        return (
            <div className="content-area col-lg-12" id="upDownCapture">

                <h3 className="subheading">Up/Down Capture - Performance-Based Analysis </h3>
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
                            <a href="#" data-year="10">10 Yr</a>
                        </div>
                        <div>
                            <a href="#" data-year="15">Since Inception</a>
                        </div>
                        <div>
                            <a href="#" data-year="20">Other</a>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-row addUnit">
                    <div className="unit d-none cloneUnit pull-left">
                        <div className="blue box"></div>
                        <h4></h4>
                        <div className="number d-flex align-items-end"></div>
                    </div>
                </div>

                <div className="row groupnunit">
                    <div className="col-lg-4">
                        <h3 className="subheading18 ">Monthly Returns</h3>
                        <div id="upDown-monthly" className="highchart-section small"></div>
                    </div>
                    <div className="col-lg-4">
                        <h3 className="subheading18 ">Quarterly Returns</h3>
                        <div id="upDown-quarterly" className="highchart-section small"></div>
                    </div>
                    <div className="col-lg-4">
                        <h3 className="subheading18 ">Semi-Annual Returns</h3>
                        <div id="upDown-semi" className="highchart-section small"></div>
                    </div>
                </div>
            </div>
        );
    }
}


export default UpdownCapture;