import { client } from '../../api/client'

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

export const selectTodos = state => state.todos

// Will always update the reference so, use this along with a comparison function
export const selectTodosIds = state => state.todos.map(todo => todo.id)

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