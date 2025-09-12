-- =========================================
-- DATOS DE PRUEBA
-- =========================================

-- Roles
INSERT INTO Rol (Nombre) VALUES
('ADMINISTRADOR'),
('OPERADOR'),
('CLIENTE'),
('SUPERVISOR'),
('CAJERO');

-- Usuarios
INSERT INTO Usuario (Nombre, Correo, Celular, Direccion, RolID) VALUES
('Juan Pérez', 'juan@example.com', '3001111111', 'Calle 123', 1),
('Ana Gómez', 'ana@example.com', '3002222222', 'Carrera 45', 2),
('Carlos Ruiz', 'carlos@example.com', '3003333333', 'Avenida 10', 3),
('Laura Torres', 'laura@example.com', '3004444444', 'Calle 77', 3),
('Pedro Sánchez', 'pedro@example.com', '3005555555', 'Carrera 8', 4);

-- Tamaños
INSERT INTO Tamanio (Nombre) VALUES
('10oz'),
('12oz'),
('16oz'),
('20oz'),
('Pequeño');

-- Insumos
INSERT INTO Insumo (Nombre, Proveedor, Cantidad_Unidad, Precio_Unidad, CantidadDisponible) VALUES
('Harina de Trigo', 'Molinos SA', 1000, 2.50, 5000),
('Azúcar', 'Dulces Ltda', 1000, 3.00, 4000),
('Leche Entera', 'Colanta', 1000, 4.20, 3000),
('Huevos', 'Granja Feliz', 30, 7.50, 500),
('Mantequilla', 'Alpina', 500, 6.80, 2000);

-- Plantillas
INSERT INTO Plantilla (TamanioID, Nombre, Descripcion) VALUES
(1, 'Torta Vainilla', 'Torta clásica de vainilla'),
(2, 'Torta Chocolate', 'Bizcocho de chocolate húmedo'),
(3, 'Cupcake Fresa', 'Cupcake con crema de fresa'),
(4, 'Cheesecake', 'Pastel de queso tradicional'),
(5, 'Brownie', 'Brownie de chocolate con nuez');

-- Productos
INSERT INTO Producto (Nombre, Descripcion, TamanioID, PrecioVenta, PlantillaID) VALUES
('Mini Torta Vainilla', 'Versión pequeña de torta vainilla', 1, 12.50, 1),
('Torta Chocolate Familiar', 'Torta grande para compartir', 2, 35.00, 2),
('Cupcake Fresa Decorado', 'Cupcake con topping de fresa', 3, 8.00, 3),
('Cheesecake New York', 'Estilo clásico NY', 4, 28.50, 4),
('Brownie con Nuez', 'Brownie artesanal', 5, 5.50, 5);

-- Producto_Insumo
INSERT INTO Producto_Insumo (ProductoID, InsumoID, Cantidad, PrecioUnitario) VALUES
(1, 1, 200, 2.50),
(1, 2, 100, 3.00),
(2, 3, 500, 4.20),
(3, 4, 5, 7.50),
(5, 5, 100, 6.80);

-- Pedidos
INSERT INTO Pedido (UsuarioID, Estado) VALUES
(1, 'PENDIENTE'),
(2, 'EN_PROCESO'),
(3, 'COMPLETADO'),
(4, 'CANCELADO'),
(5, 'PENDIENTE');

-- Pedido_Detalle
INSERT INTO Pedido_Detalle (PedidoID, ProductoID, Cantidad) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 1),
(3, 4, 2),
(5, 5, 3);

-- Facturas
INSERT INTO Factura (PedidoID, Total, MetodoPago, Estado) VALUES
(1, 33.00, 'EFECTIVO', 'PENDIENTE'),
(2, 35.00, 'TARJETA', 'PAGO'),
(3, 57.00, 'EFECTIVO', 'PAGO'),
(4, 20.00, 'TRANSFERENCIA', 'ANULADO'),
(5, 16.50, 'TARJETA', 'PENDIENTE');

-- Log_Insumo
INSERT INTO Log_Insumo (InsumoID, UsuarioID, TipoMovimiento, Cantidad, Motivo) VALUES
(1, 1, 'ENTRADA', 1000, 'Compra mayorista'),
(2, 2, 'SALIDA', 200, 'Uso en producción'),
(3, 3, 'ENTRADA', 500, 'Reposición bodega'),
(4, 4, 'SALIDA', 50, 'Pedido especial'),
(5, 5, 'AJUSTE', 20, 'Inventario físico');
