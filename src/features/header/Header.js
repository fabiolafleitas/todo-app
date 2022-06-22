import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { saveTodo } from '../todos/todosSlice'

export default function Header() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = event => setText(event.target.value)

  const handleEnterKey = async event => {
    const trimmedText = event.target.value.trim()
    if(event.key === 'Enter' && trimmedText) {
      setStatus('loading')
      // Wait for the promise returned by the thunk function
      await dispatch(saveTodo(trimmedText))
      setText('')
      setStatus('idle')
    }
  }

  let isLoading = status === 'loading'

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        disabled={isLoading}
        onChange={handleChange}
        onKeyDown={handleEnterKey}
      />
    </header>
  )
}