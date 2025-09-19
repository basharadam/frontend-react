import React, { useEffect, useState } from 'react';
import axios from '../axios';

interface RFQ {
  id: number;
  title: string;
  deadline: string;
}

interface PO {
  id: number;
  rfq_id: number;
  bid_id: number;
  vendor_name: string;
  price: number;
  status: string;
}

const VendorDashboard: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [selected, setSelected] = useState<RFQ | null>(null);
  const [price, setPrice] = useState('');
  const [comments, setComments] = useState('');
  const [success, setSuccess] = useState('');
  const [pos, setPOs] = useState<PO[]>([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    axios.get('/rfqs').then(res => setRfqs(res.data));

    if (user.name) {
      axios.get(`/vendor-pos/${user.name}`).then(res => setPOs(res.data));
    }
  }, [success]);

  const handleSubmit = async () => {
    try {
      await axios.post('/bids', {
        rfq_id: selected?.id,
        vendor_name: user.name,
        price,
        comments,
      });

      setSuccess('✅ Bid submitted');
      setPrice('');
      setComments('');
      setSelected(null);
    } catch (err) {
      alert('❌ Failed to submit bid');
    }
  };

  const handleAcknowledge = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      await axios.post('/vendor-po-status', { id, status });
      alert(`PO ${status}`);
      // Refresh PO list
      axios.get(`/vendor-pos/${user.name}`).then(res => setPOs(res.data));
    } catch (err) {
      alert('❌ Failed to update status');
    }
  };
  

  return (
    <div style={{ padding: 40 }}>
      <h2>Vendor Dashboard — {user.name}</h2>

      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* 🔽 Submit Bid Section */}
      {!selected && (
        <>
          <h3>Available RFQs:</h3>
          <ul>
            {rfqs.map(r => (
              <li key={r.id}>
                {r.title} — Due: {new Date(r.deadline).toLocaleString()}
                <button onClick={() => setSelected(r)} style={{ marginLeft: 10 }}>
                  Submit Bid
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selected && (
        <>
          <h3>Submit Bid for: {selected.title}</h3>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <br />
          <textarea
            placeholder="Comments (optional)"
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
          <br />
          <button onClick={handleSubmit}>Submit Bid</button>
          <button onClick={() => setSelected(null)} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        </>
      )}

      {/* 🧾 PO Section */}
      <div style={{ marginTop: 50 }}>
        <h3>Purchase Orders (POs) Issued to You:</h3>
        {pos.length === 0 ? (
          <p>No purchase orders found.</p>
        ) : (
          <ul>
          {pos.map(po => (
            <li key={po.id}>
              PO #{po.id} — RFQ ID: {po.rfq_id} — Amount: ${po.price} — Status: {po.status || 'pending'}
              {po.status === 'pending' && (
                <>
                  <button onClick={() => handleAcknowledge(po.id, 'accepted')} style={{ marginLeft: 10 }}>
                    ✅ Accept
                  </button>
                  <button onClick={() => handleAcknowledge(po.id, 'rejected')} style={{ marginLeft: 10 }}>
                    ❌ Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
