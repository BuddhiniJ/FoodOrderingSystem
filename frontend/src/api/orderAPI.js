import axios from 'axios';

const orderAPI = axios.create({
  baseURL: 'http://localhost:5002/api', // ORDER service backend
});

export default orderAPI;
