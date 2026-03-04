'use strict'

import { Router } from 'express'
import { 
    createReservation, 
    getMyReservations, 
    updateMyReservation, 
    cancelReservation 
} from './reservation.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'

const api = Router()

// Todas las rutas requieren estar logueado, pero NO ser Admin
api.post('/add', [validateJwt], createReservation)
api.get('/my-reservations', [validateJwt], getMyReservations)
api.put('/update/:id', [validateJwt], updateMyReservation)
api.delete('/cancel/:id', [validateJwt], cancelReservation)

export default api