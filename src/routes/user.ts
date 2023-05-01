import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { app } from '../server'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email('This value must be a e-mail.'),
      password: z
        .string()
        .min(8, 'The password must have 8 or more characters.'),
      height_cm: z.number().optional(),
      weight_kg: z.number().optional(),
      target_weight_kg: z.number().optional(),
    })

    try {
      const { name, email, password, height_cm, weight_kg, target_weight_kg } =
        createUserSchema.parse(request.body)
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
      console.log(user)
      return reply.status(201).send({ user: user[0] })
    } catch (error: any) {
      return reply.status(error.status || 500).send({
        message: JSON.parse(error.message),
      })
    }
  })
}
