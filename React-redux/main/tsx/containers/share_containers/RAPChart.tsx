import * as Highstock from 'highcharts/highstock';
import * as React from 'react';
import * as moment from 'moment';
import { generateKey, isObjEmpty, convertToMonthEnd } from "../../../utills/common";
import { GRAPH_COLOR_SERIES, CHART_ROOT, BM_CHART_ROOT, notifyRAPChartDateControlChange } from "../../constants/constant";
import { fetchWrapper } from '../../../utills/api_wrapper';
import { connect } from 'react-redux';
import { setRAPSeriesData, setSelectedRollingPeriod, setSelectedTimeFrame, setDateControl, removeRAPSeries } from '../../actions/rapChart.action';
import { RAPChartInterface, DateRange } from '../../reducers/rapChart.reducer';
import AddBenchMarkFund from './AddBenchMarkFund';

const ROLLING_PERIODS = [12, 24, 36];
const DEFAULT_ROLLING_PERIOD = ROLLING_PERIODS[0]; // set default to 12 months

const SVG_SAFE_MIN_VALUE = ~0 << 15;
const SVG_SAFE_MAX_VALUE = ~SVG_SAFE_MIN_VALUE;

interface RAPChartProps {
    childContentData: {
        plotData: any;
        plotMetaData: {
            addBenchmarkFund: boolean
            graphPositionIndicator: boolean;
            perfType: string;
            timeFrame: {
                active: number | string
            };
        };
        plotTitle: string;
    };
    id: string
}

// interface RAPChartState {
//     rollingPeriodList: number[];
//     selectedRollingPeriod: number;
//     selectedYear: number;
// }

class RAPChart extends React.Component<RAPChartProps & RAPChartMapStateToProps & RAPChartMapDispatchToProps, {}>{
    selectedYear: number;
    selectedRollingPeriod: number | string = DEFAULT_ROLLING_PERIOD;
    allChartSeries: any[];
    $rapDropDown: JQuery<HTMLElement>;

    line;
    label;
    clickX;
    clickY;
    rapChart;
    MAX_TRANSLATION_X;
    MIN_TRANSLATION_X;

    constructor(props) {
        super(props);
        // this.state = {
        //     selectedRollingPeriod: DEFAULT_ROLLING_PERIOD,
        //     selectedYear: null,
        //     rollingPeriodList: this.getRollingPeriodList(null)
        // };

        this.changeGraphTimeFrame = this.changeGraphTimeFrame.bind(this);
        this.dragStartHandler = this.dragStartHandler.bind(this);
        this.dragStepHandler = this.dragStepHandler.bind(this);
        this.onChartReady = this.onChartReady.bind(this);
        this.onRollingPeriodChange = this.onRollingPeriodChange.bind(this);
        this.refreshChart = this.refreshChart.bind(this);
        this.updateTickers = this.updateTickers.bind(this);
    }

    componentDidUpdate() {
        this.updateTickers(this.rapChart);
    }

