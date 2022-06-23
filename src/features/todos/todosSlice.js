import {createSlice, createAsyncThunk, createSelector, createEntityAdapter} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()

// Final slice state = {ids, entities, status}
const initialState = todosAdapter.getInitialState({
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
})

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
        todoDeleted: todosAdapter.removeOne, // adapter reducer function as case reducer
        completeAllTodos(state, action) {
            Object.values(state.entities).forEach(todo => {
                todo.completed = true
            })
        },
        clearCompletedTodos(state, action) {
            const completedIds = Object.values(state.entities)
              .filter(todo => todo.completed)
              .map(todo => todo.id)
            // adapter reducer function as mutating update helper
            todosAdapter.removeMany(state, completedIds)
        }
    },
    extraReducers: builder => {
        builder
          .addCase(fetchTodos.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchTodos.fulfilled, (state, action) => {
              todosAdapter.setAll(state, action.payload)
              state.status = 'idle'
          })
          .addCase(saveTodo.fulfilled, todosAdapter.addOne)
    }
})

export const {
    todoToggled,
    todoColorSelected,
    todoDeleted,
    completeAllTodos,
    clearCompletedTodos
} = todosSlice.actions

export default todosSlice.reducer

/** Selectors **/

export const { selectAll:selectTodos, selectById: selectTodoById} =
  todosAdapter.getSelectors(state => state.todos)

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

export const selectFilteredTodosIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id)
)

export const countRemainingTodos = state => {
    const remainingTodos = selectTodos(state).filter(todo => !todo.completed)
    return remainingTodos.length
}
