import { useState } from "react"
import { Display } from "./Display"
import { Button } from "./Button"

export function LikeAsContextProvider() {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(count+1)
  return (
    <>
      <Display count={count}></Display>
      <Button incrementCount={incrementCount}></Button>
    </>
  )
}
