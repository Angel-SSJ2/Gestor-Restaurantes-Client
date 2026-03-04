import User from './user.model.js'

export const update = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const loggedInUserId = req.user.id 
        if (id !== loggedInUserId) {
            return res.status(403).send({ message: 'No tienes permiso para actualizar otro perfil' })
        }
        delete data.role
        delete data.password 

        const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password')
        
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' })
        return res.send({ message: 'Tu perfil ha sido actualizado', user })
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar usuario', err: err.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const loggedInUserId = req.user.id
        if (id !== loggedInUserId) {
            return res.status(403).send({ message: 'No tienes permiso para eliminar otra cuenta' })
        }
        const user = await User.findByIdAndUpdate(id, { status: false }, { new: true })
                
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' })
        return res.send({ message: 'Cuenta desactivada correctamente' })
    } catch (err) {
        return res.status(500).send({ message: 'Error al eliminar usuario', err: err.message })
    }
}
