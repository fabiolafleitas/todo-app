import React from 'react'
import { useSelector } from 'react-redux'

import StatusFilter from './StatusFilter'
import RemainingTodos from './RemainingTodos'
import ColorFilters from './ColorFilters'

import { selectedColors, selectedStatus } from '../filters/filtersSlice'
import { countRemainingTodos } from '../todos/todosSlice'

export default function Footer() {
  const colors = useSelector(selectedColors)
  const status = useSelector(selectedStatus)
  const todosRemaining = useSelector(countRemainingTodos)

  const onColorChange = (color, changeType) =>
    console.log('Color change: ', { color, changeType })
  const onStatusChange = (status) => console.log('Status change: ', status)

  return (
    <footer className="footer">
      <div className="actions">
        <button className="button">Mark All Completed</button>
        <button className="button">Clear Completed</button>
      </div>

      <StatusFilter value={status} onChange={onStatusChange} />
      <RemainingTodos count={todosRemaining} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}