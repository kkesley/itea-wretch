
import wretch from 'wretch'
import moment from 'moment-timezone'
import {put} from 'redux-saga/effects'
import storage from 'store'
export const SERVICES = {
    PLATFORM: "PLATFORM",
    PROFILE: "PROFILE",
}
export const BASE_URL = process.env.NODE_ENV === "prod" ? "https://api.iteacloud.com" : "https://dev-api.iteacloud.com"
export const API = ({auth} = {auth: null}) => {
    
    const apiHandler = wretch()
    // Set the base url
    .url(BASE_URL)
    // Set headers
    .headers({ 
        "tz": moment.tz.guess(), 
        "lang": storage.get("lang") || "id" 
    })
    // Handle 500 errors
    .resolve(_=>_.internalError(err => ({status: 500, body: err.message})))
    // Handle 502 errors
    .resolve(_=>_.error(502, err => ({status: 512, body: err.message})))
    // Handle 403 errors
    .resolve(_=>_.forbidden(err => ({status: 403, body: err.message})))  
    // Handle 401 errors
    .resolve(_=>_.unauthorized(err => ({status: 401, body: err.message})))
    if (auth !== null && typeof auth === "string" && auth.length > 0) {
        return apiHandler
        // Authorization header
        .auth(auth)
    }
    return apiHandler
}

export function* callAPI({service, url, method, body, query, listener, listenCode, auth, beacon} = {service: "PLATFORM", url: "", method: "GET", body:{}, query:"", listener: "@@ITEACLOUD/REQ.MAIN", listenCode: [], auth: null, beacon: false}){
    const mainHandler = "@@ITEACLOUD/REQ.MAIN"
    if(!Array.isArray(listenCode)){
        listenCode = []
    }
    if(typeof listener !== "string"){
        listener = null
    }
    if(typeof service !== "string" || typeof method !== "string"){
        if(!listener && listenCode.indexOf(400) >= 0){
            return {status: 400, body: "no service or url provided"}
        }else{
            yield put({type: listenCode.indexOf(400) >= 0 ? listener : mainHandler, status: 400, body: "no service or url provided"})
            return
        }
    }
    if(typeof auth !== "string"){
        auth = null
    }else if(auth.length <= 0){
        auth = null
    }
    var serviceURL = ""
    if(service === "PLATFORM"){
        serviceURL = "/platform"
    }else if (service === "PROFILE"){
        serviceURL = "/profile"
    }
    if(beacon === true && 'sendBeacon' in navigator){
        var form_data = new FormData();
        for ( var key in body ) {
            form_data.append(key, body[key]);
        }
        return navigator.sendBeacon(BASE_URL + serviceURL + url, form_data);
    }
    var serviceAPI = API({auth})
    serviceAPI = serviceAPI.url(serviceURL)
    if(serviceAPI === null){
        if(!listener && listenCode.indexOf(501) >= 0){
            return {status: 501, body: 'Service not available'}
        }else{
            yield put({type: listenCode.indexOf(501) >= 0 ? listener : mainHandler, status: 501, body: 'Service not available'})
            return
        }
    }
    var req = serviceAPI.url(url)
    var res = null
    if(method === "GET"){
        req = req.query(query).get()
    }else if(method === "POST"){
        req = req.post(body)
    }else if(method === "DELETE"){
        req = req.delete()
    }
    res = yield req.text(text => {
        var data = text
        var status = 200
        try {
            data = JSON.parse(data)
        }catch(e){
        
        }
        return {status: status, body: data}
    }).catch(err => ({status: err.status, body: err.message}))
    if(!listener && listenCode.indexOf(res.status) >= 0){
        return res
    }else{
        yield put({type: listenCode.indexOf(res.status) >= 0 ? listener : mainHandler, ...res})
    }
}