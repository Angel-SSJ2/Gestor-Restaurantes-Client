'use strict'

import { Router } from 'express'
import { check } from 'express-validator'
import { getMenuByRestaurant } from './dish.controller.js'
import { validateErrors } from '../../middlewares/validate-errors.js'
import { restaurantExistsById } from '../../middlewares/db-validators.js'

const api = Router()

api.get('/restaurant/:restaurantId', [
    check('restaurantId', 'No es un ID de MongoDB válido').isMongoId(),
    check('restaurantId').custom(restaurantExistsById),
    validateErrors
], getMenuByRestaurant)

export default api