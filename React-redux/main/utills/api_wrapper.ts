import * as fetch from 'isomorphic-fetch';

export const fetchWrapper = (url: string, method: string = 'GET') => {
    return $.ajax({
        type: method,
        url: url,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    }).then(jsonData => {
        // wrap the json response in a function, so that it is retrieved using json() call
        // (similiar to using fetch API)
        return {
            json: () => jsonData
        };
    });

    // var myHeaders = new Headers();
    // myHeaders.append('pragma', 'no-cache');
    // myHeaders.append('cache-control', 'no-cache');
    // myHeaders.append('Content-Type', 'text/plain');

    // let headerParams: RequestInit = {
    //     credentials: "include",
    //     method: method ? method : 'GET',
    //     mode: 'cors',
    //     cache: 'default',
    //     headers: myHeaders
    // };
    // return fetch(url, headerParams)
    // return timeout(250000, fetch(url, headerParams)).then(response => response).catch(error => error);
}
function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
}