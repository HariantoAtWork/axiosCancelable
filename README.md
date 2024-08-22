# AxiosCancelable

Axios with custom CancelablePromise cancelation

> *Node*: v20.16.0
> *NPM*: 10.8.1

> This is ES6 variant from NPM: axiosbluebird.

## How to use - factoryAxioxCancelable

```js
import { factoryAxioxCancelable, isCancel } from 'axioscancelable'
```

### method: GET

```js
const getDefaultConfig = {
  method: 'get',
  url: 'https://api.sylo.space/test/axioscancelable/data'
}

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

## How to use - axiosCancelable.get - or get | delete | head | options

```js
import axiosCancelable, { isCancel } from 'axioscancelable'
```

```js
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




## How to use - axios

> Parameters as Object in axios [documentation](https://www.npmjs.com/package/axios)

> Parameters as String not supported

```js
const axiosBluebird = require("axiosbluebird")
const Promise = axiosBluebird.Promise
```

```js
let axiosDataRequest = Promise.resolve()

const axiosData = requestConfig => {
  axiosDataRequest.cancel()
  axiosDataRequest = axiosBluebird.axios(requestConfig)
  return axiosDataRequest
    .catch(console.error.bind(console, "FAIL - axiosData:"))
}
```

```js
// 1st request
axiosData({
  method: "post",
  url: "/user/12345",
  data: {
    firstName: "Fred",
    lastName: "Flintstone"
  }
})

// 2nd request
axiosData({
  method: "get",
  url: "http://bit.ly/2mTM3nY",
  responseType: "stream" })
    .then(response => response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"))
) // previous progressing queue will be canceled
```

> `responseType: 'stream'` not yet tested


## Methods

Promise: Bluebird Promise with Cancelation enabled

axios ( _requestConfig_: Object ): Request with configuration
___

delete ( _url_: String [, _params_: Object] ): Axios request with DELETE method

get ( _url_: String [, _params_: Object] ): Axios request with GET method

head ( _url_: String [, _params_: Object] ): Axios request with HEAD method

options ( _url_: String [, _params_: Object] ): Axios request with OPTIONS method
___

post ( _url_: String, _params_: Object ): Axios request with POST method

put ( _url_: String, _params_: Object ): Axios request with PUT method

patch ( _url_: String, _params_: Object ): Axios request with PATCH method


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