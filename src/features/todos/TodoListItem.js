import React from 'react'

import { availableColors, capitalize } from '../filters/colors'

const TodoListItem = React.memo(({ todo, onColorChange, onCompletedChange, onDelete }) => {
  const { id, text, completed, color } = todo

  const handleCompletedChanged = e => {
    onCompletedChange(e.target.checked, id)
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
})

export default TodoListItem
