const SVG_SAFE_MIN_VALUE = ~0 << 15;
const SVG_SAFE_MAX_VALUE = ~SVG_SAFE_MIN_VALUE;
const $rapDropDown = $('#rap-chart-dropdown');

var line,
    label,
    clickX,
    clickY,
    rapChart,
    MAX_TRANSLATION_X,
    MIN_TRANSLATION_X;

$(onReady);

function dragStartHandler(e) {
    $('.rap-band').parents('svg').bind({
        'mousemove.line': dragStepHandler,
        'mouseout.line': dragStopHandler,
        'mouseup.line': dragStopHandler
    });

    // debugger;
    clickX = e.pageX - line.translateX;
    //clickY = e.pageY - line.translateY; //uncomment if plotline should be also moved vertically
}
function dragStepHandler(e) {
    if (slidingOutsideChartArea(e)) {
        return;
    }

    slideChartElements(e);
    updateSelectedPoints(rapChart);
}

function dragStopHandler() {
    $('.rap-band').parents('svg').unbind('.line');
}

function getBandDimensions(band) {
    const dValues = band.svgElem.d.match(/M ([\-0-9\.]+?) ([\-0-9\.]+?) L ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) z/).splice(1);
    return [parseFloat(dValues[0]), parseFloat(dValues[1]), dValues[4] - dValues[2], dValues[5] - dValues[7]];
}

