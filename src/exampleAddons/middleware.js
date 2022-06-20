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
// Redux middleware are written as a series of three nested functions
function exampleMiddleware(storeAPI) {
  // Receives a function called next, it is actually the next middleware in the pipeline
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // Do anything here: pass the action onwards with next(action)
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here

      return next(action)
    }
  }
}

export const logger = storeAPI => next => action => {
  console.log('dispatching ', action)
  const result = next(action)
  console.log('next state ', storeAPI.getState())
  return result
}

export const delayedMessage = storeAPI => next => action => {
  if(action.type === 'todos/todoAdded'){
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload)
    }, 1000)
  }

  return next(action)
}
