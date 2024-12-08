import { useCount } from "../hooks/useCount"

export function Button() {
  const counterContext = useCount()
  return (
    <>
      <button onClick={counterContext.incrementCount}>증가</button>
    </>
  )
}