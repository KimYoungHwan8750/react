import { useCount } from "../hooks/useCount"

export function Count() {
  const counterContext = useCount()
  return(
    <span>{counterContext.count}</span>
  )
}
