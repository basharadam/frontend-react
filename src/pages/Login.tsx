import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [role, setRole] = useState('buyer');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('user', JSON.stringify({ role, name }));
    if (role === 'buyer') navigate('/buyer');
    else navigate('/vendor');
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login (Demo)</h2>

      <div>
        <label>
          Select Role:{' '}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="vendor">Vendor</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button style={{ marginTop: 20 }} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
