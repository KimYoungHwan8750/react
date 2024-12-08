# ContextAPI
Context를 공유하는 기능을 제공해준다. 기존에는 Context를 다른 컴포넌트와 공유하려면 props를 통해 전달해줘야 했다. 이때 해당 Context의 정보를 직접 사용하지 않지만 자식 컴포넌트에 그 데이터를 전달해주는 과정에서 부모로부터 props를 전달받아 자식에게 props를 전달해야하는 비효율적인 방법을 사용했다. 이를 Props Drilling이라고 한다.

## 프로젝트 구조
```
src
  ├─ App
  │  ├─ App.tsx
  │  ├─ Button.tsx
  │  ├─ Count.tsx
  │  ├─ Display.tsx
  │  └─ Provider.tsx
  └─ ProblemApp
    ├─ Button.tsx
    ├─ Count.tsx
    ├─ Display.tsx
    ├─ ProblemApp.tsx
    └─ Provider.tsx
```

프로젝트 구조는 위와 같다. 숫자를 표시하는 컴포넌트와 이 숫자를 1 증가시키는 버튼이 존재하는 단순한 앱이다. ProblemApp에서 Props Drilling이 일어나도록 예제를 구성해놓았고, App에서는 ContextAPI를 사용해 이러한 문제를 깔끔하게 해결해본다.

## Props Drilling
먼저, 프로젝트 구조를 보면 ProblemApp은 다음과 같이 생겼다.

```tsx
export function ProblemApp() {
  return (
    <div>
      <p>Props Drilling</p>
      <LikeAsContextProvider>
      </LikeAsContextProvider>
    </div>
  )
}
```

LikeAsContextProvider 하나만을 렌더링하며 그 외에는 딱히 하는 일이 없는 컴포넌트다. 즉 Props Drilling을 보여주기 위한 엔트리 포인트로 동작한다.

```tsx
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
```

본격적으로 카운트하는 기능과 숫자를 표시하는 기능이 보이는 컴포넌트다. `Display` 컴포넌트는 `LikeAsContextProvider`가 제공해주는 숫자를 `props`로 전달받아 렌더링하며, `Button` 컴포넌트도 마찬가지로 `incrementCount` 함수를 `props`로 전달받아 버튼을 구성한다.

이제 각각 `Display` 컴포넌트와 `Button` 컴포넌트를 보자.

```tsx
type DisplayType = { count: number }
export function Display({count}: DisplayType) {
  return (
    <>
      Now Count: <Count count={count}/>
    </>
  )
}
```

```tsx
type ButtonType = { incrementCount: () => void }
export function Button({incrementCount}: ButtonType) {
  return (
    <button onClick={incrementCount}>
      증가
    </button>
  )
}
```
`Display` 컴포넌트는 숫자를 표시하기 전에 Now Count: 텍스트를 추가해주는, UI 적인 요소가 가미된 컴포넌트고 실질적으로 숫자 렌더링은 `Count`에서 한다. 물론 이 경우 `Count` 컴포넌트에서 Now Count:도 같이 표시하면 되지 않느냐는 의견이 있겠지만 이건 단순한 카운터라서 그렇게 리팩토링이 가능한 것이지, 복잡한 실무 프로젝트를 경험하다보면 그게 맘처럼 안 되는 경우가 있다.

```tsx
type CountType = { count: number }
export function Count({count}: CountType) {
  return (
    <span>{count}</span>
  )
}
```

위처럼 `Count`는 숫자만을 표시하는 간단한 컴포넌트이다. `Display` 컴포넌트에서는 실질적으로 `count` 변수를 사용하지 않지만, `Provider`로부터 `Count` 컴포넌트로 `count` 변수를 전달하기 위해 `props`에서 `count`를 넘겨받는다. 이는 순수함수를 지향하는 리액트에서(든 어떤 프로그래밍 언어에서든) 좋은 구조는 아니라고 본다.

단순한 프로그램이라 depth가 그리 깊지 않은데, 2차 3차적으로 깊어지면 `props`를 타이핑하는데에도 피로가 느껴지는데, 그렇다면 이것을 ContextAPI로 어떻게 해결한다는 걸까?

## ContextAPI

```tsx
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
```

우선 엔트리 포인트인 `App`부터 보자면 `ProblemApp`의 `LikeAsContextProvider`처럼 `Display`와 `Button` 컴포넌트가 보인다. 하나는 `ContextProvider`로 둘러싸여있고, 나머지 하나는 날 것 그대로 노출되어 있다.

