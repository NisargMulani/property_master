const TOOLS = [
  { id: 'budget',      img: '/Images/+.png',      title: 'Budget Calculator', desc: 'Check For Affordability Range For Buying Home' },
  { id: 'emi',         img: '/Images/+ (1).png',  title: 'EMI Calculator',    desc: 'Calculate Your Home Loan EMI' },
  { id: 'eligibility', img: '/Images/+ (2).png',  title: 'Loan Eligibility',  desc: 'See What You Can Borrow For Your Home' },
  { id: 'area',        img: '/Images/+ (3).png',  title: 'Area Converter',    desc: 'Convert One Area Into Any Other Easily' },
];

export default function PopularTools({ onToolClick }) {
  return (
    <section className="section-mb-5">
      <div className="orange-banner">
        <h2>Use A Popular Tool</h2>
        <p>Go From Browsing To Buying</p>
      </div>
      <div className="tools-grid">
        {TOOLS.map(tool => (
          <div key={tool.id} className="tool-card" onClick={() => onToolClick(tool.id)}>
            <img src={tool.img} alt={tool.title} />
            <h3>{tool.title}</h3>
            <p>{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
