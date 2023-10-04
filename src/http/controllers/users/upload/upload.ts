// import { z } from 'zod'
import fs from 'fs'
import { FastifyRequest, FastifyReply } from 'fastify'

import { UserAlreadyExistsError } from '@/use-case/errors/user-already-exists-error'
// import { makeRegisterUsecase } from '@/use-case/factories/users/make-register-usecase'

export async function upload(request: FastifyRequest, reply: FastifyReply) {
	try {
		console.log(request.file)

		if (request.file && request.file.path) {
			fs.unlink(request.file.path, (err) => {
				if (err) console.error('Error deleting file', err)
			})
		}

		// const registerUseCase = makeRegisterUsecase()
		// await registerUseCase.execute({ name, email, password })
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}

	return reply.status(201).send()
}
