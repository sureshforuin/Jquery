import { MONTHLY_UPDATE_NEW_SUCCESS } from '../constants/constant';
const initialState = {
    loading: true,
    error: false,
    MonthlyUpdateReducer1: null
}
export default function (state = initialState, action) {
    let MonthlyUpdateReducer1;
    switch (action.type) {
        case MONTHLY_UPDATE_NEW_SUCCESS:
            let newObj = {};
            action.payload["payload"].forEach(function (v, i) {
                newObj[Object.keys(v)[0]] = Object.values(v)[0]
            })
            MonthlyUpdateReducer1 = [newObj,action.payload["structure"]]
            return { error: false, loading: false, MonthlyUpdateReducer1 };
        default:
            return state;
    }
}