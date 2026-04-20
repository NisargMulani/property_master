import PropertyCard from './PropertyCard';

export default function PropertyGrid({ properties, loading, error, onViewDetails, isMyListing, onEdit }) {
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spin" />
        <p className="loading-text">Loading Properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-results">
        <h3 className="error-heading">Error Loading Properties</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="no-results">
        <h3>No Properties Found</h3>
        <p>We couldn't find any properties matching your search. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid-3">
      {properties.map(p => (
        <PropertyCard
          key={p._id}
          property={p}
          onViewDetails={onViewDetails}
          isMyListing={isMyListing}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

