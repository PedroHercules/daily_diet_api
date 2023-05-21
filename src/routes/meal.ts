import { FastifyInstance, FastifyRequest } from 'fastify'
import { createMealSchema, updateMealSchema } from '../schemas/mealSchemas'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { AuthUserType } from '../@types/user'

async function getMealById(id: string) {
  const meal = await knex('meals').where('id', id).first()
  return meal
}

function groupMealsByDate(meals: any[]) {
  const groupedMealsByDate: any = {}
  meals.forEach((meal) => {
    const { date } = meal
    if (!groupedMealsByDate[date]) {
      groupedMealsByDate[date] = []
    }
    groupedMealsByDate[date].push(meal)
  })

  return groupedMealsByDate
}

function getBestMealsDateSequence(groupMealsDate: any) {
  const bestDaysSequenceOnDiet = Object.keys(groupMealsDate).filter((date) =>
    groupMealsDate[date].some((meal: any) => {
      return meal.is_on_diet
    })
  )

  return bestDaysSequenceOnDiet.length
}

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

  app.get(
    '/:id',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const user = request.user as AuthUserType

        const meal = await getMealById(id)
        if (meal.user_id !== user.id) {
          return reply.status(401).send({
            message: 'This user is not authorized to access this meal!',
          })
        }
        if (!meal) {
          return reply.status(404).send({
            message: 'Meal not found',
          })
        }
        return reply.status(200).send(meal)
      } catch (error: any) {
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )

  app.put(
    '/:id',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const user = request.user as AuthUserType
        const { id } = request.params as { id: string }
        const updateBody = updateMealSchema.parse(request.body)

        const meal = await getMealById(id)
        if (meal.user_id !== user.id) {
          return reply.status(401).send({
            message: 'This user is not authorized to access this meal!',
          })
        }
        if (!meal) {
          return reply.status(404).send({
            message: 'Meal not found',
          })
        }

        const updated = await knex('meals')
          .where('id', id)
          .first()
          .update(updateBody)
          .returning([
            'id',
            'name',
            'description',
            'date',
            'time',
            'is_on_diet',
            'created_at',
          ])

        return reply.status(200).send(updated[0])
      } catch (error: any) {
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )

  app.delete(
    '/:id',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const user = request.user as AuthUserType
        const { id } = request.params as { id: string }

        const meal = await getMealById(id)
        if (!meal) {
          return reply.status(404).send({
            message: 'Meal not found',
          })
        }
        if (meal.user_id != user.id) {
          return reply.status(401).send({
            message: 'This user is not authorized to access this meal!',
          })
        }

        await knex('meals').where('id', meal.id).first().delete()

        return reply.status(200).send({
          message: 'Meal deleted successfully!',
        })
      } catch (error: any) {
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )

  app.get(
    '/metrics',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const user = request.user as AuthUserType
        const meals = await knex('meals').where('user_id', user.id)

        const qtdUserMealsCreated = meals.length

        const userMealsOnDiet = meals.filter((meal) => {
          return meal.is_on_diet
        })
        const qtdUserMealsOnDiet = userMealsOnDiet.length

        const userMealsOutDiet = qtdUserMealsCreated - qtdUserMealsOnDiet

        const groupedMealsByDate = groupMealsByDate(meals)
        const bestDaysSequence = getBestMealsDateSequence(groupedMealsByDate)

        return reply.status(200).send({
          qtdUserMealsCreated,
          qtdUserMealsOnDiet,
          userMealsOutDiet,
          bestDaysSequence,
        })
      } catch (error: any) {
        console.log(error)
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )
}
