import React from 'react'

import StatusFilter from './StatusFilter'
import RemainingTodos from './RemainingTodos'
import ColorFilters from './ColorFilters'

import { StatusFilters } from '../filters/filtersSlice'

export default function Footer() {
  const colors = []
  const status = StatusFilters.All
  const todosRemaining = 1

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