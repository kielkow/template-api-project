import { FastifyReply, FastifyRequest } from 'fastify'

import { HealthcheckUseCase } from '@/use-case/usecases/healthcheck/healthcheck'

export async function healthcheck(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const healthcheckUseCase = new HealthcheckUseCase()

		const { message } = await healthcheckUseCase.execute()

		return reply.status(200).send({ message })
	} catch (error) {
		return reply.status(500).send({ message: error })
	}
}
