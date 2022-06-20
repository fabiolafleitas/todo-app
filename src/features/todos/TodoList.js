import React from 'react'
import TodoListItem from './TodoListItem'

export default function TodoList() {
  const todos = [
    { id: 0, text: 'Learn React', completed: true },
    { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
  ]

  const renderedListItems = todos.map((todo) => {
    return <TodoListItem key={todo.id} todo={todo} />
  })

  return (
    <ul className="todo-list">
      {renderedListItems}
    </ul>
  )
}

