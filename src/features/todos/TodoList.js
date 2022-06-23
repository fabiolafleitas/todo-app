import React from 'react'
import { useSelector } from 'react-redux'
import { selectFilteredTodosIds } from './todosSlice'
import TodoListItem from './TodoListItem'
import Loader from '../../uiComponents/Loader'

export default function TodoList() {
  const todosIds = useSelector(selectFilteredTodosIds)
  const loadingStatus = useSelector(state => state.todos.status)

  if(loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader">
          <Loader />
        </div>
      </div>
    )
  }

  const renderedListItems = todosIds.map( todoId => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return (
    <ul className="todo-list">
      {renderedListItems}
    </ul>
  )
}

