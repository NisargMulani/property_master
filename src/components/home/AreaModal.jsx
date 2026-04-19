import { useState } from 'react';

const AREA_UNITS = {
  'Square Feet':       1,
  'Square Meter':      10.7639,
  'Square Yard (Gaj)': 9,
  'Acre':              43560,
  'Hectare':           107639,
  'Bigha':             27000,
  'Cent':              435.6,
};

export default function AreaModal({ onClose }) {
  const [fromUnit, setFromUnit] = useState('Square Feet');
  const [toUnit,   setToUnit  ] = useState('Square Meter');
  const [areaVal,  setAreaVal ] = useState(1);

  function calcArea() {
    const inSqFt = areaVal * (AREA_UNITS[fromUnit] || 1);
    return (inSqFt / (AREA_UNITS[toUnit] || 1)).toFixed(4);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-heading">Area Converter</h2>
        <p className="text-gray">Convert between area units easily</p>

        <div className="form-row">
          <div className="form-group">
            <label>From</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
              {Object.keys(AREA_UNITS).map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>To</label>
            <select value={toUnit} onChange={e => setToUnit(e.target.value)}>
              {Object.keys(AREA_UNITS).map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Value</label>
          <input type="number" value={areaVal} onChange={e => setAreaVal(+e.target.value)} />
        </div>

        <div className="result-box">
          <p className="label">Result</p>
          <p className="value">{calcArea()}</p>
        </div>
        <p className="note">*For informational purposes only</p>
      </div>
    </div>
  );
}
