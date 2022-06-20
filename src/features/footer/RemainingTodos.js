import React from 'react'

export default function RemainingTodos({ count }) {
  const suffix = count === 1 ? '' : 's'

  return (
    <div className="todo-count">
      <strong>{count}</strong> item{suffix} left
    </div>
  )
}
