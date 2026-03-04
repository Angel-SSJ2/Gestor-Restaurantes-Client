'use strict'

import Dish from './dish.model.js';

export const getMenuByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        
        const dishes = await Dish.find({ 
            restaurant: restaurantId, 
            available: true 
        });

        if (dishes.length === 0) {
            return res.status(404).send({ 
                success: false, 
                message: 'Este restaurante no tiene platillos disponibles en este momento' 
            });
        }

        res.send({ 
            success: true, 
            restaurantId, 
            total: dishes.length,
            menu: dishes 
        });
    } catch (err) {
        res.status(500).send({ 
            success: false, 
            message: 'Error al obtener el menú', 
            err: err.message 
        });
    }
};