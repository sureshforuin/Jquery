$(document).ready(function(){
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
      populateBenchmarkData('reg_benchmarkTable', benchmarkData);
      //Holding Benchmarks
      var holdingTable = benchmarkData.filter(function(benchmarkItem) {
        return benchmarkItem.type === 'holdings';
      });
      populateBenchmarkData('reg_holdingBenchmarks', holdingTable);
      //Favourite Benchmarks
      var favouriteTable = benchmarkData.filter(function(benchmarkItem) {
        return benchmarkItem.type === 'favourites';
      });
      populateBenchmarkData('reg_favouriteBenchmarks', favouriteTable);

        var seriesLineData = [
            [-7, -6],
            [6.7, 6]
        ];
        var regressionScatterDataUpdated = [];
        var updateRegressionScatterData = function (yearCount) {
            setRegressionScatterData();
            seriesLineData = [
                [-7, -6],
                [6.7, 7]
            ];
            for(var i = 0; i < regressionScatterData.length; i ++) {
                var value = regressionScatterData[i];
                value[0] *= yearCount;
                value[1] *= yearCount;
                regressionScatterDataUpdated.push(value);
            }
            for(var i = 0; i < seriesLineData.length; i ++) {
                var value = seriesLineData[i];
                value[0] *= yearCount;
                value[1] *= yearCount;
                seriesLineData[i] = value;
            }
        };
        updateRegressionScatterData(15);
        
        var regscat = Highcharts.chart('regressionScatter', {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                backgroundColor: "#FAFAFA",
                style: {
                    fontFamily: 'pf_dintext_proregular',
                    fontSize:'15px'
                },
                events: {
                    click: function (evt) {
                    var axisVal = new Array();
                    $.each(regscat.series, function (i, name) {
                        axisVal[0] = getYValue(regscat, i, evt.xAxis[0].value);
                        $(".legend" + i, "#regScatterWrap").text(axisVal[0].toFixed(2));
                    })
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
                            $.each(regscat.series, function (i, name) {
                            axisVal[0] = getYValue(regscat, i, evt.xAxis[0].value);
                            $(".legend" + i, "#regScatterWrap").text(axisVal[0].toFixed(2));
                            })
                        },
                        mouseOver: function() {
                            var sname = this.series.index;
                            $(".legend" + sname, "#regScatterWrap").text(this.y.toFixed(2));
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
                    data: seriesLineData,
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
        
                    data: regressionScatterDataUpdated,
                    marker: {
                        symbol: 'circle',
                        radius: 9
                    }
                }
            ]
        },function(regscat){
            generateLegend("regScatterWrap",regscat);
            });
        
        
        
            function getYValue(chartObj, seriesIndex, xValue) {
                var yValue = null;
                var points = chartObj.series[seriesIndex].points;
                for (var i = 0; i < points.length; i++) {
                    if (points[i].x >= xValue) break;
                    yValue = points[i].y;
                }
                return yValue;
            }
            
            
        function removeAllLegend(parent){
            $(".addUnit .unit",parent).each(function(){
            if(!$(this).hasClass('d-none')){
                $(this).remove();
            }
            });
        }
        
        function generateLegend(id,chart){
            var parent = $("#"+id);
            removeAllLegend(parent);
            var cloneUnit =  $(".addUnit .cloneUnit",parent);
            var activeUnit = $(".addUnit .unit:last",parent);
            var seriesLength = chart.series.length;
                for(var i = 0;i < seriesLength; i ++)
                {
                    var lastunit =  activeUnit;
                    cloneUnit.clone().insertAfter(lastunit);
                    activeUnit = $(".addUnit .unit:last",parent);
                    activeUnit.removeClass("d-none");
                    var myseries = chart.series[i];
                    activeUnit.attr("id",i);
                    $("h4",activeUnit).text(myseries.name);
                    $(".box",activeUnit).css("background-color",myseries.color);
                    $(".number",activeUnit).text("_ _").addClass('legend'+i);
                }
        }
        



$("#bench_table").on("click", ".content-area1 a", function(evt) {
    var parent = $("#bench_table");
    evt.preventDefault();
    seriesAdded = [];
    setLocalStorage();
    generateSandboxlist("benchmark-table");
    $(".modal h3", parent).show();
    $(".modal h3.rowSelected", parent).hide();
    $(".applyButton", parent).hide();
    $(".seeall", parent).hide();
    $(".modal tr.selected .selected")
      .removeClass("selected")
      .addClass("addButton");
    $(".modal tr.selected .selected").removeClass();
    $(".sandbox", parent).hide();
  });

  function setLocalStorage() {
    localStorage.setItem("regaddedData", JSON.stringify(seriesAdded));
  }

  function getLocalStorage(){
    var ArrayData = []; 
    var storedData = localStorage.getItem("regaddedData");
    if (storedData) {
        ArrayData = JSON.parse(storedData);
    } 
    return ArrayData;
  }


  function generateSandboxlist(id) {
    var parent = $("#" + id);
    removeSandboxlist(parent);
    var cloneUnit = $(".sandbox .cloneUnit", parent);
    var activeUnit = $(".sandbox .sandbox-list:last", parent);
    var addedSeries = getLocalStorage();
    for (var i = 0; i < addedSeries.length; i++) {
      var lastunit = activeUnit;
      cloneUnit.clone().insertAfter(lastunit);
      activeUnit = $(".sandbox .sandbox-list:last", parent);
      activeUnit.removeClass("cloneUnit");
      activeUnit.attr("id", "regSeries" + i);
      $(".seriesName", activeUnit).text(addedSeries[i]);
    }
  }
  var seriesAdded = [];

  $("#bench_table").on(
    "click",
    "table td span.addButton",
    function() {
      var parent = $("#bench_table .modal");
      $(this)
        .removeClass("addButton")
        .addClass("selected");
      var trParent = $(this).closest("tr");
      trParent.addClass("selected");
      // var seriesName = $("th:first",trParent).text();
      seriesAdded.push($("th:first", trParent).text());
      var regSeries = "regSeries" + (seriesAdded.length - 1);
      trParent.addClass(regSeries);

      if ($("tr.selected", parent).length > 0) {
        var addedText = $("tr.selected", parent).length + " Added";
        $("h3", parent).hide();
        $("h3.rowSelected", parent)
          .text(addedText)
          .show();
        $(".applyButton", parent).show();
        $(".seeall", parent).show();
      }
      setLocalStorage();
      generateSandboxlist("benchmark-table");
    }
  );

  function removeSandboxlist(parent) {
    $(".sandbox .sandbox-list", parent).each(function() {
      if (!$(this).hasClass("cloneUnit")) {
        $(this).remove();
      }
    });
  }

  function getLocalStorage() {
    var ArrayData = [];
    var storedData = localStorage.getItem("regaddedSeries");
    if (storedData) {
      ArrayData = JSON.parse(storedData);
    }
    return ArrayData;
  }

  $("#bench_table").on("click", ".applyButton", function() {
    var parent = $("#bench_table");
    if ($("tr.selected", ".reg_model").length > 0){
        var cloneUnit = $("table.benchmark-table tr.cloneUnit");
        $("tr.selected", ".reg_model").each(function() {
            var activeUnit = $("table.benchmark-table tr.addnewBenchmark",).prev();
            activeUnit.removeClass("d-none");
            
            var selectedName = $("th:first", $(this)).text();
            var coEff = $("td:nth-child(4)", $(this)).text();
            var coEffInter = $("td:nth-child(5)", $(this)).text()
            cloneUnit.clone().insertAfter(activeUnit);
            activeUnit = $("table.benchmark-table tr.addnewBenchmark",).prev();
            var firstTD = "<span><a href='#'><img class='table_close' src='images/close-button.svg'><img></a></span>"+selectedName;
            $("td:nth-child(1)",activeUnit).html(firstTD);
            $("td:nth-child(2)",activeUnit).text(coEff);
            $("td:nth-child(3)",activeUnit).text(coEffInter);
        });
    }
  });


  $("#bench_table").on(
    "click",
    ".sandbox-list .remove-icon",
    function() {
      var parent = $("#bench_table");
      var parentList = $(this).closest(".sandbox-list");
      var storedArray = getLocalStorage();
      var idx = storedArray.indexOf($(".seriesName", parentList).text());
      var getID = parentList.attr("id");
      $(".popuptable tr." + getID + " .selected", parent)
        .removeClass("selected")
        .addClass("addButton");
      $(".popuptable tr." + getID, parent).removeClass("selected");
      parentList.remove();

      // var sid = getID.split("rapSeries");
      // var sid = parseInt(sid[1]);

      if (idx != -1) {
        storedArray.splice(idx, 1); // The second parameter is the number of elements to remove.
      }
      var addedText = storedArray.length + " Added";
      if (storedArray.length != 0) {
        $("h3.rowSelected", parent).text(addedText);
      } else {
        $(".modal h3", parent).show();
        $(".modal h3.rowSelected", parent).hide();
        $(".applyButton", parent).hide();
        $(".seeall", parent).hide();
        $(".sandbox", parent).hide();
      }
      seriesAdded = storedArray;
      setLocalStorage();
      generateSandboxlist();
    }
  );


});    
