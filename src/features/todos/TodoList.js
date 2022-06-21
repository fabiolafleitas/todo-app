import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectTodos } from './todosSlice'
import TodoListItem from './TodoListItem'

export default function TodoList() {
  const todos = useSelector(selectTodos)
  const dispatch = useDispatch()

  const handleCompleteChange = useCallback((checked, id) => {
    if(!checked) return
    dispatch({type: 'todos/todoToggled', payload: id})
  }, [])

  const renderedListItems = todos.map( todo => {
    return <TodoListItem key={todo.id} todo={todo} onCompletedChange={handleCompleteChange}/>
  })

  return (
    <ul className="todo-list">
      {renderedListItems}
    </ul>
  )
}

