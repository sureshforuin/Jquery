import { GET_CURRENT_STORE } from '../constants/constant';
export const setCurrentStore = (storeDetails) => {
    return dispatch => dispatch(setStore(storeDetails))
}

const setStore = (storeDetails) => {
    return {
        type: GET_CURRENT_STORE,
        payload: storeDetails
    }
}