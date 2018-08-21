'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.API = exports.BASE_URL = exports.SERVICES = undefined;

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
    PLATFORM: "PLATFORM"
};
var BASE_URL = exports.BASE_URL = process.env.NODE_ENV === "prod" ? "https://api.iteacloud.com" : "https://dev-api.iteacloud.com";
var API = exports.API = function API() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { auth: null },
        auth = _ref.auth;

    var apiHandler = (0, _wretch2.default)()
    // Set the base url
    .url(BASE_URL)
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
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { service: "PLATFORM", url: "", method: "GET", body: {}, query: "", listener: "@@ITEACLOUD/REQ.MAIN", listenCode: [], auth: null, beacon: false },
        service = _ref2.service,
        url = _ref2.url,
        method = _ref2.method,
        body = _ref2.body,
        query = _ref2.query,
        listener = _ref2.listener,
        listenCode = _ref2.listenCode,
        auth = _ref2.auth,
        beacon = _ref2.beacon;

    var mainHandler, serviceURL, form_data, key, serviceAPI, req, res;
    return _regenerator2.default.wrap(function callAPI$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    mainHandler = "@@ITEACLOUD/REQ.MAIN";

                    if (!Array.isArray(listenCode)) {
                        listenCode = [];
                    }
                    if (typeof listener !== "string") {
                        listener = null;
                    }

                    if (!(typeof service !== "string" || typeof method !== "string")) {
                        _context.next = 11;
                        break;
                    }

                    if (!(!listener && listenCode.indexOf(400) >= 0)) {
                        _context.next = 8;
                        break;
                    }

                    return _context.abrupt('return', { status: 400, body: "no service or url provided" });

                case 8:
                    _context.next = 10;
                    return (0, _effects.put)({ type: listenCode.indexOf(400) >= 0 ? listener : mainHandler, status: 400, body: "no service or url provided" });

                case 10:
                    return _context.abrupt('return');

                case 11:
                    if (typeof auth !== "string") {
                        auth = null;
                    } else if (auth.length <= 0) {
                        auth = null;
                    }
                    serviceURL = "";

                    if (service === "PLATFORM") {
                        serviceURL = "/platform";
                    } else if (service === "PROFILE") {
                        serviceURL = "/profile";
                    }

                    if (!(beacon === true && 'sendBeacon' in navigator)) {
                        _context.next = 18;
                        break;
                    }

                    form_data = new FormData();

                    for (key in body) {
                        form_data.append(key, body[key]);
                    }
                    return _context.abrupt('return', navigator.sendBeacon(BASE_URL + serviceURL + url, form_data));

                case 18:
                    serviceAPI = API({ auth: auth });

                    serviceAPI = serviceAPI.url(serviceURL);

                    if (!(serviceAPI === null)) {
                        _context.next = 28;
                        break;
                    }

                    if (!(!listener && listenCode.indexOf(501) >= 0)) {
                        _context.next = 25;
                        break;
                    }

                    return _context.abrupt('return', { status: 501, body: 'Service not available' });

                case 25:
                    _context.next = 27;
                    return (0, _effects.put)({ type: listenCode.indexOf(501) >= 0 ? listener : mainHandler, status: 501, body: 'Service not available' });

                case 27:
                    return _context.abrupt('return');

                case 28:
                    req = serviceAPI.url(url);
                    res = null;

                    if (method === "GET") {
                        req = req.query(query).get();
                    } else if (method === "POST") {
                        req = req.post(body);
                    } else if (method === "DELETE") {
                        req = req.delete();
                    }
                    _context.next = 33;
                    return req.json(function (res) {
                        return { status: 200, body: res };
                    }).catch(function (err) {
                        return { status: err.status, body: err.message };
                    });

                case 33:
                    res = _context.sent;

                    if (!(!listener && listenCode.indexOf(res.status) >= 0)) {
                        _context.next = 38;
                        break;
                    }

                    return _context.abrupt('return', res);

                case 38:
                    _context.next = 40;
                    return (0, _effects.put)((0, _extends3.default)({ type: listenCode.indexOf(res.status) >= 0 ? listener : mainHandler }, res));

                case 40:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}