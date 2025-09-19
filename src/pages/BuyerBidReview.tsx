import React, { useEffect, useState } from 'react';
import axios from '../axios';

interface RFQ {
  id: number;
  title: string;
}

interface Bid {
  id: number;
  vendor_name: string;
  price: string;
  comments: string;
  status: string;
}

const BuyerBidReview: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [selected, setSelected] = useState<RFQ | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    axios.get('/rfqs').then(res => setRfqs(res.data));
  }, []);

  const loadBids = async (rfqId: number) => {
    const res = await axios.get(`/rfqs/${rfqId}/bids`);
    setBids(res.data);
  };

  const handleAction = async (bid: Bid, action: 'approve' | 'reject') => {
    await axios.post(`/bids/${bid.id}/${action}`);
    if (action === 'approve') {
      await axios.post('/purchase-orders', {
        rfq_id: selected?.id,
        bid_id: bid.id,
        vendor_name: bid.vendor_name,
        price: bid.price,
      });
    }
    await loadBids(selected?.id || 0);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Buyer: Bid Review</h2>

      {!selected && (
        <>
          <h3>RFQs</h3>
          <ul>
            {rfqs.map(r => (
              <li key={r.id}>
                {r.title}
                <button onClick={() => { setSelected(r); loadBids(r.id); }} style={{ marginLeft: 10 }}>
                  View Bids
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selected && (
        <>
          <h3>Bids for: {selected.title}</h3>
          <button onClick={() => setSelected(null)}>🔙 Back to RFQs</button>
          <ul>
            {bids.map(bid => (
              <li key={bid.id}>
                <b>{bid.vendor_name}</b> — 💰 {bid.price} — 📝 {bid.comments} — 🟡 Status: {bid.status}
                {/* {bid.status === 'pending' && ( */}
                  <>
                    <button onClick={() => handleAction(bid, 'approve')} style={{ marginLeft: 10 }}>✅ Approve</button>
                    <button onClick={() => handleAction(bid, 'reject')} style={{ marginLeft: 10 }}>❌ Reject</button>
                  </>
               {/* )} */}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default BuyerBidReview;
