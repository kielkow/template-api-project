import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('USER UPDATE CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update an user', async () => {
		const { token, id } = await createAuthenticateUser(app)

		const response = await request(app.server)
			.put(`/users/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'John Doe Jr.',
				email: 'jonhdoejr@example.com',
				password: '123457',
			})

		expect(response.statusCode).toEqual(204)
	})
})
