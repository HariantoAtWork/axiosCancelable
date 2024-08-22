"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCancel = exports.factoryAxioxCancelable = exports["default"] = exports.CancelablePromise = void 0;
var _axios2 = _interopRequireDefault(require("axios"));
var _queryString = _interopRequireDefault(require("query-string"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var stringify = _queryString["default"].stringify;
var methodsNoData = ['delete', 'get', 'head', 'options'];
var methodsWithData = ['post', 'put', 'patch', 'postForm', 'putForm', 'patchForm'];
var isCancel = exports.isCancel = _axios2["default"].isCancel.bind(_axios2["default"]);
var CancelablePromise = exports.CancelablePromise = /*#__PURE__*/function () {
  function CancelablePromise(executor) {
    _classCallCheck(this, CancelablePromise);
    this.controller = new AbortController();
    this.promise = new Promise(executor.bind(this));
  }
  return _createClass(CancelablePromise, [{
    key: "abort",
    value: function abort() {
      var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Request canceled';
      this.controller.abort(reason);
    }
  }, {
    key: "then",
    value: function then(onFulfilled, onRejected) {
      return this.promise.then(onFulfilled, onRejected);
    }
  }, {
    key: "catch",
    value: function _catch(onRejected) {
      return this.promise["catch"](onRejected);
    }
  }]);
}();
var factoryAxioxCancelable = exports.factoryAxioxCancelable = function factoryAxioxCancelable() {
  var defaultConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var state = {
    controller: new AbortController()
  };
  var request = function request() {
    var configRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (state.controller) {
      state.controller.abort();
    }
    return new CancelablePromise(function (resolve, reject) {
      this.controller = state.controller = new AbortController();
      var signal = defaultConfig.hasOwnProperty('signal') ? defaultConfig.signal : configRequest.hasOwnProperty('signal') ? configRequest.signal : this.controller.signal;
      var config = Object.assign({}, defaultConfig, configRequest, {
        signal: signal
      });
      (0, _axios2["default"])(config).then(function (_ref) {
        var data = _ref.data;
        return data;
      }).then(resolve, reject);
    });
  };
  return request;
};
var axiosCancelable = {
  axios: function axios() {
    var defaultConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var state = {
      controller: new AbortController()
    };
    var request = function request() {
      var configRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (state.controller) {
        state.controller.abort();
      }
      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController();
        var signal = defaultConfig.hasOwnProperty('signal') ? defaultConfig.signal : configRequest.hasOwnProperty('signal') ? configRequest.signal : this.controller.signal;
        var config = Object.assign({}, defaultConfig, configRequest, {
          signal: signal
        });
        (0, _axios2["default"])(config).then(resolve, reject);
      });
    };
    return request;
  }
};
methodsNoData.forEach(function (method) {
  axiosCancelable[method] = function (defaultUrl) {
    var defaultParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaultConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var state = {
      controller: new AbortController()
    };
    var request = function request(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (state.controller) {
        state.controller.abort();
      }
      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController();
        var signal = defaultConfig.hasOwnProperty('signal') ? defaultConfig.signal : config.hasOwnProperty('signal') ? config.signal : this.controller.signal;
        var newConfig = _objectSpread(_objectSpread({
          params: Object.assign({}, defaultParams, params)
        }, Object.assign({}, defaultConfig, config)), {}, {
          signal: signal,
          paramsSerializer: stringify
        });
        _axios2["default"][method](defaultUrl ? defaultUrl : url, newConfig).then(resolve, reject);
      });
    };
    return request;
  };
});
methodsWithData.forEach(function (method) {
  axiosCancelable[method] = function (defaultUrl, defaultData, defaultConfig) {
    var state = {
      controller: new AbortController()
    };
    var request = function request(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (state.controller) {
        state.controller.abort();
      }
      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController();
        var signal = defaultConfig.hasOwnProperty('signal') ? defaultConfig.signal : config.hasOwnProperty('signal') ? config.signal : this.controller.signal;
        var newConfig = _objectSpread(_objectSpread({
          data: Object.assign({}, defaultData, data)
        }, Object.assign({}, defaultConfig, config)), {}, {
          signal: signal
        });
        _axios2["default"][method](defaultUrl ? defaultUrl : url, newConfig).then(resolve, reject);
      });
    };
    return request;
  };
});
var _default = exports["default"] = axiosCancelable;