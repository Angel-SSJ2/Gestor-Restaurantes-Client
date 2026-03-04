'use strict'

import Reservation from './reservation.model.js'
import Table from '../tables/table.model.js'

export const createReservation = async (req, res) => {
    try {
        const { restaurant, table, date, guests } = req.body
        const userId = req.user.id 

        if (new Date(date) < new Date()) {
            return res.status(400).send({ message: 'La fecha no puede ser en el pasado' })
        }

        const tableData = await Table.findById(table)
        if (!tableData) return res.status(404).send({ message: 'Mesa no encontrada' })
        
        if (guests > tableData.capacity) {
            return res.status(400).send({ 
                message: `Capacidad insuficiente. Esta mesa solo admite ${tableData.capacity} personas.` 
            })
        }
        const isReserved = await Reservation.findOne({ 
            table, 
            date, 
            status: { $ne: 'cancelada' } 
        })
        if (isReserved) {
            return res.status(400).send({ message: 'Esta mesa ya está reservada para esa fecha y hora' })
        }

        const reservation = new Reservation({
            user: userId,
            restaurant,
            table,
            date,
            guests,
            status: 'pendiente'
        })

        await reservation.save()
        res.status(201).send({ success: true, message: 'Reservación creada con éxito', reservation })
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al crear reservación', err: err.message })
    }
}

export const getMyReservations = async (req, res) => {
    try {
        const userId = req.user.id
        const reservations = await Reservation.find({ user: userId })
            .populate('restaurant', 'name')
            .populate('table', 'number')
            .sort({ date: 1 })

        res.send({ success: true, reservations })
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al listar tus reservaciones' })
    }
}
export const updateMyReservation = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const data = req.body

        const reservation = await Reservation.findOne({ _id: id, user: userId })
        
        if (!reservation) return res.status(404).send({ message: 'Reservación no encontrada o no tienes permiso' })
        if (reservation.status !== 'pendiente') {
            return res.status(400).send({ message: 'No puedes editar una reservación que ya fue confirmada o cancelada' })
        }

        const updated = await Reservation.findByIdAndUpdate(id, data, { new: true })
        res.send({ success: true, message: 'Reservación actualizada', updated })
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al actualizar', err: err.message })
    }
}

export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const deleted = await Reservation.findOneAndDelete({ _id: id, user: userId })
        
        if (!deleted) return res.status(404).send({ message: 'Reservación no encontrada o no tienes permiso' })

        res.send({ success: true, message: 'Reservación cancelada/eliminada' })
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al eliminar', err: err.message })
    }
}