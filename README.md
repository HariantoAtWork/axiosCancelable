# AxiosCancelable

Axios with custom CancelablePromise cancelation

> *Node*: v20.16.0
> *NPM*: 10.8.1

> This is ESM variant from NPM: axiosbluebird.

## How to use - factoryAxioxCancelable

```js
import { factoryAxioxCancelable, isCancel } from '@harianto/axioscancelable'
```

### method: GET

```js
const getDefaultConfig = {
  method: 'get',
  url: 'https://api.sylo.space/test/axioscancelable/data'
}

// Factory (Instantiate)
const getData = factoryAxioxCancelable(getDefaultConfig)

// See Axios Config: params
const firstRequest = getData({
  params: {
    id: 12345
  }
})

firstRequest
  .then(data => {
    console.log('SUCCESS firstRequest!!!', data)
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted firstRequest')
    } else {
      console.error(error)
    }
  })

const secondRequest = getData({
  params: {
    id: 67890
  }
})

secondRequest
  .then(data => {
    console.log('SUCCESS secondRequest!!!', data)
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted secondRequest')
    } else {
      console.error(error)
    }
  })

// Note: The `firstRequest` gets aborted
```

### Method: POST

```js
const postDefaultConfig = {
  method: 'post',
  url: 'https://api.sylo.space/test/axioscancelable/data'
}

// Factoried (Instantiate)
const postData = factoryAxioxCancelable(postDefaultConfig)

// See Axios Config: data
const thirdRequest = postData({
  data: {
    id: 12345
  }
})

thirdRequest
  .then(data => {
    console.log('SUCCESS thirdRequest!!!', data)
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted thirdRequest')
    } else {
      console.error(error)
    }
  })

const fourthRequest = postData({
  data: {
    id: 67890
  }
})

fourthRequest
  .then(data => {
    console.log('SUCCESS fourthRequest!!!', data)
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted fourthRequest')
    } else {
      console.error(error)
    }
  })

// Note: The `thirdRequest` gets aborted
```

## How to use - axiosCancelable

```js
import axiosCancelable, { isCancel } from '@harianto/axioscancelable'
```

### axiosCancelable.get - or get | delete | head | options

```js
// Factoried (Instantiate) with .get()
// axiosCancelable.get(url, [params], [config])
const getData = axiosCancelable.get()

// firstRequest
getData('https://api.sylo.space/test/axioscancelable/data', {id: 17})
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted firstRequest')
    } else {
      console.error(error)
    }
  })
// secondRequest
getData('https://api.sylo.space/test/axioscancelable/data', {id: [1,2,3]})
  .then(console.log.bind(console))
// Note: `firstRequest` gets aborted
```

### axiosCancelable.post - or post | put | patch

```js
import axiosCancelable, { isCancel } from '@harianto/axioscancelable'
```

```js
// Factoried (Instantiate) with .post()
// axiosCancelable.post(url, data, [config])
const postData = axiosCancelable.post()

// firstRequest
postData('https://api.sylo.space/test/axioscancelable/data', {id: 17})
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted firstRequest')
    } else {
      console.error(error)
    }
  })
// secondRequest
postData('https://api.sylo.space/test/axioscancelable/data', {id: [1,2,3]})
  .then(console.log.bind(console))
// Note: `firstRequest` gets aborted
```


## How to use - axios | Factory

> Parameters as Object in axios [documentation](https://www.npmjs.com/package/axios)

> Parameters as String not supported


```js
import axiosCancelable, { isCancel } from '@harianto/axioscancelable'

// Factoried (Instantiate) with .axios()
// axiosCancelable.axios(config)
const axiosData = axiosCancelable.axios()
```

```js
// 1st request
axiosData({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
})

// 2nd request
axiosData({
  method: 'get',
  url: 'http://bit.ly/2mTM3nY',
  responseType: 'stream' 
})
  .then(
    response => response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"))
  ) // previous request (1st request) will be canceled
```

> `responseType: 'stream'` not yet tested

### Getting Data Response

```js
// Factoried (Instantiate) with .axios()
const axiosRequest = axiosCancelable.axios()
// 1st request
axiosRequest({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
})
  .then(({data}) => data)
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted')
    } else {
      console.error(error)
    }
  })
```

## Examples

### Have an ajax.js file - factoryAxioxCancelable

```js
import { factoryAxioxCancelable } from '@harianto/axioscancelable'
export { isCancel } from '@harianto/axioscancelable'

const instances = {
  getProfile: factoryAxioxCancelable({ method: 'get', url: '/api/profile' }),
  postProfile: factoryAxioxCancelable({ method: 'post', url: '/api/profile' }),
  postVerifytoken: factoryAxioxCancelable({ method: 'post', url: '/api/verifytoken' }),
  postRegister: factoryAxioxCancelable({ method: 'post', url: '/api/register' }),
  postLogin: factoryAxioxCancelable({ method: 'post', url: '/api/login' })
}
const onCanceled = error => {
  if (isCancel(error)) {
    console.log('Canceled')
  } else {
    throw error
  }
}

export const getProfile = (params = {}) =>
  instances.getProfile({params}).catch(onCanceled)
export const postProfile = (data = {}) =>
  instances.postProfile({data}).catch(onCanceled)
export const postVerifytoken = (data = {}) =>
  instances.postVerifytoken({data}).catch(onCanceled)
export const postRegister = (data = {}) =>
  instances.postRegister({data}).catch(onCanceled)
export const postLogin = (data = {}) =>
  instances.postLogin({data}).catch(onCanceled)
```

### Have an ajax.js file - axiosCancelable

```js
import axiosCancelable from '@harianto/axioscancelable'
export { isCancel } from '@harianto/axioscancelable'

const instances = {
  getProfile: axiosCancelable.get('/api/profile'),
  postProfile: axiosCancelable.post('/api/profile'),
  postVerifytoken: axiosCancelable.post('/api/verifytoken'),
  postRegister: axiosCancelable.post('/api/register'),
  postLogin: axiosCancelable.post('/api/login')
}
const onCanceled = error => {
  if (isCancel(error)) {
    console.log('Canceled')
  } else {
    throw error
  }
}

export const getProfile = (params = {}) =>
  instances.getProfile(null, params).catch(onCanceled)
export const postProfile = (data = {}) =>
  instances.postProfile(null, data).catch(onCanceled)
export const postVerifytoken = (data = {}) =>
  instances.postVerifytoken(null, data).catch(onCanceled)
export const postRegister = (data = {}) =>
  instances.postRegister(null, data).catch(onCanceled)
export const postLogin = (data = {}) =>
  instances.postLogin(null, data).catch(onCanceled)
```


## Methods

axios ( _requestConfig_: Object ): Request with configuration
___

delete ( _url_: String [, _params_: Object] [, _config_: Object] ): Axios request with DELETE method

get ( _url_: String [, _params_: Object] [, _config_: Object] ): Axios request with GET method

head ( _url_: String [, _params_: Object] [, _config_: Object] ): Axios request with HEAD method

options ( _url_: String [, _params_: Object] [, _config_: Object] ): Axios request with OPTIONS method
___

post ( _url_: String, _data_: Object [, _config_: Object] ): Axios request with POST method

put ( _url_: String, _data_: Object [, _config_: Object] ): Axios request with PUT method

patch ( _url_: String, _data_: Object [, _config_: Object] ): Axios request with PATCH method


## NOTE!

Param properties as array

```js
params: {
  filter: [8, 16, 32]
}
```

will output:

```
filter=8&filter=16&filter=32
```

Idealisticly:

```
filter=[8,16,32]
```

But some servers can't accept brackets