    getSelectedPoints(rapChart: any) {
        interface Pair<T> {
            first: T
            second: T
        }
        const selectedPoints: Pair<Pair<number>>[] = [];

        if (!rapChart) {
            return selectedPoints;
        }

        const dimensions = this.getBandDimensions(this.getRapBand(rapChart));
        const newFrom = rapChart.xAxis[0].toValue(dimensions[0] + this.line.translateX);
        const newTo = moment(newFrom).add(this.getSelectedRollingPeriod(), 'months').valueOf();

        const fromPoints: any[] = [];
        const toPoints: any[] = [];

        for (let serie of rapChart.series) {
            let newFromIndex = 0;
            for (; newFromIndex < serie.data.length && serie.data[newFromIndex].x < newFrom; newFromIndex++);
            const fromPoint = serie.data[++newFromIndex];
            if (fromPoint) {
                fromPoints.push(fromPoint);
            }

            let newToIndex = serie.data.length - 1;
            for (; newToIndex >= 0 && serie.data[newToIndex].x > newTo; newToIndex--);
            const toPoint = serie.data[Math.min(++newToIndex, serie.data.length - 1)];
            if (toPoint) {
                toPoints.push(toPoint);
            }

            selectedPoints.push({
                first: {
                    first: fromPoint.x,
                    second: fromPoint.y
                },

                second: {
                    first: toPoint.x,
                    second: toPoint.y
                },
            });
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

        return selectedPoints;
    }

    getRollingPeriodList(selectedYear) {
        // if (selectedYear) {
        //     const maxRollingPeriodAllowed = parseInt(selectedYear) * 12;
        //     return ROLLING_PERIODS.filter(timeFrame => timeFrame <= maxRollingPeriodAllowed);
        // }
        // return ROLLING_PERIODS;
        return this.props.storeData.rollingPeriodList;
    }

    componentDidMount() {
        this.allChartSeries = highchartDataManipulation(this.props.childContentData.plotData) || [];
        this.props.setRAPSeriesData(this.allChartSeries);
        if (!isObjEmpty(this.props.storeData.RAPChart)) {
            this.renderChart();
            this.rapChart.xAxis[0].setExtremes(null, null);
            this.registerDateControlEventHandlers();
            this.registerRapDropDownChangeHandler();
        }
    }

    dragStartHandler(e) {
        $('.rap-band').parents('svg').bind({
            'mousemove.line': this.dragStepHandler,
            'mouseout.line': this.dragStopHandler,
            'mouseup.line': this.dragStopHandler
        });

        // debugger;
        this.clickX = e.pageX - this.line.translateX;
        //clickY = e.pageY - line.translateY; //uncomment if plotline should be also moved vertically
    }
    dragStepHandler(e) {
        if (this.slidingOutsideChartArea(e)) {
            return;
        }

        this.slideChartElements(e);
        // this.updateSelectedPoints(this.rapChart);
        this.updateTickers(this.rapChart);
    }

    dragStopHandler() {
        $('.rap-band').parents('svg').unbind('.line');
    }

    /**
     * 
     * @param band 
     * @returns [startX, startY, width, height] in pixels
     */
    getBandDimensions(band) {
        const dValues = band.svgElem.d.match(/M ([\-0-9\.]+?) ([\-0-9\.]+?) L ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) ([\-0-9\.]+?) z/).splice(1);
        return [parseFloat(dValues[0]), parseFloat(dValues[1]), dValues[4] - dValues[2], dValues[5] - dValues[7]];
    }

    getChartOptions() {
        return {
            chart: {
                // type: graphType,
                backgroundColor: null,
                reflow: false,
                style: {
                    fontFamily: "pf_dintext_proregular",
                    fontSize: "15px"
                },
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
                selected: 6,
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                shared: false,
                useHTML: false,
                shadow: false,
                borderWidth: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
            },
            xAxis: {
                crosshair: false,
                type: 'datetime',
                dateTimeLabelFormats: {
                    year: '%Y'
                },
                tickInterval: moment.duration(1, 'years').asMilliseconds(),
                plotLines: this.getInitialPlotBands()
            },
            plotOptions: {
                series: {
                    className: "mySeries",
                    cursor: "pointer",
                    showInNavigator: true,
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    tooltip: false
                }
            },
            yAxis: {
                startOnTick: false,
                opposite: false,
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            series: this.getSeries()
        };
    }

    getInitialPlotBandTimeframe() {
        const series = this.getSeries();
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
            from: lower + range / 2 - (moment.duration(this.getSelectedRollingPeriod(), 'months').asMilliseconds()) / 2,
            to: upper - range / 2 + (moment.duration(this.getSelectedRollingPeriod(), 'months').asMilliseconds()) / 2
        };
    }

    getInitialPlotBands() {
        const plotBandtimeFrame = this.getInitialPlotBandTimeframe();
        return [
            {
                color: "#FFFFFF",
                from: 0,
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
                to: Number.MAX_SAFE_INTEGER,
                id: "right-overlay-band",
                className: "overlay",
                zIndex: 10,
                borderColor: "#EFEFEF",
                borderWidth: 1
            }
        ];
    }

    getMaxTranslationXAllowed(rapChart) {
        const dimensions = this.getBandDimensions(this.getRapBand(rapChart));
        const $plotArea = $('.rap-band').parents('svg').find('.highcharts-plot-background');
        // In IE, the DOM element is not ready here so we must read the width value from the element attribute instead
        const plotAreaWidth = $plotArea.width() || parseInt($plotArea.attr('width'));
        return plotAreaWidth - dimensions[0] - dimensions[2] + 40;
    }

    getMinTranslationXAllowed(rapChart) {
        const dimensions = this.getBandDimensions(this.getRapBand(rapChart));
        return -dimensions[0] + 50;
    }

