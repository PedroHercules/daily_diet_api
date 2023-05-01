import { FastifyInstance } from "fastify";
import { z,  } from 'zod'
import { app } from "../server";

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email('This value must be a e-mail.'),
      password: z.string().min(8, 'The password must have 8 or more characters.'),
      height_cm: z.number(),
      weight_kg: z.number(),
      target_weight_kg: z.number()
    })

    try {
      const body = createUserSchema.parse(request.body)
      return reply.status(201).send({ body })
    } catch (error: any) {
      return reply.status(error.status || 500).send({
        message: JSON.parse(error.message)
      })
    }

    
  })
}