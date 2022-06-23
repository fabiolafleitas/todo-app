import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import StatusFilter from './StatusFilter'
import RemainingTodos from './RemainingTodos'
import ColorFilters from './ColorFilters'

import { selectedColors, selectedStatus, statusFilterChanged, colorsFilterChanged } from '../filters/filtersSlice'
import { countRemainingTodos, completeAllTodos, clearCompletedTodos } from '../todos/todosSlice'

export default function Footer() {
  const colors = useSelector(selectedColors)
  const status = useSelector(selectedStatus)
  const todosRemaining = useSelector(countRemainingTodos)
  const dispatch = useDispatch()

  const handleCompleteAll = () => {
    dispatch(completeAllTodos())
  }

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos())
  }

  const onColorChange = (color, changeType) => {
    dispatch(colorsFilterChanged(color, changeType))
  }

  const handleStatusChange = status => {
    dispatch(statusFilterChanged(status))
  }

  return (
    <footer className="footer">
      <div className="actions">
        <button className="button" onClick={handleCompleteAll}>Mark All Completed</button>
        <button className="button" onClick={handleClearCompleted}>Clear Completed</button>
      </div>

      <StatusFilter value={status} onChange={handleStatusChange} />
      <RemainingTodos count={todosRemaining} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}