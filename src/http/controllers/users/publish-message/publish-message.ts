import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { messageProvider } from '@/providers/message-broker'

export async function publishMessage(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { name, email, password } = registerBodySchema.parse(request.body)

	try {
		await messageProvider.publish(
			'create-users',
			JSON.stringify({ name, email, password }),
		)
	} catch (error) {
		console.error('Fail to publish message at queue.', error)

		return reply
			.status(500)
			.send({ message: 'Fail to publish message at queue.' })
	}

	return reply.status(200).send({ message: 'Message published.' })
}
