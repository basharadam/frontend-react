// src/pages/BuyerPOList.tsx
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  Stack,
} from '@mui/material';

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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          📦 Purchase Orders (Buyer View)
        </Typography>

        <List>
          {pos.map((po) => (
            <ListItem
              key={po.id}
              sx={{
                borderBottom: '1px solid #eee',
                alignItems: 'flex-start',
              }}
            >
              <ListItemText
                primary={`PO #${po.id} - Vendor: ${po.vendor_name}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Price: ${po.price}
                    </Typography>
                    <br />
                    Status:{' '}
                    <Chip
                      size="small"
                      label={po.status}
                      color={
                        po.status === 'accepted'
                          ? 'success'
                          : po.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                      sx={{ ml: 1 }}
                    />
                    {' — '}
                    Payment:{' '}
                    <Chip
                      size="small"
                      label={po.payment_confirmed ? 'Confirmed' : 'Pending'}
                      color={po.payment_confirmed ? 'success' : 'error'}
                      sx={{ ml: 1 }}
                    />
                  </>
                }
              />

              {!po.payment_confirmed && po.status === 'accepted' && (
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => confirmPayment(po.id)}
                  >
                    Confirm Payment 💳
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default BuyerPOList;
