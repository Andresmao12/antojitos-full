const API_ROUTE = import.meta.env.VITE_API_ROUTE

export const getAll = async (tableSchema) => {
    try {
        const { namedb } = tableSchema;

        const res = await fetch(`${API_ROUTE}/${namedb.toLowerCase()}`);

        if (!res.ok)
            throw new Error(`-- Error en la respuesta ${res.status} ${res.statusText}`);

        const data = await res.json();
        console.log('DATA DESDE API: ', data);
        return data;
    } catch (e) {
        return e;
    }
};

export const getAllFrom = async (name) => {
    try {
        const res = await fetch(`${API_ROUTE}/${name.toLowerCase()}`);

        if (!res.ok)
            throw new Error(`-- Error en la respuesta ${res.status} ${res.statusText}`);

        const data = await res.json();
        return data;
    } catch (e) {
        return e;
    }
};

export const getById = async (tableSchema, id) => {
    try {
        console.log("SE EJECUTO GET BY ID CON EL ID: ", id, tableSchema)
        const { namedb } = tableSchema;
        const res = await fetch(`${API_ROUTE}/${namedb.toLowerCase()}/${id}`);

        if (!res.ok) throw new Error(`-- Error obteniendo por ID ${res.status} ${res.statusText}`);

        const data = await res.json();
        console.log("RESPONSE EN GET BY ID: ", data)

        return data;

    } catch (e) {
        return e;
    }
};


export const create = async (tableSchema, data) => {
    try {
        const { namedb } = tableSchema;
        console.log("DATA EN API CREATE: ", data)

        const res = await fetch(`${API_ROUTE}/${namedb}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok)
            throw new Error(`-- Error creando el registro ${res.status} ${res.statusText}`);

        const result = await res.json();
        console.log('-- Resultado del POST:', result);
        return result;
    } catch (e) {
        throw new Error(`--Error al hacer el POST: ${e}`);
    }
};


export const update = async (tableSchema, id, data) => {
    try {
        const { namedb } = tableSchema;

        const res = await fetch(`${API_ROUTE}/${namedb.toLowerCase()}/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok)
            throw new Error(`-- Error actualizando el registro ${res.status} ${res.statusText}`);

        const result = await res.json();
        return result;
    } catch (e) {
        throw new Error(`--Error al hacer el PUT: ${e}`);
    }
};


export const remove = async (tableSchema, id) => {
    try {
        const { namedb } = tableSchema;

        const res = await fetch(`${API_ROUTE}/${namedb}/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok)
            throw new Error(`-- Error eliminando el registro ${res.status} ${res.statusText}`);

        const result = await res.json();
        return result;
    } catch (e) {
        throw new Error(`--Error al hacer el DELETE: ${e}`);
    }
};

