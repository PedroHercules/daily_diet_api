import { RequestBodyDefault } from 'fastify'
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email('This value must be a e-mail.'),
  password: z.string().min(8, 'The password must have 8 or more characters.'),
  height_cm: z.number().optional(),
  weight_kg: z.number().optional(),
  target_weight_kg: z.number().optional(),
})

export const loginUserSchema = z.object({
  email: z.string().email('This value must be a e-mail'),
  password: z.string(),
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('This value must be a e-mail.').optional(),
  height_cm: z.number().optional(),
  weight_kg: z.number().optional(),
  target_weight_kg: z.number().optional(),
})
