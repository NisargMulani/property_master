import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Navbar            from '../components/Navbar';
import Footer            from '../components/Footer';
import LoginModal        from '../components/LoginModal';

// Home-specific components
import SearchSection     from '../components/home/SearchSection';
import GallerySlider     from '../components/home/GallerySlider';
import PopularTools      from '../components/home/PopularTools';
import PropertyFeatures  from '../components/home/PropertyFeatures';
import BudgetModal       from '../components/home/BudgetModal';
import EmiModal          from '../components/home/EmiModal';
import EligibilityModal  from '../components/home/EligibilityModal';
import AreaModal         from '../components/home/AreaModal';

import API from '../api';

export default function HomePage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [showLogin,   setShowLogin  ] = useState(false);
  const [newLaunches, setNewLaunches] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  // Auto-open login modal when ?login=1 is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === '1') {
      setShowLogin(true);
      navigate('/', { replace: true });
    }
  }, [location.search]);

  // Fetch new launches
  useEffect(() => {
    API.get('/properties?is_new_launch=true')
      .then(res => setNewLaunches(res.data))
      .catch(() => {});
  }, []);

  function closeModal() { setActiveModal(null); }

  return (
    <div>
      <Navbar />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <main className="page-content">
        <SearchSection />
        <GallerySlider />
        <PopularTools onToolClick={setActiveModal} />
        <PropertyFeatures newLaunches={newLaunches} />
      </main>

      <Footer onToolClick={setActiveModal} />

      {/* Calculator Modals */}
      {activeModal === 'budget'      && <BudgetModal      onClose={closeModal} />}
      {activeModal === 'emi'         && <EmiModal          onClose={closeModal} />}
      {activeModal === 'eligibility' && <EligibilityModal  onClose={closeModal} />}
      {activeModal === 'area'        && <AreaModal          onClose={closeModal} />}
    </div>
  );
}
