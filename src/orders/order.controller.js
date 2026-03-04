'use strict'

import Order from './order.model.js'
import Dish from '../dishes/dish.model.js'

export const createOrder = async (req, res) => {
    try {
        const { restaurant, items } = req.body
        const userId = req.user.id 

        let total = 0
        for (const item of items) {
            const dish = await Dish.findById(item.dish)
            
            if (!dish || !dish.available) {
                return res.status(404).send({ 
                    success: false, 
                    message: `El plato con ID ${item.dish} ya no está en el menú.` 
                })
            }
            
            if (dish.stock < item.quantity) {
                return res.status(400).send({ 
                    success: false, 
                    message: `Lo sentimos, solo quedan ${dish.stock} unidades de ${dish.name}` 
                })
            }

            total += dish.price * item.quantity
            
            dish.stock -= item.quantity
            if (dish.stock === 0) dish.available = false
            await dish.save()
        }

        const order = new Order({
            user: userId,
            restaurant,
            items,
            totalPrice: total,
            status: 'PENDIENTE' 
        })

        await order.save()
        res.status(201).send({ 
            success: true, 
            message: '¡Pedido realizado con éxito!', 
            order 
        })
    } catch (err) {
        res.status(500).send({ 
            success: false, 
            message: 'Error al procesar el pedido', 
            err: err.message 
        })
    }
}
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Order.find({ user: userId })
            .populate('restaurant', 'name')
            .populate('items.dish', 'name price')
            .sort({ createdAt: -1 }) 

        res.send({ 
            success: true, 
            total: orders.length, 
            orders 
        })
    } catch (err) {
        res.status(500).send({ 
            success: false, 
            message: 'Error al obtener tu historial' 
        })
    }
}