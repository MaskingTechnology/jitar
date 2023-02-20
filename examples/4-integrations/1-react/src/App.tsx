import './App.css'
import { sayHello } from './shared/sayHello'

const message = await sayHello('React + Jitar')

function App()
{
  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  )
}

export default App
