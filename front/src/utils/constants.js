export const SHEMA_DB = {
    tables: [
        {
            name: "Usuarios",
            namedb: "usuario",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Nombre", namedb: "nombre", type: "string", required: true },
                { name: "Correo Electrónico", namedb: "correo", type: "string", required: true },
                { name: "Celular", namedb: "celular", type: "string" },
                { name: "Dirección", namedb: "direccion", type: "string" },
                { name: "Estado", namedb: "estado", type: "boolean", valueDefault: true, readonly: true },
                { name: "Fecha Registro", namedb: "fecha_registro", type: "date", readonly: true },
                { name: "Rol", namedb: "rol_id", type: "number", required: true, readonly: true }
            ],
            relations: [{ name: "Rol", fk: "rol_id" }],
            showInSlider: true
        },
        {
            namedb: "rol",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Nombre", namedb: "nombre", type: "string", required: true }
            ],
            showInSlider: false
        },
        {
            namedb: "tamanio",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Nombre", namedb: "nombre", type: "string", required: true }
            ],
            showInSlider: false
        },
        {
            namedb: "plantilla",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Tamaño", namedb: "tamanio_id", type: "number", required: true },
                { name: "Nombre", namedb: "nombre", type: "string", required: true },
                { name: "Descripción", namedb: "descripcion", type: "string" },
                { name: "Fecha Creación", namedb: "fecha_creacion", type: "date", readonly: true }
            ],
            relations: [{ name: "Tamaño", fk: "tamanio_id" }],
            showInSlider: false
        },
        {
            name: "Postres",
            namedb: "producto",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Nombre", namedb: "nombre", type: "string", required: true },
                { name: "Descripción", namedb: "descripcion", type: "string" },
                { name: "URL Imagen", namedb: "url_imagen", type: "string" },
                { name: "Tamaño", namedb: "tamanio_id", type: "number" },
                { name: "Datos Proceso", namedb: "datos_proceso", type: "string" },
                { name: "Precio Venta", namedb: "precio_venta", type: "number" },
                { name: "Plantilla", namedb: "plantilla_id", type: "number" }
            ],
            relations: [
                { name: "Tamaño", fk: "tamanio_id" },
                { name: "Plantilla", fk: "plantilla_id" }
            ],
            showInSlider: true
        },
        {
            name: "Insumos",
            namedb: "insumo",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Nombre", namedb: "nombre", type: "string", required: true },
                { name: "Proveedor", namedb: "proveedor", type: "string" },
                { name: "Cantidad Unidad", namedb: "cantidad_unidad", type: "number" },
                { name: "Precio Unidad", namedb: "precio_unidad", type: "number" },
                { name: "Compuesto", namedb: "compuesto", type: "boolean" },
                { name: "Precio Gramo", namedb: "precio_gramo", type: "number", readonly: true },
                { name: "Cantidad Disponible", namedb: "cantidad_disponible", type: "number" },
                { name: "Fecha Actualización", namedb: "fecha_actualizacion", type: "date", readonly: true }
            ],
            showInSlider: true
        },
        {
            namedb: "producto_insumo",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Producto", namedb: "producto_id", type: "number", required: true },
                { name: "Insumo", namedb: "insumo_id", type: "number", required: true },
                { name: "Cantidad", namedb: "cantidad", type: "number", required: true },
                { name: "Precio Unitario", namedb: "precio_unitario", type: "number", required: true },
                { name: "Fecha Registro", namedb: "fecha_registro", type: "date", readonly: true }
            ],
            relations: [
                { name: "Producto", fk: "producto_id" },
                { name: "Insumo", fk: "insumo_id" }
            ],
            showInSlider: false
        },
        {
            namedb: "insumo_composicion",
            columns: [
                { name: "Insumo Compuesto", namedb: "insumo_compuesto_id", type: "number", required: true },
                { name: "Ingrediente", namedb: "ingrediente_id", type: "number", required: true },
                { name: "Cantidad por gramo", namedb: "cantidad_por_gramo", type: "number", required: true }
            ],
            relations: [
                { name: "Insumo Compuesto", fk: "insumo_compuesto_id" },
                { name: "Ingrediente", fk: "ingrediente_id" }
            ],
            showInSlider: false
        },
        {
            name: "Pedidos",
            namedb: "pedido",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Usuario", namedb: "usuario_id", type: "number", required: true },
                { name: "Estado", namedb: "estado", type: "string", readonly: true },
                { name: "Fecha Pedido", namedb: "fecha_pedido", type: "date", readonly: true }
            ],
            relations: [{ name: "Usuario", fk: "usuario_id" }],
            showInSlider: true
        },
        {
            namedb: "pedido_detalle",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Pedido", namedb: "pedido_id", type: "number", required: true },
                { name: "Producto", namedb: "producto_id", type: "number", required: true },
                { name: "Cantidad", namedb: "cantidad", type: "number", required: true }
            ],
            relations: [
                { name: "Pedido", fk: "pedido_id" },
                { name: "Producto", fk: "producto_id" }
            ],
            showInSlider: false
        },
        {
            namedb: "factura",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Pedido", namedb: "pedido_id", type: "number", required: true },
                { name: "Fecha Factura", namedb: "fecha_factura", type: "date", readonly: true },
                { name: "Total", namedb: "total", type: "number", required: true },
                { name: "Método de Pago", namedb: "metodo_pago", type: "string", required: true },
                { name: "Estado", namedb: "estado", type: "string", readonly: true }
            ],
            relations: [{ name: "Pedido", fk: "pedido_id" }],
            showInSlider: false
        },
        {
            namedb: "log_insumo",
            columns: [
                { name: "ID", namedb: "id", type: "number", pk: true },
                { name: "Insumo", namedb: "insumo_id", type: "number", required: true },
                { name: "Usuario", namedb: "usuario_id", type: "number", required: true },
                { name: "Fecha Movimiento", namedb: "fecha_movimiento", type: "date", readonly: true },
                { name: "Tipo Movimiento", namedb: "tipo_movimiento", type: "string", required: true },
                { name: "Cantidad", namedb: "cantidad", type: "number", required: true },
                { name: "Motivo", namedb: "motivo", type: "string" }
            ],
            relations: [
                { name: "Insumo", fk: "insumo_id" },
                { name: "Usuario", fk: "usuario_id" }
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