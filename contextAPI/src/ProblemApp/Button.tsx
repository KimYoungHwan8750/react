type ButtonType = {
  incrementCount: () => void
}
export function Button({incrementCount}: ButtonType) {
  return (
    <button onClick={incrementCount}>
      증가
    </button>
  )
}