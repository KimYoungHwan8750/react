import { LikeAsContextProvider } from "./Provider";

export function ProblemApp() {
  return (
    <div>
      <p>Props Drilling</p>
      <LikeAsContextProvider>
      </LikeAsContextProvider>
    </div>
  )
}