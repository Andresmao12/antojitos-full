import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardData = async (req, res) => {
  try {
    const result = await dashboardService.getDashboardData();
    res.json(result);
  } catch (error) {
    console.error('-- Error al obtener todos los insumos:', error);
    res.status(500).json({ error: 'Error al obtener los insumos' });
  }
};
