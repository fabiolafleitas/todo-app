import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { saveTodo } from '../todos/todosSlice'

export default function Header() {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = event => setText(event.target.value)

  const handleEnterKey = event => {
    const trimmedText = event.target.value.trim()
    if(event.key === 'Enter' && trimmedText) {
      // Create the thunk function and immediately dispatch it
      dispatch(saveTodo(trimmedText))
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