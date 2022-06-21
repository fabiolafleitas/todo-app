import React from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import { selectTodosIds } from './todosSlice'
import TodoListItem from './TodoListItem'

export default function TodoList() {
  const todosIds = useSelector(selectTodosIds, shallowEqual )

  const renderedListItems = todosIds.map( todoId => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return (
    <ul className="todo-list">
      {renderedListItems}
    </ul>
  )
}

