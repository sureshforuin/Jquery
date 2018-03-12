$(function () {
    var top_band1 = [{
        x: 1314136800000,
        y: 70,
        id: 'top-a',

    }, {
        x: 1318284000000,
        y: 70,
        id: 'top-b'
    }];
    var top_band2 = [{
        x: 1319752800000,
        y: 70,
        id: 'top-a-1'
    }, {
        x: 1323298800000,
        y: 70,
        id: 'top-b-1'
    }];
    var bot_band1 = [{
        x: 1319580000000,
        y: -80,
        id: 'bot-a'
    }, {
        x: 1321484400000,
        y: -80,
        id: 'bot-b'
    }];
    var bot_band2 = [{
        x: 1323903600000,
        y: -80,
        id: 'bot-a-1'
    }, {
        x: 1328050800000,
        y: -80,
        id: 'bot-b-1'
    }];

    function plotHRBand() {
            // var nav = chart.get('navigator');
            // nav.setData(ADBE, false);
            // chartHR.xAxis[0].setExtremes();
            // $('#button')[0].disabled = true;
            
      }


    var chartHR;

    chartHR = Highcharts.StockChart('historical', {

        chart: {
            renderTo: 'historical',
            marginBottom: 50,
            spacingBottom: 30,
            backgroundColor: null,
            style: {
                fontFamily: 'pf_dintext_proregular',
                fontSize:'15px'
              },
        },
        title: {
            text: ' '
        },
        yAxis: {
            opposite: false
        },
        xAxis: {
            max: 1326150000000,
            // tickInterval: 2678400000,
            labels: {
                y:20,
                formatter: function() {
                  var d = new Date(this.value);
                  return Highcharts.dateFormat("%b %Y ", this.value); // just month
                }
              }
        },
        scrollbar: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        mouseOver: function () {
                            var sname = this.series.name.toLowerCase();
                            $("."+sname,"#historicalReturns").text(this.y);
                        }
                    }
                }
            },
        },

        series: [
            
            {
                name: 'band1',
                data: top_band1,
                type: 'area',
                color: '#2c8e7726',
                dataLabels:{
                    enabled:true,
                    format: 'T1',
                    x:0,
                    y:22,
                    borderRadius:0,
                    backgroundColor: 'rgba(252, 255, 197, 0.7)',
                    borderWidth: 1,
                    borderColor: '#AAA',
                    shadow:true
                },
                id:"band3",
                visible:false
            }, {
                name: 'band2',
                data: top_band2,
                type: 'area',
                color: '#2c8e7726',
                dataLabels:{
                    enabled:true,
                    format: 'T2',
                    x:0,
                    y:22,
                    borderRadius:0,
                    backgroundColor: 'rgba(252, 255, 197, 0.7)',
                    borderWidth: 1,
                    shadow:true,
                    borderColor: '#AAA',
                },
                id:"band4",
                visible:false
            }, {
                name: 'band2',
                data: bot_band1,
                type: 'area',
                color: '#b3415b2e',
                dataLabels:{
                    enabled:true,
                    format: 'B1',
                    x:0,
                    y:0,
                    borderRadius:0,
                    backgroundColor: 'rgba(252, 255, 197, 0.7)',
                    borderWidth: 1,
                    borderColor: '#AAA',
                    shadow:true,
                },
                id:"band1",
                visible:false
            }, {
                name: 'band2',
                data: bot_band2,
                type: 'area',
                color: '#b3415b2e',
                dataLabels:{
                    enabled:true,
                    format: 'B1',
                    x:0,
                    y:0,
                    borderRadius:0,
                    backgroundColor: 'rgba(252, 255, 197, 0.7)',
                    borderWidth: 1,
                    borderColor: '#AAA',
                    shadow:true,
                },
                id:"band2",
                visible:false
            }, {
                name: 'CITADEL',
                data: CITADEL,
                type: 'column',
                color: "#005C8F"

            }, {
                name: 'SANDP',
                data: SANDP,
                type: 'column',
                color: "#C9B160"
            }   
            
        ],
       
        // annotations: [{
        //     labels: [{
        //         point: 'top-a',
        //         backgroundColor: '#2C8E77',
        //         stroke: '#2C8E77',
        //         shape: 'rect',
        //         x: 15,
        //         y: 23
        //     }, {
        //         point: 'top-a-1',
        //         backgroundColor: '#2C8E77',
        //         stroke: '#2C8E77',
        //         shape: 'rect',
        //         x: 15,
        //         y: 23
        //     }, {
        //         point: 'bot-a',
        //         backgroundColor: '#B3415C',
        //         stroke: '#B3415C',
        //         shape: 'rect',
        //         x: 15,
        //         y: 0
        //     }, {
        //         point: 'bot-a-1',
        //         backgroundColor: '#B3415C',
        //         stroke: '#B3415C',
        //         shape: 'rect',
        //         x: 15,
        //         y: 0
        //     }, ]
        // }],

        rangeSelector: {
            buttonTheme: {
                width: 60
            },
            selected: 6,
            allButtonsEnabled: true,
            enabled: false,
            buttonTheme: {
                padding: 10,
                zIndex: 7,
            }
        },

        navigator: {
            height: 65,
            maskFill: 'rgba(255, 255, 255,.5)',
            maskInside: false,
            lineColor:"#0F8EC7",
            handles: {
                width: 16,
                height: 24,
                borderColor: "#FFFFFF",
                backgroundColor: "#005C8F"
            },
            enabled:true,
            opposite: false,
            dataGrouping: {
                smoothed: true
            },
            series: [

                {
                    name: 'CITADEL',
                    data: CITADEL,
                    type: 'column',
                    threshold: 0,
                    lineColor: "red",
                    lineWidth: 5
                }
            ]
        }

    }, );



    $(".showBox").on("click",function(){
        $(".showBox").removeClass("active");
        var seriesLength = chartHR.series.length;
        if($(this).hasClass('plotband')){
            for(var i = seriesLength - 1; i > -1; i--)
            {
                var myseries = chartHR.series[i];
                if(i < 4){
                    myseries.show();
                }
            }
        }else{
            for(var i = seriesLength - 1; i > -1; i--)
            {
                //chart.series[i].remove();
                var myseries = chartHR.series[i];
                if(i < 4){
                    myseries.hide();
                }
            }

        }
        $(this).addClass("active");
    });


    $("#myonoffswitch").on("click",function(){
        $("#runupsDowns").toggle(this.checked)
    });

    var dateFormat = "yyyy-mm-dd",
    fromHR = $( "#fromHR" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on( "change", function() {
        toHR.datepicker( "option", "minDate", getDate( this ) );
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
      }),
    toHR = $( "#toHR" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      fromHR.datepicker( "option", "maxDate", getDate( this ) );
      var parent = $(this).closest(".time-nav");
      $("> div", parent).removeClass("active");
      $(this).closest('.dateRange').addClass("active");
    });


    
    $("#historicalReturns .time-nav").on("change", "input", function(e) {
        var min = new Date($("#fromCP").val()).getTime();
        var max = new Date($("#toCP").val()).getTime();
        chartHR.xAxis[0].setExtremes(min, max);
        chartHR.showResetZoom();
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest("div").addClass("active");
      });
    
      $("#historicalReturns .time-nav").on("click", "a", function(e) {
        e.preventDefault();
        if (!chartHR) return;
        var min = extremes.min;
        var yearCount = parseInt($(this).attr("data-year"));
        var clickedElement = $(this);
        setChartRange(chartHR,yearCount, clickedElement);
      });
    
  function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( dateFormat, element.value );
    } catch( error ) {
      date = null;
    }

    return date;
  }

  function setChartRange(charObj,yearCount, clickedElement = undefined){
    var one_year = 31536000000;
    var extremes = charObj.xAxis[0].getExtremes();
    var max = extremes.max;
    var min = extremes.min;
    var unixRange = yearCount * one_year;
    var min = max - unixRange;
    charObj.xAxis[0].setExtremes(min, max);
    if(clickedElement){
      var parent = clickedElement.closest(".time-nav");
      $("> div", parent).removeClass("active");
      clickedElement.closest("div").addClass("active");
    }

  }

  setChartRange(chartHR,3);
});