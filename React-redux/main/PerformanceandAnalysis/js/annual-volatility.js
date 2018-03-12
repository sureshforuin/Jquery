    var chartRV;
    // create the chart
    createRVChart();


    function formChartData(DATA) {
        var newArray = [];
        for (var i = 0; i < DATA.length; i++) {
            var value = DATA[i];
            newArray.push([
                Date.UTC(value[0].toString().substring(0,4), value[0].toString().substring(6,4)),
                value[1] * Math.random() - 100
              ]);
        }
        return newArray;
    }

    function createRVChart() {

    chartRV = Highcharts.stockChart('annual-volatility', {
        chart: {
            alignTicks: false,
            backgroundColor: null,
            style: {
                fontFamily: 'pf_dintext_proregular',
                fontSize:'15px'
              },
            events: {
                click: function (evt) {
                    $.each(chartRV.series, function (i, name) {
                        axisVal = getYValue(chartRV, i, evt.xAxis[0].value);
                        $(".legend" + i, "#volatility-unit").text(axisVal.toFixed(2));
                    })
                }
            }
        },
        plotOptions:{
            series: {
                cursor: 'pointer',
                showInNavigator: true,
                point: {
                    events: {
                        click: function (evt) {
                            var axisVal = new Array();
                            $.each(chartRV.series, function (i, name) {
                                axisVal[0] = getYValue(chartRV, i, evt.xAxis[0].value);
                                $(".legend" + i, "#volatility-unit").text(axisVal[0].toFixed(2));
                            })
                        },
                        mouseOut: function () {
                            $(".unit.cloneUnit .number", "#volatility-unit").text("_ _ ");
                           },
                        mouseOver: function () {
                            var sname = this.series.index;
                            $(".legend" + sname, "#volatility-unit").text(this.y.toFixed(2));
                             var series = this.series.chart.series,
                                    x = this.x;
                                $(".legend" + sname, "#volatility-unit").text(this.y.toFixed(2));
                                $.each(series, function (i, e) {
                                        $.each(series[i].data,function(j,point){
                                            if(point.x === x) {
                                                $(".legend" + i, "#historicalReturns").text(point.y.toFixed(2));
                                            }
                                        });						
                                });
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
        tooltip:{
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
            name: 'Volatility',
            data: formChartData(avData),
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
    },function(chartRV) {
        generateLegend("volatility-unit", chartRV);
    });
}

    
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

    
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  var defaultvolSeriesCount =  1;


  
  $("#volatility-unit").on("click",".content-area1 a",function(evt){
    var parent = $("#volatility-unit");
    evt.preventDefault();
    seriesAdded = [];
    setLocalStorage();
    generateSandboxlist("volatility-unit");
    $(".modal h3",parent).show();
    $(".modal h3.rowSelected",parent).hide();
    $(".applyButton",parent).hide();
    $(".seeall",parent).hide();
    $(".modal tr.selected .selected").removeClass("selected").addClass("addButton");
    $(".modal tr.selected .selected").removeClass();
    $(".sandbox",parent).hide();
  });


  $("#volatility-unit").on("click",".sandbox-list .remove-icon",function(){
    var parent =  $("#volatility-unit");
    var parentList = $(this).closest(".sandbox-list");
    var storedArray = getLocalStorage();
    var idx = storedArray.indexOf($(".seriesName",parentList).text());
    var getID = parentList.attr("id");
    $(".popuptable tr."+getID+" .selected",parent).removeClass("selected").addClass("addButton");
    $(".popuptable tr."+getID,parent).removeClass("selected");
    parentList.remove();

    // var sid = getID.split("rapSeries");
    // var sid = parseInt(sid[1]);

    if (idx != -1) {
       storedArray.splice(idx, 1); // The second parameter is the number of elements to remove.
     }
    var addedText = storedArray.length+" Added";
    if(storedArray.length != 0){
      $("h3.rowSelected",parent).text(addedText);
    }else{
      $(".modal h3",parent).show();
      $(".modal h3.rowSelected",parent).hide();
      $(".applyButton",parent).hide();
      $(".seeall",parent).hide();
      $(".sandbox",parent).hide();
    }
    seriesAdded = storedArray;
    setLocalStorage();
    generateSandboxlist();
});



  function setLocalStorage(){
    localStorage.setItem("annvoladdedSeries",  JSON.stringify(seriesAdded));
  }

  function getLocalStorage(){
    var ArrayData = []; 
    var storedData = localStorage.getItem("annvoladdedSeries");
    if (storedData) {
        ArrayData = JSON.parse(storedData);
    } 
    return ArrayData;
  }

   function removeSandboxlist(parent){
        $(".sandbox .sandbox-list",parent).each(function(){
          if(!$(this).hasClass('cloneUnit')){
              $(this).remove();
          }
        });
      }

      function removeSandboxlist(parent){
        $(".sandbox .sandbox-list",parent).each(function(){
          if(!$(this).hasClass('cloneUnit')){
              $(this).remove();
          }
        });
      }

  function generateSandboxlist(id){
    var parent = $("#"+id);
    removeSandboxlist(parent);
    var cloneUnit =  $(".sandbox .cloneUnit",parent);
    var activeUnit = $(".sandbox .sandbox-list:last",parent);
    var addedSeries = getLocalStorage();
        for(var i = 0;i < addedSeries.length ; i ++)
        {
            var lastunit =  activeUnit;
            cloneUnit.clone().insertAfter(lastunit);
            activeUnit = $(".sandbox .sandbox-list:last",parent);
            activeUnit.removeClass("cloneUnit");
            activeUnit.attr("id","annvolSeries"+i);
            $(".seriesName",activeUnit).text(addedSeries[i]);
        }
  }
  
  $("#volatility-unit").on("click",".applyButton",function(){
    var parent = $("#volatility-unit");
    var totalSeriesCount = $("tr.selected",parent).length + defaultvolSeriesCount;
    var renderedSeriesCount = $(".addUnit .unit",parent).length-1;

    if( $("tr.selected",parent).length > 0 && renderedSeriesCount < totalSeriesCount){

      $("tr.selected",parent).each(function(){
        var seriesName = $("th:first",$(this)).text();
            chartRV.addSeries({
              name: seriesName,
              data: formChartData(avData),
              type: "column",
              color:getRandomColor(),
          });
        });
        generateLegend("volatility-unit",chartRV);
      }
});

    
$("#volatility-unit").on("click",".seeall",function(){
    var parent = $("#volatility-unit");
    $(".sandbox",parent).toggle();
  });

  var seriesAdded = [];

  $("#volatility-unit").on("click","table td span.addButton",function(){
    var parent = $("#volatility-unit .modal");
    $(this).removeClass("addButton").addClass("selected");
    var trParent = $(this).closest("tr");
    trParent.addClass("selected");
    // var seriesName = $("th:first",trParent).text();
    seriesAdded.push($("th:first",trParent).text());
    var annvolSeries = "annvolSeries"+(seriesAdded.length-1);
    trParent.addClass(annvolSeries);
    
    if( $("tr.selected",parent).length > 0){
        var addedText = $("tr.selected",parent).length+" Added";
        $("h3",parent).hide();
        $("h3.rowSelected",parent).text(addedText).show();
        $(".applyButton",parent).show();
        $(".seeall",parent).show();

    }
    setLocalStorage();
    generateSandboxlist("volatility-unit");
});


    
    function removeAllLegend(parent) {
        $(".addUnit .unit", parent).each(function () {
            if (!$(this).hasClass('d-none')) {
                $(this).remove();
            }
        });
    }

    $(".addUnit", "#volatility-unit").on("click", ".close-icon", function () {
        var unitParent = $(this).closest(".unit");
        getChartID = unitParent.attr("data-series");
        chartRV.series[getChartID].remove();
        generateLegend("volatility-unit", chartRV);
    });


    function generateLegend(id, chart) {
        var parent = $("#" + id);
        removeAllLegend(parent);
        var cloneUnit = $(".addUnit .cloneUnit", parent);
        var activeUnit = $(".addUnit .unit:last", parent);
        var seriesLength = chart.series.length;
        for (var i = 0; i < seriesLength; i++) {
            var myseries = chart.series[i];
            if(!myseries.baseSeries){
            var lastunit = activeUnit;
            cloneUnit.clone().insertAfter(lastunit);
            activeUnit = $(".addUnit .unit:last", parent);
            activeUnit.removeClass("d-none");
            activeUnit.attr("data-series", i);
            $("h4", activeUnit).text(myseries.name);
            $(".box", activeUnit).css("background-color", myseries.color);
            $(".number", activeUnit).text("_ _").addClass('legend' + i);
            }
        }
    }

    function populateBenchmarkData(id, data) {
        var tr;
        $('#' + id).append('<tbody>');
        for (var i = 0; i < data.length; i++) {
            tr = $('<tr/>');
            tr.append("<th scope='row'>" + data[i].benchmarks + "</th>")
            tr.append("<td class='text-center'>" + data[i].inceptionDate + "</td>");
            tr.append("<td>" + data[i].geographicFocus + "</td>");
            tr.append("<td class='text-center'>" + data[i].performance + "</td>");
            tr.append("<td class='text-center'>" + data[i].volatility + "</td>");
            tr.append("<td class='text-center'> <span class='addButton'> </td>");
            $('#' + id).append(tr);
        }
        $('#' + id).append('</tbody>');
      }
      populateBenchmarkData('vol_benchmarkTable', benchmarkData);
      //Holding Benchmarks
      var holdingTable = benchmarkData.filter(function(benchmarkItem) {
        return benchmarkItem.type === 'holdings';
      });
      populateBenchmarkData('vol_holdingBenchmarks', holdingTable);
      //Favourite Benchmarks
      var favouriteTable = benchmarkData.filter(function(benchmarkItem) {
        return benchmarkItem.type === 'favourites';
      });
      populateBenchmarkData('vol_favouriteBenchmarks', favouriteTable);