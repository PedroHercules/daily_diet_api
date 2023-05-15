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

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all')
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
      .send(createUserBody)

    expect(response.status).toEqual(201)
  })

  it('should not be able to create a user with an existing email', async () => {
    await request(app.server).post('/user').send(createUserBody)
    const response = await request(app.server)
      .post('/user')
      .send(createUserBody)

    expect(response.status).toEqual(400)
    expect(response.body.message).toEqual('User e-mail already exists!')
  })

  it('should be able login user', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    expect(loginUserResponse.status).toEqual(200)
  })

  it('should not be able to log in a user who is not registered', async () => {
    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    expect(loginUserResponse.status).toEqual(404)
  })

  it('should be able get logged user', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    const loggedUser = await request(app.server)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)

    expect(loggedUser.body).toEqual(
      expect.objectContaining({
        name: createUserBody.name,
        email: createUserBody.email,
        height_cm: createUserBody.height_cm,
        weight_kg: createUserBody.weight_kg,
        target_weight_kg: createUserBody.target_weight_kg,
      })
    )
  })

  it('should not be able get logged user without token', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const loggedUser = await request(app.server).get('/user')

    expect(loggedUser.status).toEqual(401)
  })

  it('should be able update user information', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    await request(app.server)
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pedro Teste',
        email: 'testepedro@email.com',
      })
      .expect(200)

    const getUpdatedUser = await findUserByEmail('testepedro@email.com')

    expect(getUpdatedUser).toEqual(
      expect.objectContaining({
        name: 'Pedro Teste',
        email: 'testepedro@email.com',
      })
    )
  })

  it('should not be able update user without token', async () => {
    await request(app.server).post('/user').send(createUserBody)

    await request(app.server).post('/user/login').send({
      email: createUserBody.email,
      password: createUserBody.password,
    })

    const response = await request(app.server).put('/user').send({
      name: 'Pedro Teste',
      email: 'testepedro@email.com',
    })

    expect(response.status).toEqual(401)
  })
})
