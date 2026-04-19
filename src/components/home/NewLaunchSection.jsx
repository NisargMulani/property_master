import { Link } from 'react-router-dom';

function formatCurrency(val) {
  const n = Number(val);
  if (isNaN(n)) return '₹ 0';
  if (n >= 10000000) return '₹ ' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000)   return '₹ ' + (n / 100000).toFixed(2) + ' L';
  return '₹ ' + n.toLocaleString('en-IN');
}

export default function NewLaunchSection({ launches }) {
  return (
    <div className="orange-section">
      <h2>NEW LAUNCHED PROJECTS</h2>
      <div className="slider-container">
        {launches.length === 0 ? (
          <p className="no-launch-msg">No new launched projects at this time.</p>
        ) : (
          launches.map(p => {
            const img  = p.image_urls?.[0] || 'https://placehold.co/96x96/fed7aa/f97316?text=Proj';
            const name = p.address ? p.address.split(',')[0].trim() : 'Project';
            return (
              <div key={p._id} className="new-launch-card">
                <img src={img} alt={name} />
                <div>
                  <h4>{name}</h4>
                  <p>{p.city}, {p.state}</p>
                  <p className="price-bhk">{formatCurrency(p.price)} | {p.bhk || 'N/A'} BHK</p>
                  <Link to="/listings">View Details</Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
