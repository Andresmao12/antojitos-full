import { useState, useEffect } from 'react'
import styles from '../../../Postres/components/AddPostreModal/AddPostreModal.module.css'
import buttonStyles from '../../../../styles/buttons.module.css'
import { useApi } from '../../../../hooks/useApi'

const AddPedidoModal = ({ handleShowCreate, handleRefresh }) => {
    const { fetchAll, createItem, dataFrom } = useApi({ namedb: "Pedido" })
    const [formData, setFormData] = useState({})
    const [productos, setProductos] = useState([])
    const [detallePedido, setDetallePedido] = useState([])

    useEffect(() => {
        const load = async () => {
            await fetchAll("Usuario")
            await fetchAll("Producto")
        }
        load()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleAddProducto = () => {
        const productoId = formData.producto
        const cantidad = formData["producto-cantidad"]

        if (!productoId || !cantidad) return

        const nuevo = {
            ProductoID: productoId,
            Cantidad: parseFloat(cantidad)
        }

        setDetallePedido([...detallePedido, nuevo])
        setFormData({ ...formData, producto: "", "producto-cantidad": "" })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            console.log('usuarioId recibido:', formData.usuario);


            const pedido = {
                UsuarioID: parseInt(formData.usuario),
                Estado: "pendiente",
                productos: detallePedido
            }
            await createItem(pedido)
            await handleRefresh()
            handleShowCreate()
        } catch (e) {
            console.error("Error al crear el pedido: ", e)
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <button className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`} onClick={handleShowCreate}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <form className={styles.formCont} onSubmit={handleSubmit}>
                <h2>Nuevo Pedido</h2>

                <div className={styles.selectCont}>
                    <select
                        className={styles.select}
                        name="usuario"
                        required
                        onChange={handleChange}
                        value={formData.usuario || ''}
                    >
                        <option>Seleccione cliente...</option>
                        {dataFrom["Usuario"]?.map((usuario) => (
                            <option key={usuario.Id} value={usuario.Id}>
                                {usuario.Nombre} ({usuario.Correo})
                            </option>
                        ))}
                    </select>
                </div>

                <h3>Productos</h3>
                <div className={styles.inpGroup}>
                    <div className={styles.selectCont}>
                        <select
                            className={styles.select}
                            name="producto"
                            required
                            onChange={handleChange}
                            value={formData.producto || ''}
                        >
                            <option>Seleccione producto...</option>
                            {dataFrom["Producto"]?.map((producto) => (
                                <option key={producto.Id} value={producto.Id}>
                                    {console.log(producto)}
                                    {`${producto.Nombre} ➜ ${producto.Tamanio}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inpCont}>
                        <input
                            name="producto-cantidad"
                            type="number"
                            min="1"
                            required
                            placeholder=" "
                            onChange={handleChange}
                            value={formData["producto-cantidad"] || ''}
                        />
                        <label htmlFor="producto-cantidad">Cantidad</label>
                    </div>
                    <input
                        type="button"
                        value="+"
                        className={`${buttonStyles.addButton} ${styles.addButton}`}
                        onClick={handleAddProducto}
                    />
                </div>

                <div className={styles.ingredientesCont}>
                    {detallePedido.map((item, idx) => {
                        const prod = dataFrom["Producto"]?.find(p => p.Id == item.ProductoID)
                        return (
                            <div key={idx} className={styles.ingredienteCont}>
                                <span>{prod?.Nombre}</span>
                                <span>{item.Cantidad}</span>
                            </div>
                        )
                    })}
                </div>

                <button className={buttonStyles.searchButton} type="submit">
                    Guardar Pedido
                </button>
            </form>
        </div>
    )
}

export default AddPedidoModal
