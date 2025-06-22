import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { useApi } from '../../hooks/useApi'

import { SHEMA_DB } from '../../utils/constants'

const Dashboard = () => {
    const [data, setData] = useState(null);

    const [checkedPostres, setCheckedPostres] = useState(() => {
        const saved = localStorage.getItem("checkedPostres");
        return saved ? JSON.parse(saved) : [];
    });


    const tableShema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'insumo')
    console.log("TABLESHEMA A PASAR DESDE INSUMOS: ----> ", tableShema)
    const { fetchAll, dataFrom } = useApi(tableShema)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/dashboard");
                const result = await res.json();
                console.log("Dashboard data:", result);
                setData(result);

                fetchAll("Insumo")
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            }
        };

        fetchDashboard();
    }, []);

    useEffect(() => {
        console.log("DATAF INSUMO: ", dataFrom["Insumo"])
    }, [Object.keys(dataFrom).length])


    if (!data) return <div>Cargando dashboard...</div>;

    const {
        pedidosPorEstado,
        postresPendientes,
        ingresos,
        egresos,
        insumosRequeridos
    } = data;
    console.log("INSREQ", insumosRequeridos)

    const postresOrdenados = [...postresPendientes].sort((a, b) => {
        if (a.Nombre < b.Nombre) return -1;
        if (a.Nombre > b.Nombre) return 1;

        // Si los nombres son iguales, ordenar por tamaño
        if (a.Tamanio < b.Tamanio) return -1;
        if (a.Tamanio > b.Tamanio) return 1;

        return 0;
    });

    const toggleCheck = (index) => {
        const newChecked = checkedPostres.includes(index)
            ? checkedPostres.filter(i => i !== index)
            : [...checkedPostres, index];

        setCheckedPostres(newChecked);
        localStorage.setItem("checkedPostres", JSON.stringify(newChecked));
    };


    // Convertir array de estados a objeto tipo { pendiente: X, preparado: Y, entregado: Z }
    const estadoMap = pedidosPorEstado.reduce((acc, item) => {
        acc[item.Estado] = item.Total;
        return acc;
    }, {});

    // if (!data || !dataFrom["Insumo"]) return <div>Cargando dashboard...</div>;

    return (
        <div className={styles.dashboard}>
            <h1>Dashboard</h1>

            <section className={styles.cardSection}>
                <div className={`${styles.card} ${styles.pendiente}`}>
                    <h3>Pedidos Pendientes</h3>
                    <p>{estadoMap.pendiente || 0}</p>
                </div>
                <div className={`${styles.card} ${styles.preparado}`}>
                    <h3>Pedidos Preparados</h3>
                    <p>{estadoMap.preparado || 0}</p>
                </div>
                <div className={`${styles.card} ${styles.entregado}`}>
                    <h3>Pedidos Entregados</h3>
                    <p>{estadoMap.entregado || 0}</p>
                </div>
            </section>

            <section className={styles.cardSection}>
                <div className={`${styles.card} ${styles.ingresos}`}>
                    <h3>Ingresos</h3>
                    <p>${ingresos.toFixed(2)}</p>
                </div>
                <div className={`${styles.card} ${styles.egresos}`}>
                    <h3>Egresos</h3>
                    <p>${egresos.toFixed(2)}</p>
                </div>
            </section>

            <section className={styles.cardSection}>
                <div className={`${styles.card} ${styles.cardSimple} ${styles.cardInsFaltantes}`}>
                    <h3>Insumos requeridos (pendientes)</h3>
                    <ul>
                        {insumosRequeridos.map((insumo) => {
                            const info = dataFrom["Insumo"]?.find(i => i.Id === insumo.InsumoID)
                            console.log("DATAFROM INSUMO: ", dataFrom["Insumo"])
                            console.log("INFO INSUMO: ", info)
                            return (
                                <li key={insumo.InsumoID}>
                                    {info ? `${info.Nombre}: ${insumo.CantidadTotal} ` : `ID ${insumo.InsumoID}: ${insumo.CantidadTotal}`}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className={styles.cardPostres}>
                    <h3>Postres por sabor y tamaño</h3>
                    <div className={styles.postresGrid}>
                        {postresOrdenados.map((item, index) => (
                            <div
                                key={index}
                                className={`${styles.postreCard} ${checkedPostres.includes(index) ? styles.checked : ""
                                    }`}
                                onClick={() => toggleCheck(index)}
                            >
                                <div className={styles.checkIcon}>
                                    {checkedPostres.includes(index) && <span>✔</span>}
                                </div>
                                <h4>{item.Nombre}</h4>
                                <p><strong>Tamaño:</strong> {item.Tamanio}</p>
                                <p><strong>Cantidad:</strong> {item.CantidadTotal}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
};

export default Dashboard;
