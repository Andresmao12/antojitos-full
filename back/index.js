import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173']
}))


// RUTAS
import ProductRouter from './routes/product.routes.js'
import UserRouter from './routes/user.routes.js'
import pedidoRouter from './routes/pedido.routes.js'
import InsumoRouter from './routes/insumo.routes.js'
import Prod_insumRouter from './routes/prod_insum.routes.js'

app.use('/api/producto', ProductRouter);
app.use('/api/usuario', UserRouter);
app.use('/api/pedido', pedidoRouter);
app.use('/api/insumo', InsumoRouter);
app.use('/api/producto_insumo', Prod_insumRouter);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});