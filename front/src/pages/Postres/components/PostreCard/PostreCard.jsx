import { useNavigate } from "react-router-dom"
import styles from "./PostreCard.module.css"

const PostreCard = ({ id, title, desc, img, tableShema }) => {

  const navigate = useNavigate()
  const titleUrl = generateSlug(title)

  return (
    <div className={styles.targetCont} style={{ backgroundImage: `url(${img})` }} onClick={() => navigate(`${titleUrl}-${id}`)}>
      <div className={styles.textCont}>
        <h1>{title}</h1>
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