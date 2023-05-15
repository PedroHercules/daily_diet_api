import { z } from 'zod'

export const createMealSchema = z.object({
  name: z.string(),
  description: z.string().max(150),
  date: z.string(),
  time: z.string(),
  is_on_diet: z.boolean(),
})

export const updateMealSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  is_on_diet: z.boolean().optional(),
})
