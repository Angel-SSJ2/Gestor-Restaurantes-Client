'use strict'

import { Router } from 'express'
import { getTablesByRestaurant } from './table.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'

const api = Router()

api.get('/list/restaurant/:restaurantId', [validateJwt], getTablesByRestaurant)

export default api