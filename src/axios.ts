import axios from 'axios';

const instance = axios.create({
  //baseURL: 'http://127.0.0.1:8000/api', // Laravel backend
   baseURL: 'https://laravel-production-4d41.up.railway.app/api', // Laravel backend

});

export default instance;
