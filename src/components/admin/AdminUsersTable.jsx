import { formatDate } from './adminUtils';

export default function AdminUsersTable({ users, loading, search, onSearchChange, onToggleRole, onDelete }) {
  const filtered = users.filter(u =>
    (u.name  || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Users</h2>
          <p className="admin-page-desc">{users.length} registered accounts</p>
        </div>
        <input
          className="admin-search"
          placeholder="Search users..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading"><span className="spin" /><p>Loading users...</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="admin-table-empty">No users found.</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-user-avatar">{(u.name || u.email || 'U').slice(0, 2).toUpperCase()}</span>
                      <span className="admin-user-name">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="admin-td-muted">{u.email}</td>
                  <td>
                    <span className={`admin-badge ${u.role === 'admin' ? 'admin-badge--admin' : 'admin-badge--user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="admin-td-muted">{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="admin-action-row">
                      <button
                        className={`admin-btn-sm ${u.role === 'admin' ? 'admin-btn-outline' : 'admin-btn-primary'}`}
                        onClick={() => onToggleRole(u)}
                        title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      >
                        {u.role === 'admin' ? '↓ Demote' : '↑ Promote'}
                      </button>
                      <button
                        className="admin-btn-sm admin-btn-danger"
                        onClick={() => onDelete(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
