import { GET_CURRENT_STORE } from "../constants/constant";

let initial_state = {
    loading: true,
    error: false,
    currentStore: null
}
export default function (state = initial_state, action) {

    switch (action.type) {
        case GET_CURRENT_STORE:
            let currentStore = action.payload;
            return { error: false, loading: false, currentStore }
        default:
            return state;
    }
}