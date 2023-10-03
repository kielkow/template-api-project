import { FastifyInstance } from 'fastify'
import fastifyMulter from 'fastify-multer'

import { register } from './register/register'
import { authenticate } from './authenticate/authenticate'
import { profile } from './profile/profile'
import { refresh } from './refresh/refresh'
import { update } from './update/update'
import { consumeMessages } from './consume-messages/consume-messages'
import { publishMessage } from './publish-message/publish-message'

import { verifyJWT } from '../../middlewares/verify-jwt'

const upload = fastifyMulter({ dest: 'uploads/' })

export async function usersRoutes(app: FastifyInstance) {
	app.register(fastifyMulter.contentParser)

	// Not Authenticated
	app.post('/users', register)
	app.post('/sessions', authenticate)

	app.patch('/token/refresh', refresh)

	// Authenticated
	app.get('/me', { onRequest: [verifyJWT] }, profile)

	app.post('/users/publish-message', { onRequest: [verifyJWT] }, publishMessage)

	app.post(
		'/users/consume-messages',
		{ onRequest: [verifyJWT] },
		consumeMessages,
	)

	app.put('/users/:id', { onRequest: [verifyJWT] }, update)

	app.post(
		'/users/upload',
		{ preHandler: upload.single('file') },
		async (request, reply) => {
			console.log(request.file)
			reply.send({ message: 'File uploaded successfully' })
		},
	)
}
