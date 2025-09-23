-- =========================================
-- postres inventory manage system
-- =========================================

--> tipos personalizados <--
create type tipo_capa_enum as enum ('FIJA', 'VARIABLE');
create type estado_postre_enum as enum ('PENDIENTE', 'EN_PROCESO', 'PREPARADO', 'ENTREGADO', 'CANCELADO');
create type estado_factura_enum as enum ('PENDIENTE', 'PAGO', 'ANULADO');
create type estado_pedido_enum as enum ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO');
create type metodo_pago_enum as enum ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA');
create type tipo_movimiento_enum as enum ('ENTRADA', 'SALIDA','RESERVA', 'AJUSTE');

--> creacion de tablas <--
create table rol (
    id serial primary key,
    nombre varchar(50) not null unique
);

create table usuario (
    id serial primary key,
    nombre varchar(100) not null,
    correo varchar(100) unique not null,
    celular varchar(20),
    direccion text,
    estado boolean default true,
    fecha_registro timestamptz default current_timestamp,
    rol_id int not null references rol(id)
);

create table tamanio (
    id serial primary key,
    nombre varchar(50) not null unique
);

create table insumo (
    id serial primary key,
    nombre varchar(100) not null,
    proveedor varchar(100),
    cantidad_unidad numeric(10,2),
    precio_unidad numeric(10,2) default 0,
    compuesto boolean default false,
    cantidad_reservada NUMERIC(12,2) DEFAULT 0,
    precio_gramo numeric(10,2) generated always as (
        case 
            when cantidad_unidad > 0 then precio_unidad / cantidad_unidad
            else 0 
        end
    ) stored,
    cantidad_disponible numeric(12,2) default 0,
    fecha_actualizacion timestamptz default current_timestamp
);


create table producto (
    id serial primary key,
    nombre varchar(100) not null,
    descripcion text,
    url_imagen varchar(255),
    tamanio_id int references tamanio(id),
    datos_proceso jsonb,
    precio_venta numeric(10,2),
    fecha_creacion timestamptz default current_timestamp,
    es_plantilla boolean default false
);

create table producto_insumo (
    id serial primary key,
    producto_id int not null references producto(id),
    insumo_id int not null references insumo(id),
    cantidad numeric(12,2) not null,
    fecha_registro timestamptz default current_timestamp
);

create table insumo_composicion (
    insumo_compuesto_id int not null,
    ingrediente_id int not null,
    cantidad_por_gramo numeric(10, 4),
    primary key (insumo_compuesto_id, ingrediente_id),
    constraint fk_insumo_compuesto foreign key (insumo_compuesto_id) references insumo(id) on delete cascade,
    constraint fk_insumo_ingrediente foreign key (ingrediente_id) references insumo(id) on delete cascade
);

create table pedido (
    id serial primary key,
    usuario_id int not null references usuario(id),
    fecha_pedido timestamptz default current_timestamp,
    estado estado_pedido_enum default 'PENDIENTE'
);

create table pedido_detalle (
    id serial primary key,
    pedido_id int not null references pedido(id),
    producto_id int not null references producto(id),
    cantidad int not null default 1
);

create table factura (
    id serial primary key,
    pedido_id int not null references pedido(id),
    fecha_factura timestamptz default current_timestamp,
    total numeric(10,2) not null,
    metodo_pago metodo_pago_enum not null,
    estado estado_factura_enum default 'PENDIENTE'
);

create table log_insumo (
    id serial primary key,
    insumo_id int not null references insumo(id),
    usuario_id int not null references usuario(id),
    fecha_movimiento timestamptz default current_timestamp,
    tipo_movimiento tipo_movimiento_enum not null,
    cantidad numeric(8,2) not null,
    motivo text
);

--> indices <--

create index idx_insumo_composicion_compuesto on insumo_composicion(insumo_compuesto_id);
create index idx_insumo_composicion_ingrediente on insumo_composicion(ingrediente_id);

-- usuario → rol
create index idx_usuario_rol on usuario(rol_id);

-- producto → tamanio y plantilla
create index idx_producto_tamanio on producto(tamanio_id);

-- producto_insumo → producto e insumo
create index idx_producto_insumo_producto on producto_insumo(producto_id);
create index idx_producto_insumo_insumo on producto_insumo(insumo_id);

-- pedido → usuario
create index idx_pedido_usuario on pedido(usuario_id);
create index idx_pedido_fecha on pedido(fecha_pedido);

-- pedido_detalle → pedido y producto
create index idx_pedido_detalle_pedido on pedido_detalle(pedido_id);
create index idx_pedido_detalle_producto on pedido_detalle(producto_id);

-- factura → pedido
create index idx_factura_pedido on factura(pedido_id);
create index idx_factura_fecha on factura(fecha_factura);

-- log_insumo → insumo y usuario
create index idx_log_insumo_insumo on log_insumo(insumo_id);
create index idx_log_insumo_usuario on log_insumo(usuario_id);
create index idx_log_insumo_fecha on log_insumo(fecha_movimiento);
create index idx_log_insumo_tipo on log_insumo(tipo_movimiento);

-- buscar usuario por correo (login)
create unique index idx_usuario_correo on usuario(correo);

-- buscar insumo por nombre
create index idx_insumo_nombre on insumo(nombre);

-- buscar producto por nombre
create index idx_producto_nombre on producto(nombre);

-- facturas por estado
create index idx_factura_estado on factura(estado);

-- pedidos por estado
create index idx_pedido_estado on pedido(estado);
