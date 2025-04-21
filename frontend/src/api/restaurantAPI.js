import axios from 'axios';

const restaurantAPI = axios.create({
  baseURL: 'http://localhost:5001/api', // RESTAURANT service backend
});

export default restaurantAPI;
