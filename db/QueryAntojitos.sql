IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'bd_antojitos')
BEGIN
    CREATE DATABASE bd_antojitos;
END;

GO

USE bd_antojitos


CREATE TABLE Rol (
    Id INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(50) NOT NULL 
);


CREATE TABLE Usuario (
    Id INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(100) NOT NULL UNIQUE,
    Rol INT FOREIGN KEY REFERENCES Rol(Id),
    Celular NVARCHAR(20) NOT NULL UNIQUE,
    Direccion NVARCHAR(200) NOT NULL,
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT GETDATE()
);


CREATE TABLE Insumo (
    Id INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100) NOT NULL,
    Proveedor NVARCHAR(100) NOT NULL,
    Presentacion NVARCHAR(50), 
    CantidadPorPresentacion DECIMAL(10, 2), 
    
    PrecioPresentacion DECIMAL(10, 2) DEFAULT 0,
    Compuesto BIT,
    PrecioUnitarioCalculado AS ( 
        CASE 
            WHEN CantidadPorPresentacion > 0 THEN CAST(PrecioPresentacion / CantidadPorPresentacion AS DECIMAL(10, 2))
            ELSE 0 
        END
    ) PERSISTED, -- se guarda en disco

    CantidadDisponible DECIMAL(12, 2) DEFAULT 0, -- en gramos o ml
    FechaActualizacion DATETIME DEFAULT GETDATE()

);

CREATE TABLE Tamanio(
    Id INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(30),
)



CREATE TABLE Plantilla(
    Id INT PRIMARY KEY IDENTITY,
    CantidadUsada DECIMAL(12,2) NOT NULL,
    TamanioID INT FOREIGN KEY  REFERENCES Tamanio(Id),
    InsumoID INT FOREIGN KEY REFERENCES Insumo(Id),

)

CREATE TABLE Producto (
    Id INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    UrlImagen NVARCHAR(255),
    TamanioID INT,
    DatosProceso NVARCHAR(4000),
    PrecioVenta DECIMAL(10, 2) NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (TamanioID) REFERENCES Tamanio(Id)
);



CREATE TABLE Producto_Insumo (
    ProductoID INT,
    InsumoID INT,
    CantidadUsada DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (ProductoID, InsumoID),
    FOREIGN KEY (ProductoID) REFERENCES Producto(Id),
    FOREIGN KEY (InsumoID) REFERENCES Insumo(Id)
);

CREATE TABLE Insumo_Composicion (
    InsumoCompuestoID INT NOT NULL, 
    IngredienteID INT NOT NULL,     
    CantidadPorGramo DECIMAL(10, 4),
    PRIMARY KEY (InsumoCompuestoID, IngredienteID),
    FOREIGN KEY (InsumoCompuestoID) REFERENCES Insumo(Id),
    FOREIGN KEY (IngredienteID) REFERENCES Insumo(Id)
);

CREATE TABLE Pedido (
    Id INT PRIMARY KEY IDENTITY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuario(Id),
    FechaPedido DATETIME DEFAULT GETDATE(),
    Estado NVARCHAR(20) CHECK (Estado IN ('pendiente', 'en preparacion', 'entregado', 'cancelado'))
);

CREATE TABLE Pedido_Detalle (
    Id INT PRIMARY KEY IDENTITY,
    PedidoID INT FOREIGN KEY REFERENCES Pedido(Id),
    ProductoID INT FOREIGN KEY REFERENCES Producto(Id),
    Cantidad DECIMAL(12, 2) NOT NULL,
);


CREATE TABLE Factura (
    Id INT PRIMARY KEY IDENTITY,
    PedidoID INT FOREIGN KEY REFERENCES Pedido(Id),
    FechaFactura DATETIME DEFAULT GETDATE(),
    Total DECIMAL(10, 2) NOT NULL,
    MetodoPago NVARCHAR(50) NOT NULL,
    Estado NVARCHAR(20) CHECK (Estado IN ('pagado', 'pendiente', 'anulado'))
);


CREATE TABLE Log_Insumo (
    Id INT PRIMARY KEY IDENTITY,
    InsumoID INT FOREIGN KEY REFERENCES Insumo(Id),
    UsuarioID INT FOREIGN KEY REFERENCES Usuario(Id),
    FechaMovimiento DATETIME DEFAULT GETDATE(),
    TipoMovimiento NVARCHAR(20) CHECK(TipoMovimiento IN ('entrada', 'salida', 'ajuste')) NOT NULL,
    Cantidad DECIMAL(12,2) NOT NULL,
    Motivo NVARCHAR(255) NOT NULL
);

CREATE INDEX idx_fecha_pedido ON Pedido(FechaPedido);
CREATE INDEX idx_estado_pedido ON Pedido(Estado);
CREATE INDEX idx_factura_estado ON Factura(Estado);


INSERT INTO Rol (Nombre)
VALUES 
('Administrador'),
('Empleado'),
('Cliente'),
('Repartidor'),
('Supervisor');

