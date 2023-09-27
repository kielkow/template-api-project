import { hash } from 'bcryptjs'
import request from 'supertest'
import { FastifyInstance } from 'fastify'

import { prisma } from '@/providers/prisma'

export async function createAuthenticateUser(
	app: FastifyInstance,
	isAdmin = false,
	name = 'John Doe',
	email = 'jonhdoe@example.com',
) {
	await prisma.user.create({
		data: {
			name,
			email,
			password_hash: await hash('123456', 7),
			role: isAdmin ? 'ADMIN' : 'MEMBER',
		},
	})

	const authResponse = await request(app.server).post('/sessions').send({
		email,
		password: '123456',
	})

	const { token } = authResponse.body

	const profileResponse = await request(app.server)
		.get('/me')
		.set('Authorization', `Bearer ${token}`)
		.send()

	return { token, ...profileResponse.body.user }
}
