// Exercise 16 – the work for this exercise is in Exercise.test.tsx!
// This page just shows the components you are testing.
import TodoApp from '../06-lifting-state/Solution'
import { useCounter } from './useCounter'
import { UserCard } from './UserCard'

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter({ min: 0, max: 5 })
  return (
    <p>
      <button onClick={decrement}>−</button> {count} <button onClick={increment}>+</button>{' '}
      <button onClick={reset}>reset</button> <small>(min 0, max 5)</small>
    </p>
  )
}

export default function TestingPlayground() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <p>
        Open <code>src/exercises/16-testing/Exercise.test.tsx</code> and write the tests. These are
        the components under test:
      </p>
      <TodoApp />
      <CounterDemo />
      <UserCard key="gaearon" username="gaearon" />
    </div>
  )
}
