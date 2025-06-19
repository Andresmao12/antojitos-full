-- Desactiva restricciones de clave foránea
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";

-- Elimina datos en orden correcto (si hay dependencias entre tablas)
DELETE FROM Pedido_Detalle;
DELETE FROM Pedido;
DELETE FROM Producto_Insumo;
DELETE FROM Log_Insumo;
DELETE FROM Producto;
DELETE FROM Insumo;
DELETE FROM Usuario;
DELETE FROM Rol;

-- Reinicia el contador IDENTITY
DBCC CHECKIDENT ('Pedido_Detalle', RESEED, 0);
DBCC CHECKIDENT ('Pedido', RESEED, 0);
DBCC CHECKIDENT ('Log_Insumo', RESEED, 0);
DBCC CHECKIDENT ('Producto_Insumo', RESEED, 0);
DBCC CHECKIDENT ('Producto', RESEED, 0);
DBCC CHECKIDENT ('Insumo', RESEED, 0);
DBCC CHECKIDENT ('Usuario', RESEED, 0);
DBCC CHECKIDENT ('Rol', RESEED, 0);

-- Vuelve a activar restricciones
EXEC sp_msforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL";



INSERT INTO Rol (Nombre)
VALUES 
('Administrador'),
('Empleado'),
('Cliente'),
('Repartidor'),
('Supervisor');

