import { FETCH_CUMULATIVE_SUCCESS, SET_CUMULATIVE_DATA, FETCH_CUMULATIVE_FAIL, REMOVE_SERIES_FROM_CUMULATIVE_CHART, notifyCumulativeChartDateControlChange } from "../constants/constant";

export interface CumulativeChartInterface {
    loading: boolean;
    selectedTimeFrame?: any;
    CumulativeChart?: any[];
    error?: any;
}

let initial_state: CumulativeChartInterface = {
    loading: true,
    selectedTimeFrame: null,
    CumulativeChart: []
}
export default (state = initial_state, action) : CumulativeChartInterface => {

    switch (action.type) {
        case SET_CUMULATIVE_DATA:
            notifyCumulativeChartDateControlChange();
            return { loading: false, CumulativeChart: action.payload };
        case FETCH_CUMULATIVE_SUCCESS:
            notifyCumulativeChartDateControlChange();
            return { loading: false, CumulativeChart: [...state.CumulativeChart, action.payload] };
        case FETCH_CUMULATIVE_FAIL:
            return { loading: false, error: action.payload };
        case REMOVE_SERIES_FROM_CUMULATIVE_CHART:
            notifyCumulativeChartDateControlChange();
            let seriesIndex = action.payload;
            let currentData = Object.assign([], state.CumulativeChart);
            currentData.splice(seriesIndex, 1);
            return Object.assign({}, { loading: false, CumulativeChart: currentData, selectedTimeFrame: state.selectedTimeFrame })
        default:
            return state;
    }
}