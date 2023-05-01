import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import jwt from '@fastify/jwt'
import { env } from './env'
import { userRoutes } from './routes/user'

export const app = fastify()

app.register(jwt, {
  secret: 'X2@idnslkjklsdlk',
})

app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      reply.send(error)
    }
  }
)

app.register(userRoutes, {
  prefix: 'user',
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