    getPlotBandsFromChart(chart) {
        return chart.xAxis[0].plotLinesAndBands;
    }

    getRapBand(chart) {
        return this.getPlotBandsFromChart(chart).filter(band => band.id === 'rap-band').pop();
    }

    getSelectedRollingPeriod() {
        // const selectedRollingPeriod = (this.selectedRollingPeriod || DEFAULT_ROLLING_PERIOD) as string;
        // return parseInt(selectedRollingPeriod);
        // debugger;
        let selectedRollingPeriod = this.props.storeData.selectedRollingPeriod;
        if (typeof selectedRollingPeriod === 'string') {
            selectedRollingPeriod = parseInt(selectedRollingPeriod);
        }
        return selectedRollingPeriod;
    }

    onChartReady(chart) {
        const bands = this.getPlotBandsFromChart(chart).filter(band => band.id !== 'rap-band');

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

        const rapBand = this.getRapBand(chart);
        if (rapBand) {
            this.line = rapBand.svgElem
                .attr({
                    stroke: '#EFEFEF'
                })
                .translate(0, 0)
            //.on('mousedown', dragStartHandler);

            const renderer = chart.renderer;
            const dimensions = this.getBandDimensions(rapBand);
            this.label = renderer.image.apply(renderer, [`http://png-pixel.com/${dimensions[2]}x${dimensions[3]}-00000000.png`, ...dimensions])
                .attr({
                    zIndex: 999
                })
                .css({
                    cursor: 'pointer'
                })
                .translate(0, 0)
                .addClass('rap-band-draggable-box')
                .on('mousedown', this.dragStartHandler)
                .add();

            this.$rapDropDown.css({
                left: dimensions[0] + (dimensions[2] - this.$rapDropDown.width()) / 2,
                top: dimensions[1] + 20
            }).show();

            this.MAX_TRANSLATION_X = this.getMaxTranslationXAllowed(chart);
            this.MIN_TRANSLATION_X = this.getMinTranslationXAllowed(chart);

            this.updateSelectedPoints(chart);
            this.updateTickers(chart);
        }
    }

    onRollingPeriodChange(event) {
        const newRollingPeriod = event.target.value;
        this.selectedRollingPeriod = newRollingPeriod;
        // this.setState({
        //     selectedRollingPeriod: newRollingPeriod
        // });

        this.props.setSelectedRollingPeriod(newRollingPeriod, () => { this.selectedRollingPeriod = newRollingPeriod; this.refreshChart(); });
    }

    registerRapDropDownChangeHandler() {
        $('.rap-chart-dropdown').change(this.onRollingPeriodChange);
    }

    renderChart() {
        const chartOptions = this.getChartOptions();
        this.rapChart = Highstock.stockChart(this.props.id, chartOptions, this.onChartReady);
        return this.rapChart;
    }

    slidingOutsideChartArea(e) {
        const deltaX = e.pageX - this.clickX;
        return deltaX >= this.MAX_TRANSLATION_X || deltaX <= this.MIN_TRANSLATION_X;
    }

    slideChartElements(e) {
        this.slideRapBand(e);
        this.slideOverlayPlotBands(e);
        this.slideRapDropDown(e);
    }

    slideOverlayPlotBands(e) {
        const bands = this.getPlotBandsFromChart(this.rapChart).filter(band => band.id !== 'rap-band');
        bands.map(band => band.svgElem).forEach(svgElem => svgElem.translate(this.line.translateX, this.line.translateY));
    }

    slideRapBand(e) {
        this.line.translate(e.pageX - this.clickX, e.pageY - this.clickY);
        if (this.label) {
            this.label.translate(this.line.translateX, this.line.translateY)
        }
    }

    slideRapDropDown(e) {
        const dimensions = this.getBandDimensions(this.getRapBand(this.rapChart));
        this.$rapDropDown.css({
            left: dimensions[0] + (dimensions[2] - this.$rapDropDown.width()) / 2 + this.line.translateX
        });
    }

