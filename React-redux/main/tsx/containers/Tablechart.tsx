import * as Highcharts from 'highcharts/highcharts';
import * as React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class Tablechart extends React.Component<any, any> {
    categoryX:any = [];
    categoriesData:any = [];

    componentWillMount(){

    }

    componentDidMount(){
        this.renderCorrelationsChart();
    }

    renderChartinfo(){
        var categories:any = [];
        categories[0] = ["Hedge Funds","US Equity Volume","US High Yield","World Equities","US Bonds","US Dollar"];
        categories[1] = ["US Equity","Discretionary","DISS/Restricted","Event","CTA","RV"];
        categories[2] = ["US","Europe","Asia ex Japan","Japan","International","Emerging Markets"];
        categories[3] = ["Large Cap Value","Large Cap","Large Cap Growth","Mid Cap Value","Mid Cap","Mid Cap Growth"];
        categories[4] = ["Global","US","US Volume","Europe","Emerging Markets Domestic","Emerging Markets External"];
        categories[5] = ["Commodities","S&P 500 Dispersions","Carry","Whipsaw","Momentum","TBD"];
        
        var catData = [0.68, 0.72, 0.22, 0.31, -0.4, -.6];
        
        for (var i = 0; i < catData.length; i++) {
            this.categoriesData[i] = ((catData[i] * Math.floor((Math.random() * 1) + 1)));
        }

        var xaxisText = "";
        var catX:any = [];
        var myIndex = this.props.index;
        catData.map(function(i,key){
             xaxisText =
                "<div class='xtext'><span class='cat'>" +
                categories[myIndex][key] +
                "</span><span class='number'>" +
                catData[key] +
                "</span></div>";
                catX[key] = xaxisText
            });
        this.categoryX = catX;
    }

    renderCorrelationsChart(){
       this.renderChartinfo();
        Highcharts.chart(this.props.selector, {
            chart: {
                type: "bar",
                plotBackgroundColor: "#FAFAFA",
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize:'15px'
                  },
            },
            title: {
                text: ""
            },
            subtitle: {
                text: ""
            },
            legend: {
                enabled: false
            },
            tooltip:{
                enabled: false
            },
            xAxis: [{
                    categories: this.categoryX,
                    gridLineWidth: 1,
                    labels: {
                        style: {
                            width: "250px",
                            "min-width": "250px",
                            "font-size": "12px"
                        },
                        useHTML: true
                    }
                },
                {
                    // mirror axis on right side
                    categories: this.categoryX
                }
            ],
            yAxis: {
                max: 1,
                min: -1,
                tickInterval: 1,
                gridLineWidth: 1,
                labels: {
                    enabled: true
                },
  
                title: {
                    text: null
                },
            },
    
            plotOptions: {},
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
    
            series: [{
                name: "Fund",
                data: this.categoriesData,
                color: "#0F8EC7"
            }]
        });
    }

    render(){
        return (
            <div id={this.props.selector} style={{ height: 300 }} />
        )
    }
}

export default Tablechart;