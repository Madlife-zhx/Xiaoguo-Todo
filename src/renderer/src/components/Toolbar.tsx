import type { SortMode } from '../../../shared/task'

interface ToolbarProps {
  search: string
  sortMode: SortMode
  searchRef: React.RefObject<HTMLInputElement | null>
  onSearchChange(value: string): void
  onSortChange(value: SortMode): void
}

export function Toolbar({ search, sortMode, searchRef, onSearchChange, onSortChange }: ToolbarProps): React.JSX.Element {
  return (
    <div className="toolbar" aria-label="搜索与排序">
      <label className="search-box">
        <span className="search-box__icon" aria-hidden="true">⌕</span>
        <span className="sr-only">搜索任务</span>
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜索任务标题或描述…"
        />
        {search && <button type="button" onClick={() => onSearchChange('')} aria-label="清空搜索">×</button>}
        <kbd>Ctrl F</kbd>
      </label>
      <label className="sort-control">
        <span>排序方式</span>
        <select value={sortMode} onChange={(event) => onSortChange(event.target.value as SortMode)}>
          <option value="due_asc">日期：最早优先</option>
          <option value="due_desc">日期：最晚优先</option>
          <option value="status">按状态排序</option>
        </select>
      </label>
    </div>
  )
}
