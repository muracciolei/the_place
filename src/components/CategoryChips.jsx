import { CATEGORIES } from '../data/categories'

export default function CategoryChips({ activeId, onChange }) {
  return (
    <div className="category-chips" role="group" aria-label="Categorías de lugares">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`chip${activeId === category.id ? ' is-active' : ''}`}
          aria-pressed={activeId === category.id}
          onClick={() => onChange(category.id)}
        >
          <span aria-hidden="true">{category.emoji}</span> {category.label}
        </button>
      ))}
    </div>
  )
}
