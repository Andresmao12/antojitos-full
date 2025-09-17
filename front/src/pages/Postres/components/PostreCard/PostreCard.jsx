import { useNavigate } from "react-router-dom"
import styles from "./PostreCard.module.css"

import { useState, useEffect } from "react"
import { useApi } from "../../../../hooks/useApi"

const PostreCard = ({ id, title, desc, img, tamanio, tableShema }) => {
  const navigate = useNavigate()
  const titleUrl = generateSlug(title)

  const { fetchAll, dataFrom } = useApi(tableShema)
  const [tamanioName, setTamanioName] = useState("")

  useEffect(() => {
    (async () => {
      await fetchAll("tamanio")
    })()
  }, [])


  useEffect(() => {
    if (dataFrom['tamanio']) {
      const tamanio_id = dataFrom['tamanio'].find((t) => t.id === tamanio)?.nombre || "Tamaño no disponible"
      setTamanioName(tamanio_id)
    }
  }, [dataFrom['tamanio']?.length])

  return (
    <div className={styles.targetCont} style={{ backgroundImage: `url(${img})` }} onClick={() => navigate(`${titleUrl}-${id}`)}>
      <div className={styles.textCont}>
        <h1>{title}</h1>
        <span>{tamanioName}</span>
        <p className={styles.textCont_p}>{desc}</p>
      </div>
    </div>
  )
}

export default PostreCard

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD") // Quita tildes
    .replace(/[\u0300-\u036f]/g, "") // Elimina caracteres raros
    .replace(/[^a-z0-9\s]/g, "") // Solo letras, números y espacios
    .trim()
    .replace(/\s+/g, "-"); // <-- Reemplaza todos los espacios por guiones
}