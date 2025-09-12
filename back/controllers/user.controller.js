import * as userService from '../services/user.service.js';

export const getAllUsers = async (req, res) => {

    try {
        const result = await userService.getAllUsers();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};


export const getUserById = async (req, res) => {
    try {
        const result = await userService.getUserById();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un usuario:', error);
        res.status(500).json({ error: 'Error al obtener un usuario' });
    }
};

export const createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.json(result);
    } catch (error) {
        console.error('-- Error crear un usuario:', error);
        res.status(500).json({ error: 'Error al crear un usuario' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser();
        res.json(result);
    } catch (error) {
        console.error('-- Error al actualizar un usuario:', error);
        res.status(500).json({ error: 'Error al actualizar un usuario' });
    }
};

