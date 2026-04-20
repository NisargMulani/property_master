import { useState } from 'react';

function formatCurrency(val) {
  const n = Number(val);
  return isNaN(n) ? '₹ 0' : '₹ ' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
function formatShort(val) {
  const n = Number(val);
  if (isNaN(n)) return '0';
  if (n >= 10000000) return (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000)   return (n / 100000).toFixed(2) + ' L';
  return (n / 1000).toFixed(0) + ' K';
}

export default function BudgetModal({ onClose }) {
  const [savings, setSavings] = useState(2000000);
  const [emi,     setEmi    ] = useState(20000);
  const [tenure,  setTenure ] = useState(20);

  function calcBudget() {
    const r    = 8.75 / 100 / 12;
    const n    = tenure * 12;
    const loan = emi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    const total = savings + loan;
    return `${formatShort(total * 0.95)} – ${formatShort(total * 1.05)}`;
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box wide">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-heading">Check your home buying budget</h2>
        <div className="calc-grid">
          <div>
            <div className="slider-row-gap">
              <div className="slider-label-row">
                <label>Savings for buying home</label>
                <span>{formatCurrency(savings)}</span>
              </div>
              <input type="range" min="0" max="200000000" step="100000" value={savings} onChange={e => setSavings(+e.target.value)} />
              <div className="slider-ends"><span>₹ 0</span><span>₹ 20 Cr</span></div>
            </div>

            <div className="slider-row-gap">
              <div className="slider-label-row">
                <label>EMI you can afford</label>
                <span>{formatCurrency(emi)}</span>
              </div>
              <input type="range" min="1000" max="1000000" step="1000" value={emi} onChange={e => setEmi(+e.target.value)} />
              <div className="slider-ends"><span>₹ 1,000</span><span>₹ 10 Lacs</span></div>
            </div>

            <div>
              <div className="slider-label-row">
                <label>Preferred loan tenure</label>
                <span>{tenure} Years</span>
              </div>
              <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(+e.target.value)} />
              <div className="slider-ends"><span>1 yr</span><span>30 yrs</span></div>
            </div>
          </div>

          <div className="result-box result-box-center">
            <p className="label">Your home budget</p>
            <p className="budget-result-value">{calcBudget()}</p>
          </div>
        </div>
        <p className="note">Estimated at an average interest rate of 8.75%</p>
      </div>
    </div>
  );
}