function getChartOptions() {
    return {
        chart: {
            reflow: false,
            type: "area"
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        xAxis: {
            crosshair: false,
            type: "datetime",
            plotLines: getInitialPlotBands()
        },
        plotOptions: {
            series: {
                compare: "percent",
                states: {
                    hover: {
                        enabled: false
                    }
                },

                // allowPointSelect: true,
                // marker: {
                //     radius: 0.1,
                //     states: {
                //         select: {
                //             radius: 5
                //         }
                //     }
                // }
            }           
        },
        series: getSeries()
    };
}

function getInitialPlotBandTimeframe() {
    const series = getSeries();
    let lower = Number.NEGATIVE_INFINITY;
    for (let serie of series) {
        lower = Math.max(lower, serie.data[0][0]);
    }

    let upper = Number.POSITIVE_INFINITY;
    for (let serie of series) {
        upper = Math.min(upper, serie.data[serie.data.length - 1][0]);
    }

    const range = upper - lower;
    return {
        from: lower + range / 2 - (moment.duration(getSelectedTimeframe(), 'months').asMilliseconds()) / 2, //Date.UTC(2013, 12, 31),
        to: upper - range / 2 + (moment.duration(getSelectedTimeframe(), 'months').asMilliseconds()) / 2 //Date.UTC(2015, 12, 31)
    };
}

function getInitialPlotBands() {
    const plotBandtimeFrame = getInitialPlotBandTimeframe();
    return [
        {
            color: "#FFFFFF",
            from: 0,//Date.UTC(2010, 01, 01),
            to: plotBandtimeFrame.from,
            id: "left-overlay-band",
            className: "overlay",
            zIndex: 10,
            borderColor: "#EFEFEF",
            borderWidth: 1
        },
        {
            // color: "#FFFFFF",
            from: plotBandtimeFrame.from,
            to: plotBandtimeFrame.to,
            id: "rap-band",
            className: "rap-band",
            zIndex: 10,
            borderColor: "#EFEFEF",
            borderWidth: 1
        },
        {
            color: "#FFFFFF",
            from: plotBandtimeFrame.to,
            to: Number.MAX_SAFE_INTEGER,//Date.UTC(2018, 12, 31),
            id: "right-overlay-band",
            className: "overlay",
            zIndex: 10,
            borderColor: "#EFEFEF",
            borderWidth: 1
        }
    ];
}

function getMaxTranslationXAllowed(rapChart) {
    const dimensions = getBandDimensions(getRapBand(rapChart));
    return $('.rap-band').parents('svg').find('.highcharts-plot-background').width() - dimensions[0] - dimensions[2];
}

function getMinTranslationXAllowed(rapChart) {
    const dimensions = getBandDimensions(getRapBand(rapChart));
    return -dimensions[0];
}

function getPlotBandsFromChart(chart) {
    return chart.xAxis[0].plotLinesAndBands;
}

function getRapBand(chart) {
    return getPlotBandsFromChart(chart).filter(band => band.id === 'rap-band').pop();
}

function getSelectedTimeframe() {
    return parseInt($('#rap-chart-dropdown').val());
}

function getSeries() {
    return [{
        name: "ALPHA PORTFOLIO MODEL",
        data: [
            [1293840000000, 27.91],
            [1296518400000, 27.72],
            [1298937600000, 26.58],
            [1301616000000, 25.39],
            [1304208000000, 25.92],
            [1306886400000, 25.01],
            [1309478400000, 26],
            [1312156800000, 27.4],
            [1314835200000, 26.6],
            [1317427200000, 24.89],
            [1320105600000, 26.63],
            [1322697600000, 25.58],
            [1325376000000, 25.96],
            [1328054400000, 29.53],
            [1330560000000, 31.74],
            [1333238400000, 32.26],
            [1335830400000, 32.02],
            [1338508800000, 29.19],
            [1341100800000, 30.59],
            [1343779200000, 29.47],
            [1346457600000, 30.82],
            [1349049600000, 29.76],
            [1351728000000, 28.54],
            [1354320000000, 26.62],
            [1356998400000, 26.71],
            [1359676800000, 27.45],
            [1362096000000, 27.8],
            [1364774400000, 28.6],
            [1367366400000, 33.1],
            [1370044800000, 34.9],
            [1372636800000, 34.54],
            [1375315200000, 31.84],
            [1377993600000, 33.4],
            [1380585600000, 33.28],
            [1383264000000, 35.4],
            [1385856000000, 38.13],
            [1388534400000, 37.41],
            [1391212800000, 37.84],
            [1393632000000, 38.31],
            [1396310400000, 40.99],
            [1398902400000, 40.4],
            [1401580800000, 40.94],
            [1404172800000, 43.16],
            [1406851200000, 45.43],
            [1409529600000, 46.36],
            [1412121600000, 46.95],
            [1414800000000, 47.81],
            [1417392000000, 46.45],
            [1420070400000, 40.4],
            [1422748800000, 43.85],
            [1425168000000, 40.66],
            [1427846400000, 48.64],
            [1430438400000, 46.86],
            [1433116800000, 44.15],
            [1435708800000, 46.7],
            [1438387200000, 43.52],
            [1441065600000, 44.26],
            [1443657600000, 52.64],
            [1446336000000, 54.35],
            [1448928000000, 55.48],
            [1451606400000, 55.09],
            [1454284800000, 50.88],
            [1456790400000, 55.23],
            [1459468800000, 49.87],
            [1462060800000, 53],
            [1464739200000, 51.17],
            [1467331200000, 56.68],
            [1470009600000, 57.46],
            [1472688000000, 57.6],
            [1475280000000, 59.92],
            [1477958400000, 60.26],
            [1480550400000, 62.14],
            [1483228800000, 64.65],
            [1485907200000, 63.98],
            [1488326400000, 65.86],
            [1491004800000, 68.46],
            [1493596800000, 69.84],
            [1496275200000, 68.93],
            [1498867200000, 72.7],
            [1501545600000, 74.77],
            [1504224000000, 74.49],
            [1506816000000, 83.18],
            [1509494400000, 84.17],
            [1512086400000, 85.23],
            [1514764800000, 85.23]
        ],
        color: "#0F8EC7",
        fillOpacity: 0.1,
        lineWidth: 1,
        className: "baseBench"
    }, {
        name: "S&P 500 TR USD",
        data: [
            [1293840000000, -93.84168179370873],
            [1296518400000, -92.05787324513723],
            [1298937600000, -89.1444877061288],
            [1301616000000, -85.92113511215406],
            [1304208000000, -85.60094645043357],
            [1306886400000, -82.89506865784743],
            [1309478400000, -76.43708859510555],
            [1312156800000, -95.9355200333016],
            [1314835200000, -81.18831499907353],
            [1317427200000, -82.51771899494325],
            [1320105600000, -88.69832262377689],
            [1322697600000, -92.24759484484856],
            [1325376000000, -91.18861321212574],
            [1328054400000, -77.83919628253815],
            [1330560000000, -90.5122437498596],
            [1333238400000, -91.80211720713953],
            [1335830400000, -99.50453165196075],
            [1338508800000, -88.80520977448816],
            [1341100800000, -69.96165341903536],
            [1343779200000, -95.3868162397778],
            [1346457600000, -92.43083413435681],
            [1349049600000, -94.91352695122582],
            [1351728000000, -73.2701141678597],
            [1354320000000, -81.96140874506463],
            [1356998400000, -89.09820445833441],
            [1359676800000, -89.18345164044916],
            [1362096000000, -91.4547122429461],
            [1364774400000, -80.83852033312724],
            [1367366400000, -93.27178671099828],
            [1370044800000, -90.17901538008124],
            [1372636800000, -87.48389552218505],
            [1375315200000, -98.6676628155315],
            [1377993600000, -98.3716146759969],
            [1380585600000, -90.08895266067182],
            [1383264000000, -82.53447955155974],
            [1385856000000, -98.30239665639643],
            [1388534400000, -72.32325692828734],
            [1391212800000, -66.04373495116276],
            [1393632000000, -66.64455742727952],
            [1396310400000, -59.294915660854734],
            [1398902400000, -73.4348774008102],
            [1401580800000, -91.22504626079585],
            [1404172800000, -70.25631726395693],
            [1406851200000, -95.06014541630196],
            [1409529600000, -70.72420631683735],
            [1412121600000, -64.76731043244394],
            [1414800000000, -99.81545280343502],
            [1417392000000, -63.1283253591954],
            [1420070400000, -94.82490248363476],
            [1422748800000, -66.78349566805392],
            [1425168000000, -65.9188996848964],
            [1427846400000, -70.2121050594262],
            [1430438400000, -59.57634717973964],
            [1433116800000, -95.03669113945575],
            [1435708800000, -63.31636058673462],
            [1438387200000, -90.82265736284742],
            [1441065600000, -93.41560061132121],
            [1443657600000, -59.02965435635623],
            [1446336000000, -60.85378285537915],
            [1448928000000, -82.74566903937755],
            [1451606400000, -77.09301573387137],
            [1454284800000, -84.74709184246504],
            [1456790400000, -60.337144527592706],
            [1459468800000, -83.69961211072592],
            [1462060800000, -96.9731817133418],
            [1464739200000, -71.05723867766321],
            [1467331200000, -96.22465841738921],
            [1470009600000, -88.31234587361985],
            [1472688000000, -62.953515092132854],
            [1475280000000, -57.31004238358917],
            [1477958400000, -90.05806238850778],
            [1480550400000, -41.13650293759845],
            [1483228800000, -49.84116282231344],
            [1485907200000, -47.782695702975275],
            [1488326400000, -52.13974028185669],
            [1491004800000, -57.080806725700874],
            [1493596800000, -61.99248810264879],
            [1496275200000, -47.27767940739377],
            [1498867200000, -45.92144254959152],
            [1501545600000, -97.77252756239491],
            [1504224000000, -26.13482359899649],
            [1506816000000, -96.41157143190222],
            [1509494400000, -18.65636346297387],
            [1512086400000, -54.15314381017385],
            [1514764800000, -84.72930453520625]
        ],
        color: "#C9B160",
        fillOpacity: 0.1,
        lineWidth: 1,
        className: "baseBench"
    }];
}

function onChartReady(chart) {
    const bands = getPlotBandsFromChart(chart).filter(band => band.id !== 'rap-band');

    for (let band of bands) {
        const dValues = band.svgElem.d.split(' ');
        if (band.id === 'left-overlay-band') {
            dValues[1] = dValues[4] = SVG_SAFE_MIN_VALUE;
        } else if (band.id === 'right-overlay-band') {
            dValues[6] = dValues[8] = SVG_SAFE_MAX_VALUE;
        }

        band.svgElem.attr({
            d: dValues.join(' ')
        });
    }

    const rapBand = getRapBand(chart);
    line = rapBand.svgElem
        .attr({
            stroke: '#EFEFEF'
        })
        .translate(0, 0)
    //.on('mousedown', dragStartHandler);

    const renderer = chart.renderer;
    const dimensions = getBandDimensions(rapBand);
    label = renderer.image.apply(renderer, [`http://png-pixel.com/${dimensions[2]}x${dimensions[3]}-00000000.png`, ...dimensions])
        .attr({
            zIndex: 999
        })
        .css({
            cursor: 'pointer'
        })
        .translate(0, 0)
        .addClass('rap-band-draggable-box')
        .on('mousedown', dragStartHandler)
        .add();

    $rapDropDown.css({
        left: dimensions[0] + (dimensions[2] - $rapDropDown.width()) / 2,
        top: dimensions[1] + 20
    }).show();

    MAX_TRANSLATION_X = getMaxTranslationXAllowed(chart);
    MIN_TRANSLATION_X = getMinTranslationXAllowed(chart);

    updateSelectedPoints(chart);
}

function onReady() {
    renderChart();
    registerRapDropDownChangeHandler();
}

function onTimeFrameChange(event) {
    rapChart.destroy();
    renderChart();
}

function registerRapDropDownChangeHandler() {
    $('#rap-chart-dropdown').change(onTimeFrameChange);
}

function renderChart() {
    rapChart = Highcharts.stockChart('rap-chart', getChartOptions(), onChartReady);
}

function slidingOutsideChartArea(e) {
    const deltaX = e.pageX - clickX;
    return deltaX >= MAX_TRANSLATION_X || deltaX <= MIN_TRANSLATION_X;
}

function slideChartElements(e) {
    slideRapBand(e);
    slideOverlayPlotBands(e);
    slideRapDropDown(e);
}

function slideOverlayPlotBands(e) {
    const bands = getPlotBandsFromChart(rapChart).filter(band => band.id !== 'rap-band');
    bands.map(band => band.svgElem).forEach(svgElem => svgElem.translate(line.translateX, line.translateY));
}

function slideRapBand(e) {
    line.translate(e.pageX - clickX, e.pageY - clickY);
    if (label) {
        label.translate(line.translateX, line.translateY)
    }
}

function slideRapDropDown(e) {
    const dimensions = getBandDimensions(getRapBand(rapChart));
    $rapDropDown.css({
        left: dimensions[0] + (dimensions[2] - $rapDropDown.width()) / 2 + line.translateX
    });
}

function updateSelectedPoints(rapChart) {
    return;

    const dimensions = getBandDimensions(getRapBand(rapChart));
    const newFrom = rapChart.xAxis[0].toValue(dimensions[0] + line.translateX);
    const newTo = moment(newFrom).add(getSelectedTimeframe(), 'months').valueOf();

    const fromPoints = [];
    const toPoints = [];

    for (let serie of rapChart.series) {
        let newFromIndex = 0;
        for (; newFromIndex < serie.data.length && serie.data[newFromIndex].x < newFrom; newFromIndex++);
        const fromPoint = serie.data[++newFromIndex];
        if (fromPoint) {
            fromPoints.push(fromPoint);    
        }

        let newToIndex = serie.data.length - 1;
        for (; newToIndex >= 0 && serie.data[newToIndex].x > newTo; newToIndex--);
        const toPoint = serie.data[++newToIndex];
        if (toPoint) {
            toPoints.push(toPoint);
        }

        // const fromMarkerAttribs = serie.markerAttribs(fromPoint, 'hover');
        // const fromStateMarkerGraphic = rapChart.renderer.symbol(
        //     'cirlce',
        //     fromMarkerAttribs.x,
        //     fromMarkerAttribs.y,
        //     fromMarkerAttribs.width,
        //     fromMarkerAttribs.height
        // );

        // const toMarkerAttribs = serie.markerAttribs(toPoint, 'hover');
        // const toStateMarkerGraphic = rapChart.renderer.symbol(
        //     'cirlce',
        //     toMarkerAttribs.x,
        //     toMarkerAttribs.y,
        //     toMarkerAttribs.width,
        //     toMarkerAttribs.height
        // );

        // fromStateMarkerGraphic.attr(serie.pointAttribs(fromPoint, 'hover'));
        // toStateMarkerGraphic.attr(serie.pointAttribs(toPoint, 'hover'));

        // fromStateMarkerGraphic.show();
        // toStateMarkerGraphic.show();
    }

    if (fromPoints.length * toPoints.length === 0) {
        return;
    }

    const renderer = rapChart.renderer;
    const allPoints = [...fromPoints, ...toPoints];
    for (let point of allPoints) {
        renderer.circle(point.plotX, point.plotY, 2).add();
    }
    // debugger;
}