import fs from 'fs'
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { convertCsvToJson } from '@/utils/convert-csv-to-json'

import { FileNotFoundError } from '@/use-case/errors/files-not-found-exists'
import { makeRegisterUsecase } from '@/use-case/factories/users/make-register-usecase'

interface ResponseUploadUsers {
	success: any[]
	failure: any[]
}

export async function upload(request: FastifyRequest, reply: FastifyReply) {
	try {
		if (!request.file || !request.file.path) throw new FileNotFoundError()

		const filePath = request.file.path

		const jsonData = await convertCsvToJson(filePath)

		const registerUseCase = makeRegisterUsecase()

		const results: ResponseUploadUsers = {
			success: [],
			failure: [],
		}
		for (const data of jsonData) {
			try {
				const registerBodySchema = z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				})

				const { name, email, password } = registerBodySchema.parse(data)

				const { user } = await registerUseCase.execute({
					name,
					email,
					password,
				})

				results.success.push({ id: user.id, name, email })
			} catch (error) {
				results.failure.push(error)
			}
		}

		fs.unlink(request.file.path, (err) => {
			if (err) console.error('Error deleting file', err)
		})

		return reply.status(200).send(results)
	} catch (error) {
		if (error instanceof FileNotFoundError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}
}
