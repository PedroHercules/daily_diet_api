import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Users {
    users: {
      id: string
      name: string
      email: string
      password: string
      height_cm?: number
      weight_kg?: number
      target_weight_kg?: number
      created_at: string
    }
  }

  export interface Meals {
    meals: {
      id: string
      name: string
      description: string
      date: string
      time: string
      is_on_diet: boolean
    }
  }
}
