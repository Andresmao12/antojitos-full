import { useState, useEffect } from 'react'
import styles from "./DataTable.module.css"
import buttonStyles from "../../styles/buttons.module.css"

import { useApi } from '../../hooks/useApi'

// RECIBIR TABLESHEMA
const DataTable = ({ data, getId }) => {

  const excludeValores = ['Rol', 'CantidadPorPresentacion', 'PrecioUnitarioCalculado']

  const handleGetId = (id) => {
    getId(id)
    console.log("ID EN DT: ", id)
  }
  console.log("DATA MS", data)
  if (!data || data?.length == 0) return <span className={styles.msgWithoutData}>Por aca no hay informacion</span>

  return (
    <table className={styles.tableCont}>
      <thead className={styles.tableCont_head}>

        <tr className={styles.head}>
          {/* TOMAMOS LAS KEYS DEL PRIMER OBJ PARA LOS ENCABEZADOS */}
          {Array.isArray(data) && data.length > 0 && (

            Object.keys(data[0]).map((key, index) => (

              excludeValores.includes(key) ?
                null
                :
                <th key={index} className={styles.head_data}>{key}</th>
            ))
          )}
          <th className={styles.head_data}>Acciones</th>
        </tr>

      </thead>

      <tbody className={styles.tableCont_body}>

        {/* TOMAMOS LOS VALORES DEL OBJETO PARA LLENAR LA TABLA */}
        {(Array.isArray(data) && data.length > 0) && data.map((element, index) =>

          // Td por cada uno de los datos
          < tr key={index} className={styles.register} >
            {
              Object.entries(element).map(([key, value], index) => {
                if (excludeValores.includes(key)) return null;

                if (key.toLowerCase().includes("fecha")) {

                  const fecha = typeof value === 'string' ? value.replace(/Z$/, '') : value;

                  return (
                    <td key={index} className={styles.register_data}>
                      {new Date(fecha).toLocaleString("es-CO").replace(",", " →")}
                    </td>
                  );
                }

                return (
                  <td key={index} className={styles.register_data}>
                    {value}
                  </td>
                );
              })
            }
            < td className={styles.register_btnCont} >
              <button className={buttonStyles.searchButton}><i className="fa-solid fa-pen-to-square"></i></button>
              <button className={buttonStyles.deleteButton}><i className="fa-solid fa-trash"></i></button>
              {getId && <button className={buttonStyles.searchButton} onClick={() => handleGetId(element.Id)}>👁</button>}
            </td>
          </tr>
        )
        }
      </tbody >
    </table >
  )
}

export default DataTable