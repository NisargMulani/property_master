import { Link } from 'react-router-dom';
import NewLaunchSection from './NewLaunchSection';

export default function PropertyFeatures({ newLaunches }) {
  return (
    <section className="section-mb-4">
      <p className="section-subtitle">ALL PROPERTY NEEDS - ONE PORTAL</p>
      <h2 className="section-title">FIND BETTER PLACE TO LIVE, WORK<br />AND WONDER...</h2>

      {/* Buy a Home */}
      <div className="feature-section section-mb-4">
        <img src="/Images/Untitled design.png" alt="Living room" className="feature-img left" />
        <div className="info-card right-card">
          <p className="feature-label">BUY A HOME</p>
          <h3 className="feature-title">FIND, BUY &amp; OWN YOUR DREAM HOME</h3>
          <p className="feature-desc">Explore from Apartment Land, Builder Floor, Villas and more</p>
          <Link to="/listings" className="btn-link">Explore Buying</Link>
        </div>
      </div>

      {/* New Launches */}
      <NewLaunchSection launches={newLaunches} />

      {/* Plots / Land */}
      <div className="feature-section feature-mt4-mb4">
        <img src="/Images/Untitled design (3).png" alt="Plots" className="feature-img left" />
        <div className="info-card right-card">
          <p className="feature-label">BUY PLOTS/LAND</p>
          <h3 className="feature-title">RESIDENTIAL &amp; COMMERCIAL PLOT/LAND</h3>
          <p className="feature-desc">Explore Residential, Agricultural, Industrial and Commercial Plots/Land</p>
          <Link to="/listings" className="btn-link">Explore Buying</Link>
        </div>
      </div>

      {/* Sell / Rent */}
      <div className="feature-section section-mb-4">
        <img src="/Images/Untitled design (2).png" alt="Sell/Rent" className="feature-img right" />
        <div className="info-card left-card">
          <h3 className="feature-title">Sell or rent faster at the right price!</h3>
          <p className="feature-desc">List your property now</p>
          <Link to="/sell" className="btn-link">POST PROPERTY IT'S FREE</Link>
        </div>
      </div>

      {/* Commercial Heading */}
      <p className="section-subtitle section-pt-2">COMMERCIAL SPACES</p>
      <h2 className="section-title">Choose from a wide variety of<br />commercial properties</h2>

      {/* Buy Commercial */}
      <div className="feature-section section-mb-4">
        <img src="/Images/Untitled design (6).png" alt="Commercial Buy" className="feature-img left" />
        <div className="info-card right-card">
          <p className="feature-label">BUY FOR COMMERCIAL USE</p>
          <h3 className="feature-title">Buy a Commercial property</h3>
          <p className="feature-desc">Explore from Office Spaces, Co-working spaces, Retail Shops, Land, Factories and more</p>
          <Link to="/listings" className="btn-link">Explore Buying</Link>
        </div>
      </div>

      {/* Lease Commercial */}
      <div className="feature-section section-mb-4">
        <img src="/Images/Untitled design (7).png" alt="Commercial Lease" className="feature-img right" />
        <div className="info-card left-card">
          <p className="feature-label">LEASE FOR COMMERCIAL USE</p>
          <h3 className="feature-title">Lease a Commercial property</h3>
          <p className="feature-desc">Explore from Office Spaces, Co-working spaces, Retail Shops, Land, Factories and more</p>
          <Link to="/listings" className="btn-link">Explore Buying</Link>
        </div>
      </div>
    </section>
  );
}
