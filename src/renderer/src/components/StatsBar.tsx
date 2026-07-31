interface StatsBarProps {
  total: number
  active: number
  overdue: number
  completed: number
}

export function StatsBar({ total, active, overdue, completed }: StatsBarProps): React.JSX.Element {
  const stats = [
    { label: '全部任务', value: total, tone: 'blue', icon: '▦' },
    { label: '待处理', value: active, tone: 'cyan', icon: '◷' },
    { label: '已逾期', value: overdue, tone: 'red', icon: '!' },
    { label: '已完成', value: completed, tone: 'green', icon: '✓' }
  ]

  return (
    <section className="stats" aria-label="任务统计">
      {stats.map((stat) => (
        <div className={`stat-card stat-card--${stat.tone}`} key={stat.label}>
          <span className="stat-card__icon" aria-hidden="true">{stat.icon}</span>
          <span><strong>{stat.value}</strong><small>{stat.label}</small></span>
        </div>
      ))}
    </section>
  )
}
