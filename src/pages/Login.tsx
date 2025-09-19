import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

const Login: React.FC = () => {
  const [role, setRole] = useState('buyer');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('user', JSON.stringify({ role, name }));
    if (role === 'buyer') navigate('/buyer');
    else navigate('/vendor');
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: '#ffffff',
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ color: '#1976d2' }}
          >
            Login to SupchaConnect
          </Typography>

          <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Choose your role and enter your name to continue
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={handleRoleChange}
              label="Select Role"
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              disabled={!name.trim()}
              sx={{
                textTransform: 'none',
                px: 5,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
