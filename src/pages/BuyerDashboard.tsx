// src/pages/BuyerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
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
    axios
      .get('/rfqs/buyer')
      .then((res) => setRfqs(res.data))
      .catch((err) => console.error('Failed to load RFQs', err));
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f8fa',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: '#1976d2' }}
          >
            Welcome, {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your requisitions and purchase orders from here.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              component={RouterLink}
              to="/buyer/rfq"
              sx={{
                textTransform: 'none',
                px: 4,
                py: 1.2,
                fontWeight: 'bold',
              }}
            >
              Create Requisition
            </Button>

            <Button
              variant="outlined"
              startIcon={<InventoryIcon />}
              component={RouterLink}
              to="/buyer/po-list"
              sx={{
                textTransform: 'none',
                px: 4,
                py: 1.2,
                fontWeight: 'bold',
              }}
            >
              View Purchase Orders
            </Button>
          </Stack>

          <Divider sx={{ my: 5 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Your Requisitions:
          </Typography>

          {rfqs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You have not created any requisitions yet.
            </Typography>
          ) : (
            <List>
              {rfqs.map((r) => (
                <ListItem
                  key={r.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 1.5,
                    backgroundColor: '#fff',
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      component={RouterLink}
                      to={`/buyer/rfq/${r.id}/bids`}
                      aria-label="view"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {r.title}
                      </Typography>
                    }
                    secondary={`Deadline: ${new Date(r.deadline).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default BuyerDashboard;
