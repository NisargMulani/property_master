import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import PropertyListingForm from '../components/sell/PropertyListingForm';
import { useAuth } from '../context/AuthContext';
import API from '../api';

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

export default function SellPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  // Form state
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
      const base64Images = await Promise.all(images.map(fileToBase64));
      setLoadingStep('Saving to database...');
      await API.post('/properties', {
        listing_type: listingType, property_type: propertyType,
        city, state, address,
        area_sqft: parseFloat(area),
        bhk: bhk ? parseInt(bhk) : null,
        price: parseFloat(price),
        description, contact_number: contactNumber,
        image_urls: base64Images,
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

  const fields = { listingType, propertyType, city, state, address, area, bhk, price, description, contactNumber, isNewLaunch, imagePreviews };
  const setters = { setListingType, setPropertyType, setCity, setState, setAddress, setArea, setBhk, setPrice, setDescription, setContactNumber, setIsNewLaunch, handleImageChange };

  return (
    <div>
      <Navbar />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <main className="page-content">
        <PropertyListingForm
          fields={fields}
          setters={setters}
          onSubmit={handleSubmit}
          loading={loading}
          loadingStep={loadingStep}
          error={error}
          onLoginRequired={!user ? () => setShowLogin(true) : null}
        />
      </main>

      <Footer />
    </div>
  );
}
