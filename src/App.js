import React from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'

function App() {
  return (
    <div className="App">
      <main>
        <section className="medium-container">
          <div className="todoapp card">
            <Header />
            <TodoList />
            <Footer />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
