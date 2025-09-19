// src/pages/BuyerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axios';

interface RFQ {
  id: number;
  title: string;
  deadline: string;
}

const BuyerDashboard: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    axios.get('/rfqs/buyer') // Laravel route that returns RFQs created by buyer
      .then(res => setRfqs(res.data))
      .catch(err => console.error('Failed to load RFQs', err));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome Buyer: {user.name}</h2>
      <p>From here, you can create and manage your RFQs.</p>

      <Link to="/buyer/rfq">➕ Create New RFQ</Link>
      <Link to="/buyer/po-list">📦 View POs</Link>

      <h3 style={{ marginTop: 40 }}>📄 Your RFQs:</h3>
      <ul>
        {rfqs.map(r => (
          <li key={r.id}>
            {r.title} (Due: {new Date(r.deadline).toLocaleString()})
            <Link to={`/buyer/rfq/${r.id}/bids`} style={{ marginLeft: 10 }}>
              🔍 View Bids
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerDashboard;
