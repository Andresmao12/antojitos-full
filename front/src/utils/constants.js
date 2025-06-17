export const SHEMA_DB = {
    tables: [
        {
            name: "Usuarios",
            namedb: "Usuario",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Nombre", namedb: "Nombre", type: "string", required: true },
                { name: "Correo Electrónico", namedb: "Correo", type: "string", valueDefault: "usuariosAntojitos@gmail.com" },
                { name: "Rol", namedb: "Rol", type: "number", required: true },
                { name: "Celular", namedb: "Celular", type: "string", required: true },
                { name: "Dirección", namedb: "Direccion", type: "string", valueDefault: "Sin informacion" }
            ],
            relations: [
                { name: "Rol", fk: "Rol" }
            ],
            showInSlider: true
        },
        {
            namedb: "Rol",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Nombre", namedb: "Nombre", type: "string", required: true }
            ],
            showInSlider: false
        },
        {
            name: "Postres",
            namedb: "Producto",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Nombre", namedb: "Nombre", type: "string", required: true },
                { name: "Descripción", namedb: "Descripcion", type: "string", required: true },
                { name: "URL de Imagen", namedb: "UrlImagen", type: "string", required: true },
                { name: "Datos del proceso", namedb: "DatosProceso", type: "string", required: true },
                { name: "Precio de Venta", namedb: "PrecioVenta", type: "number", required: true },
                { name: "Tamaño", namedb: "Tamanio", type: "string", required: true }
            ],
            showInSlider: true
        },
        {
            name: "Insumos",
            namedb: "Insumo",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Nombre", namedb: "Nombre", type: "string", required: true },
                { name: "Proveedor", namedb: "Proveedor", type: "string", required: true },
                { name: "Presentación", namedb: "Presentacion", type: "string", required: false },
                { name: "Cantidad por Presentación  g/ml", namedb: "CantidadPorPresentacion", type: "number", required: false },
                { name: "Precio Presentación", namedb: "PrecioPresentacion", type: "number", required: false },
                { name: "Precio por g/ml", namedb: "PrecioUnitarioCalculado", type: "number", required: false, readonly: true },
                { name: "Cantidad Disponible", namedb: "CantidadDisponible", type: "number", required: true },
                { name: "Fecha Actualización", namedb: "FechaActualizacion", type: "date", required: false, readonly: true }
            ],
            showInSlider: true
        },

        {
            namedb: "Producto_Insumo",
            columns: [
                { name: "Producto", namedb: "ProductoID", type: "number", required: true },
                { name: "Insumo", namedb: "InsumoID", type: "number", required: true },
                { name: "Cantidad", namedb: "Cantidad", type: "number", required: true }
            ],
            relations: [
                { name: "Producto", fk: "ProductoID" },
                { name: "Insumo", fk: "InsumoID" }
            ],
            showInSlider: false
        },
        {
            namedb: "Log_Insumo",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Insumo", namedb: "InsumoID", type: "number", required: true },
                { name: "Usuario", namedb: "UsuarioID", type: "number", required: true },
                { name: "Fecha de Movimiento", namedb: "FechaMovimiento", type: "string", required: true },
                { name: "Tipo de Movimiento", namedb: "TipoMovimiento", type: "string", required: true },
                { name: "Cantidad", namedb: "Cantidad", type: "number", required: true }
            ],
            relations: [
                { name: "Insumo", fk: "InsumoID" },
                { name: "Usuario", fk: "UsuarioID" }
            ],
            showInSlider: false
        },
        {
            name: "Pedidos",
            namedb: "Pedido",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Usuario", namedb: "UsuarioID", type: "number", required: true },
                { name: "Estado", namedb: "Estado", type: "string", readonly: true },
                { name: "Fecha del Pedido", namedb: "FechaPedido", type: "string", required: true }
            ],
            relations: [
                { name: "Usuario", fk: "UsuarioID" }
            ],
            showInSlider: true
        },
        {
            name: "Pedido_Detalle",
            columns: [
                { name: "Pedido", namedb: "PedidoID", type: "number", required: true },
                { name: "Producto", namedb: "ProductoID", type: "number", required: true },
                { name: "Cantidad", namedb: "Cantidad", type: "number", required: true }
            ],
            relations: [
                { name: "Pedido", fk: "PedidoID" },
                { name: "Producto", fk: "ProductoID" }
            ],
            showInSlider: false
        },
        {
            namedb: "Factura",
            columns: [
                { name: "ID", namedb: "Id", type: "number", required: false, pk: true },
                { name: "Pedido", namedb: "PedidoID", type: "number", required: true },
                { name: "Usuario", namedb: "UsuarioID", type: "number", required: true },
                { name: "Fecha de Factura", namedb: "FechaFactura", type: "string", required: true },
                { name: "Total", namedb: "Total", type: "number", required: true },
                { name: "Método de Pago", namedb: "MetodoPago", type: "string", required: true }
            ],
            relations: [
                { name: "Pedido", fk: "PedidoID" },
                { name: "Usuario", fk: "UsuarioID" }
            ],
            showInSlider: false
        }
    ]
};



export const PRODUCT_DETAILS_MOCK = {
    ingredientes: [
        { ingrediente: 'IngredientePrieba', cantidad: 0 },
    ],
    capas: {
        capa1: { ingrediente: 'IngredienteCapaPrueba', cantidad: 0 },
    },
    notas: ""
}

export const PRODUCT_DETAILS = {
    ingredientes: [],
    capas: {},
    notas: ""
}