import { SET_HISTORIC_DATA, FETCH_HISTORIC_SUCCESS, FETCH_ADD_HISTORIC_SUCCESS, REMOVE_HISTORIC_SERIES, HISTORIC_TIME_FRAME_CHANGES, HISTORIC_TOGGLE } from "../constants/constant";
let initial_state = {
    loading: true,
    selectedTimeFrame: null,
    historicData: [],
    selectedFrequency: 1,
    toggleStatus: "disabled",
    hiddenSeries: []
}
export default (state = initial_state, action) => {

    switch (action.type) {
        case SET_HISTORIC_DATA:
            let hiddenSeries = action.payload.data.filter(filterValue => filterValue.initialHideOnGraph)
            return { loading: false, historicData: action.payload.data, selectedFrequency: action.payload.selectedChartFrequency || 1, selectedTimeFrame: action.payload.selectedTimeFrame, toggleStatus: state.toggleStatus, hiddenSeries: hiddenSeries };
        case FETCH_HISTORIC_SUCCESS: /* change : if user select monthly then for displaying funds and benchmark we need to change runup and drawdown */
            return { loading: false, historicData: action.payload.data, selectedFrequency: action.payload.selectedChartFrequency || 1, selectedTimeFrame: action.payload.selectedTimeFrame, toggleStatus: state.toggleStatus, hiddenSeries: state.hiddenSeries };
        case FETCH_ADD_HISTORIC_SUCCESS:
            state.historicData.push(action.payload.data[0]);
            return Object.assign({}, { loading: false, historicData: state.historicData, selectedFrequency: action.payload.selectedChartFrequency || 1, selectedTimeFrame: action.payload.selectedTimeFrame || undefined, toggleStatus: state.toggleStatus, hiddenSeries: state.hiddenSeries });
        case REMOVE_HISTORIC_SERIES:
            let seriesIndex = action.payload.seriesIndex;
            // let currentData = Object.assign([], state.historicData);
            // currentData.splice(seriesIndex, 1);
            return Object.assign({}, state, { historicData: state.historicData.filter((val, index) => val.type == 'area' || val.title !== seriesIndex)  });
        case HISTORIC_TIME_FRAME_CHANGES:
            /* below condition added for common date range overrites the value for selected year on change time frame */
            if ((state.selectedTimeFrame || {}).year) {
                if (action.payload.selectedTimeFrame.year == 0)
                    action.payload.selectedTimeFrame.year = state.selectedTimeFrame.year;
            }
            return Object.assign({}, { loading: false, historicData: state.historicData, selectedFrequency: action.payload.selectedChartFrequency || 1, selectedTimeFrame: action.payload.selectedTimeFrame, toggleStatus: state.toggleStatus, hiddenSeries: state.hiddenSeries })
        case HISTORIC_TOGGLE:
            return Object.assign({}, {
                loading: false, historicData: state.historicData, selectedFrequency: state.selectedFrequency,
                selectedTimeFrame: state.selectedTimeFrame, toggleStatus: action.payload, hiddenSeries: state.hiddenSeries
            });
        default:
            return state;
    }
}