import { useState, useEffect } from 'react';
import { formatPrice, getBadgeClass, getBadgeLabel } from './listingUtils';
import API from '../../api';

export default function PropertyDetailModal({ property, onClose }) {
  const [fullProperty, setFullProperty] = useState(null);
  const [mainImg, setMainImg]           = useState('');
  const [loadingImg, setLoadingImg]     = useState(true);

  // Fetch full property (includes image_urls) on open
  useEffect(() => {
    setLoadingImg(true);
    API.get(`/properties/${property._id}`)
      .then(res => {
        setFullProperty(res.data);
        setMainImg(res.data.image_urls?.[0] || '');
      })
      .catch(() => {
        setFullProperty(property);   // fallback to card data
        setMainImg('');
      })
      .finally(() => setLoadingImg(false));
  }, [property._id]);

  const p = fullProperty || property;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box xl prop-modal-box">
        <div className="prop-modal-grid">

          {/* Images */}
          <div className="prop-modal-images">
            {loadingImg ? (
              <div className="prop-modal-img-loading">
                <div className="spin" />
              </div>
            ) : (
              <img
                className="main-img"
                src={mainImg || 'https://placehold.co/800x450?text=No+Image'}
                alt="Property"
              />
            )}
            <div className="prop-modal-thumbs">
              {(fullProperty?.image_urls || []).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Thumbnail ${i + 1}`}
                  className={url === mainImg ? 'active' : ''}
                  onClick={() => setMainImg(url)}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="prop-modal-details">
            <button className="modal-close" onClick={onClose}>✕</button>
            <span className={`badge ${getBadgeClass(p)}`}>{getBadgeLabel(p)}</span>
            <h2 className="modal-prop-title">
              {p.address?.split(',')[0] || p.city}
            </h2>
            <p className="modal-prop-address">{p.address}</p>

            <div className="modal-detail-card">
              <p className="modal-price">
                {p.listing_type === 'Rent / Lease Property'
                  ? `₹${Number(p.price).toLocaleString('en-IN')}/month`
                  : formatPrice(p.price)}
              </p>
              <div className="detail-stats">
                <div>
                  <p className="stat-label">BHK</p>
                  <p className="stat-value">{p.bhk || 'N/A'}</p>
                </div>
                <div>
                  <p className="stat-label">Area</p>
                  <p className="stat-value">{p.area_sqft} sqft</p>
                </div>
                <div className="stat-full-row">
                  <p className="stat-label">Property Type</p>
                  <p className="stat-value">{p.property_type}</p>
                </div>
              </div>
              <a className="call-btn" href={`tel:${p.contact_number}`}>
                Call: {p.contact_number}
              </a>
            </div>

            <hr className="modal-divider" />
            <h3 className="modal-desc-title">Description</h3>
            <p className="modal-desc-text">
              {p.description || 'No description provided.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
