// src/pages/RFQForm.tsx
import React, { useState } from 'react';
import axios from '../axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Box,
} from '@mui/material';

const RFQForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    try {
      await axios.post('/rfqs', {
        title,
        notes,
        deadline,
      });

      setSuccess('Requisition submitted successfully ✅');
      setTitle('');
      setNotes('');
      setDeadline('');
    } catch (err) {
      console.error(err);
      alert('❌ Error submitting requisition');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f8fa',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: '#1976d2' }}
          >
            Create Requisition
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Fill in the details below to submit a new requisition.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Requisition Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={4}
                fullWidth
              />

              <TextField
                label="Deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Submit Requisition
              </Button>

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RFQForm;
