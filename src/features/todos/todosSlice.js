import { client } from '../../api/client'
import { createSelector } from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
    entities: {}
}

const nextTodoId = (todos) => {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            const todo = action.payload
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todo.id]: todo
                }
            }
        }
        case 'todos/todoToggled': {
            const id = action.payload
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [id]: {
                        ...state.entities[id],
                        completed: !state.entities[id].completed
                    }
                }
            }
        }
        case 'todos/colorSelected': {
            const { color, id } = action.payload
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [id]: {
                        ...state.entities[id],
                        color: color
                    }
                }
            }
        }
        case 'todos/todoDeleted': {
            const todos = {...state.entities}
            delete todos[action.payload]
            return {
                ...state,
                entities: todos
            }
        }
        case 'todos/completeAll': {
            const todos = {...state.entities}
            Object.values(todos).forEach(todo => {
                todos[todo.id] = {
                    ...todo,
                    completed: true
                }
            })
            return {
                ...state,
                entities: todos
            }
        }
        case 'todos/clearCompleted': {
            const todos = {...state.entities}
            Object.values(todos).forEach(todo => {
                if(todo.completed){
                    delete todos[todo.id]
                }
            })
            return {
                ...state,
                entities: todos
            }
        }
        case 'todos/todosLoading': {
            return {
                ...state,
                status: 'loading'
            }
        }
        case 'todos/todosLoaded': {
            const todos = {}
            action.payload.forEach(todo => {
                todos[todo.id] = todo
            })
            return {
                ...state,
                status: 'idle',
                entities: todos
            }
        }
        default:
            return state
    }
}

/** Selectors **/

const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(
  selectTodoEntities,
  entities => Object.values(entities)
)

export const selectFilteredTodos = createSelector(
  selectTodos, //all todos
  state => state.filters, // current filter values
  (todos, filters) => {
      const { status, colors } = filters
      const showAll = status === StatusFilters.All
      if(showAll && colors.length === 0) {
          return todos
      }
      const completedStatus = status === StatusFilters.Completed
      return todos.filter(todo => {
          const statusMatches = showAll || todo.completed === completedStatus
          const colorMatches = colors.length === 0 || colors.includes(todo.color)
          return statusMatches && colorMatches
      })
  }
)

export const selectTodosIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id)
)

export const selectTodoById = (state, id) => selectTodoEntities(state)[id]

export const countRemainingTodos = state => {
    const remainingTodos = selectTodos(state).filter(todo => !todo.completed)
    return remainingTodos.length
}
/** Action Creators **/

// Action creator for load Todos
export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
}

export const todosLoading = () => {
    return {
        type: 'todos/todosLoading'
    }
}

export const fetchTodos = () => {
    // Thunk function
    return async function fetchTodosThunk(dispatch, getState) {
        dispatch(todosLoading())
        const response  = await client.get('/fakeApi/todos')
        dispatch(todosLoaded(response.todos))
    }
}

// Action creator for add todo
export const todoAdded = todo => {
    return {
        type: 'todos/todoAdded',
        payload: todo
    }
}

// Thunk action creator for save a new todo
export function saveTodo(text) {
    return async (dispatch, getState) => {
        const newTodo = { text }
        const response = await client.post('fakeApi/todos', {todo: newTodo})
        dispatch(todoAdded(response.todo))
    }
}