import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
import { selectTodoById } from './todosSlice'

export default function TodoListItem({ id, onColorChange, onDelete }) {
  const todo = useSelector(state => selectTodoById(state, id))
  const {text, completed, color} = todo
  const dispatch = useDispatch()

  const handleCompletedChanged = () => {
    dispatch({type: 'todos/todoToggled', payload: todo.id})
  }

  const handleColorChanged = e => {
    onColorChange(e.target.value)
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
          <button className="destroy" onClick={onDelete}>
            <span>&#10539;</span>
          </button>
        </div>
      </div>
    </li>
  )
}
