import { Link } from 'react-router-dom';

const GALLERY_ITEMS = [
  { img: '/Images/Untitled design.png',    label: 'Buying A Home',        to: '/listings?listing_type=Sell%20Property&property_group=Residential' },
  { img: '/Images/Untitled design (1).png', label: 'Rent A Home',          to: '/listings?listing_type=Rent%20%2F%20Lease%20Property&property_group=Residential' },
  { img: '/Images/Untitled design (2).png', label: 'Sell/Rent Property',   to: '/sell' },
  { img: '/Images/Untitled design (3).png', label: 'Plots/Land',           to: '/listings?property_group=Plot%2FLand' },
  { img: '/Images/Untitled design (6).png', label: 'Buying Commercial',    to: '/listings?listing_type=Sell%20Property&property_group=Commercial' },
  { img: '/Images/Untitled design (7).png', label: 'Lease Commercial',     to: '/listings?listing_type=Rent%20%2F%20Lease%20Property&property_group=Commercial' },
  { img: '/Images/Untitled design (8).png', label: 'Invest In Real Estate',to: '/listings?listing_type=Sell%20Property' },
];

export default function GallerySlider() {
  return (
    <section className="section-mb-3">
      <div className="slider-container">
        {GALLERY_ITEMS.map(item => (
          <Link key={item.label} to={item.to} className="slider-item">
            <img src={item.img} alt={item.label} />
            <h3>{item.label}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
