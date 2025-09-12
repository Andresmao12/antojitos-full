import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Postres',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], 
}

const specs = swaggerJsdoc(options)

export { swaggerUi, specs }
