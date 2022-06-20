import React from 'react'

import { StatusFilters } from '../filters/filtersSlice'

export default function StatusFilter({ value: status, onChange }) {
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key]
    const handleClick = () => onChange(value)
    const className = value === status ? 'selected' : ''

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    )
  })

  return (
    <div className="filters statusFilters">
      <ul>{renderedFilters}</ul>
    </div>
  )
}
