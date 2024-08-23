import {
  CancelablePromise,
  factoryAxioxCancelable,
  isCancel
} from '../src/index.js'

// When you create a new CancelablePromise:
const promise = new CancelablePromise(function (resolve, reject) {
  // Inside the executor, `this` refers to the promise instance
  console.log(this.controller) // This will log the AbortController instance
  console.log(this.controller.signal) // This will log the signal
})

const getCv = factoryAxioxCancelable({
  method: 'get',
  url: 'http://localhost:3000/api/cv'
})

const getOther = factoryAxioxCancelable({
  method: 'get',
  url: 'http://localhost:3000/api/cv'
})

const first = getCv()

first
  .then(() => {
    console.log('SUCCESS!! 1st')
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted 1st')
    } else {
      console.error('NOPE!!!! 1st')
    }
  })

// first.abort()

const other = getOther()

other
  .then(() => {
    console.log('SUCCESS other!! 1st')
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted other 1st')
    } else {
      console.error('NOPE other!!!! 1st')
    }
  })

const second = getCv()
  .then(() => {
    console.log('SUCCESS!! 2nd')
  })
  .catch(error => {
    if (isCancel(error)) {
      console.log('Request aborted: second')
    } else {
      console.error('NOPE!!!! 2st')
    }
  })
