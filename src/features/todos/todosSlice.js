import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = [
    // { id: 0, text: 'Learn React', completed: true },
    // { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    // { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
]

const nextTodoId = (todos) => {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            return [
                ...state,
                action.payload
            ]
        }
        case 'todos/todoToggled': {
            return state.map(todo => {
                if(todo.id !== action.payload){
                    return todo
                }
                return {
                    ...todo,
                    completed: !todo.completed
                }
            })
        }
        case 'todos/colorSelected': {
            const { color, id } = action.payload
            return state.map(todo => {
                if(todo.id !== id){
                    return todo
                }
                return {
                    ...todo,
                    color: color
                }
            })
        }
        case 'todos/todoDeleted': {
            return state.filter(todo => todo.id !== action.payload)
        }
        case 'todos/completeAll': {
            return state.map(todo => {
                return {
                    ...todo,
                    completed: true
                }
            })
        }
        case 'todos/clearCompleted': {
            return state.filter(todo => !todo.completed)
        }
        case 'todos/todosLoaded': {
            return action.payload
        }
        default:
            return state
    }
}

export const selectFilteredTodos = createSelector(
  state => state.todos, //all todos
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

export const selectTodoById = (state, id) => state.todos.find(todo => todo.id === id)

export const countRemainingTodos = state => {
    const remainingTodos = state.todos.filter(todo => !todo.completed)
    return remainingTodos.length
}

// Action creator for load Todos
export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
}

export const fetchTodos = () => {
    // Thunk function
    return async function fetchTodosThunk(dispatch, getState) {
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