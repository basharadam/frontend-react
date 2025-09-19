// src/pages/VendorDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Stack,
  Divider,
  Box,
} from '@mui/material';

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
      axios.get(`/vendor-pos/${user.name}`).then(res => setPOs(res.data));
    } catch (err) {
      alert('❌ Failed to update status');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Vendor Dashboard — {user.name}
        </Typography>

        {success && (
          <Typography variant="body1" color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        {/* 🔽 Submit Bid Section */}
        {!selected ? (
          <>
            <Typography variant="h6" gutterBottom>
              Available RFQs
            </Typography>
            <List>
              {rfqs.map((r) => (
                <ListItem
                  key={r.id}
                  sx={{ borderBottom: '1px solid #eee' }}
                  secondaryAction={
                    <Button variant="outlined" onClick={() => setSelected(r)}>
                      Submit Bid
                    </Button>
                  }
                >
                  <ListItemText
                    primary={r.title}
                    secondary={`Due: ${new Date(r.deadline).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Submit Bid for: {selected.title}
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Enter price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <TextField
                label="Comments (optional)"
                multiline
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSubmit}>
                  Submit Bid
                </Button>
                <Button variant="outlined" color="error" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </>
        )}

        {/* 🧾 PO Section */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" gutterBottom>
          📦 Purchase Orders Issued to You
        </Typography>

        {pos.length === 0 ? (
          <Typography variant="body2">No purchase orders found.</Typography>
        ) : (
          <List>
            {pos.map((po) => (
              <ListItem
                key={po.id}
                sx={{
                  borderBottom: '1px solid #eee',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography>
                    <strong>PO #{po.id}</strong> — RFQ #{po.rfq_id} — Amount: ${po.price} —{' '}
                    <strong>Status:</strong>{' '}
                    <span style={{ textTransform: 'capitalize' }}>{po.status || 'pending'}</span>
                  </Typography>
                </Box>

                {po.status === 'pending' && (
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleAcknowledge(po.id, 'accepted')}
                    >
                      ✅ Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleAcknowledge(po.id, 'rejected')}
                    >
                      ❌ Reject
                    </Button>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default VendorDashboard;
