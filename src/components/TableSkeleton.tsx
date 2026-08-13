// components/User/UserList/TableUserSkeleton.tsx
export default function TableSkeleton() {
  return (
    <div className="protected-loading">
      <div className="protected-spinner" />
      <p>
        Memuat data...
      </p>
    </div>
  ); 
} 