'use strict'

import Table from './table.model.js'

export const getTablesByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params
        
        const tables = await Table.find({ 
            restaurant: restaurantId, 
            status: { $ne: 'inactiva' } 
        }).sort({ number: 1 })

        if (tables.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No hay mesas configuradas o disponibles en este restaurante' 
            })
        }

        res.status(200).json({ 
            success: true, 
            total: tables.length,
            data: tables 
        })
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener mesas', 
            error: error.message 
        })
    }
}