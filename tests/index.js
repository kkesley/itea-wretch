const iteaWretch = require("../dist")
console.log(iteaWretch)
function* login({alias, username, password, mfa} = {}){
    var res = iteaWretch.callAPI({
        service: iteaWretch.SERVICES.PLATFORM,
        method: "POST",
        body: {
            prefix: alias,
            username,
            password,
            otp: mfa
        },
        url: '/login',
        listenCode: [401, 200, 202, 500, 412, 423]
    })
    console.log(res.next())
    return res
}

const res = login({alias: "", username: "winchest_pw@yahoo.com", password: "asd"})
console.log(res.next())