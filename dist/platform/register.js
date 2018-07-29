import { SERVICES, callAPI } from '../index';
export default function* register({ organizationName, firstName, lastName, email, phone, password } = {}) {
    var res = yield callAPI({
        service: SERVICES.PLATFORM,
        method: "POST",
        body: {
            client: {
                name: organizationName
            },
            master_user: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                password: password
            }
        },
        url: '/register',
        listenCode: [200, 500, 400]
    });
    return res;
}