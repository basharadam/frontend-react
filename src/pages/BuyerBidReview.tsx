import React, { useEffect, useState } from 'react';
import axios from '../axios';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';

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
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          🧾 Requisition Bid Review
        </Typography>

        {!selected ? (
          <>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              Select a requisition to view and manage vendor bids.
            </Typography>

            {rfqs.length === 0 ? (
              <Typography>No requisitions available.</Typography>
            ) : (
              <List>
                {rfqs.map((r) => (
                  <ListItem
                    key={r.id}
                    sx={{
                      border: '1px solid #eee',
                      borderRadius: 1,
                      mb: 1,
                      py: 2,
                      px: 2,
                    }}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelected(r);
                          loadBids(r.id);
                        }}
                      >
                        View Bids
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {r.title}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                📨 Bids for: {selected.title}
              </Typography>
              <Button variant="text" onClick={() => setSelected(null)}>
                🔙 Back to Requisitions
              </Button>
            </Stack>

            {bids.length === 0 ? (
              <Typography>No bids submitted for this requisition.</Typography>
            ) : (
              <List>
                {bids.map((bid) => (
                  <ListItem
                    key={bid.id}
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      border: '1px solid #eee',
                      borderRadius: 1,
                      mb: 2,
                      p: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {bid.vendor_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            💰 {bid.price} — 📝 {bid.comments}
                          </Typography>
                        </>
                      }
                      secondary={
                        <Chip
                          size="small"
                          label={`Status: ${bid.status}`}
                          color={
                            bid.status === 'approved'
                              ? 'success'
                              : bid.status === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          sx={{ mt: 1 }}
                        />
                      }
                    />

                    {bid.status === 'pending' && (
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAction(bid, 'approve')}
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleAction(bid, 'reject')}
                        >
                          ❌ Reject
                        </Button>
                      </Stack>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default BuyerBidReview;