    updateSelectedPoints(rapChart) {
        const dontExecute = true;
        if (dontExecute) {
            return;
        }

        const dimensions = this.getBandDimensions(this.getRapBand(rapChart));
        const newFrom = rapChart.xAxis[0].toValue(dimensions[0] + this.line.translateX);
        const newTo = moment(newFrom).add(this.getSelectedRollingPeriod(), 'months').valueOf();

        const fromPoints: any[] = [];
        const toPoints: any[] = [];

        this.getSelectedPoints(rapChart);

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

    updateTickers(rapChart) {
        const selectedPoints = this.getSelectedPoints(rapChart);
        if (!selectedPoints.length) {
            return;
        }

        $('#fromAsOfDate' + this.props.id).text(moment(selectedPoints[0].first.first).format("MMM 'YY"));
        $('#toAsOfDate' + this.props.id).text(moment(selectedPoints[0].second.first).format("MMM 'YY"));
        // debugger;
        for (let index = 0; index < selectedPoints.length; index++) {
            const leftValue = selectedPoints[index].first.second;
            const rightValue = selectedPoints[index].second.second;
            $('#series-' + this.props.id + index + '-point').text(`${leftValue} to ${rightValue}`);
        }
    }

    registerDateControlEventHandlers() {
        let $from = $("#from" + this.props.id) as any,
            $to = $("#to" + this.props.id) as any;
        let _self: RAPChart = this;
        $from.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onSelect: function (date) {
                _self.changeGraphTimeFrame(event, { from: date });
                notifyRAPChartDateControlChange();
                // _self.changeGraphTimeFrame();
            }
        }).on("change", function () {
            $to.datepicker("option", "minDate", $from.val());
        });
        $to.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onSelect: function (date) {
                _self.changeGraphTimeFrame(event, { to: date });
                notifyRAPChartDateControlChange();
                // _self.changeGraphTimeFrame();
            }
        }).on("change", function () {
            $from.datepicker("option", "maxDate", $to.val());
        });
        console.log($(".high-chart-container .graph-timeframe a").data('events'));
    }

    getSeries() {
        // let tempChartSeries = this.allChartSeries;
        // console.log("Load Series");
        // console.log(this.allChartSeries);
        // debugger;
        const storeData = this.props.storeData;
        let tempChartSeries = storeData.RAPChart;

        // const startDates = tempChartSeries.map(serie => serie.series[0][0]);
        // let commonStartDate = Math.max.apply(Math, startDates);
        // const commonEndDate = tempChartSeries[0].series[tempChartSeries[0].series.length - 1][0];
        let commonStartDate = storeData.from;
        const commonEndDate = storeData.to;

        let truncatedChartSeries: any = [];
        const startPeriod = this.selectedYear || this.props.childContentData.plotMetaData.timeFrame.active;
        tempChartSeries.forEach((val, index) => {
            let sortedSeries = val.series;
            let truncatedSeries: any = [];

            // Pick the Year from the last index in 
            if (startPeriod) {
                // let period = moment(sortedSeries[sortedSeries.length - 1][0]).year() - startPeriod;
                commonStartDate = moment(commonEndDate).add(-startPeriod, 'years').valueOf();
            }

            sortedSeries.forEach(function (item, itr) {
                if (item[0] >= commonStartDate && item[0] <= commonEndDate) {
                    truncatedSeries.push(item);
                }
            });
            truncatedChartSeries.push({ title: val.title, series: truncatedSeries });
        });

        return truncatedChartSeries.map((val, index) => {
            return { id: val.title, data: val.series, type: val.type, tooltip: { enabled: false }, color: GRAPH_COLOR_SERIES[index], showInNavigator: true, fillOpacity: 0.1, lineWidth: 1 };
        });
    }

    renderGraphTimeFrame() {
        let activeTimeFrame = (this.props.childContentData.plotMetaData.timeFrame || { active: 0 }).active;
        return (
            <div className="container no-padding">
                <div className="blank-space-25"></div>
                <div className="content-area">
                    <div className="timeframe graph-timeframe">
                        <h3>timeframe</h3>
                        <div className="d-flex flex-row time-nav highchart-timeframe-container">
                            <div className={activeTimeFrame == 1 ? 'active' : ''}>
                                <a href="#" data-year="1" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 1 })}>1 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 3 ? 'active' : ''}>
                                <a href="#" data-year="3" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 3 })}>3 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 5 ? 'active' : ''}>
                                <a href="#" data-year="5" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 5 })}>5 Yr</a>
                            </div>
                            <div className={activeTimeFrame == 10 ? 'active' : ''}>
                                <a href="#" data-year="10" onClick={(e) => this.changeGraphTimeFrame(e, { timeFrame: 10 })}>10 Yr</a>
                            </div>
                            <div className="dateRange">
                                <h3>COMMON DATE RANGE </h3>
                                <input type="text" id={"from" + this.props.id} className="datepicker" name="from" defaultValue="12/13/2013" /> -
                                <input type="text" id={"to" + this.props.id} className="datepicker" name="to" defaultValue="12/13/2015" />
                            </div>
                        </div>
                    </div>
                </div>
                <h4>
                    From: <span id={"fromAsOfDate"+this.props.id}></span>&nbsp;
                    To: <span id={"toAsOfDate"+this.props.id}></span>
                </h4>
            </div>
        )
    }

    changeGraphTimeFrame(event, opts: { from?: number, to?: number, timeFrame?: number }) {
        event.preventDefault();
        let $el = $(event.target);
        $el.parent().addClass("active");
        $el.parent().siblings().removeClass("active");

        // let selectedYear: string | number = $el.attr('data-year');
        let selectedYear = opts.timeFrame;
        if (selectedYear) {
            // const newRollingPeriodList = this.getRollingPeriodList(selectedYear);
            // const newSelectedRollingPeriod = newRollingPeriodList.some(rollingPeriod => rollingPeriod == this.state.selectedRollingPeriod) ?
            //     this.state.selectedRollingPeriod : newRollingPeriodList[0];

            // this.selectedYear = parseInt(selectedYear);
            // this.selectedRollingPeriod = newSelectedRollingPeriod;
            // this.setState({
            //     rollingPeriodList: newRollingPeriodList,
            //     selectedRollingPeriod: newSelectedRollingPeriod,
            //     selectedYear: parseInt(selectedYear)
            // });
            if (typeof selectedYear === 'string') {
                selectedYear = parseInt(selectedYear);
            }

            this.props.setSelectedTimeFrame(selectedYear, () => {
                this.selectedYear = selectedYear as number;
                this.refreshChart();
            });

        } else {
            const $from = opts.from || ($("#from" + this.props.id).val() || "").toString();
            const $to = opts.to || ($("#to" + this.props.id).val() || "").toString();
            const fromDate = moment($from).valueOf();
            const toDate = moment($to).valueOf();
            this.props.setDateControl({ from: fromDate, to: toDate }, () => {
                this.selectedYear = null;
                this.refreshChart();
            });
        }

        // Is this needed here? (since we already have it in callback)
        this.refreshChart();
    }

    refreshChart() {
        if (this.rapChart && this.rapChart.container) {
            this.rapChart.destroy();
            this.renderChart();
        }
    }

    removeGraphSeries(event) {
        event.preventDefault();
        let $el = $(event.target);
        let $selectedUnit = $el.parents(".cloneUnit");
        let getChartSeriesID = $selectedUnit.attr("data-series") || "-";
        // Highstock.charts[$("#" + ($el.parents('.high-chart-container').attr("id") || "").split("_")[0]).data('highchartsChart')]
        //     .get(getChartSeriesID).remove();
        // $selectedUnit.remove();
        this.props.removeRAPSeries(getChartSeriesID, this.refreshChart);
    }

    renderTicker() {
        let data = this.props.storeData.RAPChart || [];
        let graphIndicator = data.map((val, key) => {
            return (
                <div key={generateKey("GraphvalueIndicator_" + val.title)} className="unit unit-large d-none cloneUnit pull-left" data-series={val.title} style={{ margin: '10px' }}>
                    <div className="blue box" style={{ backgroundColor: GRAPH_COLOR_SERIES[key] }}></div>
                    <h4 className="no-margin">{val.title}</h4>
                    <div className="number d-flex align-items-end legend1" id={'series-' + this.props.id + key + '-point'}>0</div>
                    {key > 0 ? <div className="close-icon" onClick={(e) => this.removeGraphSeries(e)}></div> : null}
                </div>
            );
        });
        return [...graphIndicator];
    }

    renderAddBenchMark() {
        return <AddBenchMarkFund callback={this.refreshChart} chartId={this.props.id} rollingPeriod={this.getSelectedRollingPeriod()} />
    }

    renderGraphTicker() {
        return (
            <div>
                {this.renderTicker()}
                {(this.props.childContentData.plotMetaData.addBenchmarkFund) ? this.renderAddBenchMark() : false}
                {/* {this.renderAddBenchMark()} */}
            </div>
        );
    }

    render() {
        let perfType = this.props.childContentData.plotMetaData.perfType;
        const { storeData } = this.props;

        return (
            <div className="col-md-12 high-chart-container no-padding rap-chart-container" id={this.props.id + "_container"} data-perftype={perfType}>
                <div className="blank-space-25"></div>
                <h3 className="paragraph-title no-margin">{this.props.childContentData.plotTitle}</h3>

                {/* {(!isObjEmpty(this.props.childContentData.plotMetaData.timeFrame)) ? this.renderGraphTimeFrame() : false} */}
                {this.renderGraphTimeFrame()}
                {(this.props.childContentData.plotMetaData.graphPositionIndicator) ? this.renderGraphTicker() : false}

                <div className="blank-space-30"></div>

                <div className="rap-chart-inner-container">
                    <div id={this.props.id} className="highchart-section rap-chart"></div>
                    <RAPChartRollingPeriodDropDown
                        onChange={this.onRollingPeriodChange}
                        rollingPeriodList={storeData.rollingPeriodList}
                        selectedRollingPeriod={storeData.selectedRollingPeriod}
                        selectRef={el => this.$rapDropDown = $(el)} />
                </div>
            </div>
        );
    }
}

