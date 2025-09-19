import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Set Laravel API base URL
//axios.defaults.baseURL = 'http://127.0.0.1:8000/api'; // make sure CORS is enabled on Laravel
 axios.defaults.baseURL = 'https://laravel-production-4d41.up.railway.app/api'; // make sure CORS is enabled on Laravel

const App: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios.get('frontend-react/test')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching data from Laravel API');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>SupchaConnect - Demo</h1>
      <p>React frontend connected to Laravel backend</p>

      <div style={{ marginTop: 20 }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data && (
          <div>
            <h3>API Response:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
