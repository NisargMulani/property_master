import { formatPrice } from './listingUtils';

export default function PropertyCard({ property, onViewDetails, isMyListing, onEdit }) {
  const p = property;
  const img = p.image_urls?.[0] || 'https://placehold.co/600x400/040459/FF7142?text=Property+Master';
  const name = p.address ? p.address.split(',')[0].trim() : p.city;
  const title = `${p.property_type}${p.bhk ? ` (${p.bhk} BHK)` : ''} in ${name}`;
  const price = p.listing_type === 'Rent / Lease Property'
    ? `₹${Number(p.price).toLocaleString('en-IN')}/month`
    : formatPrice(p.price);

  return (
    <div className="property-card">
      <img src={img} alt={title} />
      <div className="property-card-body">
        <p className="location">{p.city}, {p.state}</p>
        <p className="title" title={title}>{title}</p>
        <div className="price-area">
          <span>{price}</span>
          <span className="sep">|</span>
          <span>{Number(p.area_sqft).toLocaleString('en-IN')} sqft</span>
        </div>
        <button
          className="btn-orange btn-full view-details-btn"
          onClick={() => onViewDetails(p)}
        >
          View Details
        </button>
        {isMyListing && (
          <button
            className="btn-orange-outline btn-full edit-listing-btn"
            onClick={() => onEdit(p)}
          >
            Edit Listing
          </button>
        )}
      </div>
    </div>
  );
}

