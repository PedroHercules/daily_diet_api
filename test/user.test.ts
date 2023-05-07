import { expect, test } from 'vitest'
import { app } from '../src/app'

test('First test', () => {
  const multi = 5 * 2
  expect(multi).toEqual(10)
})
