import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EmiModal({ onClose }) {
  const [loanAmt,   setLoanAmt  ] = useState(3000000);
  const [emiTenure, setEmiTenure] = useState(20);
  const [emiRate,   setEmiRate  ] = useState(8.9);

  function calcEmi() {
    const r     = emiRate / 12 / 100;
    const n     = emiTenure * 12;
    const e     = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = e * n;
    return { monthly: Math.round(e), total: Math.round(total), interest: Math.round(total - loanAmt) };
  }

  const data = calcEmi();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box wide">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-heading-sm">EMI Calculator</h2>
        <div className="calc-grid">
          <div>
            <div className="form-row-3 calc-form-mb">
              <div className="form-group">
                <label>Loan Amount (₹)</label>
                <input type="number" value={loanAmt} onChange={e => setLoanAmt(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tenure (yrs)</label>
                <input type="number" value={emiTenure} onChange={e => setEmiTenure(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" step="0.1" value={emiRate} onChange={e => setEmiRate(+e.target.value)} />
              </div>
            </div>

            <Doughnut
              data={{
                labels: ['Principal', 'Interest'],
                datasets: [{ data: [loanAmt, data.interest], backgroundColor: ['#040459', '#FF7142'], borderWidth: 2 }],
              }}
              options={{ responsive: true, cutout: '50%', plugins: { legend: { display: false } } }}
            />
            <div className="chart-legend">
              <span><span className="legend-dot legend-dot-blue" />Principal</span>
              <span><span className="legend-dot legend-dot-orange" />Interest</span>
            </div>
          </div>

          <div className="result-box result-box-center-gap">
            <p className="label">Monthly EMI</p>
            <p className="emi-monthly">₹ {data.monthly.toLocaleString('en-IN')}</p>
            <p className="label">Total Payable Amount</p>
            <p className="sub-value">₹ {data.total.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
