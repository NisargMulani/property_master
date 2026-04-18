import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(val) {
  const n = Number(val);
  if (isNaN(n)) return '₹ 0';
  if (n >= 10000000) return '₹ ' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹ ' + (n / 100000).toFixed(2) + ' L';
  return '₹ ' + n.toLocaleString('en-IN');
}

const token = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

export default function AdminPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats
  const [stats, setStats] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Properties
  const [properties, setProperties] = useState([]);
  const [propsLoading, setPropsLoading] = useState(false);
  const [propSearch, setPropSearch] = useState('');

  // Confirm dialog
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  // Redirect non-admins
  useEffect(() => {
    if (!user) { navigate('/'); return; }
    if (!isAdmin) { navigate('/'); }
  }, [user, isAdmin]);

  // Load stats
  useEffect(() => {
    API.get('/admin/stats', authHeader())
      .then(r => setStats(r.data))
      .catch(() => { });
  }, []);

  // Load users
  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    API.get('/admin/users', authHeader())
      .then(r => setUsers(r.data))
      .catch(() => { })
      .finally(() => setUsersLoading(false));
  }, []);

  // Load properties
  const loadProperties = useCallback(() => {
    setPropsLoading(true);
    API.get('/admin/properties', authHeader())
      .then(r => setProperties(r.data))
      .catch(() => { })
      .finally(() => setPropsLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'properties') loadProperties();
  }, [activeTab]);

  // User actions
  async function toggleRole(u) {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    await API.patch(`/admin/users/${u._id}`, { role: newRole }, authHeader());
    loadUsers();
  }

  async function deleteUser(id) {
    await API.delete(`/admin/users/${id}`, authHeader());
    loadUsers();
    setConfirm(null);
  }

  // Property actions
  async function toggleNewLaunch(p) {
    await API.patch(`/admin/properties/${p._id}`, { is_new_launch: !p.is_new_launch }, authHeader());
    loadProperties();
  }

  async function deleteProperty(id) {
    await API.delete(`/admin/properties/${id}`, authHeader());
    loadProperties();
    setConfirm(null);
  }

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProps = properties.filter(p =>
    (p.city || '').toLowerCase().includes(propSearch.toLowerCase()) ||
    (p.address || '').toLowerCase().includes(propSearch.toLowerCase()) ||
    (p.listing_type || '').toLowerCase().includes(propSearch.toLowerCase())
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'users', label: 'Users', icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { id: 'properties', label: 'Properties', icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
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
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <span className="admin-sidebar-avatar">{(user?.name || user?.email || 'A').slice(0, 2).toUpperCase()}</span>
            <div>
              <p className="admin-sidebar-user-name">{user?.name || 'Admin'}</p>
              <p className="admin-sidebar-user-email">{user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Link to="/" className="admin-btn-ghost admin-btn-sm">← Site</Link>
            <button className="admin-btn-ghost admin-btn-sm" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <div className="admin-section">
            <div className="admin-page-header">
              <h2 className="admin-page-title">Dashboard</h2>
              <p className="admin-page-desc">Welcome back, {user?.name || 'Admin'}</p>
            </div>

            <div className="admin-stat-grid">
              {[
                { label: 'Total Users', value: stats?.totalUsers ?? '—', color: '#040459', sub: `+${stats?.newUsers ?? 0} this week` },
                { label: 'Total Properties', value: stats?.totalProperties ?? '—', color: '#FF7142', sub: `+${stats?.newProperties ?? 0} this week` },
                { label: 'Admin Accounts', value: stats?.admins ?? '—', color: '#7c3aed', sub: 'with admin role' },
                { label: 'New This Week', value: (stats?.newUsers ?? 0) + (stats?.newProperties ?? 0), color: '#059669', sub: 'users + listings' },
              ].map(s => (
                <div key={s.label} className="admin-stat-card" style={{ '--accent': s.color }}>
                  <div className="admin-stat-icon">{s.icon}</div>
                  <div className="admin-stat-body">
                    <p className="admin-stat-label">{s.label}</p>
                    <p className="admin-stat-value">{s.value}</p>
                    <p className="admin-stat-sub">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-dash-actions">
              <div className="admin-quick-card" onClick={() => setActiveTab('users')}>
                <div className="admin-quick-icon admin-quick-icon--blue">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <h3>Manage Users</h3>
                  <p>View, promote, or remove user accounts</p>
                </div>
                <svg className="admin-quick-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
              <div className="admin-quick-card" onClick={() => setActiveTab('properties')}>
                <div className="admin-quick-icon admin-quick-icon--orange">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <h3>Manage Properties</h3>
                  <p>Review, feature, or delete listings</p>
                </div>
                <svg className="admin-quick-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <h2 className="admin-page-title">Users</h2>
                <p className="admin-page-desc">{users.length} registered accounts</p>
              </div>
              <input
                className="admin-search"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
            </div>

            {usersLoading ? (
              <div className="admin-loading"><span className="spin" /><p>Loading users...</p></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="admin-table-empty">No users found.</td></tr>
                    ) : filteredUsers.map(u => (
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
                              onClick={() => setConfirm({
                                message: `${u.role === 'admin' ? 'Demote' : 'Promote'} "${u.name || u.email}"?`,
                                onConfirm: () => toggleRole(u),
                              })}
                              title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            >
                              {u.role === 'admin' ? '↓ Demote' : '↑ Promote'}
                            </button>
                            <button
                              className="admin-btn-sm admin-btn-danger"
                              onClick={() => setConfirm({
                                message: `Delete user "${u.name || u.email}"? This cannot be undone.`,
                                onConfirm: () => deleteUser(u._id),
                              })}
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
        )}

        {/* ── PROPERTIES ── */}
        {activeTab === 'properties' && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <h2 className="admin-page-title">Properties</h2>
                <p className="admin-page-desc">{properties.length} total listings</p>
              </div>
              <input
                className="admin-search"
                placeholder="Search properties..."
                value={propSearch}
                onChange={e => setPropSearch(e.target.value)}
              />
            </div>

            {propsLoading ? (
              <div className="admin-loading"><span className="spin" /><p>Loading properties...</p></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Location</th>
                      <th>New Launch</th>
                      <th>Listed</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProps.length === 0 ? (
                      <tr><td colSpan={7} className="admin-table-empty">No properties found.</td></tr>
                    ) : filteredProps.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="admin-prop-cell">
                            {p.image_urls?.[0] ? (
                              <img src={p.image_urls[0]} alt="" className="admin-prop-thumb" />
                            ) : (
                              <div className="admin-prop-thumb admin-prop-thumb--placeholder">🏠</div>
                            )}
                            <span className="admin-prop-name">
                              {p.address ? p.address.slice(0, 30) + (p.address.length > 30 ? '…' : '') : '—'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-badge admin-badge--type">{p.property_type || '—'}</span>
                        </td>
                        <td className="admin-td-price">{formatCurrency(p.price)}</td>
                        <td className="admin-td-muted">{p.city}{p.state ? `, ${p.state}` : ''}</td>
                        <td>
                          <button
                            className={`admin-toggle ${p.is_new_launch ? 'admin-toggle--on' : 'admin-toggle--off'}`}
                            onClick={() => toggleNewLaunch(p)}
                            title="Toggle New Launch"
                          >
                            {p.is_new_launch ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td className="admin-td-muted">{formatDate(p.createdAt)}</td>
                        <td>
                          <button
                            className="admin-btn-sm admin-btn-danger"
                            onClick={() => setConfirm({
                              message: `Delete this property at "${p.city}"? This cannot be undone.`,
                              onConfirm: () => deleteProperty(p._id),
                            })}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirm Dialog */}
      {confirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setConfirm(null)}>
          <div className="admin-confirm-box">
            <div className="admin-confirm-icon">⚠️</div>
            <p className="admin-confirm-msg">{confirm.message}</p>
            <div className="admin-confirm-actions">
              <button className="admin-btn-sm admin-btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="admin-btn-sm admin-btn-danger" onClick={confirm.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
