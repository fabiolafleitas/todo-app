import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
    entities: []
}

const nextTodoId = (todos) => {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            return {
                ...state,
                entities: [
                    ...state.entities,
                    action.payload
                ]
            }
        }
        case 'todos/todoToggled': {
            return {
                ...state,
                entities: state.entities.map(todo => {
                    if(todo.id !== action.payload){
                        return todo
                    }
                    return {
                        ...todo,
                        completed: !todo.completed
                    }
                })
            }
        }
        case 'todos/colorSelected': {
            const { color, id } = action.payload
            return {
                ...state,
                entities: state.entities.map(todo => {
                    if(todo.id !== id){
                        return todo
                    }
                    return {
                        ...todo,
                        color: color
                    }
                })
            }
        }
        case 'todos/todoDeleted': {
            return {
                ...state,
                entities: state.entities.filter(todo => todo.id !== action.payload)
            }
        }
        case 'todos/completeAll': {
            return {
                ...state,
                entities: state.entities.map(todo => {
                    return {
                        ...todo,
                        completed: true
                    }
                })
            }
        }
        case 'todos/clearCompleted': {
            return {
                ...state,
                entities: state.entities.filter(todo => !todo.completed)
            }
        }
        case 'todos/todosLoading': {
            return {
                ...state,
                status: 'loading'
            }
        }
        case 'todos/todosLoaded': {
            return {
                ...state,
                status: 'idle',
                entities: action.payload
            }
        }
        default:
            return state
    }
}

const selectTodos = state => state.todos.entities

export const selectFilteredTodos = createSelector(
  state => selectTodos(state), //all todos
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

export const selectTodoById = (state, id) => selectTodos(state).find(todo => todo.id === id)

export const countRemainingTodos = state => {
    const remainingTodos = selectTodos(state).filter(todo => !todo.completed)
    return remainingTodos.length
}

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