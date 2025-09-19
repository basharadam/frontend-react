import React, { useState } from 'react';
import axios from '../axios'; // relative import

const RFQForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    try {
      const res = await axios.post('/rfqs', {
        title,
        notes,
        deadline,
      });

      setSuccess('RFQ submitted successfully ✅');
      setTitle('');
      setNotes('');
      setDeadline('');
    } catch (err) {
      console.error(err);
      alert('Error submitting RFQ');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Create RFQ</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="RFQ Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <button type="submit">Submit RFQ</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RFQForm;
