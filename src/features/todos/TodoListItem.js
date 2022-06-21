import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
import { selectTodoById } from './todosSlice'

export default function TodoListItem({ id }) {
  const todo = useSelector(state => selectTodoById(state, id))
  const {text, completed, color} = todo
  const dispatch = useDispatch()

  const handleCompletedChanged = () => {
    dispatch({type: 'todos/todoToggled', payload: todo.id})
  }

  const handleColorChanged = event => {
    dispatch({
      type: 'todos/colorSelected',
      payload: {id: todo.id, color: event.target.value}
    })
  }

  const handleDelete = () => {
    dispatch({type: 'todos/todoDeleted', payload: todo.id})
  }

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value="">No Color</option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={handleDelete}>
            <span>&#10539;</span>
          </button>
        </div>
      </div>
    </li>
  )
}
