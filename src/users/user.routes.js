'use strict'

import { Router } from 'express'
import { update, deleteUser } from './user.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'

const api = Router()

api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteUser) 

export default api