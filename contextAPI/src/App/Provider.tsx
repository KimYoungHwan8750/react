import { createContext, PropsWithChildren, useState } from "react"

type CounterContextType = {
  count: number
  incrementCount: () => void
}
export const CounterContext = createContext<CounterContextType | null>(null)
export function ContextProvider({children}: PropsWithChildren) {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(count+1)
  return(
    <CounterContext.Provider value={{count, incrementCount}}>
      {children}
    </CounterContext.Provider>
  )
}

