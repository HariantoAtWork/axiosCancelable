(function (exports, axios, queryString) {
  'use strict';

  const { stringify } = queryString;

  const methodsNoData = ['delete', 'get', 'head', 'options'];
  const methodsWithData = [
    'post',
    'put',
    'patch',
    'postForm',
    'putForm',
    'patchForm'
  ];

  const isCancel = axios.isCancel.bind(axios);

  class CancelablePromise {
    constructor(executor) {
      this.controller = new AbortController();
      this.promise = new Promise(executor.bind(this));
    }

    abort(reason = 'Request canceled') {
      this.controller.abort(reason);
    }

    then(onFulfilled, onRejected) {
      return this.promise.then(onFulfilled, onRejected)
    }

    catch(onRejected) {
      return this.promise.catch(onRejected)
    }
  }

  const factoryAxioxCancelable = function (defaultConfig = {}) {
    const state = { controller: new AbortController() };

    const request = (configRequest = {}) => {
      if (state.controller) {
        state.controller.abort();
      }
      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController();
        const signal = defaultConfig.hasOwnProperty('signal')
          ? defaultConfig.signal
          : configRequest.hasOwnProperty('signal')
          ? configRequest.signal
          : this.controller.signal;

        const config = Object.assign({}, defaultConfig, configRequest, { signal });
        axios(config)
          .then(({ data }) => data)
          .then(resolve, reject);
      })
    };

    return request
  };

  const axiosCancelable = {
    axios(defaultConfig = {}) {
      const state = { controller: new AbortController() };

      const request = (configRequest = {}) => {
        if (state.controller) {
          state.controller.abort();
        }
        return new CancelablePromise(function (resolve, reject) {
          this.controller = state.controller = new AbortController();
          const signal = defaultConfig.hasOwnProperty('signal')
            ? defaultConfig.signal
            : configRequest.hasOwnProperty('signal')
            ? configRequest.signal
            : this.controller.signal;

          const config = Object.assign({}, defaultConfig, configRequest, {
            signal
          });
          axios(config).then(resolve, reject);
        })
      };

      return request
    }
  };

  methodsNoData.forEach(method => {
    axiosCancelable[method] = function (
      defaultUrl,
      defaultParams = {},
      defaultConfig = {}
    ) {
      const state = { controller: new AbortController() };

      const request = (url, params = {}, config = {}) => {
        if (state.controller) {
          state.controller.abort();
        }
        return new CancelablePromise(function (resolve, reject) {
          this.controller = state.controller = new AbortController();
          const signal = defaultConfig.hasOwnProperty('signal')
            ? defaultConfig.signal
            : config.hasOwnProperty('signal')
            ? config.signal
            : this.controller.signal;

          const newConfig = {
            params: Object.assign({}, defaultParams, params),
            ...Object.assign({}, defaultConfig, config),
            signal,
            paramsSerializer: stringify
          };

          axios[method](defaultUrl ? defaultUrl : url, newConfig).then(
            resolve,
            reject
          );
        })
      };

      return request
    };
  });

  methodsWithData.forEach(method => {
    axiosCancelable[method] = function (defaultUrl, defaultData, defaultConfig) {
      const state = { controller: new AbortController() };

      const request = (url, data = {}, config = {}) => {
        if (state.controller) {
          state.controller.abort();
        }

        return new CancelablePromise(function (resolve, reject) {
          this.controller = state.controller = new AbortController();
          const signal = defaultConfig.hasOwnProperty('signal')
            ? defaultConfig.signal
            : config.hasOwnProperty('signal')
            ? config.signal
            : this.controller.signal;

          const newConfig = {
            data: Object.assign({}, defaultData, data),
            ...Object.assign({}, defaultConfig, config),
            signal
          };

          axios[method](defaultUrl ? defaultUrl : url, newConfig).then(
            resolve,
            reject
          );
        })
      };

      return request
    };
  });

  exports.CancelablePromise = CancelablePromise;
  exports.default = axiosCancelable;
  exports.factoryAxioxCancelable = factoryAxioxCancelable;
  exports.isCancel = isCancel;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, axios, queryString);
