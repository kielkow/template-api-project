import { FastifyRequest, FastifyReply } from 'fastify'

import { makeGetUserProfileUsecase } from '@/use-case/factories/users/make-get-user-profile-usecase'
import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	try {
		const getUserProfile = makeGetUserProfileUsecase()

		const { user } = await getUserProfile.execute({ userId: request.user.sub })

		return reply.status(200).send({
			user: {
				...user,
				password_hash: undefined,
			},
		})
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}
}
