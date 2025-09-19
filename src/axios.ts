import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://laravel-production-4d41.up.railway.app/api', // Laravel backend
});

export default instance;
