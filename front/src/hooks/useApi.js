import { useState, useCallback } from "react";
import { getAll, getAllFrom, getById, create, update, remove } from "../services/api"; 

export const useApi = (tableSchema) => {
    const [data, setData] = useState(null);
    const [dataFrom, setDataFrom] = useState({});
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchAll = useCallback(async (table) => {
        setLoading(true);
        setError(null);
        try {
            if (!table) {
                const result = await getAll(tableSchema);
                setData(result);
            } else {
                const result = await getAllFrom(table);
                setDataFrom(prev => ({ ...prev, [table]: result }));

            }
        } catch (err) {
            setError(err.message || err.toString());
        } finally {
            setLoading(false);
        }
    }, [tableSchema]);


    const fetchById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            
            const result = await getById(tableSchema, id);
            setItem(result[0]);
        } catch (err) {
            setError(err.message || err.toString());
        } finally {
            setLoading(false);
        }
    }, [tableSchema]);


    const createItem = useCallback(async (newData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await create(tableSchema, newData);
            fetchAll();
            return result;
        } catch (err) {
            setError(err.message || err.toString());
        } finally {
            setLoading(false);
        }
    }, [tableSchema, fetchAll]);


    const updateItem = useCallback(async (id, newData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await update(tableSchema, id, newData);
            fetchAll();
            return result;
        } catch (err) {
            setError(err.message || err.toString());
        } finally {
            setLoading(false);
        }
    }, [tableSchema, fetchAll]);


    const deleteItem = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const result = await remove(tableSchema, id);
            fetchAll();
            return result;
        } catch (err) {
            setError(err.message || err.toString());
        } finally {
            setLoading(false);
        }
    }, [tableSchema, fetchAll]);


    return {
        data,
        dataFrom,
        item,
        loading,
        error,
        fetchAll,
        fetchById,
        createItem,
        updateItem,
        deleteItem,
    };
};
