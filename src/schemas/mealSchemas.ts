import { z } from 'zod'

export const createMealSchema = z.object({
  name: z.string(),
  description: z.string().max(150),
  date: z.string(),
  time: z.string(),
  is_on_diet: z.boolean(),
})
