import { Count } from "./Count"

type DisplayType = {
  count: number
}
export function Display({count}: DisplayType) {
  return (
    <>
      Now Count: <Count count={count}/>
    </>
  )
}