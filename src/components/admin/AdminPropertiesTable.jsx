import { formatDate, formatCurrency } from './adminUtils';

export default function AdminPropertiesTable({ properties, loading, search, onSearchChange, onToggleNewLaunch, onDelete }) {
  const filtered = properties.filter(p =>
    (p.city         || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.address      || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.listing_type || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Properties</h2>
          <p className="admin-page-desc">{properties.length} total listings</p>
        </div>
        <input
          className="admin-search"
          placeholder="Search properties..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading"><span className="spin" /><p>Loading properties...</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th><th>Type</th><th>Price</th>
                <th>Location</th><th>New Launch</th><th>Listed</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="admin-table-empty">No properties found.</td></tr>
              ) : filtered.map(p => (
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
                  <td><span className="admin-badge admin-badge--type">{p.property_type || '—'}</span></td>
                  <td className="admin-td-price">{formatCurrency(p.price)}</td>
                  <td className="admin-td-muted">{p.city}{p.state ? `, ${p.state}` : ''}</td>
                  <td>
                    <button
                      className={`admin-toggle ${p.is_new_launch ? 'admin-toggle--on' : 'admin-toggle--off'}`}
                      onClick={() => onToggleNewLaunch(p)}
                      title="Toggle New Launch"
                    >
                      {p.is_new_launch ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="admin-td-muted">{formatDate(p.createdAt)}</td>
                  <td>
                    <button
                      className="admin-btn-sm admin-btn-danger"
                      onClick={() => onDelete(p)}
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
  );
}
