import { useState } from 'react';

function formatCurrency(val) {
  const n = Number(val);
  return isNaN(n) ? '₹ 0' : '₹ ' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export default function EligibilityModal({ onClose }) {
  const [income,      setIncome     ] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(10000);
  const [eliRate,     setEliRate    ] = useState(8.9);
  const [eliTenure,   setEliTenure  ] = useState(20);

  function calcEligibility() {
    const maxEmi     = income * 0.5 - existingEmi;
    const r          = eliRate / 12 / 100;
    const n          = eliTenure * 12;
    const loanAmount = maxEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    return { maxEmi: Math.round(maxEmi), loanAmount: Math.round(loanAmount), payable: Math.round(maxEmi * n) };
  }

  const data = calcEligibility();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box xl">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-heading-sm">Loan Eligibility</h2>
        <div className="calc-grid">
          <div>
            <div className="form-row calc-form-mb">
              <div className="form-group">
                <label>Net Monthly Income (₹)</label>
                <input type="number" value={income} onChange={e => setIncome(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Existing EMI (₹)</label>
                <input type="number" value={existingEmi} onChange={e => setExistingEmi(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Rate of Interest (%)</label>
                <input type="number" step="0.1" value={eliRate} onChange={e => setEliRate(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tenure (years)</label>
                <input type="number" value={eliTenure} onChange={e => setEliTenure(+e.target.value)} />
              </div>
            </div>
          </div>

          <div className="result-box text-center">
            <p className="label">You could borrow up to</p>
            <p className="eli-borrow">{formatCurrency(data.loanAmount)}</p>
            <p className="label">Total Payable</p>
            <p className="sub-value">{formatCurrency(data.payable)}</p>
            <br />
            <p className="label">Monthly EMI</p>
            <p className="eli-emi">{formatCurrency(data.maxEmi)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
