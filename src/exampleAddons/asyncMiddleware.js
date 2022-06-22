import { client } from '../api/client'

/* Simplified version of the reduxThunkMiddleware */
const asyncMiddleware = storeAPI => next => action => {
  if(typeof action === 'function'){
    // call the function and pass dispatch and getState as arguments
    // Also, return whatever the thunk function returns
    return action(storeAPI.dispatch, storeAPI.getState)
  }

  // Normal action, send it onwards
  return next(action)
}

// Write a function that has dispatch and getState as arguments
const fetchSomeData = (dispatch, getState) => {
  client.get('todos').then(todos => {
    dispatch({ type: 'todos/todosLoaded', payload: todos })
    const allTodos = getState().todos
    console.log('Number of todos after loading: ', allTodos.length)
  })
}

// Enable the store to use the asyncMiddleware middleware
// const store = createStore(rootReducer, applyMiddleware(asyncMiddleware))

// Dispatch using the function
// store.dispatch(fetchSomeData)