'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.API = exports.SERVICES = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.callAPI = callAPI;

var _wretch = require('wretch');

var _wretch2 = _interopRequireDefault(_wretch);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _effects = require('redux-saga/effects');

var _store = require('store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(callAPI);

var SERVICES = exports.SERVICES = {
    PLATFORM: "PLATFORM",
    PROFILE: "PROFILE",
    EDUCATION: "EDUCATION",
    COMMENT: "COMMENT"
};
var URL = {
    itea: process.env.NODE_ENV === "prod" ? "https://api.iteacloud.com" : "https://dev-api.iteacloud.com",
    edvise: process.env.NODE_ENV === "prod" ? "https://api.edvise.id" : "https://dev-api.edvise.id"
};
var API = exports.API = function API() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { auth: null, apiEndpoint: "itea" },
        auth = _ref.auth,
        apiEndpoint = _ref.apiEndpoint;

    var apiHandler = (0, _wretch2.default)()
    // Set the base url
    .url(URL[apiEndpoint] || URL.itea)
    // Set headers
    .headers({
        "tz": _momentTimezone2.default.tz.guess(),
        "lang": _store2.default.get("lang") || "id"
    })
    // Handle 500 errors
    .resolve(function (_) {
        return _.internalError(function (err) {
            return { status: 500, body: err.message };
        });
    })
    // Handle 502 errors
    .resolve(function (_) {
        return _.error(502, function (err) {
            return { status: 512, body: err.message };
        });
    })
    // Handle 403 errors
    .resolve(function (_) {
        return _.forbidden(function (err) {
            return { status: 403, body: err.message };
        });
    })
    // Handle 401 errors
    .resolve(function (_) {
        return _.unauthorized(function (err) {
            return { status: 401, body: err.message };
        });
    });
    if (auth !== null && typeof auth === "string" && auth.length > 0) {
        return apiHandler
        // Authorization header
        .auth(auth);
    }
    return apiHandler;
};

function callAPI() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { service: "PLATFORM", url: "", method: "GET", body: {}, query: "", listener: "@@ITEACLOUD/REQ.MAIN", listenCode: [], auth: null, beacon: false, apiEndpoint: "itea" },
        service = _ref2.service,
        url = _ref2.url,
        method = _ref2.method,
        body = _ref2.body,
        query = _ref2.query,
        listener = _ref2.listener,
        listenCode = _ref2.listenCode,
        auth = _ref2.auth,
        beacon = _ref2.beacon,
        apiEndpoint = _ref2.apiEndpoint;

    var mainHandler, serviceURL, form_data, key, serviceAPI, req, res;
    return _regenerator2.default.wrap(function callAPI$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    if (!navigator) {
                        _context.next = 5;
                        break;
                    }

                    _context.next = 3;
                    return (0, _effects.put)({ type: "@@ITEACLOUD/REQ.OFFLINE", offline: !navigator.onLine });

                case 3:
                    if (!(navigator.onLine === false)) {
                        _context.next = 5;
                        break;
                    }

                    return _context.abrupt('return', null);

                case 5:
                    mainHandler = "@@ITEACLOUD/REQ.MAIN";

                    if (!Array.isArray(listenCode)) {
                        listenCode = [];
                    }
                    if (typeof listener !== "string") {
                        listener = null;
                    }

                    if (!(typeof service !== "string" || typeof method !== "string")) {
                        _context.next = 16;
                        break;
                    }

                    if (!(!listener && listenCode.indexOf(400) >= 0)) {
                        _context.next = 13;
                        break;
                    }

                    return _context.abrupt('return', { status: 400, body: "no service or url provided" });

                case 13:
                    _context.next = 15;
                    return (0, _effects.put)({ type: listenCode.indexOf(400) >= 0 ? listener : mainHandler, status: 400, body: "no service or url provided" });

                case 15:
                    return _context.abrupt('return');

                case 16:
                    if (typeof auth !== "string") {
                        auth = null;
                    } else if (auth.length <= 0) {
                        auth = null;
                    }
                    serviceURL = "";

                    if (service === SERVICES.PLATFORM) {
                        serviceURL = "/platform";
                    } else if (service === SERVICES.PROFILE) {
                        serviceURL = "/profile";
                    } else if (service === SERVICES.EDUCATION) {
                        serviceURL = "/education";
                    } else if (service === SERVICES.COMMENT) {
                        serviceURL = "/comment";
                    }

                    if (!(navigator && beacon === true && 'sendBeacon' in navigator)) {
                        _context.next = 23;
                        break;
                    }

                    form_data = new FormData();

                    for (key in body) {
                        form_data.append(key, body[key]);
                    }
                    return _context.abrupt('return', navigator.sendBeacon((URL[apiEndpoint] || URL.itea) + serviceURL + url, form_data));

                case 23:
                    serviceAPI = API({ auth: auth, apiEndpoint: apiEndpoint });

                    serviceAPI = serviceAPI.url(serviceURL);

                    if (!(serviceAPI === null)) {
                        _context.next = 33;
                        break;
                    }

                    if (!(!listener && listenCode.indexOf(501) >= 0)) {
                        _context.next = 30;
                        break;
                    }

                    return _context.abrupt('return', { status: 501, body: 'Service not available' });

                case 30:
                    _context.next = 32;
                    return (0, _effects.put)({ type: listenCode.indexOf(501) >= 0 ? listener : mainHandler, status: 501, body: 'Service not available' });

                case 32:
                    return _context.abrupt('return');

                case 33:
                    req = serviceAPI.url(url);
                    res = null;

                    if (method === "GET") {
                        req = req.query(query).get();
                    } else if (method === "POST") {
                        req = req.post(body);
                    } else if (method === "DELETE") {
                        req = req.delete();
                    }
                    _context.next = 38;
                    return req.text(function (text) {
                        var data = text;
                        var status = 200;
                        try {
                            data = JSON.parse(data);
                        } catch (e) {}
                        return { status: status, body: data };
                    }).catch(function (err) {
                        return { status: err.status, body: err.message };
                    });

                case 38:
                    res = _context.sent;

                    if (!(!listener && listenCode.indexOf(res.status) >= 0)) {
                        _context.next = 43;
                        break;
                    }

                    return _context.abrupt('return', res);

                case 43:
                    _context.next = 45;
                    return (0, _effects.put)((0, _extends3.default)({ type: listenCode.indexOf(res.status) >= 0 ? listener : mainHandler }, res));

                case 45:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}