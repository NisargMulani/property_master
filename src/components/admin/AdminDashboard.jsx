export default function AdminDashboard({ stats, user, onNavigate }) {
  const statCards = [
    { label: 'Total Users',      value: stats?.totalUsers      ?? '—', color: '#040459', sub: `+${stats?.newUsers      ?? 0} this week` },
    { label: 'Total Properties', value: stats?.totalProperties ?? '—', color: '#FF7142', sub: `+${stats?.newProperties ?? 0} this week` },
    { label: 'Admin Accounts',   value: stats?.admins          ?? '—', color: '#7c3aed', sub: 'with admin role' },
    { label: 'New This Week',    value: (stats?.newUsers ?? 0) + (stats?.newProperties ?? 0), color: '#059669', sub: 'users + listings' },
  ];

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard</h2>
          <p className="admin-page-desc">Welcome back, {user?.name || 'Admin'}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-stat-grid">
        {statCards.map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--accent': s.color }}>
            <div className="admin-stat-body">
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
              <p className="admin-stat-sub">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="admin-dash-actions">
        <div className="admin-quick-card" onClick={() => onNavigate('users')}>
          <div className="admin-quick-icon admin-quick-icon--blue">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3>Manage Users</h3>
            <p>View, promote, or remove user accounts</p>
          </div>
          <svg className="admin-quick-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="admin-quick-card" onClick={() => onNavigate('properties')}>
          <div className="admin-quick-icon admin-quick-icon--orange">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3>Manage Properties</h3>
            <p>Review, feature, or delete listings</p>
          </div>
          <svg className="admin-quick-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
