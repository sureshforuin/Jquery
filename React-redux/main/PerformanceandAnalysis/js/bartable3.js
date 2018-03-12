$(document).ready(function() {
    var tableBarChart3;
    var categories = [
        "US",
        "Europe",
        "Asia ex Japan",
        "Japan",
        "International",
        "Emerging Markets"
    ];
    var categoriesData = [0.68, -0.72, 0.22, 0.31, 0.4, 0.6];
    var space = "              ";
    var categoryX = [];
    
    var categoryXData = function (yearCount) {
        categoryX = [];
        var calcYearCount = yearCount / 10;
        if (yearCount) {
            categoriesData = [0.68, -0.72, 0.22, 0.31, 0.4, 0.6];
            for (var i = 0; i < categoriesData.length; i++) {
                categoriesData[i] = ((categoriesData[i] * calcYearCount).toFixed(2))/1;
            }
        }
        $(categoriesData).each(function(i, key) {
            var xaxisText =
                "<div class='xtext'><span class='cat'>" +
                categories[i] +
                "</span><span class='number'>" +
                categoriesData[i] +
                "</span></div>";
            categoryX.push(xaxisText);
        });
    };
    categoryXData(3);
    
    $("#tab-3 .time-nav").on("change", "input", function(e) {
        e.preventDefault();
        var min = new Date($("#fromCF").val()).getTime();
        var max = new Date($("#toCF").val()).getTime();
        categoriesData = [0.68, -0.72, 0.22, 0.31, 0.4, 0.6];
        var calcValue = Math.round((max - min) / 86400000) / 1000;
        for (var i = 0; i < categoriesData.length; i++) {
            categoriesData[i] = (categoriesData[i] * calcValue).toFixed(2) / 1;
        }
        categoryXData();
        tableBarChart3.xAxis[0].categories = categoryX;
        tableBarChart3.xAxis[1].categories = categoryX;
        tableBarChart3.series[0].setData(categoriesData, true);
    });

    $("#tab-3 .time-nav").on("click", "a", function(e) {
        e.preventDefault();
        var yearCount = parseInt($(this).attr("data-year"));
        categoryXData(yearCount);
        tableBarChart3.xAxis[0].categories = categoryX;
        tableBarChart3.xAxis[1].categories = categoryX;
        tableBarChart3.series[0].setData(categoriesData, true);
    });

    tableBarChart3 = Highcharts.chart("tableBar3", {
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
        xAxis: [{
                categories: categoryX,
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
                categories: categoryX
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
                text: ""
            },

            title: {
                text: null
            },
            // labels: {
            //     formatter: function() {
            //         return Math.abs(this.value);
            //     }
            // }
        },

        plotOptions: {},
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },

        tooltip:{
            enabled: false
        },

        series: [{
            name: "Fund",
            data: categoriesData,
            color: "#0F8EC7"
        }]
    });
});