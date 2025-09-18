import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { useApi } from "../../hooks/useApi";
import { SHEMA_DB } from "../../utils/constants";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [checkedPostres, setCheckedPostres] = useState(() => {
        const saved = localStorage.getItem("checkedPostres");
        return saved ? JSON.parse(saved) : [];
    });

    const tableShema = SHEMA_DB.tables.find(
        (element) => element.namedb?.toLowerCase() === "insumo"
    );
    const { fetchAll, dataFrom } = useApi(tableShema);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/dashboard");
                const result = await res.json();
                setData(result);
                fetchAll("Insumo");
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            }
        };

        fetchDashboard();
    }, []);

    if (!data) return <div>Cargando dashboard...</div>;

    const {
        pedidosPorEstado = [],
        postresPendientes = [],
        ingresos = 0,
        egresos = 0,
        utilidad = 0,
        insumosRequeridos = [],
        topPostres = [],
        ventasPorDia = [],
        alertas = []
    } = data || {};

    // Estado → {pendiente, preparado, entregado}
    const estadoMap = pedidosPorEstado.reduce((acc, item) => {
        acc[item.estado.toLowerCase()] = parseInt(item.total);
        return acc;
    }, {});

    // Ordenar postres
    const postresOrdenados = [...postresPendientes].sort((a, b) =>
        a.nombre.localeCompare(b.nombre) || a.tamanioid - b.tamanioid
    );

    const toggleCheck = (index) => {
        const newChecked = checkedPostres.includes(index)
            ? checkedPostres.filter((i) => i !== index)
            : [...checkedPostres, index];

        setCheckedPostres(newChecked);
        localStorage.setItem("checkedPostres", JSON.stringify(newChecked));
    };

    return (
        <div className={styles.dashboard}>
            <h1>📊 Dashboard</h1>

            {/* Alertas */}
            {alertas && alertas.length > 0 && (
                <section className={styles.alertSection}>
                    {alertas.map((a, i) => (
                        <div key={i} className={styles.alert}>
                            {a.mensaje}
                        </div>
                    ))}
                </section>
            )}

            {/* Resumen rápido */}
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
                    <p>${Number(ingresos).toFixed(2)}</p>
                </div>
                <div className={`${styles.card} ${styles.egresos}`}>
                    <h3>Egresos</h3>
                    <p>${Number(egresos).toFixed(2)}</p>
                </div>
                <div className={`${styles.card} ${styles.utilidad}`}>
                    <h3>Utilidad</h3>
                    <p>${Number(utilidad).toFixed(2)}</p>
                </div>
            </section>

            {/* Insumos requeridos */}
            <section className={styles.cardSection}>
                <div className={`${styles.card} ${styles.cardSimple}`}>
                    <h3>📦 Insumos requeridos</h3>
                    <ul>
                        {insumosRequeridos.map((insumo) => {
                            const info = dataFrom["Insumo"]?.find((i) => i.Id === insumo.insumoid);
                            return (
                                <li key={insumo.insumoid}>
                                    {info
                                        ? `${info.Nombre}: ${Math.round(insumo.cantidadtotal)}g`
                                        : `ID ${insumo.insumoid}: ${Math.round(insumo.cantidadtotal)}g`}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* Postres pendientes */}
            <section className={styles.cardSection}>
                <div className={styles.cardPostres}>
                    <h3>🍰 Postres por sabor y tamaño</h3>
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
                                <h4>{item.nombre}</h4>
                                <p><strong>Tamaño:</strong> {item.tamanioid}</p>
                                <p><strong>Cantidad:</strong> {item.cantidadtotal}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top postres */}
            <section className={styles.cardSection}>
                <div className={`${styles.card} ${styles.cardSimple}`}>
                    <h3>🏆 Top 5 Postres más vendidos</h3>
                    <ol>
                        {topPostres.map((p, i) => (
                            <li key={i}>{p.nombre} — {p.total_vendidos}</li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Ventas por día */}
            <section className={styles.cardSection}>
                <div className={`${styles.card} ${styles.cardSimple}`}>
                    <h3>📈 Ventas últimos 30 días</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={ventasPorDia}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="dia" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total_dia" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;


// PENDIENTES:
// IMPLEMENTAR ESTADO DE TIPO DE TRANSACCION DENTRO DE LOS LOGS PARA NO RESTAR INSUMOS INMEDIATAMENTE AL REGISTRAR UN PEDIDO
// IMPLEMENTAR LAS PLANTILLAS
// AL MARCAR UN INSUMO COMO COMPUESTO, ELIMINAR LA NECESIDAD DE INGRESAR CANTIDAD_UNIDAD Y PRECIO_UNIDAD
// ARREGLAR DASHBOARD
/*
    Este dashboard no utiliza IA actualmente.
    Sin embargo, podrías usar IA para:
    - Predecir demanda de insumos/postres.
    - Detectar anomalías en ingresos/egresos.
    - Recomendar compras de insumos.
    - Analizar patrones de pedidos.
    - Automatizar respuestas a clientes.
    - Generar reportes inteligentes.
*/