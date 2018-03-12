import { getChartApiPath } from "../constants/constant";
import { fetchWrapper } from "../../utills/api_wrapper";
import { convertToMonthEnd } from "../../utills/common";
import { RAPChartInterface, DateRange } from "../reducers/rapChart.reducer";

export const ADD_RAP_SERIES = 'ADD_RAP_SERIES';
export const FETCH_RAP_FAIL = 'FETCH_RAP_FAIL';
export const FETCH_RAP_SUCCESS = 'FETCH_RAP_SUCCESS';
export const REMOVE_RAP_SERIES = 'REMOVE_RAP_SERIES';
export const SET_DATE_RANGE = 'SET_DATE_RANGE';
export const SET_RAP_DATA = 'SET_RAP_DATA';
export const SET_SELECTED_ROLLING_PERIOD = 'SET_SELECTED_ROLLING_PERIOD';
export const SET_SELECTED_TIME_FRAME = 'SET_SELECTED_TIME_FRAME';

export interface Entity {
    entityType: string;
    fundRunnerId: number;
}

export function addRAPSeries(series) {
    return {
        type: ADD_RAP_SERIES,
        payload: series
    };
}

export function fetchRAPSeriesData(
    { entities, rollingPeriod }: { entities: Entity[], rollingPeriod: number }
) {
    const urls = entities.map(entity =>
        getChartApiPath({
            entityType: entity.entityType,
            entityId: entity.fundRunnerId,
            source: 'FundRunner',
            fileName: `rolling${rollingPeriod}month.json`
        }));

    const promises = urls.map(url => {
        return fetchWrapper(url)
            .then(response => response.json())
            .then(chartSeries => {
                const series = chartSeries.series;
                for (let i = 0; i < series.length; i++) {
                    series[i][0] = convertToMonthEnd(series[i][0]);
                    series[i][1] = parseFloat(series[i][1]);
                }

                return chartSeries;
            })
            .catch(error => {
                console.error(`Rolling returns error: Could not fetch rolling returns data from: ${url}`);
                console.error(error);
            })
    });

    return Promise.all(promises);
}

export function removeRAPSeries(seriesToRemove: string, callback) {
    return function (dispatch) {
        dispatch({
            type: REMOVE_RAP_SERIES,
            payload: seriesToRemove
        });
        callback();
    };
}

export function setDateControl(dateRange: DateRange, callback) {
    return function (dispatch) {
        dispatch({
            type: SET_DATE_RANGE,
            payload: dateRange
        });
        callback();
    }
}

export function setRAPSeriesData(data) {
    // debugger;
    return {
        type: SET_RAP_DATA,
        payload: data
    };
}

export function setSelectedRollingPeriod(selectedRollingPeriod, callback) {
    return function (dispatch, getState) {
        const { RAPChart }: { RAPChart: RAPChartInterface } = getState();
        const currentChartEntities: Entity[] = RAPChart.RAPChart.map(chartItem => {
            const { entityType, fundRunnerId } = chartItem;
            return {
                entityType,
                fundRunnerId
            };
        });

        fetchRAPSeriesData({
            entities: currentChartEntities,
            rollingPeriod: selectedRollingPeriod
        }).then(chartSeriesData => {
            // debugger;
            for (let i = 0; i < chartSeriesData.length; i++) {
                (chartSeriesData[i] as any).entityType = currentChartEntities[i].entityType;
                (chartSeriesData[i] as any).fundRunnerId = currentChartEntities[i].fundRunnerId;
            }

            return dispatch(setRAPSeriesData(chartSeriesData));
        }).then(() => {
            return dispatch({
                type: SET_SELECTED_ROLLING_PERIOD,
                payload: selectedRollingPeriod
            });
        }).then(() => {
            callback();
        });
    }
}

export function setSelectedTimeFrame(selectedTimeFrame, callback) {
    return function (dispatch) {
        dispatch({
            type: SET_SELECTED_TIME_FRAME,
            payload: selectedTimeFrame
        });
        callback();
    }
}