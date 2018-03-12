var chartHR;

$(function () {
    var dynamicBand = [];
    
    var primaryDataSet = [];
    var dataSet = [];

    function getMonthString (value) {
        var months = ["JAN", "FEB", "MAR", "APR","MAY", "JUN", "JUL", "AUG","SEP", "OCT", "NOV", "DEC"];
        return months[value - 1];
    }

    function formPrimaryDataSet (data, type) {
        primaryDataSet = [];
        var year = 0,
            monthString = '',
            month = 0,
            value = [];
        for (var i = 0; i < data.length; i++) {
            value = data[i];
            year = value[0].toString().substring(0,4);
            month = value[0].toString().substring(6,4);
            monthString = getMonthString(value[0].toString().substring(6,4));
            primaryDataSet.push({year : year, type : type, month : month, monthString: monthString, value : value[1]});
        }
        primaryDataSet.sort(function(a, b){return a.year - b.year});
        var prevYear = 0,
            months = [],
            temporaryDataSet = [];
        for (var j = 0; j < primaryDataSet.length; j++) {
            year = primaryDataSet[j].year;
            if (j !== primaryDataSet.length - 1 && (year === prevYear || prevYear === 0)){
                temporaryDataSet.push(primaryDataSet[j]);
                prevYear = year;
            } else if (year !== prevYear || prevYear !== 0 || j === primaryDataSet.length - 1){
                if (j === primaryDataSet.length - 1) {
                    temporaryDataSet.push(primaryDataSet[j]);
                }
                temporaryDataSet.sort(function(a, b){return a.month - b.month});
                var result = temporaryDataSet.map(a => a.value);
                var sum = 0;
                for( var i = 0; i < result.length; i++ ){
                    sum += result[i];
                }
                var avgValue = (sum/result.length).toFixed(2);
                if (temporaryDataSet.length === 12) {                   
                    dataSet.push({"Year" : prevYear,"Type" : type, "YTD" : avgValue, "JAN" : result[0],
                        "FEB" : result[1], "MAR" : result[2], "APR" : result[3],"MAY" : result[4], 
                        "JUN" : result[5], "JUL" : result[6], "AUG" : result[7],"SEP" : result[8], 
                        "OCT" : result[9], "NOV" : result[10], "DEC" : result[11], "DT_RowClass": type.toLowerCase()});

                } else if (temporaryDataSet.length === 1) { 
                    dataSet.push({"Year" : prevYear,"Type" : type, "YTD" : avgValue, "JAN" : '',
                    "FEB" : '', "MAR" : '', "APR" : '',"MAY" : '', 
                    "JUN" : '', "JUL" : '', "AUG" : '',"SEP" : '', 
                    "OCT" : '', "NOV" : '',"DEC" : result[0], "DT_RowClass": type.toLowerCase()});
                }
                prevYear = year;
                temporaryDataSet = [];
                if (j !== primaryDataSet.length - 1) {
                    temporaryDataSet.push(primaryDataSet[j]);
                }
            }
        } 
    }

    function formDataSet() {
        formPrimaryDataSet (CITADEL, 'CITADEL');
        formPrimaryDataSet (SANDP, 'SANDP');
       dataSet.sort(function(a, b){return a.Year - b.Year});
       $('#historicalTable').DataTable({
        data: dataSet.reverse(),
        columns: columnsList,
        searching: false, 
        responsive: true,
        paging: false, 
        sorting: false,
        ordering:false,
        info : false,
        // "order": [[ 0, "desc" ]]
        // rowGroup: {
        //     dataSrc: 'Year'
        // }
    });
        $("#historicalTableWrap").css('display', 'none');
    }

    var columnsArr = ["Year","YTD", "JAN", "FEB", "MAR", "APR","MAY", "JUN", "JUL", "AUG","SEP", "OCT", "NOV", "DEC"];
    var columnsList = [];
    for (var i = 0; i < columnsArr.length; i++) {
        columnsList.push({title : columnsArr[i], data : columnsArr[i]})
    }

    formDataSet();
    
    function formChartData(DATA) {
        for (var i = 0; i < DATA.length; i++) {
            var value = DATA[i];
            value[0] = Date.UTC(value[0].toString().substring(0,4), 
                value[0].toString().substring(6,4));
        }
        return DATA;
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
    
    //Overall Benchmarks
    populateBenchmarkData('his_benchmarkTable', benchmarkData);

    //Holding Benchmarks
    var holdingTable = benchmarkData.filter(function(benchmarkItem) {
        return benchmarkItem.type === 'holdings';
    });
    populateBenchmarkData('his_holdingBenchmarks', holdingTable);

    //Favourite Benchmarks
    var favouriteTable = benchmarkData.filter(function(benchmarkItem) {
        return benchmarkItem.type === 'favourites';
    });
    populateBenchmarkData('his_favouriteBenchmarks', favouriteTable);

    dynamicBand[0] = [{
        x: 1292371200000,
        y: 300,
        id: 'top-a',
        val:1

    }, {
        x: 1298937599000,
        y: 300,
        id: 'top-b',
        val:1

    }];
    dynamicBand[1] = [{
        x: 1308096000000,
        y: 300,
        id: 'top-a-1',
        val:2
    }, {
        x: 1314748800000,
        y: 300,
        id: 'top-b-1',
        val:2
    }];
    dynamicBand[2] = [{
        x: 1298937600000,
        y: -250,
        id: 'bot-a',
        val:1
    }, {
        x: 1301615999000,
        y: -250,
        id: 'bot-b',
        val:1
    }];
    dynamicBand[3] = [{
        x: 1301616000000,
        y: -250,
        id: 'bot-a-1',
        val:2
    }, {
        x: 1304207999000,
        y: -250,
        id: 'bot-b-1',
        val:2
    }];
    dynamicBand[4] = [{
        x: 1320105600000,
        y: 300,
        id: 'top-a-2',
        val:3

    }, {
        x: 1325376000000,
        y: 300,
        id: 'top-b-2',
        val:3

    }];
    dynamicBand[5] = [{
        x: 1362096000000,
        y: 300,
        id: 'top-a-3',
        val:4
    }, {
        x: 1370044800000,
        y: 300,
        id: 'top-b-3',
        val:4
    }];
    dynamicBand[6] = [{
        x: 1315785600000,
        y: -250,
        id: 'bot-a-2',
        val:3
    }, {
        x: 1320019200000,
        y: -250,
        id: 'bot-b-2',
        val:3
    }];
    dynamicBand[7] = [{
        x: 1336780800000,
        y: -350,
        id: 'bot-a-3',
        val:4
    }, {
        x: 1341100800000,
        y: -350,
        id: 'bot-b-3',
        val:4
    }];
    dynamicBand[8] = [{
        x: 1420070400000,
        y: 600,
        id: 'top-a-4',
        val:5
    }, {
        x: 1443657600000,
        y: 600,
        id: 'top-b-4',
        val:5
    }];
    dynamicBand[9] = [{
        x: 1394841600000,
        y: -650,
        id: 'bot-a-4',
        val:5
    }, {
        x: 1397520000000,
        y: -650,
        id: 'bot-b-4',
        val:5
    }];


    function plotHRBand() {
        // var nav = chart.get('navigator');
        // nav.setData(ADBE, false);
        // chartHR.xAxis[0].setExtremes();
        // $('#button')[0].disabled = true;

    }


    // var chartHR;

    createHRChart();

    function createHRChart() {

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
                events: {
                    click: function (evt) {
                        $.each(chartHR.series, function (i, name) {
                            axisVal = getYValue(chartHR, i, evt.xAxis[0].value);
                            $(".legend" + i, "#historicalReturns").text(axisVal.toFixed(2));
                        })
                    }
                }
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
                    y: 20,
                    formatter: function () {
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
                enabled : false,
                // showTable : true
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                showInNavigator: true,
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (evt) {
                                var axisVal = new Array();
                                $.each(chartHR.series, function (i, name) {
                                    axisVal[0] = getYValue(chartHR, i, evt.xAxis[0].value);
                                    $(".legend" + i, "#historicalReturns").text(axisVal[0].toFixed(2));
                                })
                            },
                            mouseOut: function () {
                                $(".unit.cloneUnit .number", "#historicalReturns").text("_ _ ");
                               },
                            mouseOver: function () {
                                var sname = this.series.index;
                                $(".legend" + sname, "#historicalReturns").text(this.y.toFixed(2));
                                var series = this.series.chart.series,
                                    x = this.x;
                                $(".legend" + sname, "#historicalReturns").text(this.y.toFixed(2));
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
                },
            },

            series: [
                 {
                    name: 'CITADEL',
                    data: formChartData(CITADEL),
                    type: 'column',
                    color: "#005C8F",
                    showInNavigator: true,

                }

            ],

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
                lineColor: "#0F8EC7",
                handles: {
                    width: 16,
                    height: 24,
                    borderColor: "#FFFFFF",
                    backgroundColor: "#005C8F"
                },
                series: {
                    type: 'column',
                    threshold: 0,
                    lineWidth:2,
                },
                enabled: true,
                opposite: false,
                dataGrouping: {
                    smoothed: true
                }
               
            }

        },function(chartHR) {
            chartHR.addSeries({
                name: 'SANDP',
                data:  formChartData(SANDP),
                type: 'column',
                color: "#C9B160",
                showInNavigator: true
              });
            generateLegend("historicalReturns", chartHR);

        });
    }

    function getfromTimestamp(timeStamp, returnYear=true){
        var currentDate = new Date(timeStamp);
        var month = currentDate.getMonth(); 
        var year = currentDate.getFullYear();
        return data = returnYear ? year : month;
    }


    function getYValue(chartObj, seriesIndex, xValue) {
        var yValue = null;
        var points = chartObj.series[seriesIndex].points;
        for (var i = 0; i < points.length; i++) {
            if (points[i].x >= xValue) break;
            yValue = points[i].y;
        }
        return yValue;
    }

    $(".showBox").on("click", function () {
        $(".showBox").removeClass("active");
        $(this).addClass("active");
        var type = $(this).attr("data-area");
        if (type === 'table') {
            $("#historicalTableWrap").css('display', 'block');
            $("#historicalChartWrap").css('display', 'none');
        } else {
            $("#historicalTableWrap").css('display', 'none');
            $("#historicalChartWrap").css('display', 'block');
        }
    });

    $('#chartFrequency').on("change",function(){
        console.log("Filename: historical-returns.js");
        console.log("Line no: 363");
        // var setFrequency = parseInt($(this).val());
        // var one = 30 * 24 * 3600 * 1000;
        // chartHR.xAxis[0].update({
        //     tickInterval: setFrequency*one
        // });
    });
    
    var names = ["Band 1","Band 2","Band 3","Band 4","Band 5","Band 6","Band 7","Band 8","Band 9","Band 10"];
    var bgColor = ["#2C8E77","#2C8E77","#B3415C","#B3415C","#2C8E77","#2C8E77","#B3415C","#B3415C","#2C8E77","#B3415C"];



    $("#myTableonoffswitch").on("click", function (){
        if(this.checked){
            $(dynamicBand).each(function(i, value){
                var startYear = getfromTimestamp(this[0].x);
                var startMonth = getfromTimestamp(this[0].x, false);
                var endYear = getfromTimestamp(this[1].x);
                var endMonth = getfromTimestamp(this[1].x, false);
                var xVal = this[0].val;
                var className = "";
                if(this[1].y > 0){
                    className = "table-positive";
                }else{
                    className = "table-negative";
                }
                var defaultCell = 3;
                if(startYear == endYear){
                    var startTR = $("#historicalTable td:contains("+startYear+")").closest("tr");
                    var totalMonth = endMonth - startMonth;
                    for(var i=0;i<totalMonth;i++){
                        var month = defaultCell + startMonth + i;
                        $( "td:nth-child("+month+")", startTR).addClass(className);
                        if(prevx != xVal){
                            $( "td:nth-child("+month+")", startTR).attr("data-val",xVal);
                        }
                        var prevx = xVal;
                    }
                }else{
                    var tr = [];
                    tr[0] = $("#historicalTable td:contains("+startYear+")").closest("tr");
                    tr[1] = $("#historicalTable td:contains("+endYear+")").closest("tr");
                    var totalMonth = [];
                    totalMonth[0] = 12 - startMonth;
                    totalMonth[1] = defaultCell+endMonth;
                    // $(totalMonth).each(function(j, val){
                        for(var i=0;i<totalMonth[0];i++){
                            var month = defaultCell + startMonth + i;
                            $( "td:nth-child("+month+")", tr[0]).addClass(className);
                            if(prevx != xVal){
                                $( "td:nth-child("+month+")", tr[0]).attr("data-val",xVal);
                            }
                            var prevx = xVal;
                        }
                        for(var i=0;i<totalMonth[1];i++){
                            var month = totalMonth[1] - i;
                            if(month!=0&&month!==1&&month!==2){
                                $( "td:nth-child("+month+")", tr[1]).addClass(className);    
                            }
                            
                            if(prevx != xVal){
                                $( "td:nth-child("+month+")", tr[1]).attr("data-val",xVal);
                            }
                            var prevx = xVal;
                        }
                        
                    // var tr = [];
                    // tr[0] = $("#historicalTable td:contains("+startYear+")").closest("tr");
                    // tr[1] = $("#historicalTable td:contains("+endYear+")").closest("tr");
                    // var totalMonth = [];
                    // totalMonth[0] = 12 - startMonth;
                    // totalMonth[1] = endMonth;
                    // $(totalMonth).each(function(j, val){
                    //     for(var i=0;i<this;i++){
                    //         var month = defaultCell + this + i;
                    //         $( "td:nth-child("+month+")", tr[j]).addClass(className);
                    //         if(prevx != xVal){
                    //             $( "td:nth-child("+month+")", tr[j]).attr("data-val",xVal);
                    //         }
                    //         var prevx = xVal;
                    //     }
                    // });
                
                }
            });
        }else{
            $("#historicalTable td").removeAttr("data-val").removeClass();
        }
    });



    $("#myonoffswitch").on("click", function () {
        var seriesLength = chartHR.series.length;
        var yvalue;
        if(this.checked){
            $(dynamicBand).each(function(i, value){
                yvalue = dynamicBand[i][0].y > 0 ? 23:0;
                    chartHR.addSeries({
                        name: names[i],
                        data: dynamicBand[i],
                        type: "area",
                        color: "#2C8E77",
                        fillOpacity:.1,
                        lineWidth:0,
                        negativeColor: '#B3415C',
                        showInNavigator: true,  
                        borderWidth:0,
                        navigatorOptions:{
                            width:20,
                            fillOpacity:.75,
                            lineWidth:10
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.point.val;  
                            },
                            x: 10,
                            y: yvalue ,
                            borderRadius: 0,
                            borderWidth:0,
                            color:"#FFFFFF",
                            backgroundColor: bgColor[i],
                        },
                        id: "band"+i
                    });
                });
        }else{
            for(var i = 0; i < dynamicBand.length; i++){
                var series = chartHR.get("band"+i);
                series.remove();
            }
        }
       
    });

    var dateFormat = "yyyy-mm-dd",
        fromHR = $("#fromHR")
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true
            })
            .on("change", function () {
                toHR.datepicker("option", "minDate", getDate(this));
                var parent = $(this).closest(".time-nav");
                $("> div", parent).removeClass("active");
                $(this).closest('.dateRange').addClass("active");
            }),
        toHR = $("#toHR").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
            .on("change", function () {
                fromHR.datepicker("option", "maxDate", getDate(this));
                var parent = $(this).closest(".time-nav");
                $("> div", parent).removeClass("active");
                $(this).closest('.dateRange').addClass("active");
            });



    $("#historicalReturns .time-nav").on("change", "input", function (e) {
        var min = new Date($("#fromCP").val()).getTime();
        var max = new Date($("#toCP").val()).getTime();
        chartHR.xAxis[0].setExtremes(min, max);
        chartHR.showResetZoom();
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest("div").addClass("active");
    });

    $("#historicalReturns .time-nav").on("click", "a", function (e) {
        e.preventDefault();
        if (!chartHR) return;
        var min = extremes.min;
        var yearCount = parseInt($(this).attr("data-year"));
        var clickedElement = $(this);
        setChartRange(chartHR, yearCount, clickedElement);
    });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }

    function removeAllLegend(parent) {
        $(".addUnit .unit", parent).each(function () {
            if (!$(this).hasClass('d-none')) {
                $(this).remove();
            }
        });
    }

    $(".addUnit", "#historicalReturns").on("click", ".close-icon", function () {
        var unitParent = $(this).closest(".unit");
        getChartID = unitParent.attr("data-series");
        chartHR.series[getChartID].remove();
        generateLegend("historicalReturns", chartHR);
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

    function setChartRange(charObj, yearCount, clickedElement = undefined) {
        var one_year = 31536000000;
        var extremes = charObj.xAxis[0].getExtremes();
        var max = extremes.max;
        var min = extremes.min;
        var unixRange = yearCount * one_year;
        var min = max - unixRange;
        charObj.xAxis[0].setExtremes(min, max);
        if (clickedElement) {
            var parent = clickedElement.closest(".time-nav");
            $("> div", parent).removeClass("active");
            clickedElement.closest("div").addClass("active");
        }

        var setFrequency = parseInt($("#chartFrequency").val());
        var one = 30 * 24 * 3600 * 1000;
        charObj.xAxis[0].update({
            tickInterval: setFrequency*one
        });

    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    

      var defaulthisSeriesCount =  7;

      $("#historicalReturns").on("click",".content-area1 a",function(evt){
        var parent = $("#historicalReturns");
        evt.preventDefault();
        seriesAdded = [];
        setLocalStorage();
        generateSandboxlist("historicalReturns");
        $(".modal h3",parent).show();
        $(".modal h3.rowSelected",parent).hide();
        $(".applyButton",parent).hide();
        $(".seeall",parent).hide();
        $(".modal tr.selected .selected").removeClass("selected").addClass("addButton");
        $(".modal tr.selected .selected").removeClass();
        $(".sandbox",parent).hide();
      });


      $("#historicalReturns").on("click",".sandbox-list .remove-icon",function(){
        var parent =  $("#historicalReturns");
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
        localStorage.setItem("hisretaddedSeries",  JSON.stringify(seriesAdded));
      }
    
      function getLocalStorage(){
        var ArrayData = []; 
        var storedData = localStorage.getItem("hisretaddedSeries");
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
                activeUnit.attr("id","hisretSeries"+i);
                $(".seriesName",activeUnit).text(addedSeries[i]);
            }
      }


    $("#historicalReturns").on("click", ".applyButton", function () {
        var parent = $("#historicalReturns");
        var totalSeriesCount = $("tr.selected",parent).length + defaulthisSeriesCount;
        var renderedSeriesCount = $(".addUnit .unit",parent).length-1;
    
        if( $("tr.selected",parent).length > 0 && renderedSeriesCount < totalSeriesCount){

            $("tr.selected", parent).each(function () {
                var seriesName = $("th:first", $(this)).text();
                chartHR.addSeries({
                    name: seriesName,
                    data: formChartData(aapl),
                    type: "column",
                    color: getRandomColor(),
                    fillOpacity: 0.1,
                    lineWidth: 1
                });
            });
            generateLegend("historicalReturns", chartHR);
        }
    });

    
$("#historicalReturns").on("click",".seeall",function(){
    var parent = $("#historicalReturns");
    $(".sandbox",parent).toggle();
  });

  var seriesAdded = [];

  $("#historicalReturns").on("click","table td span.addButton",function(){
    var parent = $("#historicalReturns .modal");
    $(this).removeClass("addButton").addClass("selected");
    var trParent = $(this).closest("tr");
    trParent.addClass("selected");
    // var seriesName = $("th:first",trParent).text();
    seriesAdded.push($("th:first",trParent).text());
    var hisretSeries = "hisretSeries"+(seriesAdded.length-1);
    trParent.addClass(hisretSeries);
    
    if( $("tr.selected",parent).length > 0){
        var addedText = $("tr.selected",parent).length+" Added";
        $("h3",parent).hide();
        $("h3.rowSelected",parent).text(addedText).show();
        $(".applyButton",parent).show();
        $(".seeall",parent).show();

    }
    setLocalStorage();
    generateSandboxlist("historicalReturns");
});

    setChartRange(chartHR, 3);

    $("tr.odd > td:first-child","#historicalTable").on("click",function(){
        var parent = $(this).closest("tr");
        if(parent.hasClass("removeBorder")){
            parent.removeClass("removeBorder")
        }else{
            parent.addClass("removeBorder")
        }
        parent.next().toggle();
    })
});