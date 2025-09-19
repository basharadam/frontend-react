// src/pages/BuyerPOList.tsx
import React, { useEffect, useState } from 'react';
import axios from '../axios';

interface PO {
  id: number;
  rfq_id: number;
  vendor_name: string;
  price: string;
  status: string;
  payment_confirmed: boolean;
}

const BuyerPOList: React.FC = () => {
  const [pos, setPOs] = useState<PO[]>([]);

  useEffect(() => {
    axios.get('/buyer-pos').then(res => setPOs(res.data));
  }, []);

  const confirmPayment = async (id: number) => {
    try {
      await axios.post('/buyer-po-payment', { id });
      alert('✅ Payment confirmed!');
      const res = await axios.get('/buyer-pos');
      setPOs(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || '❌ Error confirming payment');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📦 Purchase Orders (Buyer View)</h2>
      <ul>
        {pos.map(po => (
          <li key={po.id}>
            PO #{po.id} — Vendor: {po.vendor_name} — Price: ${po.price} — Status: {po.status} — Payment: {po.payment_confirmed ? '✅ Confirmed' : '❌ Pending'}
            {po.status === 'accepted' && !po.payment_confirmed && (
              <button onClick={() => confirmPayment(po.id)} style={{ marginLeft: 10 }}>
                Confirm Payment 💳
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerPOList;
