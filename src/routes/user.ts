import { FastifyInstance, FastifyReply } from 'fastify'
import { z } from 'zod'
import { app } from '../server'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { createUserSchema } from '../schemas/userSchemas'

async function findUserByEmail(email: string) {
  const user = await knex('users').where('email', email).first()
  return user
}

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const { name, email, password, height_cm, weight_kg, target_weight_kg } =
        createUserSchema.parse(request.body)

      const emailExists = await findUserByEmail(email)
      if (emailExists) {
        return reply.status(400).send({
          message: 'User e-mail already exists!',
        })
      }

      const user = await knex('users')
        .insert({
          id: randomUUID(),
          name,
          email,
          password,
          height_cm,
          weight_kg,
          target_weight_kg,
        })
        .returning([
          'id',
          'name',
          'email',
          'height_cm',
          'weight_kg',
          'target_weight_kg',
          'created_at',
        ])

      return reply.status(201).send({ user: user[0] })
    } catch (error: any) {
      return reply.status(error.status || 500).send({
        message: JSON.parse(error.message),
      })
    }
  })
}
