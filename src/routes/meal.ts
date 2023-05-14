import { FastifyInstance } from 'fastify'
import { createMealSchema } from '../schemas/mealSchemas'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { AuthUserType } from '../@types/user'

export async function mealRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const user = request.user as AuthUserType
        const mealBody = createMealSchema.parse(request.body)

        const meal = await knex('meals')
          .insert({
            id: randomUUID(),
            user_id: user.id,
            ...mealBody,
          })
          .returning([
            'id',
            'name',
            'description',
            'date',
            'time',
            'is_on_diet',
            'created_at',
          ])

        return reply.status(201).send(meal[0])
      } catch (error: any) {
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )

  app.get(
    '/',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const user = request.user as AuthUserType

        const meals = await knex('meals').where('user_id', user.id)

        return reply.status(200).send(meals)
      } catch (error: any) {
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )
}
