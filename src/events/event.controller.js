'use strict'

import Event from './event.model.js'

export const getEventsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const events = await Event.find({ 
            restaurant: restaurantId, 
            active: true 
        }).sort({ date: 1 });

        if (events.length === 0) {
            return res.status(404).send({ 
                success: false, 
                message: 'No hay eventos próximos para este restaurante' 
            });
        }

        res.send({ success: true, total: events.length, data: events });
    } catch (error) {
        res.status(500).send({ 
            success: false, 
            message: 'Error al obtener eventos', 
            error: error.message 
        });
    }
};

export const reserveSpots = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body 

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'La cantidad debe ser mayor a 0' })
        }

        const event = await Event.findById(id)
        if (!event || !event.active) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado o ya no está disponible' })
        }

        if (event.availableSpots < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: `Lo sentimos, solo quedan ${event.availableSpots} cupos disponibles` 
            })
        }

        event.availableSpots -= quantity
        
        if (event.availableSpots === 0) event.active = false

        await event.save()

        res.json({
            success: true,
            message: '¡Cupos reservados con éxito!',
            data: {
                evento: event.name,
                cuposReservados: quantity,
                quedan: event.availableSpots
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al reservar cupos', error: error.message })
    }
}
