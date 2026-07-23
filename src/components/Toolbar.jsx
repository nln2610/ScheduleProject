import { CATEGORIES } from '../i18n'

// Ô tìm kiếm + bộ lọc danh mục + nút thêm sự kiện.
export default function Toolbar({
  t,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onAdd,
}) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="search-input"
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="category-select"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">{t.allCategories}</option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {t[c.labelKey]}
          </option>
        ))}
      </select>
      <button className="btn btn-primary" onClick={onAdd}>
        + {t.addEvent}
      </button>
    </div>
  )
}
