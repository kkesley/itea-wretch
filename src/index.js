
import wretch from 'wretch'
import moment from 'moment-timezone'
import {put} from 'redux-saga/effects'
import storage from 'store'
export const SERVICES = {
    PLATFORM: "PLATFORM"
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
    if (auth !== null && typeof auth === "string" && auth.length > 0) {
        return apiHandler
        // Authorization header
        .auth(auth)
        // Handle 401 errors
        .resolve(_=>_.unauthorized(err => ({status: 401, body: err})))
         
    }
    return apiHandler
}

export function* callAPI({service, url, method, body, query, listener, listenCode, auth} = {service: "PLATFORM", url: "", method: "GET", body:{}, query:"", listener: "@@ITEACLOUD/REQ.MAIN", listenCode: [], auth: null}){
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
    var serviceAPI = API({auth})
    if(service === "PLATFORM"){
        serviceAPI = serviceAPI.url('/platform')
    }
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
    }
    res = yield req.json(res => ({status: 200, body: res})).catch(err => ({status: err, body: err.message}))
    if(!listener && listenCode.indexOf(res.status) >= 0){
        return res
    }else{
        yield put({type: listenCode.indexOf(res.status) >= 0 ? listener : mainHandler, ...res})
    }
}