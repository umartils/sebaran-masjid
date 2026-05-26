interface StatCardProps {
  value: number;
  label: string;
  variant?: string;
}

export function StatCard({
  value,
  label,
  variant,
}: StatCardProps) {
  return (
    <div className={`stat-card ${variant ?? ""}`}>
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}