```tsx
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
```
`createContext` 함수를 사용해 `CounterContext`를 생성했다. 이때 `createContext`에 기본값을 전달해줄 수 있다. 만약 `Provider`를 통해서 값을 전달해주지 않는다면 `null`이 될 것이다. 위에서 `Provider`는 `value`로 `count` 변수와, `incrementCount` 함수를 전달하고 있다 따라서 `Provider`로 둘러싼 하위 요소들은 해당 `Provider`가 제공해주는 Context를 공유하며 `count`와 `incrementCount` 함수를 사용할 수 있다. 이제 `Display`와 `Button` 컴포넌트를 살펴보자.

```tsx
export function Display() {
  return (
    <>
      Now Count: <Count/>
    </>
  )
}
```

뭔가 이상하다. `Count` 컴포넌트에서 숫자를 표시해야하는데 아무런 `props`도 전달하고 있지 않다. `Display` 컴포넌트는 Now Count: 를 표시하며, 그 뒤에 `Count` 컴포넌트를 렌더링하는 단순한 컴포넌트가 되었다.

```tsx
export function Count() {
  const counterContext = useContext(CounterContext)
  return(
    <span>{counterContext?.count}</span>
  )
}
```

그리고 `Count` 컴포넌트에선 `useContext`를 사용해 해당 Context에 있는 `count` 변수에 접근하고 있다.(counterContext 뒤에 ?는 조금 더 아래에서 설명한다.)

```tsx
export function Button() {
  const counterContext = useContext(CounterContext) 
  return (
    <>
      <button onClick={counterContext?.incrementCount}>증가</button>
    </>
  )
}
```

마찬가지로 `Button` 컴포넌트도 깔끔해졌다. 이전의 `ProblemApp`에서 사용된 버튼을 기억하는가? `function Button({incrementCount}: ButtonType)`, 마찬가지로 `props`를 통해 `incrementCount` 함수를 전달받아 사용했다.

이렇게 ContextAPI를 사용하면 부모 컴포넌트 종속적인 코드를 제거하여 가독성과 성능면에서 다양한 이득을 취할 수 있다. 성능면에서 이득을 취할 수 있다는 말은, Props Drilling 기법을 사용해도 성능 최적화를 위한 Hooks를 사용하면 성능 문제에 대응할 수 있지만, 애초에 대응할 일이 없도록, 또는 대응하기 쉽도록 코드를 짜는 편이 좋다.

처음으로 돌아가서, 다시 `App` 컴포넌트를 보자.

```tsx
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
```

`Provider`로 래핑된 경우와 그렇지 않은 경우가 있다. 이것들은 각각 어떻게 동작할까?

%% 동영상 첨부 %%

`Provider`로 래핑되지 않은 `Display`와 `Button`들은 `Provider`가 제공해주는 컨텍스트를 이용할 수 없고, 당연하게도 `count`와 `incrementCount`에 접근할 수 없다. 이것이 ContextAPI의 또다른 장점이다. Context를 공유할 범위를 명확하게 지정할 수 있다.

만약 위 동영상을 보고 "어? 왜 Provider로 래핑되지 않은 Display와 Button은 동작을 안 하지?"라고 느꼈다면 개발을 이제 막 시작한 코딩 병아리일 수 있다. `Provider`로 Context를 제공받지 않았음에도 `useContext`를 사용해 해당 Context를 사용하려는 실수를 범할 수 있는데, 이는 따로 커스텀 훅을 만들어 대응이 가능하다.

```tsx
export function useCount() {
  const countContext = useContext(CounterContext)
  if (!countContext) {
    throw Error('CounterContext는 Provider로 제공받아서 사용해주세요.')
  }
  return countContext
}
```

그리고 `useContext`를 쓰던 코드를 `useCount`를 쓰도록 바꾸면 된다.

%% 사진 첨부 %%

그러면 위와 같은 에러가 뜬다. 디버깅에 유용하고 잘못된 사용을 줄일 수 있다.

참고로 기본값을 `null`이 아니라 0이나 "어떤값"으로 줬다면 커스텀훅을 만들 때 `if (countContext == 0)`이나 `if (countContext == '어떤값')`으로 기본값을 검사해 `Error`를 `throw`해야한다. 내가 `if (!countContext)`로 적었다고 무작정 그렇게만 적으면 안 된다.