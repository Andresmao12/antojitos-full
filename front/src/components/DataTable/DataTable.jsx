import { useEffect } from 'react'
import styles from "./DataTable.module.css"
import buttonStyles from "../../styles/buttons.module.css"
import { useApi } from '../../hooks/useApi'

import { SHEMA_DB } from '../../utils/constants'

// RECIBIR TABLESHEMA
const DataTable = ({ data, getId, schema = null }) => {
  const { fetchAll, dataFrom } = useApi()

  // valores a excluir (todo en minúsculas para comparar)
  const excludeValores = ['rol_id', 'estado', 'compuesto', 'id']

  const toTitle = (s = '') =>
    s
      .replace(/_/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  const getFriendlyName = (initialName) => {
    if (!schema) return toTitle(initialName)
    let newName = initialName;

    if (initialName.includes('_id')) {

      newName = initialName.toLowerCase().replace("_id", "");
      const relationSchema = schema.relations?.find(rel => rel.fk.toLowerCase() === initialName.toLowerCase())
      if (relationSchema) return relationSchema.name
    }

    const column = schema.columns.find(col => col.namedb.toLowerCase() === newName)
    return column ? column.name : toTitle(initialName)
  }

  const handleGetId = (id) => {
    if (getId) getId(id)
  }

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const keys = Object.keys(data[0]);
    // detectar relaciones que terminen en "id" (ej: usuario_id, proveedor_id)
    const relaciones = keys
      .filter(key => key.toLowerCase().endsWith("id") && key.toLowerCase() !== "id")
      .map(key => key.replace(/_?id$/i, "")); // quita _id o id

    // fetch de datos relacionados (fetchAll espera nombre de recurso)
    relaciones.forEach(table => fetchAll(table));
  }, [data]);

  if (!data || data.length === 0) return <span className={styles.msgWithoutData}>Por acá no hay información</span>

  // Helper: buscar dataset relacionado en dataFrom probando variantes de nombre
  const findRelatedDataset = (baseName) => {
    if (!dataFrom) return null
    const base = baseName.toLowerCase()
    const keys = Object.keys(dataFrom)
    // exacto
    let k = keys.find(x => x.toLowerCase() === base)
    if (k) return dataFrom[k]
    // plural (insumo -> insumos)
    k = keys.find(x => x.toLowerCase() === base + 's')
    if (k) return dataFrom[k]
    // contiene (fallback)
    k = keys.find(x => x.toLowerCase().includes(base))
    if (k) return dataFrom[k]
    return null
  }

  const parseToDate = (value) => {
    if (!value) return null
    if (typeof value !== 'string') return new Date(value)
    // si ya tiene Z u offset lo parseamos tal cual
    if (/[zZ]$/.test(value) || /[+\-]\d{2}:\d{2}$/.test(value)) return new Date(value)
    // si no tiene zona, asumimos que viene en UTC (común en APIs) y le agregamos Z
    const maybeUTC = new Date(value + 'Z')
    if (!isNaN(maybeUTC)) return maybeUTC
    // fallback local
    return new Date(value)
  }

  const formatDateForCO = (value) => {
    const d = parseToDate(value)
    if (!d || isNaN(d)) return value
    return d.toLocaleString('es-CO', { timeZone: 'America/Bogota' }).replace(',', ' →')
  }

  return (
    <table className={styles.tableCont}>
      <thead className={styles.tableCont_head}>
        <tr className={styles.head}>
          {Object.keys(data[0]).map((key) => {
            if (excludeValores.includes(key.toLowerCase())) return null
            console.log('KEY EN TABLE: ', key)
            return <th key={key} className={styles.head_data}>{getFriendlyName(key)}</th>
          })}
          <th className={styles.head_data}>Acciones</th>
        </tr>
      </thead>

      <tbody className={styles.tableCont_body}>
        {data.map((element) => (
          <tr key={element.id ?? JSON.stringify(element)} className={styles.register}>
            {Object.entries(element).map(([key, value]) => {
              if (excludeValores.includes(key.toLowerCase())) return null

              const keyLower = key.toLowerCase()

              // CASE 1: id principal -> mostrar valor directo
              if (keyLower === 'id') {
                return <td key={`${element.id}-id`} className={styles.register_data}>{value}</td>
              }

              // CASE 2: fecha
              if (keyLower.includes("fecha")) {
                return (
                  <td key={`${element.id}-${key}`} className={styles.register_data}>
                    {formatDateForCO(value)}
                  </td>
                )
              }

              // CASE 3: relaciones tipo usuario_id, proveedor_id, etc.
              if (keyLower.endsWith("id")) {
                const base = keyLower.replace(/_?id$/i, "")
                const relatedDataset = findRelatedDataset(base)
                // buscar por id (coerción por si viene string)
                const relatedItem = relatedDataset?.find(item => String(item.id) === String(value))
                const label = relatedItem?.nombre ?? relatedItem?.nombre_completo ?? relatedItem?.descripcion ?? String(value) ?? "Sin información"
                return (
                  <td key={`${element.id}-${key}`} className={styles.register_data}>
                    {label}
                  </td>
                )
              }

              // DEFAULT: mostrar el valor tal cual
              return (
                <td key={`${element.id}-${key}`} className={styles.register_data}>
                  {String(value)}
                </td>
              )
            })}
            <td className={styles.register_btnCont}>
              <button className={buttonStyles.searchButton}><i className="fa-solid fa-pen-to-square"></i></button>
              <button className={buttonStyles.deleteButton}><i className="fa-solid fa-trash"></i></button>
              {getId && <button className={buttonStyles.searchButton} onClick={() => handleGetId(element.id)}>👁</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
