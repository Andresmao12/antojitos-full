import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173']
}))


// SWAGGER
import { swaggerUi, specs } from './swagger.js'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// RUTAS
import userRouter from './routes/user.routes.js'
import insumoRouter from './routes/insumo.routes.js'
import productRouter from './routes/product.routes.js'
import productoInsumoRouter from './routes/product_Insumo.routes.js'
import pedidoRouter from './routes/pedido.routes.js'
import tamanioRouter from './routes/tamanio.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

app.use('/api/usuario', userRouter);
app.use('/api/insumo', insumoRouter);
app.use('/api/producto', productRouter);
app.use('/api/producto_insumo', productoInsumoRouter);
app.use('/api/pedido', pedidoRouter);
app.use('/api/tamanio', tamanioRouter);
app.use('/api/dashboard', dashboardRouter);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});