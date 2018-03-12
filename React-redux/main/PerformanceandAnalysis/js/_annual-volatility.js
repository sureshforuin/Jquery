    var chartRV;
    // create the chart
    chartRV = Highcharts.stockChart('annual-volatility', {
        chart: {
            alignTicks: false,
            backgroundColor: null,
            style: {
                fontFamily: 'pf_dintext_proregular',
                fontSize:'15px'
              },
        },
        plotOptions:{
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        mouseOver: function () {
                            $(".volatility","#volatility-unit").text(parseInt(this.y/100000000)+"M");
                        }
                    }
                }
            }
        },
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
                    return (this.value/100000000);
                }
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    var d = new Date(this.value);
                    return Highcharts.dateFormat("%Y", this.value); // just month
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
            data: aapl,
            fillColor: "#005C8F",
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
        }]
    });

    
    var extremes = chartRV.xAxis[0].getExtremes();
    var max = extremes.max;
    var min = extremes.min;


    var dateFormat = "yyyy-mm-dd",
    fromRV = $( "#fromRV" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on( "change", function() {
        toRV.datepicker( "option", "minDate", getDate( this ) );
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
      }),
    toRV = $( "#toRV" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      fromRV.datepicker( "option", "maxDate", getDate( this ) );
      var parent = $(this).closest(".time-nav");
      $("> div", parent).removeClass("active");
      $(this).closest('.dateRange').addClass("active");
    });

    
    $("#volatility-unit .time-nav").on("change", "input", function(e) {
        var min = new Date($("#fromRV").val()).getTime();
        var max = new Date($("#toRV").val()).getTime();
        chartRV.xAxis[0].setExtremes(min, max);
        chartRV.showResetZoom();
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest("div").addClass("active");
      });
    
      $("#volatility-unit .time-nav").on("click", "a", function(e) {
        e.preventDefault();
        if (!chartRV) return;
        var min = extremes.min;
        var yearCount = parseInt($(this).attr("data-year"));
        var clickedElement = $(this);
        setChartRange(chartRV,yearCount, clickedElement);
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