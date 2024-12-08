import { Display } from './Display'
import { Button } from './Button'
import { ContextProvider } from './Provider'

export function App() {
  return (
    <div>
      <p>Provider로 래핑</p>
      <ContextProvider>
        <Display></Display>
        <Button></Button>
      </ContextProvider>
      <hr/>
      <p>Provider로 래핑 x</p>
      <Display></Display>
      <Button></Button>
      <hr/>
    </div>
  )
}