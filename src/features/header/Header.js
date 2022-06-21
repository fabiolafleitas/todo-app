import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

export default function Header() {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = event => setText(event.target.value)

  const handleEnterKey = event => {
    const trimmedText = event.target.value.trim()
    if(event.key === 'Enter' && trimmedText) {
      dispatch({type: 'todos/todoAdded', payload: trimmedText})
      setText('')
    }
  }

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={handleChange}
        onKeyDown={handleEnterKey}
      />
    </header>
  )
}