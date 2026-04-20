import { useState } from 'react';
import API from '../../api';

const PROPERTY_TYPES = [
  'Residential House', 'Residential Plot/Land',
  'Commercial Office', 'Commercial Shop', 'Commercial Land', 'Other',
];

// Compress a File → Base64 JPEG data URI (max 1024px, 85% quality)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export default function UpdatePropertyModal({ property, onClose, onUpdated }) {
  const p = property;

  // Pre-fill all fields from the existing property
  const [listingType,    setListingType   ] = useState(p.listing_type    || 'Sell Property');
  const [propertyType,   setPropertyType  ] = useState(p.property_type   || '');
  const [city,           setCity          ] = useState(p.city            || '');
  const [state,          setState         ] = useState(p.state           || '');
  const [address,        setAddress       ] = useState(p.address         || '');
  const [area,           setArea          ] = useState(p.area_sqft       || '');
  const [bhk,            setBhk           ] = useState(p.bhk             || '');
  const [price,          setPrice         ] = useState(p.price           || '');
  const [description,    setDescription   ] = useState(p.description     || '');
  const [contactNumber,  setContactNumber ] = useState(p.contact_number  || '');
  const [isNewLaunch,    setIsNewLaunch   ] = useState(p.is_new_launch   || false);

  // Images: start with existing; new files override
  const [newImageFiles,    setNewImageFiles   ] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const existingImages = p.image_urls || [];

  const [loading,     setLoading    ] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error,       setError      ] = useState('');

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setNewImageFiles(files);
    setNewImagePreviews(files.map(f => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setLoadingStep('Saving changes...');
    setError('');

    try {
      let imagePayload = undefined; // undefined = keep existing on server

      if (newImageFiles.length > 0) {
        setLoadingStep('Compressing new images...');
        imagePayload = await Promise.all(newImageFiles.map(fileToBase64));
        setLoadingStep('Saving changes...');
      }

      await API.put(`/properties/${p._id}`, {
        listing_type:   listingType,
        property_type:  propertyType,
        city, state, address,
        area_sqft:      parseFloat(area),
        bhk:            bhk ? parseInt(bhk) : null,
        price:          parseFloat(price),
        description,
        contact_number: contactNumber,
        is_new_launch:  isNewLaunch,
        ...(imagePayload ? { image_urls: imagePayload } : {}),
      });

      onUpdated();   // tell parent to re-fetch & close modal
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  }

  const previewImages = newImagePreviews.length > 0 ? newImagePreviews : existingImages;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box wide update-prop-modal">

        <button className="modal-close" onClick={onClose} title="Close">✕</button>
        <h2 className="modal-title">Update Property</h2>

        <form onSubmit={handleSubmit}>

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
            <textarea rows="2" value={address} onChange={e => setAddress(e.target.value)} required />
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
            <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} />
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
            <label>
              Property Images&nbsp;
              <span className="update-img-hint">(leave blank to keep existing)</span>
            </label>
            <label htmlFor="updatePropertyImages" className="file-upload-label">
              Click or Drag &amp; Drop to Replace Images
            </label>
            <input
              id="updatePropertyImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {previewImages.length > 0 && (
              <div className="image-preview-grid">
                {previewImages.map((src, i) => (
                  <img key={i} src={src} alt={`preview ${i + 1}`} />
                ))}
              </div>
            )}
            {newImagePreviews.length > 0 && (
              <p className="update-img-replace-note">✓ {newImagePreviews.length} new image(s) will replace existing ones</p>
            )}
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="update-modal-actions">
            <button type="button" className="btn-orange-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-orange" disabled={loading}>
              {loading ? loadingStep || 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
