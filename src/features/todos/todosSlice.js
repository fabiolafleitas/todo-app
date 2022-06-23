import { client } from '../../api/client'
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
    entities: {}
}

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response  = await client.get('/fakeApi/todos')
    return response.todos
})

export const saveTodo = createAsyncThunk('todos/saveTodo', async (text) => {
    const newTodo = { text }
    const response = await client.post('fakeApi/todos', {todo: newTodo})
    return response.todo
})

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoAdded(state, action) {
            const todo = action.payload
            state.entities[todo.id] = todo
        },
        todoToggled(state, action) {
            const id = action.payload
            const todo = state.entities[id]
            todo.completed = !todo.completed
        },
        todoColorSelected: {
            reducer(state, action) {
                const { color, id } = action.payload
                state.entities[id].color = color
            },
            prepare(id, color) {
                return {
                    payload: { id, color }
                }
            }
        },
        todoDeleted(state, action) {
            delete state.entities[action.payload]
        },
        completeAllTodos(state, action) {
            Object.values(state.entities).forEach(todo => {
                todo.completed = true
            })
        },
        clearCompletedTodos(state, action) {
            Object.values(state.entities).forEach(todo => {
                if(todo.completed){
                    delete state.entities[todo.id]
                }
            })
        }
    },
    extraReducers: builder => {
        builder
          .addCase(fetchTodos.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchTodos.fulfilled, (state, action) => {
              const newEntities = {}
              action.payload.forEach(todo => {
                  newEntities[todo.id] = todo
              })
              state.entities = newEntities
              state.status = 'idle'
          })
          .addCase(saveTodo.fulfilled, (state, action) => {
              const todo = action.payload
              state.entities[todo.id] = todo
          })
    }
})

export const {
    todoAdded,
    todoToggled,
    todoColorSelected,
    todoDeleted,
    completeAllTodos,
    clearCompletedTodos
} = todosSlice.actions

export default todosSlice.reducer

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
