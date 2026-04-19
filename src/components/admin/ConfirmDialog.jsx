export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="admin-confirm-box">
        <div className="admin-confirm-icon">⚠️</div>
        <p className="admin-confirm-msg">{message}</p>
        <div className="admin-confirm-actions">
          <button className="admin-btn-sm admin-btn-outline" onClick={onCancel}>Cancel</button>
          <button className="admin-btn-sm admin-btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
