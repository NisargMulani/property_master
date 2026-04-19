import { useState, useEffect, useCallback } from 'react';
import { useNavigate }          from 'react-router-dom';
import { useAuth }              from '../context/AuthContext';
import AdminSidebar             from '../components/admin/AdminSidebar';
import AdminDashboard           from '../components/admin/AdminDashboard';
import AdminUsersTable          from '../components/admin/AdminUsersTable';
import AdminPropertiesTable     from '../components/admin/AdminPropertiesTable';
import ConfirmDialog            from '../components/admin/ConfirmDialog';
import { authHeader }           from '../components/admin/adminUtils';
import API from '../api';

export default function AdminPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data
  const [stats,      setStats     ] = useState(null);
  const [users,      setUsers     ] = useState([]);
  const [properties, setProperties] = useState([]);

  // UI
  const [usersLoading, setUsersLoading] = useState(false);
  const [propsLoading, setPropsLoading] = useState(false);
  const [userSearch,   setUserSearch  ] = useState('');
  const [propSearch,   setPropSearch  ] = useState('');
  const [confirm,      setConfirm     ] = useState(null); // { message, onConfirm }

  // Guard
  useEffect(() => {
    if (!user || !isAdmin) navigate('/');
  }, [user, isAdmin]);

  // Load stats once
  useEffect(() => {
    API.get('/admin/stats', authHeader())
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    API.get('/admin/users', authHeader())
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, []);

  const loadProperties = useCallback(() => {
    setPropsLoading(true);
    API.get('/admin/properties', authHeader())
      .then(r => setProperties(r.data))
      .catch(() => {})
      .finally(() => setPropsLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'users')      loadUsers();
    if (activeTab === 'properties') loadProperties();
  }, [activeTab]);

  // ── User actions ─────────────────────────────────────────
  async function toggleRole(u) {
    await API.patch(`/admin/users/${u._id}`, { role: u.role === 'admin' ? 'user' : 'admin' }, authHeader());
    loadUsers();
  }

  async function deleteUser(u) {
    setConfirm({
      message: `Delete user "${u.name || u.email}"? This cannot be undone.`,
      onConfirm: async () => {
        await API.delete(`/admin/users/${u._id}`, authHeader());
        loadUsers();
        setConfirm(null);
      },
    });
  }

  function handleToggleRole(u) {
    setConfirm({
      message: `${u.role === 'admin' ? 'Demote' : 'Promote'} "${u.name || u.email}"?`,
      onConfirm: () => { toggleRole(u); setConfirm(null); },
    });
  }

  // ── Property actions ──────────────────────────────────────
  async function toggleNewLaunch(p) {
    await API.patch(`/admin/properties/${p._id}`, { is_new_launch: !p.is_new_launch }, authHeader());
    loadProperties();
  }

  function handleDeleteProperty(p) {
    setConfirm({
      message: `Delete property at "${p.city}"? This cannot be undone.`,
      onConfirm: async () => {
        await API.delete(`/admin/properties/${p._id}`, authHeader());
        loadProperties();
        setConfirm(null);
      },
    });
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={() => { logout(); navigate('/'); }}
      />

      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <AdminDashboard stats={stats} user={user} onNavigate={setActiveTab} />
        )}
        {activeTab === 'users' && (
          <AdminUsersTable
            users={users}
            loading={usersLoading}
            search={userSearch}
            onSearchChange={setUserSearch}
            onToggleRole={handleToggleRole}
            onDelete={deleteUser}
          />
        )}
        {activeTab === 'properties' && (
          <AdminPropertiesTable
            properties={properties}
            loading={propsLoading}
            search={propSearch}
            onSearchChange={setPropSearch}
            onToggleNewLaunch={toggleNewLaunch}
            onDelete={handleDeleteProperty}
          />
        )}
      </main>

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
