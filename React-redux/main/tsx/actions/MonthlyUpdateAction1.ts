import { APPROACH_1_METADATA, FETCH_APPROACH_1_API, MONTHLY_UPDATE_NEW_SUCCESS, MONTHLY_UPDATE_NEW_FAIL, FETCH_MONTHLY_UPDATE_METADATA_API } from '../constants/constant';
let structure = [];
let headerParams: RequestInit = {
    credentials: "include"
}

export const fetchMetaData = () => dispatch => {
    fetch(FETCH_APPROACH_1_API + "/" + APPROACH_1_METADATA, headerParams)
        .then(response => response.json())
        .then((parseData) => fetchAllData(parseData))
        .then((allData) => dispatch(fetchSuccess(allData)))
        .catch(error => error);
}

const fetchAllData = (data) => {
    structure = data;
    let api_data: any[] = [];
    data.blocks.map((val, index) => {
        val.data.map((value, key) => {
            let api = FETCH_APPROACH_1_API + "/" + value.id + ".json";
            api_data.push(asyncRequest(value.id, api));
        })
    })
    return fetchAllNewData(api_data);
}

const asyncRequest = (store, api) => {

    return fetch(api, headerParams)
        .then((response) => response.json())
        .catch((error) => {
            return error;
        })

}

const fetchAllNewData = api_data => Promise.all(api_data).then(values => [...values]);

const fetchSuccess = (data) => {
    let temp = {};
    temp["payload"] = data;
    temp["structure"] = structure;
    return {
        type: MONTHLY_UPDATE_NEW_SUCCESS,
        payload: temp
    }
}

const fetchFail = (data) => {
    return {
        type: MONTHLY_UPDATE_NEW_FAIL,
        payload: data
    }
}