/**
 * Small version of a Redux store.
 * Replace the createStore function used in store.js to give it a try
 **/
export default function createStore(reducer, preloadedState) {
    // The store has the current state value and reducer function inside.
    let state = preloadedState
    const listeners = []

    // returns the current state value
    function getState() {
        return state
    }

    // keeps an array of listener callbacks and returns a function to remove the new callback
    function subscribe(listener) {
        listeners.push(listener)
        return function unsubscribe() {
            const index = listeners.indexOf(listener)
            listeners.splice(index, 1)
        }
    }

    // calls the reducer, saves the state, and runs the listeners
    function dispatch(action) {
        state = reducer(state, action)
        listeners.forEach(listener => listener())
    }

    // The store dispatches one action on startup to initialize the reducers with their state
    dispatch({ type: '@@redux/INIT' })

    // The store API is an object with {dispatch, subscribe, getState}
    return { dispatch, subscribe, getState }
}