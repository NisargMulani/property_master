const PROPERTY_TYPES = [
  'Residential House', 'Residential Plot/Land',
  'Commercial Office', 'Commercial Shop', 'Commercial Land', 'Other',
];

export default function PropertyListingForm({ fields, setters, onSubmit, loading, loadingStep, error, onLoginRequired }) {
  const {
    listingType, propertyType, city, state, address,
    area, bhk, price, description, contactNumber,
    isNewLaunch, imagePreviews,
  } = fields;

  const {
    setListingType, setPropertyType, setCity, setState, setAddress,
    setArea, setBhk, setPrice, setDescription, setContactNumber,
    setIsNewLaunch, handleImageChange,
  } = setters;

  return (
    <div className="sell-form-wrapper">
      <h2>List Your Property</h2>

      {/* Auth warning */}
      {onLoginRequired && (
        <div className="auth-warning">
          <p>
            You need to be logged in to list a property.&nbsp;
            <button className="auth-warning-link" onClick={onLoginRequired}>
              Login / Sign Up
            </button>
          </p>
        </div>
      )}

      <form onSubmit={onSubmit}>

        {/* Listing Type */}
        <div className="form-group">
          <label className="label-heading">Listing Type</label>
          <div className="form-group-inline">
            {['Sell Property', 'Rent / Lease Property'].map(type => (
              <label key={type} className="radio-label">
                <input
                  type="radio"
                  name="listingType"
                  value={type}
                  checked={listingType === type}
                  onChange={e => setListingType(e.target.value)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="form-group">
          <label>Property Type</label>
          <select value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
            <option value="">Select Property Type</option>
            {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* City & State */}
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" value={state} onChange={e => setState(e.target.value)} required />
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Full Address</label>
          <textarea rows="3" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>

        {/* Area, BHK, Price */}
        <div className="form-row-3">
          <div className="form-group">
            <label>Area (sqft)</label>
            <input type="number" value={area} onChange={e => setArea(e.target.value)} required min="1" />
          </div>
          <div className="form-group">
            <label>BHK (Optional)</label>
            <input type="number" value={bhk} onChange={e => setBhk(e.target.value)} min="0" />
          </div>
          <div className="form-group">
            <label>Expected Price / Rent (₹)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="1" />
          </div>
        </div>

        {/* New Launch */}
        <div className="form-group">
          <label className="checkbox-label">
            <span className="checkbox-label-text">This is a new launch</span>
            <input type="checkbox" checked={isNewLaunch} onChange={e => setIsNewLaunch(e.target.checked)} />
          </label>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        {/* Contact */}
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={e => setContactNumber(e.target.value)}
            required
            pattern="[0-9]{10}"
            title="Please enter a 10-digit phone number"
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Upload Property Images</label>
          <label htmlFor="propertyImages" className="file-upload-label">
            Click or Drag &amp; Drop to Upload Images
          </label>
          <input id="propertyImages" type="file" accept="image/*" multiple onChange={handleImageChange} />
          {imagePreviews.length > 0 && (
            <div className="image-preview-grid">
              {imagePreviews.map((src, i) => <img key={i} src={src} alt={`preview ${i + 1}`} />)}
            </div>
          )}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn-orange btn-full submit-btn" disabled={loading}>
          {loading ? loadingStep || 'Processing...' : 'List Property Now'}
        </button>

      </form>
    </div>
  );
}