class RAPChartRollingPeriodDropDown extends React.Component<any, any> {

    select: HTMLSelectElement;

    render() {
        const { onChange, rollingPeriodList, selectRef, selectedRollingPeriod } = this.props;
        // debugger;
        return (
            <select className="rap-chart-dropdown" onChange={onChange} ref={selectRef} style={{ display: 'none' }} value={selectedRollingPeriod}>
                {rollingPeriodList.map(timeFrame => <option key={timeFrame} value={timeFrame}>{timeFrame} Months</option>)}
            </select>
        );
    }
}

interface RAPChartMapStateToProps {
    storeData: RAPChartInterface;
}

interface RAPChartMapDispatchToProps {
    removeRAPSeries: (seriesToRemove: string, callback) => void;
    setDateControl: (dateRange: DateRange, callback) => void;
    setRAPSeriesData: (data: any) => void;
    setSelectedRollingPeriod: (selectedRollingPeriod: number, callback) => void;
    setSelectedTimeFrame: (selectedTimeFrame: number, callback) => void;
}

function mapStateToProps(state): RAPChartMapStateToProps {
    return {
        storeData: state.RAPChart
    };
}

function mapDispatchToProps(dispatch): RAPChartMapDispatchToProps {
    return {
        removeRAPSeries: (seriesToRemove: string, callback) => dispatch(removeRAPSeries(seriesToRemove, callback)),
        setDateControl: (dateRange, callback) => dispatch(setDateControl(dateRange, callback)),
        setRAPSeriesData: (data) => dispatch(setRAPSeriesData(data)),
        setSelectedRollingPeriod: (selectedRollingPeriod, callback) => dispatch(setSelectedRollingPeriod(selectedRollingPeriod, callback)),
        setSelectedTimeFrame: (selectedTimeFrame: number, callback) => dispatch(setSelectedTimeFrame(selectedTimeFrame, callback))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RAPChart);

const highchartDataManipulation = (linkDataItem) => {
    let modifiedPlotData = (linkDataItem || []).map(val => {
        let previousYear = 0;
        let avg = 1;
        /*single graph with multiple series iteration and manipulation */
        let innerSeriesData: any = [];
        let modifiedSeriesData: any = {};

        innerSeriesData = (val["series"] || []).map((value, index) => {
            /*single series manipulation */
            let seriesDate = moment(convertToMonthEnd(value[0]));
            let year = parseInt(seriesDate.format('YYYY'));
            let month = parseInt(seriesDate.format('M'));
            let pointValue = parseFloat(value[1]);
            return [seriesDate.valueOf(), pointValue, month, year];
        });
        innerSeriesData.sort(function (a, b) { return a[3] - b[3] || a[2] - b[2] })
        modifiedSeriesData = { title: val.title, entityType: val.entityType, series: innerSeriesData, type: val.type || "line", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1, fundRunnerId: val.fundRunnerId };

        return modifiedSeriesData;
    });

    return modifiedPlotData;
}

// export default RAPChart;