import { ANNUALIZED_TIMEFRAME_CHANGES, GET_ANNUALIZED_DATA, ADD_ANNUALIZED_DATA } from "../constants/constant";
import { ADD_TO_CUSTOM, CLEAR_SELECTED_TIMEFRAME } from "../actions/annualized.action";
let initial_state = {
    loading: true,
    selectedTimeFrame: null,
    annualizedData: []
}
export default (state = initial_state, action) => {

    switch (action.type) {
        case ANNUALIZED_TIMEFRAME_CHANGES:
            return { loading: false, selectedTimeFrame: action.payload, annualizedData: state.annualizedData };
        case GET_ANNUALIZED_DATA:
            return { loading: false, annualizedData: action.payload, selectedTimeFrame: state.selectedTimeFrame };
        case ADD_ANNUALIZED_DATA:
            return { loading: false, annualizedData: [...state.annualizedData, action.payload] ,selectedTimeFrame: state.selectedTimeFrame }
        case ADD_TO_CUSTOM:
            const customData = action.payload;
            const newAnnualizedData = state.annualizedData;
            for (let i=0; i<customData.length; i++) {
                newAnnualizedData[i].custom =  customData[i];
            }
            
            return Object.assign({},state,{annualizedData: newAnnualizedData});
        case CLEAR_SELECTED_TIMEFRAME: 
            return Object.assign({},state,{selectedTimeFrame:null});
        default:
            return state;
    }
}