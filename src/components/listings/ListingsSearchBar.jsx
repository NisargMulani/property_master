export default function ListingsSearchBar({ value, onChange, onSearch }) {
  return (
    <div className="listing-search-row">
      <input
        type="text"
        className="listing-search-input"
        placeholder="Search by location (e.g., 'Vadodara')"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
      />
      <button className="btn-orange" onClick={onSearch}>Search</button>
    </div>
  );
}
