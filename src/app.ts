import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import jwt from '@fastify/jwt'
import { userRoutes } from './routes/user'
import { env } from './env'
import { mealRoutes } from './routes/meal'

export const app = fastify()

app.register(jwt, {
  secret: env.AUTH_TOKEN_SECRET,
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

app.register(mealRoutes, {
  prefix: 'meal',
})

app.get('/', async () => {
  return {
    project: 'Diet controll API',
    version: '0.0.2',
    date: '30/04/2023',
  }
})
