/**
 * Middleware Use Cases
 * A middleware can do anything it wants when it sees a dispatched action:
 *
 * Log something to the console
 * Set timeouts
 * Make asynchronous API calls
 * Modify the action
 * Pause the action or even stop it entirely
 * and anything else you can think of.
 *
 * In particular, middleware are intended to contain logic with side effects.
 * In addition, middleware can modify dispatch to accept things that are not plain action objects.
 */

export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1')
  return next(action) // calls next middleware' dispatch implementation in the pipeline (next = print2)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action) // next = print3
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action) // finally, calls the original dispatch function and the rootReducer
}
