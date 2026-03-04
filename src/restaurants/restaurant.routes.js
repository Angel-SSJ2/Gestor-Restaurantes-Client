import { Router } from 'express';
import { getRestaurants } from './restaurant.controller.js';
import { searchRestaurants } from './restaurant.controller.js';


const api = Router();

api.get('/list', getRestaurants); 
api.get('/search', searchRestaurants);

export default api;