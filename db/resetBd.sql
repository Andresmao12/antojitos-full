-- =========================================
-- ELIMINAR TODAS LAS TABLAS (CON CASCADE)
-- =========================================

DROP TABLE IF EXISTS Log_Insumo CASCADE;
DROP TABLE IF EXISTS Factura CASCADE;
DROP TABLE IF EXISTS Pedido_Detalle CASCADE;
DROP TABLE IF EXISTS Pedido CASCADE;
DROP TABLE IF EXISTS Producto_Insumo CASCADE;
DROP TABLE IF EXISTS Producto CASCADE;
DROP TABLE IF EXISTS Plantilla CASCADE;
DROP TABLE IF EXISTS Insumo CASCADE;
DROP TABLE IF EXISTS Tamanio CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Rol CASCADE;

-- =========================================
-- ELIMINAR TIPOS ENUM PERSONALIZADOS
-- =========================================

DROP TYPE IF EXISTS tipo_capa_enum CASCADE;
DROP TYPE IF EXISTS estado_postre_enum CASCADE;
DROP TYPE IF EXISTS estado_factura_enum CASCADE;
DROP TYPE IF EXISTS estado_pedido_enum CASCADE;
DROP TYPE IF EXISTS metodo_pago_enum CASCADE;
DROP TYPE IF EXISTS tipo_movimiento_enum CASCADE;