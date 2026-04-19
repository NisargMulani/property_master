import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    id: 'users', label: 'Users',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    id: 'properties', label: 'Properties',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
];

export default function AdminSidebar({ activeTab, onTabChange, user, onLogout }) {
  const initials = (user?.name || user?.email || 'A').slice(0, 2).toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <Link to="/" className="admin-sidebar-logo">
          <img src="/Images/logo1.png" alt="PM Logo" />
          <div>
            <span className="admin-sidebar-title">Property Master</span>
            <span className="admin-sidebar-subtitle">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="admin-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`admin-nav-item${activeTab === item.id ? ' active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <span className="admin-sidebar-avatar">{initials}</span>
          <div>
            <p className="admin-sidebar-user-name">{user?.name || 'Admin'}</p>
            <p className="admin-sidebar-user-email">{user?.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Link to="/" className="admin-btn-ghost admin-btn-sm">← Site</Link>
          <button className="admin-btn-ghost admin-btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </aside>
  );
}
