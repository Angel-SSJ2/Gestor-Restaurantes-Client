'use strict'

import { Router } from 'express'
import { getEventsByRestaurant, reserveSpots } from './event.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'

const api = Router()
api.get('/list/restaurant/:restaurantId', getEventsByRestaurant)

api.post('/reserve/:id', [validateJwt], reserveSpots)

export default api