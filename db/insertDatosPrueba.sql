
INSERT INTO Rol (Nombre) VALUES
('Administrador'),
('Cliente');


INSERT INTO Usuario (Nombre, Correo, Rol, Celular, Direccion) VALUES
('Camila Torres', 'camila@correo.com', 1, '3001234567', 'Calle 10 #45-32'),
('Juan Pérez', 'juan@correo.com', 2, '3012345678', 'Cra 50 #30-21'),
('María López', 'maria@correo.com', 2, '3023456789', 'Calle 60 #15-40'),
('Santiago Gómez', 'santi@correo.com', 1, '3034567890', 'Cra 80 #20-10'),
('Laura Ramírez', 'laura@correo.com', 1, '3045678901', 'Calle 70 #25-50'),
('Carlos Díaz', 'carlos@correo.com', 2, '3056789012', 'Cra 45 #12-11'),
('Daniela Vega', 'daniela@correo.com', 1, '3067890123', 'Calle 90 #70-23'),
('Andrés Castaño', 'andres@correo.com', 2, '3078901234', 'Cra 30 #80-50'),
('Tatiana Ruiz', 'tatiana@correo.com', 1, '3089012345', 'Calle 33 #11-10'),
('Esteban Mejía', 'esteban@correo.com', 2, '3090123456', 'Cra 10 #5-23');


INSERT INTO Producto (Nombre, Descripcion, UrlImagen, PrecioVenta) VALUES
('Brownie', 'Brownie de chocolate con nueces', 'https://i.pinimg.com/originals/73/26/b0/7326b034b560a6607da3aa6bb8a3c622.jpg', 5000),
('Tiramisú', 'Postre italiano con café y mascarpone', 'https://i.pinimg.com/originals/73/26/b0/7326b034b560a6607da3aa6bb8a3c622.jpg', 7000),
('Cheesecake', 'Tarta de queso con mermelada de fresa', 'https://i.pinimg.com/originals/73/26/b0/7326b034b560a6607da3aa6bb8a3c622.jpg', 6000),
('Tres Leches', 'Bizcocho bañado en tres tipos de leche', 'https://i.pinimg.com/originals/73/26/b0/7326b034b560a6607da3aa6bb8a3c622.jpg', 5500),
('Flan', 'Flan de caramelo tradicional', 'https://postrecasero.com/wp-content/uploads/2023/01/Esponjado-de-mora.webp', 4000),
('Cupcake', 'Cupcake de vainilla con crema', 'https://postrecasero.com/wp-content/uploads/2023/01/Esponjado-de-mora.webp', 4500),
('Mousse de Maracuyá', 'Postre suave y frutal', 'https://postrecasero.com/wp-content/uploads/2023/01/Esponjado-de-mora.webp', 5200),
('Milhoja', 'Milhoja con crema pastelera', 'https://postrecasero.com/wp-content/uploads/2023/01/Esponjado-de-mora.webp', 4800),
('Churros', 'Churros con arequipe', 'https://postrecasero.com/wp-content/uploads/2023/01/Esponjado-de-mora.webp', 4300),
('Galleta Rellena', 'Galleta de avena con relleno de chocolate', 'https://postrecasero.com/wp-content/uploads/2023/01/Esponjado-de-mora.webp', 3900);


INSERT INTO Pedido (UsuarioID, FechaPedido) VALUES
(1, '2025-05-01'),
(2, '2025-05-02'),
(3, '2025-05-03'),
(4, '2025-05-04'),
(5, '2025-05-05'),
(6, '2025-05-06')


SELECT * FROM Usuario
SELECT * FROM Pedido
SELECT * FROM Producto


DELETE FROM Producto;

DBCC CHECKIDENT ('Pedido', RESEED, 0);