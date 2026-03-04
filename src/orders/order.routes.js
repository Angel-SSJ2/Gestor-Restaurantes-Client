'use strict'

import { Router } from 'express'
import { createOrder, getMyOrders } from './order.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'

const api = Router()

api.post('/add', [validateJwt], createOrder)

api.get('/my-history', [validateJwt], getMyOrders)

export default api