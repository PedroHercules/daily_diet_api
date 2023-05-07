import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
import { findUserByEmail, findUserById } from '../../src/routes/user'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

describe('User E2E tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  const createUserBody = {
    name: 'Pedro Hercules',
    email: 'pedrotesteroute@email.com',
    password: 'teste123',
    height_cm: 172,
    weight_kg: 100,
    target_weight_kg: 75,
  }

  it('should be able create a new user', async () => {
    const response = await request(app.server)
      .post('/user')
      .send({
        id: randomUUID(),
        ...createUserBody,
      })

    expect(response.status).toEqual(201)
  })

  it('should be able login user', async () => {
    await request(app.server)
      .post('/user')
      .send({
        id: randomUUID(),
        ...createUserBody,
      })

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    expect(loginUserResponse.status).toEqual(200)
  })
})
