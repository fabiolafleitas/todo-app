const initialState = [
    { id: 0, text: 'Learn React', completed: true },
    { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
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
                {
                    id: nextTodoId(state),
                    text: action.payload,
                    completed: false
                }
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