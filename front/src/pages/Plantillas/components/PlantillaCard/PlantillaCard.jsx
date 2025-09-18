import { useNavigate } from 'react-router-dom'
import styles from './PlantillaCard.module.css'

const PlantillaCard = ({ id, title, desc, img }) => {
  const navigate = useNavigate()

  const titleUrl = generateSlug(title)

  return (
    <div
      className={styles.targetCont}
      style={{ backgroundImage: `url(${img})` }}
      onClick={() => navigate(`${titleUrl}-${id}`)}
    >
      <div className={styles.textCont}>
        <h1>{title}</h1>
        <p className={styles.textCont_p}>{desc}</p>
      </div>
    </div>
  )
}

export default PlantillaCard

// Función helper para URLs
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
