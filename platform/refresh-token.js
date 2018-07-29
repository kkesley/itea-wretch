import { SERVICES, callAPI } from '../index';
export default function* refreshToken({ refreshToken, refreshTokenSecret, accesstoken } = {}) {
    var res = yield call(() => callAPI({
        service: SERVICES.PLATFORM,
        url: '/refresh-token',
        method: "POST",
        body: {
            refresh_token: refreshToken,
            refresh_token_secret: refreshTokenSecret
        },
        auth: accesstoken,
        listenCode: [200]
    }));
    return res;
}