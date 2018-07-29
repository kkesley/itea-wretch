import {SERVICES, callAPI} from '../util/api'
export default function* login({alias, username, password} = {}){
    var res = yield callAPI({
        service: SERVICES.PLATFORM,
        method: "POST",
        body: {
            prefix: alias,
            username,
            password
        },
        url: '/login',
        listenCode: [401, 200, 500]
    })
    return res
}