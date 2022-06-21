import React from 'react'
import { useSelector } from 'react-redux'
import { selectTodos } from './todosSlice'
import TodoListItem from './TodoListItem'

export default function TodoList() {
  const todos = useSelector(selectTodos)

  const renderedListItems = todos.map( todo => {
    return <TodoListItem key={todo.id} todo={todo} />
  })

  return (
    <ul className="todo-list">
      {renderedListItems}
    </ul>
  )
}

