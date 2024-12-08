type CountType = {
  count: number
}
export function Count({count}: CountType) {
  return (
    <span>{count}</span>
  )
}
