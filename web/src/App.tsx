import { useState } from 'react'
import Habit from './components/habit'
import './styles/global.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Habit completed={5} />
      <Habit completed={2} />
      <Habit completed={1} />
    </>
  )
}

export default App
