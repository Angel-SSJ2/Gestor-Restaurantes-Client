import Restaurant from './restaurant.model.js';

// Listar todos los restaurantes activos
export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ status: true }); 
        res.send({ success: true, restaurants });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al obtener restaurantes', err: err.message });
    }
};

// Buscar por nombre o especialidad
export const searchRestaurants = async (req, res) => {
    try {
        const { query } = req.query; 
        const restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ],
            status: true
        });
        res.send({ success: true, restaurants });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error en la búsqueda', err: err.message });
    }
};