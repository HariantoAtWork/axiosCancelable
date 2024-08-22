import axios from 'axios'
import queryString from 'query-string'
const { stringify } = queryString

const methodsNoData = ['delete', 'get', 'head', 'options']
const methodsWithData = [
  'post',
  'put',
  'patch',
  'postForm',
  'putForm',
  'patchForm'
]

export class CancelablePromise {
  constructor(executor) {
    this.controller = new AbortController()
    this.promise = new Promise(executor.bind(this))
  }

  abort(reason = 'Request canceled') {
    this.controller.abort(reason)
  }

  then(onFulfilled, onRejected) {
    const self = this
    return this.promise.then(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this.promise.catch(onRejected)
  }
}

export const factoryAxioxCancelable = function (defaultConfig = {}) {
  const state = { controller: new AbortController() }

  const request = (configRequest = {}) => {
    if (state.controller) {
      state.controller.abort()
    }
    return new CancelablePromise(function (resolve, reject) {
      this.controller = state.controller = new AbortController()
      const signal = configRequest.hasOwnProperty('signal')
        ? configRequest.signal
        : this.controller.signal

      const config = Object.assign({}, defaultConfig, configRequest, { signal })
      axios(config)
        .then(({ data }) => data)
        .then(resolve, reject)
    })
  }

  return request
}

const axiosCancelable = {
  CancelablePromise,
  axios(defaultConfig = {}) {
    const state = { controller: new AbortController() }

    const request = (configRequest = {}) => {
      if (state.controller) {
        state.controller.abort()
      }
      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController()
        const signal = configRequest.hasOwnProperty('signal')
          ? configRequest.signal
          : this.controller.signal

        const config = Object.assign({}, defaultConfig, configRequest, {
          signal
        })
        axios(config).then(resolve, reject)
      })
    }

    return request
  }
}

methodsNoData.forEach(method => {
  axiosCancelable[method] = function (
    defaultUrl,
    defaultParams = {},
    defaultConfig = {}
  ) {
    const state = { controller: new AbortController() }

    const request = (url, params = {}, config = {}) => {
      if (state.controller) {
        state.controller.abort()
      }
      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController()
        const signal = config.hasOwnProperty('signal')
          ? config.signal
          : this.controller.signal

        const newConfig = {
          params: Object.assign({}, defaultParams, params),
          ...Object.assign({}, defaultConfig, config),
          signal,
          paramsSerializer: stringify
        }

        axios[method](defaultUrl ? defaultUrl : url, newConfig).then(
          resolve,
          reject
        )
      })
    }

    return request
  }
})

methodsWithData.forEach(method => {
  axiosCancelable[method] = (url, params) =>
    new Promise((fulfil, reject, onCancel) => {
      // eslint-disable-line
      const controller = new AbortController()
      const signal = controller.signal

      onCancel(() => {
        controller.abort()
      })

      return axios[method](url, params, { signal }).then(fulfil).catch(reject)
    })

  axiosCancelable[method] = function (defaultUrl, defaultData, defaultConfig) {
    const state = { controller: new AbortController() }

    const request = (url, data = {}, config = {}) => {
      if (state.controller) {
        state.controller.abort()
      }

      return new CancelablePromise(function (resolve, reject) {
        this.controller = state.controller = new AbortController()
        const signal = config.hasOwnProperty('signal')
          ? config.signal
          : this.controller.signal

        const newConfig = {
          data: Object.assign({}, defaultData, data),
          ...Object.assign({}, defaultConfig, config),
          signal
        }

        axios[method](defaultUrl ? defaultUrl : url, newConfig).then(
          resolve,
          reject
        )
      })
    }

    return request
  }
})

export default axiosCancelable
