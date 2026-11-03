// Exercise 05 – Lists, keys & conditional rendering
import { fruits } from './data'

export default function FruitList() {
  // TODO: state for search text, category ('all' | Fruit['category']), inStockOnly, sort direction

  // TODO: derive `visible` from `fruits` + the filters above (no extra state for it!)
  //       Remember: don't .sort() the original array — copy it first or use .toSorted()
  const visible = fruits

  return (
    <div>
      {/* TODO: <label> Search <input/> */}
      {/* TODO: <label> Category <select/> with all / berry / citrus / tropical */}
      {/* TODO: <label> <input type="checkbox"/> In stock only */}
      {/* TODO: sort toggle button "Sort A→Z" / "Sort Z→A" */}

      <p>
        Showing {visible.length} of {fruits.length}
      </p>

      {/* TODO: render <p>No fruits match</p> when `visible` is empty, otherwise the list */}
      <ul>{/* TODO: map `visible` to <li key={...}>name (+ " (out of stock)")</li> */}</ul>
    </div>
  )
}
