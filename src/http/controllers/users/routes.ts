import { FastifyInstance } from 'fastify'
import fastifyMulter from 'fastify-multer'

import { register } from './register/register'
import { authenticate } from './authenticate/authenticate'
import { profile } from './profile/profile'
import { refresh } from './refresh/refresh'
import { update } from './update/update'
import { upload } from './upload/upload'
import { consumeMessages } from './consume-messages/consume-messages'
import { publishMessage } from './publish-message/publish-message'

import { verifyJWT } from '../../middlewares/verify-jwt'

const uploadMulter = fastifyMulter({ dest: 'uploads/' })

export async function usersRoutes(app: FastifyInstance) {
	app.register(fastifyMulter.contentParser)

	// Not Authenticated
	app.post('/users', register)
	app.post('/sessions', authenticate)

	app.patch('/token/refresh', refresh)

	app.post('/users/upload', { preHandler: uploadMulter.single('file') }, upload)

	// Authenticated
	app.get('/me', { onRequest: [verifyJWT] }, profile)

	app.post('/users/publish-message', { onRequest: [verifyJWT] }, publishMessage)

	app.post(
		'/users/consume-messages',
		{ onRequest: [verifyJWT] },
		consumeMessages,
	)

	app.put('/users/:id', { onRequest: [verifyJWT] }, update)
}
