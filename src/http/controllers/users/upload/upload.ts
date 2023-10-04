// import { z } from 'zod'
import fs from 'fs'
import { FastifyRequest, FastifyReply } from 'fastify'

import { UserAlreadyExistsError } from '@/use-case/errors/user-already-exists-error'
import { convertCsvToJson } from '@/utils/convert-csv-to-json'
// import { makeRegisterUsecase } from '@/use-case/factories/users/make-register-usecase'

export async function upload(request: FastifyRequest, reply: FastifyReply) {
	try {
		if (!request.file || !request.file.path) throw new Error('File not found')

		const filePath = request.file.path

		const jsonData = await convertCsvToJson(filePath)

		console.log(jsonData)

		// const registerUseCase = makeRegisterUsecase()
		// await registerUseCase.execute({ name, email, password })

		fs.unlink(request.file.path, (err) => {
			if (err) console.error('Error deleting file', err)
		})
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}

	return reply.status(201).send()
}
