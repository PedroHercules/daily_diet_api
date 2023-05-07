import { expect, it, describe, beforeEach } from 'vitest'
import { findUserByEmail, findUserById } from '../../src/routes/user'
import { execSync } from 'node:child_process'
import { knex } from '../../src/database'

describe('User integration tests', () => {
  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest --all')
  })

  const createUserBody = {
    name: 'Pedro Hercules',
    email: 'pedrotestemethod@email.com',
    password: 'teste123',
    height_cm: 172,
    weight_kg: 100,
    target_weight_kg: 75,
  }

  it('should can find user by e-mail', async () => {
    await knex('users').insert(createUserBody)
    const user = await findUserByEmail(createUserBody.email)

    expect(user.email).toEqual(createUserBody.email)
  })

  it('should can find user by ID', async () => {
    await knex('users').insert(createUserBody)
    const userByEmail = await findUserByEmail(createUserBody.email)

    const userById = await findUserById(userByEmail.id)
    expect(userById.id).toEqual(userByEmail.id)
  })
})
