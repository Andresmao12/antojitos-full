insert into rol (nombre)
values 
    ('Administrador'),
    ('Usuario'),
    ('Cliente');

insert into tamanio  (nombre ) values ('12oz'), ('10oz'), ('Peque')

-- =========================================
-- DATOS DE PRUEBA
-- =========================================

-- =========================
-- ROL
-- =========================
insert into rol (nombre) values
('Administrador'),
('Cajero'),
('Repostero'),
('Supervisor'),
('Inventario'),
('Ventas'),
('Domiciliario'),
('Cliente'),
('Auxiliar'),
('Gerente');

-- =========================
-- USUARIO
-- =========================
insert into usuario (
    nombre,
    correo,
    celular,
    direccion,
    rol_id
) values
('Ana Torres', 'ana@test.com', '3000000001', 'Calle 1', 1),
('Luis Perez', 'luis@test.com', '3000000002', 'Calle 2', 2),
('Maria Gomez', 'maria@test.com', '3000000003', 'Calle 3', 3),
('Carlos Ruiz', 'carlos@test.com', '3000000004', 'Calle 4', 4),
('Laura Diaz', 'laura@test.com', '3000000005', 'Calle 5', 5),
('Jorge Castro', 'jorge@test.com', '3000000006', 'Calle 6', 6),
('Camila Rios', 'camila@test.com', '3000000007', 'Calle 7', 7),
('Sofia Mora', 'sofia@test.com', '3000000008', 'Calle 8', 8),
('Mateo Gil', 'mateo@test.com', '3000000009', 'Calle 9', 9),
('Valentina Cruz', 'valentina@test.com', '3000000010', 'Calle 10', 10);

-- =========================
-- TAMAÑO
-- =========================
insert into tamanio (nombre) values
('Mini'),
('Pequeño'),
('Mediano'),
('Grande'),
('Familiar'),
('XL'),
('Individual'),
('Party'),
('Premium'),
('Especial');

-- =========================
-- INSUMO
-- =========================
insert into insumo (
    nombre,
    proveedor,
    cantidad_unidad,
    precio_unidad,
    compuesto,
    cantidad_disponible
) values
('Harina', 'Molinos SA', 1000, 5000, false, 50),
('Azucar', 'Dulces SAS', 1000, 4000, false, 40),
('Chocolate', 'Cacao Corp', 500, 7000, false, 25),
('Leche', 'Lacteos SA', 1000, 3500, false, 30),
('Mantequilla', 'Alpina', 500, 6000, false, 15),
('Fresa', 'Frutas SAS', 300, 4500, false, 12),
('Crema Chantilly', 'Postres SA', 400, 5500, false, 20),
('Vainilla', 'Sabores SA', 250, 3000, false, 18),
('Mix Brownie', 'Reposteria SAS', 1000, 9000, true, 10),
('Relleno Frutos Rojos', 'Premium SAS', 800, 8500, true, 8);

-- =========================
-- PRODUCTO
-- =========================
insert into producto (
    nombre,
    descripcion,
    url_imagen,
    tamanio_id,
    datos_proceso,
    precio_venta,
    es_plantilla
) values
('Cheesecake Fresa', 'Cheesecake artesanal', 'img1.jpg', 1, '{"horno":"30min"}', 25000, false),
('Brownie', 'Brownie chocolate', 'img2.jpg', 2, '{"horno":"20min"}', 12000, false),
('Torta Chocolate', 'Chocolate premium', 'img3.jpg', 3, '{"horno":"45min"}', 45000, false),
('Cupcake', 'Cupcake vainilla', 'img4.jpg', 4, '{"horno":"15min"}', 8000, false),
('Pie Limon', 'Pie artesanal', 'img5.jpg', 5, '{"horno":"35min"}', 30000, false),
('Galletas', 'Pack galletas', 'img6.jpg', 6, '{"horno":"18min"}', 15000, false),
('Tres Leches', 'Postre tres leches', 'img7.jpg', 7, '{"frio":"2h"}', 28000, false),
('Red Velvet', 'Torta red velvet', 'img8.jpg', 8, '{"horno":"50min"}', 50000, false),
('Mousse Maracuya', 'Mousse tropical', 'img9.jpg', 9, '{"frio":"3h"}', 22000, true),
('Napoleon', 'Mil hojas', 'img10.jpg', 10, '{"horno":"40min"}', 32000, true);

-- =========================
-- PRODUCTO_INSUMO
-- =========================
insert into producto_insumo (
    producto_id,
    insumo_id,
    cantidad
) values
(1,1,200),
(1,2,100),
(2,3,150),
(3,1,300),
(4,8,50),
(5,2,120),
(6,1,180),
(7,4,250),
(8,3,280),
(9,10,200);

-- =========================
-- INSUMO_COMPOSICION
-- =========================
insert into insumo_composicion (
    insumo_compuesto_id,
    ingrediente_id,
    cantidad_por_gramo
) values
(9,1,0.5),
(9,2,0.2),
(9,3,0.3),
(10,6,0.6),
(10,2,0.1),
(10,8,0.1),
(9,4,0.2),
(10,5,0.3),
(9,8,0.1),
(10,3,0.4);

-- =========================
-- PEDIDO
-- =========================
insert into pedido (
    usuario_id,
    estado
) values
(1,'PENDIENTE'),
(2,'EN_PROCESO'),
(3,'COMPLETADO'),
(4,'CANCELADO'),
(5,'PENDIENTE'),
(6,'EN_PROCESO'),
(7,'COMPLETADO'),
(8,'PENDIENTE'),
(9,'COMPLETADO'),
(10,'CANCELADO');

-- =========================
-- PEDIDO_DETALLE
-- =========================
insert into pedido_detalle (
    pedido_id,
    producto_id,
    cantidad
) values
(1,1,2),
(2,2,1),
(3,3,1),
(4,4,3),
(5,5,2),
(6,6,4),
(7,7,1),
(8,8,2),
(9,9,1),
(10,10,5);

-- =========================
-- FACTURA
-- =========================
insert into factura (
    pedido_id,
    total,
    metodo_pago,
    estado
) values
(1,50000,'EFECTIVO','PAGO'),
(2,12000,'TARJETA','PENDIENTE'),
(3,45000,'TRANSFERENCIA','PAGO'),
(4,24000,'EFECTIVO','ANULADO'),
(5,60000,'TARJETA','PAGO'),
(6,30000,'TRANSFERENCIA','PENDIENTE'),
(7,28000,'EFECTIVO','PAGO'),
(8,100000,'TARJETA','PAGO'),
(9,22000,'TRANSFERENCIA','PENDIENTE'),
(10,160000,'EFECTIVO','ANULADO');

-- =========================
-- LOG_INSUMO
-- =========================
insert into log_insumo (
    insumo_id,
    usuario_id,
    tipo_movimiento,
    cantidad,
    motivo
) values
(1,1,'ENTRADA',10,'Compra proveedor'),
(2,2,'SALIDA',5,'Produccion'),
(3,3,'RESERVA',2,'Pedido especial'),
(4,4,'AJUSTE',1,'Correccion inventario'),
(5,5,'ENTRADA',8,'Reposicion'),
(6,6,'SALIDA',3,'Produccion'),
(7,7,'RESERVA',2,'Evento'),
(8,8,'AJUSTE',1,'Inventario'),
(9,9,'ENTRADA',4,'Compra'),
(10,10,'SALIDA',2,'Preparacion');