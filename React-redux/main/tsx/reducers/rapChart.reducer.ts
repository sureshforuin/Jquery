import * as moment from 'moment';

import { SET_RAP_DATA, FETCH_RAP_SUCCESS, FETCH_RAP_FAIL, REMOVE_RAP_SERIES, SET_SELECTED_TIME_FRAME, SET_SELECTED_ROLLING_PERIOD, SET_DATE_RANGE, ADD_RAP_SERIES } from "../actions/rapChart.action";
import Action from "../models/action";

const ROLLING_PERIODS = [12, 24, 36];
const DEFAULT_ROLLING_PERIOD = ROLLING_PERIODS[0]; // set default to 12 months

export interface RAPChartInterface {
    error?: any;
    from: number;
    loading: boolean;
    RAPChart?: any[];
    rollingPeriodList: number[];
    selectedRollingPeriod: number;
    selectedTimeFrame?: number;
    to: number;
}

export interface DateRange { from: number; to: number; }

const initialState: RAPChartInterface = {
    from: Number.MIN_SAFE_INTEGER,
    loading: true,
    rollingPeriodList: ROLLING_PERIODS,
    selectedRollingPeriod: DEFAULT_ROLLING_PERIOD,
    selectedTimeFrame: 5,
    to: Number.MAX_SAFE_INTEGER
};

export default (state: RAPChartInterface = initialState, action: Action): RAPChartInterface => {
    if (action.type === ADD_RAP_SERIES) {
        const { payload } = action;
        const allSeries = [...state.RAPChart, ...payload];
        const commonDateRange = getCommonDateRange(allSeries);
        const { from, to } = commonDateRange;
        const rollingPeriodList = getRollingPeriodList(state.selectedTimeFrame, commonDateRange);
        const selectedRollingPeriod = getSelectedRollingPeriod(state.selectedRollingPeriod, rollingPeriodList);
        return {
            from,
            loading: false,
            RAPChart: allSeries,
            rollingPeriodList,
            selectedRollingPeriod,
            selectedTimeFrame: state.selectedTimeFrame,
            to
        };

    } else if (action.type === REMOVE_RAP_SERIES) {
        const seriesToRemove = action.payload;
        return Object.assign({}, state, {
            RAPChart: state.RAPChart.filter(series => series.title !== seriesToRemove)
        });

    } else if (action.type === SET_RAP_DATA) {
        const { payload } = action;
        const commonDateRange = getCommonDateRange(payload);
        const { from, to } = commonDateRange;
        const rollingPeriodList = getRollingPeriodList(state.selectedTimeFrame, commonDateRange);
        const selectedRollingPeriod = getSelectedRollingPeriod(state.selectedRollingPeriod, rollingPeriodList);
        return {
            from,
            loading: false,
            RAPChart: payload,
            rollingPeriodList,
            selectedRollingPeriod,
            selectedTimeFrame: state.selectedTimeFrame,
            to
        };

        // case FETCH_RAP_SUCCESS:
        //     return { loading: false, CumulativeChart: [...state.CumulativeChart, action.payload] };
        // case FETCH_RAP_FAIL:
        //     return { loading: false, error: action.payload };
        // case REMOVE_SERIES_FROM_RAP_CHART:
        //     let seriesIndex = action.payload;
        //     let currentData = Object.assign([], state.CumulativeChart);
        //     currentData.splice(seriesIndex, 1);
        //     return Object.assign({}, { loading: false, CumulativeChart: currentData, selectedTimeFrame: state.selectedTimeFrame })

    } else if (action.type === SET_DATE_RANGE) {
        const endDate = state.RAPChart[0].series[state.RAPChart[0].series.length - 1][0];
        const commonDateRange = action.payload as DateRange;
        const selectedTimeFrame = null;
        const rollingPeriodList = getRollingPeriodList(selectedTimeFrame, commonDateRange);
        const selectedRollingPeriod = getSelectedRollingPeriod(state.selectedRollingPeriod, rollingPeriodList);
        return {
            from: commonDateRange.from,
            loading: false,
            RAPChart: state.RAPChart,
            rollingPeriodList,
            selectedRollingPeriod,
            selectedTimeFrame,
            to: commonDateRange.to
        };

    } else if (action.type === SET_SELECTED_TIME_FRAME) {
        const selectedTimeFrame = action.payload as number;
        const endDate = state.RAPChart[0].series[state.RAPChart[0].series.length - 1][0];
        const commonDateRange = {
            from: moment(endDate).add(-selectedTimeFrame, 'years').valueOf(),
            to: endDate
        };
        const rollingPeriodList = getRollingPeriodList(selectedTimeFrame, commonDateRange);
        const selectedRollingPeriod = getSelectedRollingPeriod(state.selectedRollingPeriod, rollingPeriodList);
        return {
            from: state.from,
            loading: false,
            RAPChart: state.RAPChart,
            rollingPeriodList,
            selectedRollingPeriod,
            selectedTimeFrame,
            to: state.to
        };

    } else if (action.type === SET_SELECTED_ROLLING_PERIOD) {
        return {
            from: state.from,
            loading: false,
            RAPChart: state.RAPChart,
            rollingPeriodList: state.rollingPeriodList,
            selectedRollingPeriod: action.payload,
            selectedTimeFrame: state.selectedTimeFrame,
            to: state.to
        };
    }

    return state;
}


interface SeriesContainer {
    series: number[][];
    type: string;
}

// getCommonRangeSeries(series: any[]) {
//     const startDates = visibleSeries.map(serie => serie.data[0][0]);
//     const commonStartDate = Math.max.apply(Math, startDates);
//     for (let serie of series) {
//         serie.data = serie.data.filter(data => commonStartDate <= data[0]);
//     }

//     return series;
// }

export function getCommonDateRange(seriesContainers: SeriesContainer[]): DateRange {
    const allSeries = seriesContainers.map(seriesContainer => seriesContainer.series);
    const startDates = allSeries.map(series => series[0][0]);
    const endDates = allSeries.map(series => series[series.length - 1][0]);
    const commonStartDate = Math.max.apply(Math, startDates);
    const commonEndDate = Math.min.apply(Math, endDates);
    return {
        from: commonStartDate,
        to: commonEndDate
    };
}

function getRollingPeriodList(selectedTimeFrame: string | number | null, commonDateRange: DateRange) {
    if (selectedTimeFrame) {
        if (typeof selectedTimeFrame === 'string') {
            selectedTimeFrame = parseInt(selectedTimeFrame);
        }

        const maxRollingPeriodAllowed = selectedTimeFrame * 12;
        return ROLLING_PERIODS.filter(timeFrame => timeFrame <= maxRollingPeriodAllowed);

    } else if (commonDateRange && commonDateRange.from !== null && commonDateRange.to !== null) {
        const { from, to } = commonDateRange;
        const diffInMonths = moment(to).diff(moment(from), 'months', true);
        const maxRollingPeriodAllowed = Math.floor(diffInMonths);
        return ROLLING_PERIODS.filter(timeFrame => timeFrame <= maxRollingPeriodAllowed);
    }

    return ROLLING_PERIODS;
}

function getSelectedRollingPeriod(currentSelectedRollingPeriod: number, rollingPeriodList: number[]) {
    return Math.min(currentSelectedRollingPeriod, rollingPeriodList[rollingPeriodList.length - 1]);
}