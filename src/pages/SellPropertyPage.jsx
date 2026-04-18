import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';
import API from '../api';

// Convert a File to a compressed Base64 JPEG data URI (max 1024px, 85% quality)
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
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export default function SellPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const [listingType, setListingType] = useState('Sell Property');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [bhk, setBhk] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isNewLaunch, setIsNewLaunch] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    if (images.length === 0) { setError('Please select at least one image.'); return; }

    setLoading(true);
    setLoadingStep('Compressing images...');
    setError('');
    try {
      // Compress + convert all images to Base64 data URIs
      const base64Images = await Promise.all(images.map(fileToBase64));

      setLoadingStep('Saving to database...');
      // Single API call — images stored directly in MongoDB
      await API.post('/properties', {
        listing_type: listingType,
        property_type: propertyType,
        city, state, address,
        area_sqft: parseFloat(area),
        bhk: bhk ? parseInt(bhk) : null,
        price: parseFloat(price),
        description,
        contact_number: contactNumber,
        image_urls: base64Images,   // Compressed Base64 data URIs stored in MongoDB
        is_new_launch: isNewLaunch,
      });

      alert('Property listed successfully! Redirecting to home...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  }


  return (
    <div>
      <Navbar />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <main className="page-content">
        <div className="sell-form-wrapper">
          <h2>List Your Property</h2>

          {/* Auth warning */}
          {!user && (
            <div className="auth-warning">
              <p>
                You need to be logged in to list a property.&nbsp;
                <button className="auth-warning-link" onClick={() => setShowLogin(true)}>
                  Login / Sign Up
                </button>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Listing Type */}
            <div className="form-group">
              <label className="label-heading">Listing Type</label>
              <div className="form-group-inline">
                <label className="radio-label">
                  <input type="radio" name="listingType" value="Sell Property" checked={listingType === 'Sell Property'} onChange={e => setListingType(e.target.value)} />
                  Sell Property
                </label>
                <label className="radio-label">
                  <input type="radio" name="listingType" value="Rent / Lease Property" checked={listingType === 'Rent / Lease Property'} onChange={e => setListingType(e.target.value)} />
                  Rent / Lease Property
                </label>
              </div>
            </div>

            {/* Property Type */}
            <div className="form-group">
              <label>Property Type</label>
              <select value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
                <option value="">Select Property Type</option>
                <option>Residential House</option>
                <option>Residential Plot/Land</option>
                <option>Commercial Office</option>
                <option>Commercial Shop</option>
                <option>Commercial Land</option>
                <option>Other</option>
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
                <input type="checkbox" checked={isNewLaunch} onChange={e => setIsNewLaunch(e.target.checked)} />
                <span className="checkbox-label-text">This is a new launch</span>
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
              <input type="tel" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required pattern="[0-9]{10}" title="Please enter a 10-digit phone number" />
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
      </main>

      <Footer />
    </div>
  );
}
