import { useContext } from "react";
import { CounterContext } from "../App/Provider";

export function useCount() {
  const countContext = useContext(CounterContext)
  if (!countContext) {
    throw Error('CounterContext는 Provider로 제공받아서 사용해주세요.')
  }
  return countContext
}