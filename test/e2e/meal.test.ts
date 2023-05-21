import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
import { findUserByEmail, findUserById } from '../../src/routes/user'
import { execSync } from 'node:child_process'

describe('Meal E2E tests', () => {
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

  const createMealBody = {
    name: 'Pizza de frango',
    description: 'Pizza feita com aveia, ovos e com recheio de frango',
    date: '14/05/2023',
    time: '21:00',
    is_on_diet: true,
  }

  const createUserBody = {
    name: 'Pedro Hercules',
    email: 'pedrotesteroute@email.com',
    password: 'teste123',
    height_cm: 172,
    weight_kg: 100,
    target_weight_kg: 75,
  }

  it('shoulde be able to create a new meal', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    const createMealResponse = await request(app.server)
      .post('/meal')
      .send(createMealBody)
      .set('Authorization', `Bearer ${token}`)

    expect(createMealResponse.status).toEqual(201)
  })

  it('should be able to return user meals', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    await request(app.server)
      .post('/meal')
      .send(createMealBody)
      .set('Authorization', `Bearer ${token}`)

    const getMealsResponse = await request(app.server)
      .get('/meal')
      .set('Authorization', `Bearer ${token}`)

    expect(getMealsResponse.body).toEqual([
      expect.objectContaining({
        name: createMealBody.name,
        description: createMealBody.description,
        is_on_diet: 1,
      }),
    ])
  })

  it('should be able to return a meal by id', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    const createdMealResponse = await request(app.server)
      .post('/meal')
      .send(createMealBody)
      .set('Authorization', `Bearer ${token}`)

    const mealId = createdMealResponse.body.id
    const getMealResponse = await request(app.server)
      .get(`/meal/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getMealResponse.body).toEqual(
      expect.objectContaining({
        name: createMealBody.name,
        description: createMealBody.description,
        is_on_diet: 1,
      })
    )
  })

  it('should be able to edit a meal', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    const createdMealResponse = await request(app.server)
      .post('/meal')
      .send(createMealBody)
      .set('Authorization', `Bearer ${token}`)

    const mealId = createdMealResponse.body.id
    const updateMealResponse = await request(app.server)
      .put(`/meal/${mealId}`)
      .send({
        name: 'Nome atualizado',
        description: 'Atualização teste',
        is_on_diet: false,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(updateMealResponse.body).toEqual(
      expect.objectContaining({
        name: 'Nome atualizado',
        description: 'Atualização teste',
        is_on_diet: 0,
      })
    )
  })

  it('should be able to delete a meal', async () => {
    await request(app.server).post('/user').send(createUserBody)

    const loginUserResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })

    const token = loginUserResponse.body.token

    const createdMealResponse = await request(app.server)
      .post('/meal')
      .send(createMealBody)
      .set('Authorization', `Bearer ${token}`)

    const mealId = createdMealResponse.body.id
    const deleteMealResponse = await request(app.server)
      .delete(`/meal/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteMealResponse.status).toEqual(200)
  })
})
