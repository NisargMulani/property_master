import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar               from '../components/Navbar';
import Footer               from '../components/Footer';
import LoginModal           from '../components/LoginModal';
import ListingsSearchBar    from '../components/listings/ListingsSearchBar';
import PropertyGrid         from '../components/listings/PropertyGrid';
import PropertyDetailModal  from '../components/listings/PropertyDetailModal';
import API from '../api';

function buildResultLabel(listingType, propertyGroup, search, category) {
  const parts = [];
  if (listingType === 'Sell Property')         parts.push('For Sale');
  if (listingType === 'Rent / Lease Property') parts.push('For Rent');
  if (propertyGroup) parts.push(propertyGroup);
  if (search)        parts.push(`in "${search}"`);
  if (category)      parts.push(category);
  return parts.length ? `Showing results for ${parts.join(' ')}` : 'Showing all properties';
}

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties,       setProperties      ] = useState([]);
  const [loading,          setLoading         ] = useState(true);
  const [error,            setError           ] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showLogin,        setShowLogin       ] = useState(false);
  const [headerSearch,     setHeaderSearch    ] = useState(searchParams.get('search') || '');

  const listingType   = searchParams.get('listing_type');
  const propertyGroup = searchParams.get('property_group');
  const search        = searchParams.get('search');
  const category      = searchParams.get('category');

  // Fetch properties on filter change
  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (listingType)   params.listing_type   = listingType;
    if (propertyGroup) params.property_group = propertyGroup;
    if (search)        params.search         = search;
    if (category) {
      const c = category.toLowerCase();
      if (c === 'buy')                        params.listing_type   = 'Sell Property';
      else if (c === 'rent')                  params.listing_type   = 'Rent / Lease Property';
      else if (c === 'new launch' || c === 'projects') params.is_new_launch = true;
      else if (c === 'commercial')            params.property_group = 'commercial';
      else if (c === 'plot/lands')            params.property_group = 'plot/land';
    }
    API.get('/properties', { params })
      .then(res => { setProperties(res.data); setLoading(false); })
      .catch(err => { setError(err.response?.data?.message || 'Failed to load properties.'); setLoading(false); });
  }, [listingType, propertyGroup, search, category]);

  function handleHeaderSearch() {
    const newParams = new URLSearchParams(searchParams);
    if (headerSearch.trim()) newParams.set('search', headerSearch.trim());
    else newParams.delete('search');
    setSearchParams(newParams);
  }

  return (
    <div>
      <Navbar showSearch />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <main className="page-content">
        <ListingsSearchBar
          value={headerSearch}
          onChange={setHeaderSearch}
          onSearch={handleHeaderSearch}
        />

        <div className="search-results-header">
          <h3>Search Results</h3>
          <p>{buildResultLabel(listingType, propertyGroup, search, category)}</p>
        </div>

        <PropertyGrid
          properties={properties}
          loading={loading}
          error={error}
          onViewDetails={setSelectedProperty}
        />
      </main>

      <Footer />

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
