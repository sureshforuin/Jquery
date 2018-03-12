import { SET_HIGHCHART_DATA, CLEAR_CHART_REDUCER, FETCH_SET_HIGHCHART_DATA, FETCH_SET_HIGHCHART_FAIL, REMOVE_HIGHCHART_SERIES } from "../constants/constant";
import * as moment from 'moment';

let initial_state = {}
export default (state = initial_state, action) => {
    let id = '';
    switch (action.type) {
        case SET_HIGHCHART_DATA:
            // console.log("chart reducer");
            // console.log(action);
            // console.log(state);
            id = action.payload.id;
            if (Object.keys(state).indexOf(id) !== -1)
                return { [id]: { loading: false, highchartData: action.payload.data, highchartId: action.payload.id } };
            else {
                return Object.assign({}, state, { [id]: { loading: false, highchartData: action.payload.data, highchartId: action.payload.id } });
                // state[id] = { loading: false, highchartData: action.payload.data, highchartId: action.payload.id }
                // return state;
            }
        case FETCH_SET_HIGHCHART_DATA:
            id = action.payload.id;
            return Object.assign({}, state, { [id]: { loading: true, highchartData: [...state[id].highchartData, Object.assign({}, action.payload.data, { entityType: action.payload.type || "fund" })], highchartId: action.payload.id } });
        // state[id] = { loading: true, highchartData: [...state[id].highchartData, action.payload.data], highchartId: action.payload.id }
        // return state;
        case FETCH_SET_HIGHCHART_FAIL:
            id = action.payload.id;
            state[id] = { loading: false, highchartData: state, highchartId: action.payload.id, error: true }
            return state;
        case CLEAR_CHART_REDUCER:
            // console.log("CLEAR Chart Reducer");
            // console.log(state);
            // console.log(action.payload.id);
            let newState = Object.assign({}, state);
            delete newState[action.payload.id]
            // console.log(newState);
            // state[action.payload.id] = { loading: false, highchartData: [], timeStamp: new Date() };
            return newState;
        case REMOVE_HIGHCHART_SERIES:
            id = action.payload.id;
            let data = Object.assign([], state[id].highchartData);
            data.splice(action.payload.seriesIndex, 1);
            return Object.assign({}, state, { [id]: { loading: false, highchartData: data, highchartId: action.payload.id } });
        default:
            return state;
    }
}