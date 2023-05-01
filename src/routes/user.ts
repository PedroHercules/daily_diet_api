import { FastifyInstance, FastifyReply } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { createUserSchema, loginUserSchema } from '../schemas/userSchemas'
import { AuthUserType } from '../@types/user'

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
      const token = app.jwt.sign(
        { id: user[0].id, email: user[0].email },
        {
          expiresIn: '7d',
        }
      )

      return reply.status(201).send({ user: user[0], token })
    } catch (error: any) {
      return reply.status(error.status || 500).send({
        message: JSON.parse(error.message),
      })
    }
  })

  app.post('/login', async (request, reply) => {
    try {
      const body = loginUserSchema.parse(request.body)
      const { password, ...user } = await findUserByEmail(body.email)
      if (body.password !== password) {
        return reply.status(400).send({
          message: 'Incorrect password!',
        })
      }

      const token = app.jwt.sign(
        { id: user.id, email: user.email },
        {
          expiresIn: '7d',
        }
      )

      return reply.status(200).send({
        user,
        token,
      })
    } catch (error: any) {
      return reply.status(error.status || 500).send({
        message: error.message,
      })
    }
  })

  app.get(
    '/',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      const auth = request.user as AuthUserType

      const user = await knex('users')
        .where('id', auth.id)
        .first()
        .select([
          'id',
          'name',
          'email',
          'height_cm',
          'weight_kg',
          'target_weight_kg',
          'created_at',
        ])

      return reply.status(200).send(user)
    }
  )
}
