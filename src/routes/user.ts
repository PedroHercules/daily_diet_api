import { FastifyInstance, FastifyReply } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from '../schemas/userSchemas'
import { AuthUserType } from '../@types/user'

export async function findUserByEmail(email: string) {
  const user = await knex('users').where('email', email).first()
  return user
}

export async function findUserById(id: number) {
  const user = await knex('users')
    .where('id', id)
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

      const passwordCrypted = await bcrypt.hash(password, 10)

      const user = await knex('users')
        .insert({
          id: randomUUID(),
          name,
          email,
          password: passwordCrypted,
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
      const user = await findUserByEmail(body.email)
      if (!user) {
        return reply.status(404).send({
          message: 'User not found',
        })
      }

      const isCorrectPassword = await bcrypt.compare(
        body.password,
        user.password
      )
      if (!isCorrectPassword) {
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

      user.password = null

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

      const user = await findUserById(auth.id)

      return reply.status(200).send(user)
    }
  )

  app.put(
    '/',
    {
      onRequest: [app.authenticate],
    },
    async (request, reply) => {
      try {
        const body = updateUserSchema.parse(request.body)
        const auth = request.user as AuthUserType

        await knex('users').where('id', auth.id).first().update(body)

        return reply.status(200).send({
          message: 'Usuário alterado com sucesso',
        })
      } catch (error: any) {
        return reply.status(error.status || 500).send({
          message: error.message,
        })
      }
    }
  )
}
