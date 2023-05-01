import fastify from 'fastify'
import { env } from './env'
import { userRoutes } from './routes/user'

export const app = fastify()

app.register(userRoutes, {
  prefix: 'user'
})

app.get('/', async () => {
  return {
    project: 'Diet controll API',
    version: '0.0.2',
    date: '30/04/2023',
  }
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server is running on port ${env.PORT}`)
  })
  .catch((error) => {
    console.log(error)
  })
